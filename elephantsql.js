const pg = require('pg');
const conString = "postgres://wcttmvpv:wQkxFqVLnxpNVCe_14lj2xD2N8Cc4TI-@motty.db.elephantsql.com/wcttmvpv"
const client = new pg.Client(conString);

client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query(`SELECT email, hash FROM login WHERE email = 'pepe@gmail.com'`, function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log('everything is working');
      
    });
  
  });

  module.exports = client;