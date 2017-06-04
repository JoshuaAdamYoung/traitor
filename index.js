const Poloniex = require('poloniex-api-node');
const poloniex = new Poloniex(process.env.POLO_TSHIRT, process.env.GOLF_CLUB);

/*

poloniex.returnTicker(function(err, ticker) {
  console.log('BTC_ETH last traded at: ' + ticker.BTC_ETH.last)
});

*/

/*

var autobahn = require('autobahn');
var wsuri = "wss://api.poloniex.com";
var connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});

connection.onopen = function (session) {
	function marketEvent (args,kwargs) {
		//console.log(args);
	}
	function tickerEvent (args,kwargs) {
		//console.log(args);
	}
	function trollboxEvent (args,kwargs) {
		console.log(args);
	}
	session.subscribe('BTC_XMR', marketEvent);
	session.subscribe('ticker', tickerEvent);
	session.subscribe('trollbox', trollboxEvent);
}

connection.onclose = function () {
  console.log("Websocket connection closed");
}

connection.open();

*/



// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var poloPush = new polo.PushWrapper();
var poloPublic = new polo.PublicWrapper();

var dataSet = [];
var data10 = [];
var data50 = [];
var data200 = [];
var dataDerivation = [];
var sum10 = 0;
var sum50 = 0;
var sum200 = 0;
var mean10 = 0;
var mean50 = 0;
var mean200 = 0;
var d10;
var d50;
var d200;


// Some currency pairs to watch
var watchList = ["BTC_ETH", "USDT_BTC", "BTC_USDT"];
var ethList = ["BTC_ETH"];

// Get price ticker updates
poloPush.ticker((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);

        // Disconnect
        return true;
    }

    // Check if this currency is in the watch list
      if (ethList.indexOf(response.currencyPair) > -1) {
          // Log the currency pair and its last price
          // console.log(response.currencyPair + ": " + response.last);
          numRes = Number(response.last);
          if (numRes !== dataSet[0]){
            dataSet.unshift(numRes);
            derivation([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
          }

          function derivation(arr){
            let dataArr = [];
            for ( i = 0; i < arr.length; i++) {
              let size = arr[i];
              let data = dataSet.slice(0, size);
              let mean = data.reduce((a, b) => {
                return a + b
              }, 0) / size;
              let derivation = ((numRes - mean) * 100000).toFixed();
              dataArr.push(derivation);
            }
            console.log(dataArr);
          }

          /*
            data10 = dataSet.slice(0,10);
            sum10 = data10.reduce((a, b) => {
              return a + b
            }, 0);
            mean10 = sum10 / 10;
            if(dataSet.length > 10) {
              d10 = numRes - mean10;
              d10 = d10 * 100000;
              d10 = d10.toFixed();
            } else {
              d10 = 'insuf data'
            };

            data50 = dataSet.slice(0,50);

            sum50 = data50.reduce((a, b) => {
              return a + b
            }, 0);

            mean50 = sum50 / 50;

            if(dataSet.length > 50) {
              d50 = numRes - mean50;
              d50 = d50 * 100000;
              d50 = d50.toFixed();
            } else {
              d50 = 'insuf data'
            };

            data200 = dataSet.slice(0,200);

            sum200 = data200.reduce((a, b) => {
              return a + b
            }, 0);

            mean200 = sum200 / 200;

            if(dataSet.length > 200) {
              d200 = numRes - mean200;
              d200 = d200 * 100000;
              d200 = d200.toFixed();
            } else {
              d200 = 'insuf data'
            }

            //console.log(sum);
            //console.log(mean);
            d = new Date();
            time = d.toTimeString().split(' ')[0];
            console.log('BTC_ETH, data points: ' + dataSet.length + ', current value: ' + response.last + ', d10: ' + d10 + ', d50: ' + d50 + ', d200: ' + d200 + ', time: ' + time);
            */

      }


});

/*
var startTime = new Date(2017, 4, 11);
var now = Date.now();

poloPublic.returnTradeHistory('BTC_ETH', startTime, now, (err, response) => {
  if (err) {
      // Log error message
      console.log("An error occurred: " + err.msg);

      // Disconnect
      return true;
  }
  console.log(response);
});

*/

function sma(points, data){
  for(i = 0; i < data.length; i++){

  }
}
