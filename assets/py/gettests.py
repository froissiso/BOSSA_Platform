import math
import csv
import records
from prettytable import PrettyTable

num_beacons = 3



class BT:
    """
    The BT object is basically a struct. All functions here are simply for printing to stdout, for debugging purposes.
    Major, Minor, Locid, floor, x, y are all BT metadata
    rssis is a list of all rssis's seen for the particular test in question, for this BT major-minor
        this is stored in mW
    proximity is an approximated distance, determined by Test.apply_prox()
    average_rssi is average rssi for this BT device, for this test.
        this is stored in DBm (because its more human-readable).
    """

    def __init__(self, major, minor, locid, floor, b_x, b_y, proximity=None):
        self.rssis = []  # rssis are in mW units
        self.major = int(major)
        self.minor = int(minor)
        self.locid = int(locid)
        self.floor = int(floor)
        self.x = float(b_x)
        self.y = float(b_y)
        self.proximity = proximity
        self.average_rssi = None

    def table_header(self):
        return [
            'major', 'minor', 'locid', 'floor', 'x', 'y', 'avg_rssi',
            'proximity'
        ]

    def table_vals(self):
        return [
            self.major, self.minor, self.locid, self.floor, self.x, self.y,
            self.average_rssi, self.proximity
        ]

    def __str__(self):
        string = """
---
major = %s
minor = %s
locid = %s
floor = %s
x     = %s
y     = %s
avg_rssi = %s
proximity = %s
""" % (self.major, self.minor, self.locid, self.floor, self.x, self.y,
       self.average_rssi, self.proximity)
        string += "rssis: %s\n" % sorted(self.rssis, reverse=True)
        string += '---'
        return string


class Test:
    """
    Test Object - A single TestEvent
    A TestEvent consists of a TestLocation, and a list of BT-Devices that
        spotted the tester.
    All attributes except self.bts are components of the TestLocation
    self.bts is a dictionary of the form
        { ("MAJOR", "MINOR") : [BT Objects] }

    __init__(...):
        Instantiates a new Test Object
    __repr__():
        Defines how the object is printed to stdout. For debugging purposes.
    find_floor(num_beacons):
        Using only N beacons, determine the floor. (usually 3 beacons is best for this)

    self.bts Explanation
    ======
    When a test occurs, it catches the beacon-signal of all BT-devices in its
        vincinity. A single device will likely respond multiple times. So
        the TestEvent will contain for example 10 responses from BT 101-200
        and 5 responses from BT 101-150, etc.
    So in self.bts, each major-minor will have a single BT object for it,
        which will have the attribute rssis, a list of all rssi-values seen for
        that particular major-minor.
        so key (101, 200) will have a BT object, with len(bt.rssis) == 10
        so key (101, 150) will have a BT object, with len(bt.rssis) == 5
    """

    def __init__(self, testid, testlocid, experiment, floor, t_x, t_y):
        self.testlocid = int(testlocid)
        self.experiment = int(experiment)
        self.testid = int(testid)
        self.floor = int(floor)
        self.x = float(t_x)
        self.y = float(t_y)
        self.bts = dict()

    def __repr__(self):
        topn = [
            'minor %s, prox %s' % (bt.minor, bt.proximity)
            for bt in self.topbt(num_beacons)
        ]
        string = """
testid       = %s
testlocid    = %s
experiment   = %s
floor        = %s
x            = %s
y            = %s
approx_floor = %s
""" % (self.testid, self.testlocid, self.experiment, self.floor, self.x,
       self.y, self.approx_floor)
        t = PrettyTable(self.bts.values()[0].table_header())
        if DEBUG:
            map(t.add_row, map(lambda bt: bt.table_vals(), self.bts))
        else:
            map(t.add_row,
                map(lambda bt: bt.table_vals(), self.topbt(num_beacons)))
        string += '\n'
        string += str(t)
        return string


    def find_floor(self, num_beacons):
        # first take the top 3-5 beacons for the testid
        # then use that to calculate floor
        bt_sorted = topbt(self.bts, num_beacons)
        # floor = sum(f_i/p_i) / sum( 1/bt.proximity )
        t = sum(map(lambda bt: bt.floor * 1.0 / bt.proximity, bt_sorted))
        b = sum(map(lambda bt: 1.0 / bt.proximity, bt_sorted))
        self.approx_floor = int(round(t / b))
        return self.approx_floor

def topbt(bts, num_beacons):
    """ 
        gets the top N beacons having the highest average RSSI
    """
    bt_sorted = sorted(
        bts.values(), key=lambda bt: bt.average_rssi,
        reverse=True)[:num_beacons]
    return bt_sorted

