/**
* Authentication.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id: {
      type: 'integer'
    },
    email: {
      type: 'string',
      // type: 'email',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },


  /**
   * Check validness of a login using the provided inputs.
   * But encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  attemptLogin: function (inputs, cb) {
    // Create an authentication
    console.log('inputs',inputs);
    Authentication.findOne({
      email: inputs.email,
      // TODO: Encrypt the password first
      password: inputs.password
    })
    .exec(cb);

    // var email = inputs.email;
    // var password = input.password;

    // var con = mysql.createConnection(db);

    // con.connect(function(err){
    //   if(err){
    //     console.log('Error connecting to db');
    //     console.log(err);
    //     return;
    //   }

  }
};