"use strict";
exports.__esModule = true;
var mmm_1 = require("./comp/mmm");
var Poloniex = require("poloniex.js");
var autobahn = require("autobahn");
var fs = require("fs");
var convnetjs = require("convnetjs");
var mmmut = new mmm_1.MMMUtils();
var util = new Poloniex();
function fetchChartData() {
    var startChart = new Date(2017, 9, 11, 0, 0, 0, 0).getTime() / 1000;
    var endChart = new Date(2017, 9, 12, 0, 0, 0, 0).getTime() / 1000;
    var chartData = util.returnChartData('BTC', 'ETH', 300, startChart, endChart, function (err, data) {
        var mv = mmmut.calculateMovingVolume(data, 10);
        var max = mmmut.maximumVal(mv);
        var mvc = mmmut.normalize(mv, max);
        return mvc;
    });
    return chartData;
}
function getEthData() {
    var wsuri = "wss://api.poloniex.com";
    var connection = new autobahn.Connection({
        url: wsuri,
        realm: "realm1"
    });
    var collection = [];
    connection.onopen = function (session) {
        function ethTicker(args, kwargs) {
            if (args.indexOf('BTC_ETH') > -1) {
                var now = Date.now();
                args[0] = now;
                collection.unshift(args);
                if (collection.length % 10 == 0) {
                    console.log('Collection has ' + collection.length + ' items.');
                }
                if (collection.length >= 1000) {
                    var dataFile = fs.readFileSync('./data.json');
                    var data_1 = JSON.parse(dataFile);
                    collection.forEach(function (item) {
                        data_1.push(item);
                    });
                    console.log('Writing ' + data_1.length + ' items to database');
                    var dataJSON = JSON.stringify(data_1);
                    fs.writeFileSync('./data.json', dataJSON);
                    collection = [];
                }
            }
        }
        session.subscribe('ticker', ethTicker);
    };
    connection.onclose = function () {
        console.log("Websocket connection closed");
    };
    connection.open();
}
// getEthData();
function firstTrain() {
    var trainFile = fs.readFileSync('./data.json');
    var trainData = JSON.parse(trainFile);
    var layer_defs = [];
    // input layer of size 1x1x2 (all volumes are 3D)
    layer_defs.push({ type: 'input', out_sx: 10, out_sy: 1, out_depth: 1 });
    // some fully connected layers
    layer_defs.push({ type: 'fc', num_neurons: 10, activation: 'relu' });
    layer_defs.push({ type: 'fc', num_neurons: 10, activation: 'relu' });
    // a softmax classifier predicting probabilities for two classes: 0,1
    layer_defs.push({ type: 'softmax', num_classes: 2 });
    // create a net out of it
    var net = new convnetjs.Net();
    net.makeLayers(layer_defs);
    // the network always works on Vol() elements. These are essentially
    // simple wrappers around lists, but also contain gradients and dimensions
    // line below will create a 1x1x2 volume and fill it with 0.5 and -1.3
    trainData.forEach(function (element) {
        var x = new convnetjs.Vol(element);
        var probability_volume = net.forward(x);
        console.log('probability that x is class 0: ' + probability_volume.w[0]);
    });
}
firstTrain();
// prints 0.50101 
