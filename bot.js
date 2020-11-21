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

var he = require('he');

// Start once
tweeter();

// Once every N milliseconds
setInterval(tweeter, 1000 * 60 * 60 * 24);

// Here is the bot!
function tweeter() {

  request(randomWordURL, gotData);

  function gotData(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);

      // This is a random number bot
     
      var tweet = "This month's yield:"
      var apys = new Array()
      var vaults = new Array()
      for (var i=0; i < data.length; i++){
        if (data[i].name != 'ChainLink'){ // removing chainLink as it can provide a negative APY and it is not really active.
        apys.push(data[i].apyOneMonthSample)
        vaults.push(data[i].name.replace('.',he.decode('&#x2024')))
        }

        
      }
      var min = Math.min.apply(null,apys).toFixed(2)
      var max = Math.max.apply(null,apys).toFixed(2)
   console.log(apys, vaults)
      console.log("min", Math.min.apply(null,apys).toFixed(2))
      console.log("max", Math.max.apply(null,apys).toFixed(2)) 
      console.log("Best performing vault", vaults[apys.indexOf(Math.max.apply(null,apys))])
      var bestVault = vaults[apys.indexOf(Math.max.apply(null,apys))]
      
      tweet = tweet + " "+min+"% to "+max+"% annualized. \nBest performing vault: "+bestVault+". \nStart earning yield at yearn.finance/vaults $YFI #DEFI"
      

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
