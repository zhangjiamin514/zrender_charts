import "commonDir/css/common.less";
import "./nav.less";
import "./index.less";
import $ from "jquery";
//import Chats from "./chart/chart.js";
import Chats from "./chart.js";
const jsonz = require('./wanli.json');

let zu=[];
let opts = {
            data: [
                [15,45,67,34,57,67,74,60,50,30,54,79],
                [80,60,70,60,50,30,40,70,130,60,40,20]
                ],
            xTime:["0","1","2","3","4","5","6","7","8","9","10","11"]
        };
let dom1=document.getElementsByClassName("charts1");
let chart1=new Chats(dom1[0]);

chart1.showPub(jsonz.data);

$("body").click(()=>{

//	let opts2 = {
//          data: [
//              [30,45,70,40,50,65,40,50,15,30,60,150,15,45,67,34,57,67,74,60,50,30,54,79,48],
//              [45,48,80,30,40,50,90,65,40,58,80,50,45,60,80,70,60,50,30,40,70,80,60,40,20]
//              ],
//          xTime:["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
//      };
//	chart1.showPub(opts2);

});
