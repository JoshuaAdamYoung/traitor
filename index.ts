


import { MMMUtils } from './comp/mmm';
import Poloniex = require('poloniex.js');

import autobahn = require('autobahn');
import fs = require('fs');
import convnetjs  = require('convnetjs');

let mmmut= new MMMUtils();
let util = new Poloniex();

function fetchChartData(){
    let startChart = new Date(2017, 9, 11, 0, 0, 0, 0).getTime()/1000;
    let endChart = new Date(2017, 9, 12, 0, 0, 0, 0).getTime()/1000;
    let chartData = util.returnChartData('BTC', 'ETH', 300, startChart, endChart, (err, data) => {
        let mv = mmmut.calculateMovingVolume(data, 10);
        let max = mmmut.maximumVal(mv);
        let mvc = mmmut.normalize(mv, max);
        return mvc
    });
    return chartData;
}

function getEthData (){

    var wsuri = "wss://api.poloniex.com";
    var connection = new autobahn.Connection({
      url: wsuri,
      realm: "realm1"
    });
    
    let collection = [];
    
    connection.onopen = function (session) {
        function ethTicker (args,kwargs){
            if (args.indexOf('BTC_ETH') > -1) {
                let now = Date.now();
                args[0] = now;
                collection.unshift(args);
                if(collection.length % 10 == 0){
                    console.log('Collection has ' + collection.length + ' items.');
                }
                if(collection.length >= 1000){
                    let dataFile = fs.readFileSync('./data.json');
                    let data = JSON.parse(dataFile);
                    collection.forEach((item) => {
                        data.push(item)
                    });
                    console.log('Writing ' + data.length + ' items to database');
                    var dataJSON = JSON.stringify(data);
                    fs.writeFileSync('./data.json', dataJSON);
                    collection = [];
                }
            } 
        }
        session.subscribe('ticker', ethTicker);
    }
    
    connection.onclose = function () {
      console.log("Websocket connection closed");
    }
    
    connection.open();

}

// getEthData();

function firstTrain(){
    let trainFile = fs.readFileSync('./data.json');
    let trainData = JSON.parse(trainFile);
    
    var layer_defs = [];
    // input layer of size 1x1x2 (all volumes are 3D)
    layer_defs.push({type:'input', out_sx:10, out_sy:1, out_depth:1});
    // some fully connected layers
    layer_defs.push({type:'fc', num_neurons:10, activation:'relu'});
    layer_defs.push({type:'fc', num_neurons:10, activation:'relu'});
    // a softmax classifier predicting probabilities for two classes: 0,1
    layer_defs.push({type:'softmax', num_classes:2});
     
    // create a net out of it
    var net = new convnetjs.Net();
    net.makeLayers(layer_defs);
     
    // the network always works on Vol() elements. These are essentially
    // simple wrappers around lists, but also contain gradients and dimensions
    // line below will create a 1x1x2 volume and fill it with 0.5 and -1.3
    trainData.forEach(element => {
        var x = new convnetjs.Vol(element);
        
        var probability_volume = net.forward(x);
        console.log('probability that x is class 0: ' + probability_volume.w[0]);
    });
}
 firstTrain();

// prints 0.50101