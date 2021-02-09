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
var apyUrl = "https://api.yearn.tools/vaults/apy";
const tvlUrl = 'https://api.yearn.tools/tvl';

var request = require('request');

var he = require('he');

// Start once
tweeter();

// Once every N milliseconds
setInterval(tweeter, 1000 * 60 * 60 * 24);

// Here is the bot!
function tweeter() {
// get APY
  request(apyUrl, gotData);

  function gotData(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);

      // This is a random number bot
     
      var tweet = "This month's yield:"
      var apys = new Array()
      var vaults = new Array()
      for (var i=0; i < data.length; i++){
        console.log(data[i].name);
        if ((data[i].name != 'ChainLink') && (data[i].name != 'DAI')){ // removing chainLink as it can provide a negative APY and it is not really active.
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

  // get TVL
  request(tvlUrl, gotTvlData);
  var tvlDataUSD;
  function gotTvlData(error, response, body) {
    if (!error) {
      var tvlData = JSON.parse(body); 
      tvlDataUSD = tvlData.TvlUSD.toLocaleString("en", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
        });
     

      tweet = tweet + " "+min+"% to "+max+"% annualized. \nBest performing vault: "+bestVault+". \nTotal Value Locked: "+tvlDataUSD+"\nStart earning yield at yearn"+he.decode('&#x2024')+"finance/vaults $YFI #DEFI"
      

    // Post that tweet!
    // T.post('statuses/update', { status: tweet }, tweeted);
  }
}

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
