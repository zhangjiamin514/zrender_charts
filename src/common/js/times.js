//当前时间

class getTimen{
	constructor(){
		this.nowtime="";
		this.init();
	}
	init(){
		this.getTimen();
	}
	
	getTimen(){
		let cur=this;
		let times=new Date();
		let year=times.getFullYear();
		let mon=times.getMonth()+1;
		let day=times.getDate();
		let ho=times.getHours();
		let fen=times.getMinutes();
		if(mon<10){
		    mon = "0" + mon
		}
		if(day<10){
		    day = "0" + day
		}
		if(ho<10){
		    ho = "0" + ho
		}
		if(fen<10){
		    fen = "0" + fen
		}
		let str=year+"."+mon+"."+day+"　"+ho+":"+fen;
		let time_dom=document.getElementsByClassName("times");
		time_dom[0].innerHTML=str;
		this.nowtime=setTimeout(function(){
			cur.getTimen();
		},60000);
	}
}

export default getTimen;
