

import plnx from 'plnx';
import poloniex from 'poloniex.js';


export class MMMUtils {
    plnx: any;

    constructor(){
      this.plnx = poloniex;
    }

    calculateMovingVolume(data, depth){
      let movingVolumeAvg = [];
      let chdata = data.map(element => {
        return element.volume
      });
      let chunked = this.chunkArr(chdata, depth);
      chunked.forEach((item) => {
          let long = item.length;
          let sum = 0;
          for(let i = 0; i < item.length; i++){
              sum += item[i];
          };
          let mean = sum / long;
          movingVolumeAvg.push(mean);
      });
      return movingVolumeAvg;
    }

    maximumVal(data: number[]): number{
      let max = Math.max(...data);
      console.log(max);
      return max;
    }

    normalize(data: number[], factor: number){
      
      let normalized = data.map((x: number) => {
        let calcd = x/factor;
        return calcd;
      });
      return normalized;
    }


    
    filterCurr (data: array[], curr: string) {
        let stageArr = [];
        var filtered = data.forEach((item) => {
            let filtArr = item.filter((info) => {
                return info !== curr
            });
            stageArr.push(filtArr);
        })
        return stageArr;
    }
    
    filterStuff(data, theFilter){
      let filterData, filterFile;
      if(data){
        filterData = data
      } else {
        filterFile = fs.readFileSync('./undata.json');
        filterData = JSON.parse(filterFile);
      }
      
      let filtered = this.filterCurr(filterData, theFilter);
      
      let dataJSON = JSON.stringify(filtered);
      fs.writeFileSync('./data.json', dataJSON);
      console.log(filtered);
    }
    

    chunkArr(arr: any[], chunkSize: number) {
      let chunkedArr = [];
      for(let i = 0; i < arr.length - chunkSize; i++){
        let chunk = [];
        for(let k = i; k < chunkSize + i; k++){
          chunk.push(arr[k]);
        }
        chunkedArr.push(chunk);
      }
      return chunkedArr;
    }

    /*
    derivation(arr){
        let dataArr = [];
        for (let i = 0; i < arr.length; i++) {
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
    */
}

