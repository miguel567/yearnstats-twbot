// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// Using the Twit node package
// https://github.com/ttezel/twit
var Twit = require('twit');

// Pulling all my twitter account info from another file
var config = require('./config.js');

// Making a Twit object for connection to the API
var T = new Twit(config);

// A random word
var randomWordURL = "https://api.yearn.tools/vaults/apy";

var request = require('request');

// Start once
tweeter();

// Once every N milliseconds
setInterval(tweeter, 60*5*1000);

// Here is the bot!
function tweeter() {

  request(randomWordURL, gotData);

  function gotData(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);

      // This is a random number bot
      /* console.log(" first apy", data[0].apyOneMonthSample) */
      var tweet = "This month's yield is from:"
      var apys = new Array()
      var vaults = new Array()
      for (var i=0; i < data.length; i++){
        apys.push(data[i].apyOneMonthSample)
        vaults.push(data[i].name)

        
      }
      var min = Math.min.apply(null,apys).toFixed(2)
      var max = Math.max.apply(null,apys).toFixed(2)
/*       console.log(apys, vaults)
      console.log("min", Math.min.apply(null,apys).toFixed(2))
      console.log("max", Math.max.apply(null,apys).toFixed(2)) */
      tweet = tweet + " "+min+"% to "+max+"% annualized"
      

      // Post that tweet!
      T.post('statuses/update', { status: tweet }, tweeted);

      // Callback for when the tweet is sent
      function tweeted(err, data, response) {
        if (err) {
          console.log(err);
        } else {
          console.log('Success: ' + data.text);
        }
      } 
    }
  }

}
