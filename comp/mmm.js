"use strict";
exports.__esModule = true;
var poloniex_js_1 = require("poloniex.js");
var MMMUtils = /** @class */ (function () {
    function MMMUtils() {
        this.plnx = poloniex_js_1["default"];
    }
    MMMUtils.prototype.calculateMovingVolume = function (data, depth) {
        var movingVolumeAvg = [];
        var chdata = data.map(function (element) {
            return element.volume;
        });
        var chunked = this.chunkArr(chdata, depth);
        chunked.forEach(function (item) {
            var long = item.length;
            var sum = 0;
            for (var i = 0; i < item.length; i++) {
                sum += item[i];
            }
            ;
            var mean = sum / long;
            movingVolumeAvg.push(mean);
        });
        return movingVolumeAvg;
    };
    MMMUtils.prototype.maximumVal = function (data) {
        var max = Math.max.apply(Math, data);
        console.log(max);
        return max;
    };
    MMMUtils.prototype.normalize = function (data, factor) {
        var normalized = data.map(function (x) {
            var calcd = x / factor;
            return calcd;
        });
        return normalized;
    };
    MMMUtils.prototype.filterCurr = function (data, curr) {
        var stageArr = [];
        var filtered = data.forEach(function (item) {
            var filtArr = item.filter(function (info) {
                return info !== curr;
            });
            stageArr.push(filtArr);
        });
        return stageArr;
    };
    MMMUtils.prototype.filterStuff = function (data, theFilter) {
        var filterData, filterFile;
        if (data) {
            filterData = data;
        }
        else {
            filterFile = fs.readFileSync('./undata.json');
            filterData = JSON.parse(filterFile);
        }
        var filtered = this.filterCurr(filterData, theFilter);
        var dataJSON = JSON.stringify(filtered);
        fs.writeFileSync('./data.json', dataJSON);
        console.log(filtered);
    };
    MMMUtils.prototype.chunkArr = function (arr, chunkSize) {
        var chunkedArr = [];
        for (var i = 0; i < arr.length - chunkSize; i++) {
            var chunk = [];
            for (var k = i; k < chunkSize + i; k++) {
                chunk.push(arr[k]);
            }
            chunkedArr.push(chunk);
        }
        return chunkedArr;
    };
    return MMMUtils;
}());
exports.MMMUtils = MMMUtils;
