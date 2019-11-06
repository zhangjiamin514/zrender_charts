import "commonDir/css/common.less";
import "./nav.less";
import "./index.less";
import $ from "jquery";
import Chats from "./chart/chart.js";
import Chatsh from "./chart/charth.js";

let zu=[];
let opts = {
            data:[[30,45,70,20,10,25,40,50,15,30,60,90]],
            xTime:["0","1","2","3","4","5","6","7","8","9","10","11"]
        };
let opts2 = {
            data: [[15,45,67,34,57,67,74,60,50,30,54,79]],
            xTime:["0","1","2","3","4","5","6","7","8","9","10","11"]
        };

for (let i=0;i<12;i++) {
	let str="charts"+(i+1);
	let dom1=document.getElementsByClassName(str);
	let chart1="";
	if(i%2==0)chart1=new Chats(dom1[0]);
	else{
		chart1=new Chatsh(dom1[0]);
	}
	setTimeout(function(){
		chart1.showPub(opts);
	},Math.floor((Math.random()*12)+1)*100);
	
	zu.push(chart1);
}
let cl=1;
$("body").click(()=>{
//	chart1.dispose();
//	let op=opts;
//	if(cl==1){op=opts;cl=0;}
//	else{
//		op=opts2;
//	}
//	for (let i=0;i<12;i++) {
//		setTimeout(function(){
//			zu[i].showPub(op);
//		},i*100)
//	}
	
//	chart1.showPub(opts2);

});
