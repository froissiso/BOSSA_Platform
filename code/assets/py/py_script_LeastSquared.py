import math, lmfit, numpy
import sys, argparse, json
from pprint import pprint
import gettests as db

num_beacons = 3
num_floorbeacons = 3
proximity_vals = [(-70, 9), (-60, 5), (-50, 2), (0, 1)]


def model(params, x, y, proximity):
    x0 = params['x0']
    y0 = params['y0']
    t = map(math.sqrt, (x - x0)**2 + (y - y0)**2)
    prox = numpy.array(proximity)
    t = prox - t
    return t / prox


def calc_realtime(bts):
    db.apply_prox(bts, proximity_vals)
    topn_bts = db.topbt(bts, num_beacons)

    b_x, b_y, proximity = zip(* [(bt.x, bt.y, bt.proximity)
                                 for bt in topn_bts])
    # x0, y0 are the variables we can fiddle with
    params = lmfit.Parameters()
    params.add('x0', value=0)
    params.add('y0', value=0)

    # now fiddle with the x0, y0 pair to minimize the model's result
    # (x0, y0) is the estimated coordinates of the caller
    mini = lmfit.Minimizer(model, params, fcn_args=(b_x, b_y, proximity))
    result = mini.minimize()
    x0 = result.params['x0'].value
    y0 = result.params['y0'].value

    return x0, y0


def calc_testdev(test):
    """
        Given a test, get the estimated location and the deviation from the tester's location
    """
    # applies the proximity as
    # rssi >-70 = 9 meters away
    # rssi >-60 = 5 meters away
    # etc
    # for each bt in the test
    # numbers were picked because they produced the best results on each experiment
    db.apply_prox(test.bts, proximity_vals)

    # Use only the top-3 BT devices to generate our estimate (more than 3-4 usually produces worse results)
    topn_bts = db.topbt(test.bts, num_beacons)

    # (bt_x, bt_y, bt_proximity) are the variables we know
    b_x, b_y, proximity = zip(* [(bt.x, bt.y, bt.proximity)
                                 for bt in topn_bts])

    # x0, y0 are the variables we can fiddle with
    params = lmfit.Parameters()
    params.add('x0', value=0)
    params.add('y0', value=0)

    # now fiddle with the x0, y0 pair to minimize the model's result
    # (x0, y0) is the estimated coordinates of the caller
    mini = lmfit.Minimizer(model, params, fcn_args=(b_x, b_y, proximity))
    result = mini.minimize()

    # get the difference between the estimated coordinates
    # and the true coordinates of the caller
    x0 = result.params['x0'].value
    y0 = result.params['y0'].value
    xc = test.x
    yc = test.y
    deviation = math.sqrt((x0 - xc)**2 + (y0 - yc)**2)
    return x0, y0, deviation


def run_testid(testid):
    # gets the Test object for that Test from the DB
    test = db.fetch_onetest_db(testid)
    if not test:
        sys.exit()
    x0, y0, dev = calc_testdev(test)
    d = {
        'real_x': test.x,
        'real_y': test.y,
        'real_floor': test.floor,
        'x0': x0,
        'y0': y0,
        'est_floor': test.find_floor(num_floorbeacons),
        'deviation': dev,
        'BTs': []
    }
    for bt in db.topbt(test.bts, num_beacons):
        BT = {
            'maj': bt.major,
            'min': bt.minor,
            'x': bt.x,
            'y': bt.y,
            'avg_rssi': bt.average_rssi,
            'proximity': bt.proximity,
            'floor': bt.floor
        }
        d['BTs'].append(BT)
    print json.dumps(d)

def run_realtime(json_bts):
    bts = db.fetch_btdata(json_bts)
    x0, y0 = calc_realtime(bts) 
    d = { 'x0' : x0, 'y0' : y0 }
    print json.dumps(d)
        

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process some integers.')

    parser.add_argument('--testid', type=int, default=None)

    # if you use this, testid will be ignored
    # input BT values as a json.
    parser.add_argument('--inputbt', type=json.loads, default=None, help="[{'major': 101, 'minor': 150, rssi: '-74'}]")
    parser.add_argument(
        '--nbeacons',
        metavar='nbeacons',
        type=int,
        default=3,
        help='number of beacons to estimate x,y with')
    parser.add_argument(
        '--nfbeacons',
        metavar='nfbeacons',
        type=int,
        default=3,
        help='number of beacons to estimate floor with')
    parser.add_argument(
        '--proximity',
        metavar='proximities',
        type=str,
        nargs='+',
        default=["-70,9,-60,5,-50,2,0,1"],
        help='pairs of proximity values to use')
    args = parser.parse_args()

    testid = args.testid
    json_bts = args.inputbt
    num_beacons = args.nbeacons
    num_floorbeacons = args.nfbeacons
    # every 2 numbers are paired
    # so input: -70 9 -60 5 -50 2 0 1
    # becomes: [ (-70, 9),
    #            (-60, 5),
    #            (-50, 2),
    #            (  0, 1)]

    # print('HERE',args.proximity)
    # print('HEEEERE',args.proximity[0])
    newList = args.proximity[0].split(',')
    
    # newlist = args.proximity
    # print(args.proximity[0])
    # print('HERE2',newList)
    # proximity_vals = [(args.proximity[i], args.proximity[i + 1])
    #                  for i in xrange(0, len(args.proximity), 2)]
    
    proximity_vals = [(int(newList[i]), int(newList[i + 1]))
                     for i in xrange(0, len(newList), 2)]

    # print('proximity_vals: ',proximity_vals)

     
    # for i in args.proximity:
    #     print ("i:",i)

    # print("System argv:",sys.argv[1])
    # print("System argv:",sys.argv[2])
    # print("System argv:",sys.argv[3])
    # print("System argv:",sys.argv[4])

    if testid:
        run_testid(testid)
    elif json_bts:
        run_realtime(json_bts)
    else:
        sys.exit("Need a testid or json of BT data")
