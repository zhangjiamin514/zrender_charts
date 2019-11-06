import AniC from "../../../unit/animateChoose.js";
import Option from "./option.js";
const zrender = require('zrender');

class Chats{
	constructor(dom){
		//生成需要的全局变量
		this.zr=zrender.init(dom);
		this.allW=this.zr.getWidth();
		this.allH=this.zr.getHeight();
		this.saveData=[];   //存放所有组件生成的元素
		
		this.maxData=0;//数据最大值
		
		this.init();  //调用创建组方法
		this.anic=new AniC();
	}
	init(){
		//创建组，添加到zrender中
		this.group = new zrender.Group();
		this.zr.add(this.group);
		//把组件需要的东西都分组存放，新建多个组，把生成的圆，矩形等加入到组里，然后存入到全局元素存放处，
		this.statics = new zrender.Group();
		this.group.add(this.statics);
		//触碰矩形
		this.rectmous = new zrender.Group();
		this.group.add(this.rectmous);
		
		
		
	}
	//存入图形
    setSave(ele, i, name) {
        if(this.saveData[name + '_' + i]) {
            this.saveData[name + '_' + i].off();
        }
        this.saveData[name + '_' + i] = ele;
        
    }
    //取出图形
    getSave(name, i) {
        return this.saveData[name + '_' + i];
    }
    //销毁zrender实例
    dispose() {
        zrender.dispose(this.zr);
    }
    
    //公共部分动画显示
    showPub(opt){
    	//设置公共部分配置信息
    	if(!this.pub)this.pub=new Option(this,opt);
    	else{
    		this.pub.setXYLT(opt);
    	}
    	//显示公共部分
    	this.x_Z.showAll();
    	this.y_Z.showAll();
    	
    	this.drawPublic(opt);   //画里面的组件
    	
    }
    
    //传入配置，数据等信息，去画组件，可以自己新建方法函数，生成静态元素方法，动态元素方法
    drawPublic(opt){
		let cur=this;
		
		this.drawC(opt);    //画元素
	}
    //具体画元素
    drawC(opts){
    	let cur=this;
        
//  	cur.rectmous.removeAll();//要把触发清空，然后重新触发，
    	
    	//循环数据，画单个的曲线
//      for (let wz=0;wz<opts.data.length;wz++) {
        	
        	//根据数据进行曲线绘制cur.x_Z.xz_dian.length
	    	for (let i=0;i<cur.x_Z.xz_dian.length;i++) {
	    		
	    			let xd=cur.x_Z.xz_dian[i];
					let yd=(opts.data[0][i]/cur.maxData)*cur.y_Z.yh;
					//绘制触碰矩形
					if(i!=0){
						let widt=(cur.x_Z.xz_dian[1]-cur.x_Z.xz_dian[0])/2;
						let rectbg=cur.getSave("rectbg",i);
						let delay=Math.floor((Math.random()*opts.data[0].length)+1)*100;
						if(!rectbg){
							rectbg= new zrender.Rect({
								shape:{
									x:xd-widt/2,
									y:cur.x_Z.y,
									width:widt,
									height:-cur.y_Z.yh
								},
								style:{
									fill:"#ffeb3b",
									opacity:0
								},
								z:3
							});
							cur.rectmous.add(rectbg);
							cur.setSave(rectbg, i, "rectbg");
							//添加动画
							let attribute={
								target:rectbg,  //需要缓动的对象
								ease:7,    //添加缓动函数，可以自定义，也可以输入数字1-7对应不同的缓动效果
								time:1000,   //动画持续时间，一般是毫秒
								delay: delay,  //动画延迟时间，一般是毫秒
								style:{
									opacity:0.3
								},
							}
							cur.anic.init(attribute);
//							cur.anic.init("opacity",rectbg,delay,0.3);
						}
						let rectc=cur.getSave("rectc",i);
						if(!rectc){
							rectc= new zrender.Rect({
								shape:{
									x:xd-widt/2,
									y:cur.x_Z.y,
									width:widt,
									height:0
								},
								style:{
									fill:"#ffeb3b",
									opacity:0
								},
								z:3
							});
							cur.statics.add(rectc);
							cur.setSave(rectc, i, "rectc");
							//添加动画
//							cur.anic.init("height",rectc,delay,yd);						
							let attribute={
								target:rectc,  //需要缓动的对象
								ease:7,
								time:3000,   //动画持续时间，一般是毫秒
								delay: delay,  //动画延迟时间，一般是毫秒
								shape:{
									height:-yd
								},
								style:{
									opacity:1
								},
							}
							cur.anic.init(attribute);
						    
						}
						
					}
					
	    	}
	    	
	    	
//  	}
//  	console.log("x轴点数组:"+this.x_Z.xz_dian,"y轴点数组:"+this.y_Z.yz_dian,"yh:"+this.y_Z.yh);
    }
    
    
    
    //移除组中的元素，
    removeAll(){
    	let cur=this;
//  	this.statics.removeAll();
//  	console.log(this.statics)
    	
    }
}

export default Chats;