def apply_prox(bts, proximities):
    """
        Using the given proximity values, assign each BT device an approximate distance
        based on its average_rssi
    """
    for bt in bts.values():
        # gets the first proximity average rssi isn't less than
        for (val, prox) in proximities:
            if bt.average_rssi < val:
                bt.proximity = prox
                break
        else:  # never hit break; which shouldn't be possible
            print('PROXIMITY BROKE')
            print(bt)

def fetch_btdata(json_bts):
    db = records.Database(
        'mysql+pymysql://neil:neilpassword@accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com/indoor_location_db'
    )
    query= """
        select di.b_id, di.b_major, di.b_minor, dl.loc_id, dl.loc_x, dl.loc_y, dl.loc_floor from beacon_info di 
        
        join device_location dl
                on di.b_fk_loc_id = dl.loc_id
        where di.b_major = %s and di.b_minor = %s 
    """

    # query= """
    #     select di.coreid, di.major, di.minor, lu.deploylocid, dl.x, dl.y, dl.floor from DevicesInfo di 
    #     join LocationUsed lu
    #             on di.coreid = lu.coreid and lu.ExperimentID = 2
    #     join DeployLocation dl
    #             on lu.deploylocid = dl.deployid
    #     where di.major = %s and di.minor = %s 
    # """


    bts = dict()
    for jbt in json_bts:
        btkey = (jbt['Major'], jbt['Minor'])
        if btkey not in bts:  # if we haven't seen this BT before, make a new object for it
            row = db.query(query % btkey)[0]
            bts[btkey] = BT(row['b_major'], row['b_minor'],
                                row['loc_id'], row['loc_floor'],
                                row['loc_x'], row['loc_y'])
        # convert the rssi from DBm to mW
        rssi = float(jbt['Rssi'])
        rssi_power = 10**(rssi / 10)
        # add the rssi to the BT's list of seen-rssis.
        bts[btkey].rssis.append(rssi_power)

    # For each BT, average the rssi, and convert back to DBm
    for bt in bts.values():
        avg_pow = sum(bt.rssis) * 1.0 / len(bt.rssis)
        bt.average_rssi = 10 * math.log10(avg_pow)
    return bts



def fetch_onetest_db(testid):
    """
    Creates a Test object for the given testid
    Also sets average_rssi for each bt device.
    """
    db = records.Database(
        'mysql+pymysql://neil:neilpassword@accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com/APDB'
    )
    query = """
    select tddb.Major, tddb.Minor, tddb.Rssi, tddb.TestID,
        te.TestLocationID, tl.Floor as 't_floor', tl.RoomType as 't_roomtype', tl.RoomNumber as 't_roomnumber', tl.x as 't_x', tl.y as 't_y', tr.ExperimentID,
        lu.DeployLocID , dl.Floor as 'bt_floor', dl.RoomType as 'bt_roomtype', dl.RoomNumber as 'bt_roomnumber', dl.x as 'bt_x', dl.y as 'bt_y' from TestDataDB tddb
        join TestEvent te
                on te.`TestID` = tddb.`TestID`
        join TestRun tr
                on te.`RunNumber` = tr.`RunNumber`
        join TesterLocation tl
                on tl.TesterLocationID = te.`TestLocationID`
        join DevicesInfo di
                on di.Major = tddb.Major and di.Minor = tddb.Minor
        join LocationUsed lu
                on di.CoreID = lu.CoreID and lu.ExperimentID = tr.ExperimentID
        join DeployLocation dl
                on lu.DeployLocID = dl.DeployID
    where
    """
    query += 'te.TestID = "%s"' % testid
    rows = db.query(query)

    # all rows should have the same values for test metadata,
    # so we can just use the first row to get the required
    # information.
    try:
        test = Test(rows[0]['TestID'], rows[0]['TestLocationID'],
                    rows[0]['ExperimentID'], rows[0]['t_floor'],
                    rows[0]['t_x'], rows[0]['t_y'])
    except IndexError:
        return None

    for row in rows.as_dict():
        btkey = (row['Major'], row['Minor'])
        if btkey not in test.bts:  # if we haven't seen this BT before, make a new object for it
            test.bts[btkey] = BT(row['Major'], row['Minor'],
                                 row['DeployLocID'], row['bt_floor'],
                                 row['bt_x'], row['bt_y'])
        # convert the rssi from DBm to mW
        rssi = float(row['Rssi'])
        rssi_power = 10**(rssi / 10)
        # add the rssi to the BT's list of seen-rssis.
        test.bts[btkey].rssis.append(rssi_power)

    # For each BT, average the rssi, and convert back to DBm
    for bt in test.bts.values():
        avg_pow = sum(bt.rssis) * 1.0 / len(bt.rssis)
        bt.average_rssi = 10 * math.log10(avg_pow)
    return test
