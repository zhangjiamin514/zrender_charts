const zrender = require('zrender');
//import TweenMax from './TweenMax.min.js';
const ku = require("./images/k1.png");
const kuh = require("./images/k2.png");
const imgbg = require("./images/imgbg.png");
const imgup = require("./images/imgup.png");
class Chart_hbzs{
    constructor(dom){
        this.zr=zrender.init(dom);
        this.allW=this.zr.getWidth();
        this.allH=this.zr.getHeight();
        this.saveData=[];   //存放所有组件生成的元素
        this.init();
        this.drawPic();
    }
    setSave(ele, i, name) {
        if(this.saveData[name + '_' + i]) {
            this.saveData[name + '_' + i].off();
        }
        this.saveData[name + '_' + i] = ele;
    }
    getSave(name, i) {
        return this.saveData[name + '_' + i];
    }
    init(){
        this.group = new zrender.Group();
        this.zr.add(this.group);
        this.statics = new zrender.Group();
        this.group.add(this.statics);
        this.kuangg = new zrender.Group();
        this.group.add(this.kuangg);
        this.lengtit = new zrender.Group();
        this.group.add(this.lengtit);
        this.kuanc = new zrender.Group();
        this.group.add(this.kuanc);
        
    }
    //数据调用
    setOption(data){
    	let tuli=data.children;
    	let dq={id: tuli.length+1, name: "大区", so2Num: data.so2AllNum, noxNum:data.noxAllNum, smokeNum:data.smokeAllNum};
    	tuli.push(dq);
    	this.initLegend(tuli);
    	this.alldata=tuli;
    }
    // 渲染图例
    initLegend(res){
    	let cur=this;
    	cur.kuangg.removeAll();
    	cur.lengtit.removeAll();
    	cur.kuanc.removeAll();
    	let kw=18/864*cur.allW;
    	let kx=0;
    	let ky=24/377*cur.allH;
    	for (let i=0;i<res.length;i++) {
    		
    			let img= new zrender.Image({
		            style: {
		                image:i==res.length-1?kuh:ku,
		                x: kx,
		                y: ky,
		                width: kw,
		                height: kw
		            }
		        });
		        cur.kuangg.add(img);
		        
		        let titx=new zrender.Text({
		        	style:{
		        		text:res[i].name,
		        		x: 10/864*cur.allW+img.getBoundingRect().x+img.getBoundingRect().width,
		                y: ky,
		                textFill: i==res.length-1?"#e6da1d":"#0072ff",
		                textAlign: 'left',
		                fontSize: kw
		        	}
		        });
		        cur.lengtit.add(titx);
		        
		        let kuangcw=img.getBoundingRect().width+titx.getBoundingRect().width+20/864*cur.allW+10/864*cur.allW;
		        let kuangc=new zrender.Rect({
		        	shape:{
		        		x: kx,
		                y: ky,
		                width: kuangcw,
		                height: kw
		        	},
		        	style:{
		        		fill:"transparent",
		        		lineWidth:0
		        	},
		        	z:3
		        });
		        cur.kuanc.add(kuangc);
		        kuangc.on("click",function(){
		        	cur.kuangg._children.map(function(j,w){
		        		j.attr({
		        			style: {
				                image:w==i?kuh:ku,
				            }
		        		});
		        	});
		        	cur.lengtit._children.map(function(c,n){
		        		c.attr({
		        			style: {
				                textFill:n==i?"#e6da1d":"#0072ff",
				            }
		        		});
		        	});
		        	for (let w=0;w<3;w++) {
			        	let numz=cur.getSave("num",w);
			        	let imgz=cur.getSave("imgl",w);
			        	let daz=res[i].so2Num;
			        	let dazll=res[res.length-1].so2Num;
			        	if(w==1){
			        		daz=res[i].noxNum;
			        		dazll=res[res.length-1].noxNum;
			        	}
			        	if(w==2){
			        		daz=res[i].smokeNum;
			        		dazll=res[res.length-1].smokeNum;
			        	}
			        	numz.animate('style', false)
							.when(1000, {
								text: daz*1
							})
							.during(function(num, time) {
								let txt=parseFloat(num.text).toFixed(2)*1;
								num.text = txt;
							})
							.start();
						imgz.animate('style', false)
							.when(1000, {
								width: daz/dazll*387/864*cur.allW
							})
							.start();
		        	}
//					console.log(res[i].name,i);
				});
				if(i==res.length-1){
					kuangc.trigger("click");
					console.log(6665551255)
				}
		        
		        kx=titx.getBoundingRect().x+titx.getBoundingRect().width+20/864*cur.allW;
		        if(kx>cur.allW-kuangcw){
		        	kx=0;
		        	ky=24/377*cur.allH+kw+10/377*cur.allH;
		        }
		      
	        
    	}
    	
        
        
    }
    // 画图
    drawPic(res){
    	let cur=this;
        let txt=["SO","NO","烟尘"];
        
        for (let i=0;i<3;i++) {
	        let tx=i==1?478/864*cur.allW:6/864*cur.allW;
	        let ty=i==2?240/377*cur.allH:96/377*cur.allH;
	        let titBig=new zrender.Text({
	        	style:{
	        		text:txt[i],
	        		x: tx,
	                y: ty,
	                textFill:"#00b0ff",
	                fontSize: 42/864*cur.allW,
	                fontFamily:"DIN"
	        	}
	        });
			cur.statics.add(titBig);
			
			if(i==0||i==1){
				let txtsx=i==0?"2":"X";
				let numsx=i==0?3:4;
				let titBigs=new zrender.Text({
		        	style:{
		        		text:txtsx,
		        		x: titBig.getBoundingRect().x+titBig.getBoundingRect().width-numsx/377*cur.allW,
		                y: titBig.getBoundingRect().height+titBig.getBoundingRect().y,
		                textFill:"#00b0ff",
		                fontSize: 26/864*cur.allW,
		                fontFamily:"DIN",
		                textVerticalAlign:"bottom"
		        	}
		        });
				cur.statics.add(titBigs);
			}
			
			let titSm=new zrender.Text({
	        	style:{
	        		text:"月累计排放量：",
	        		x: titBig.getBoundingRect().x,
	                y: titBig.getBoundingRect().height+titBig.getBoundingRect().y+10/377*cur.allH,
	                textFill:"#00f6ff",
	                fontSize: 26/864*cur.allW,
	                fontFamily:"DIN",
	                opacity:0.5
	        	}
	        });
			cur.statics.add(titSm);
			let numtit=new zrender.Text({
	        	style:{
	        		text:0,
	        		x: titSm.getBoundingRect().x+titSm.getBoundingRect().width+10/864*cur.allW,
	                y: titSm.getBoundingRect().height+titSm.getBoundingRect().y+5/377*cur.allH,
	                textFill:"#00f6ff",
	                fontSize: 48/864*cur.allW,
	                fontFamily:"DIN",
	                textVerticalAlign:"bottom"
	        	}
	        });
			cur.statics.add(numtit);
			cur.setSave(numtit, i, "num");
			let imgbgz= new zrender.Image({
	            style: {
	                image:imgbg,
	                x: titSm.getBoundingRect().x,
	                y: titSm.getBoundingRect().height+titSm.getBoundingRect().y+10/377*cur.allH,
	                width: 387/864*cur.allW,
	                height: 16/377*cur.allH
	            }
	        });
	        cur.statics.add(imgbgz);
	        let imgbgzl= new zrender.Image({
	            style: {
	                image:imgup,
	                x: titSm.getBoundingRect().x,
	                y: titSm.getBoundingRect().height+titSm.getBoundingRect().y+10/377*cur.allH,
	                width: 0,
	                height: 16/377*cur.allH
	            }
	        });
	        cur.statics.add(imgbgzl);
	        cur.setSave(imgbgzl, i, "imgl");
        }

    }
    // 数字
    drawNum(){
        
    }

    // 更新图表
    updateChart(data,indexDemo){
        
    }
}

export default Chart_hbzs;
