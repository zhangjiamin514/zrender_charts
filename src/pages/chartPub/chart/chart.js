import AniC from "../../../unit/animateChoose.js";
import Option from "./option.js";
const zrender = require('zrender');
const imgd=require('./lightcd.png');

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
    	this.leg.showAll();
    	
    	this.drawPublic(opt);   //画里面的组件
    	
    }
    
    //传入配置，数据等信息，去画组件，可以自己新建方法函数，生成静态元素方法，动态元素方法
    drawPublic(opt){
		let cur=this;
		
		let dyTxt=cur.getSave("dyTxt",0);   //从全局中取元素，然后判断是不是有这个元素，如果没有就生成，如果有就改变变量然后动画。
		if(!dyTxt){
			dyTxt=new zrender.Text({
				style:{
					text:"单位(ms)",
					textFill:"#54b3ea",
					x:10,
					y:105,
					textVerticalAlign:"middle",
					fontSize:34,
					fontFamily:"Microsoft yahei"
				},
			});
			cur.statics.add(dyTxt);
			cur.setSave(dyTxt, 0, "dyTxt");
			let dxTxt=new zrender.Text({
				style:{
					text:"(时)",
					textFill:"#54b3ea",
					x:cur.allW,
					y:this.allH-35,
					textAlign:"right",
					fontSize:20,
					fontFamily:"Microsoft yahei"
				},
			});
			cur.statics.add(dxTxt);
			cur.setSave(dxTxt, 0, "dxTxt");
		}
		else{
			dyTxt.attr({
				style:{
					text:"单位(ms)",
				}
			});
			let dxTxt=cur.getSave("dxTxt",0);
			dxTxt.attr({
				style:{
					text:"(时)",
				}
			});
		}
		
		this.drawC(opt);    //画元素
	}
    //具体画元素
    drawC(opts){
    	let cur=this;
    	let clor=["#dceeff","#00eaff"];
        let clorRgba=["rgba(110,173,255,0.05)","rgba(0,234,255,0.05)"];
        
    	cur.rectmous.removeAll();//要把触发清空，然后重新触发，
    	
    	//循环数据，画单个的曲线
        for (let wz=0;wz<opts.data.length;wz++) {
        	
        	//根据数据进行曲线绘制
        	let nowda=opts.data[wz];
			let dataDxyl0=[];
			let dataDxyl=[];
			let dataDxy0=[];
			let dataDxy=[];
	    	for (let i=0;i<cur.x_Z.xz_dian.length;i++) {
	    			let xd=cur.x_Z.xz_dian[i];
					let yd=cur.x_Z.y-(nowda[i]/cur.maxData)*cur.y_Z.yh;
					if(i==0){dataDxy0.push([xd,cur.x_Z.y]);dataDxy.push([xd,cur.x_Z.y]);}
					dataDxy0.push([xd,cur.x_Z.y]);
					dataDxy.push([xd,yd]);
					dataDxyl0.push([xd,cur.x_Z.y]);
					dataDxyl.push([xd,yd]);
					if(i==cur.x_Z.xz_dian.length -1){
						dataDxyl0.push([cur.allW,yd]);
						dataDxyl.push([cur.allW,yd]);
						dataDxy0.push([cur.allW,yd]);
						dataDxy.push([cur.allW,yd]);
						dataDxy0.push([cur.allW,cur.x_Z.y]);
						dataDxy.push([cur.allW,cur.x_Z.y]);
					}
					//绘制点
					let barCir=cur.getSave("barCir"+wz,i);   //从全局中取元素，然后判断是不是有这个元素，如果没有就生成，如果有就改变变量然后动画。
					if(!barCir){
						barCir = new zrender.Image({
							style: {
				                x: xd-31,
				                y: yd-31,
				                image: imgd,
				                width: 62,
				                height: 62,
				            	opacity:0
				            },
				            silent:true,
				            z:2
						});
						
						cur.statics.add(barCir);
						cur.setSave(barCir, i, "barCir"+wz);   //存入元素
					}
					else{
						barCir.attr({
						    style: {
				                x: xd-31,
				                y: yd-31
				            }
						});
					}
					
					//绘制线
					let linexy=cur.getSave("linexy"+wz,i);   //从全局中取元素，然后判断是不是有这个元素，如果没有就生成，如果有就改变变量然后动画。
					if(!linexy){
						linexy = new zrender.Polyline({
							shape: {
				                points: [[cur.x_Z.xz_dian[0],yd],[xd,yd],[xd,cur.x_Z.y]],
				            },
				            style:{
				            	lineDash:[4,2],
				            	stroke:"#ffc100",
				            	lineWidth:1,
				            	opacity:0
				            },
				            silent:true,
				            z:1
						});
						
						cur.statics.add(linexy);
						cur.setSave(linexy, i, "linexy"+wz);   //存入元素
					}
					else{
						linexy.attr({
						   shape: {
				                points: [[cur.x_Z.xz_dian[0],yd],[xd,yd],[xd,cur.x_Z.y]],
				            },
						});
					}
					//绘制触碰矩形
					if(wz==0){
						
						let widt=(cur.x_Z.xz_dian[1]-cur.x_Z.xz_dian[0])/2;
						let rectm= new zrender.Rect({
							shape:{
								x:i==0?xd:xd-widt/2,
								y:cur.x_Z.y,
								width:widt,
								height:-cur.y_Z.yh
							},
							style:{
								fill:"#ffffff",
								opacity:0
							},
							z:3
						});
						cur.rectmous.add(rectm);
						
					}
					
	    	}
	    	let Polylinel=cur.getSave("Polylinel",wz);   //从全局中取元素，然后判断是不是有这个元素，如果没有就生成，如果有就改变变量然后动画。
			if(!Polylinel){
				let Polylinel=new zrender.Polyline({
						shape:{
							points:dataDxyl0,
							smooth:0.3,
						},
						style:{
							stroke:clor[wz],
							lineWidth:2,
							shadowColor:clor[wz],
							shadowBlur:10
						},
						z2:12,
					    silent:true,
				});
				cur.statics.add(Polylinel);
				cur.setSave(Polylinel, wz, "Polylinel");   //存入元素
				
				Polylinel.animateTo({
							shape: {
						        points:dataDxyl,
						    },
						});
				let colro=new zrender.LinearGradient(1, 1, 1,0,[
					{
	                    offset: 0.8,
	                    color: clor[wz]
	               },
	                {
	                    offset: 0,
	                    color: clorRgba[wz]
	                }]);
				let Polylinelbg=new zrender.Polygon({
					shape:{
						points:dataDxy0,
						smooth:0.3,
						smoothConstraint:dataDxy0
					},
					style:{
						stroke:"transparent",
						fill:colro,
						opacity:0.5,
						lineWidth:0
					},
				    silent:true,
				});
				cur.statics.add(Polylinelbg);
				cur.setSave(Polylinelbg, wz, "Polylinelbg");   //存入元素
				
				Polylinelbg.animateTo({
					shape: {
				        points:dataDxy,
				        smoothConstraint:dataDxy
				    },
				});
			
			}
			else{
				Polylinel.animateTo({
					shape: {
				        points:dataDxyl,
				    },
				});
				let Polylinelbg=cur.getSave("Polylinelbg",wz);
				Polylinelbg.animateTo({
					shape: {
				        points:dataDxy,
				        smoothConstraint:dataDxy
				    },
				});
			}
	    	
	    	
    	}
        
        
        //添加鼠标事件，显示提示
        cur.rectmous._children.map((v,j) =>{
        	let barCir1=cur.getSave("barCir0",j);
			let barCir2=cur.getSave("barCir1",j);
			let linexy1=cur.getSave("linexy0",j);
			let linexy2=cur.getSave("linexy1",j);
			v.on('mouseover', (e) => {
				barCir1.animateTo({
					style:{
						opacity: 1,
					}
				}, 300, 'cubicOut');
				barCir2.animateTo({
					style:{
						opacity: 1,
					}
				}, 300, 'cubicOut');
				linexy1.animateTo({
					style:{
						opacity: 1,
					}
				}, 300, 'cubicOut');
				linexy2.animateTo({
					style:{
						opacity: 1,
					}
				}, 300, 'cubicOut');
				//调用提示框显示
				let tx=j<cur.x_Z.xz_dian.length/2?cur.x_Z.xz_dian[j]+31:cur.x_Z.xz_dian[j]-31;
				let txzi=j<cur.x_Z.xz_dian.length/2?"left":"right";  //内容对齐左右
				
				cur.tool.drawT(tx,cur.y_Z.y1-cur.y_Z.yh/2,["实际值：36","未达标：89"],txzi);  //显示提示框内容
			});
			v.on('mouseout', (e) => {
				barCir1.animateTo({
					style:{
						opacity: 0,
					}
				}, 300, 'cubicOut');
				barCir2.animateTo({
					style:{
						opacity: 0,
					}
				}, 300, 'cubicOut');
				linexy1.animateTo({
					style:{
						opacity: 0,
					}
				}, 300, 'cubicOut');
				linexy2.animateTo({
					style:{
						opacity: 0,
					}
				}, 300, 'cubicOut');
				//调用提示框隐藏
				cur.tool.hide();
			});
		});
        
    	console.log("x轴点数组:"+this.x_Z.xz_dian,"y轴点数组:"+this.y_Z.yz_dian,"yh:"+this.y_Z.yh);
    }
    
    //图例点击事件,根据返回的nu和show判断，nu是点击的第几个，show是是否显示，
    legendF(nu,show){
    	let cur=this;
		let Polylinels=cur.getSave("Polylinel",nu);
		let Polylinelbgs=cur.getSave("Polylinelbg",nu);
		if(!show){
			Polylinels.hide();
			Polylinelbgs.hide();
			for (let sd=0;sd<cur.x_Z.xz_dian.length;sd++) {
				let barCirs=cur.getSave("barCir"+nu,sd);
				let linexys=cur.getSave("linexy"+nu,sd);
				barCirs.hide();
				linexys.hide();
			}
		}
		else{
			Polylinels.show();
			Polylinelbgs.show();
			for (let sd=0;sd<cur.x_Z.xz_dian.length;sd++) {
				let barCirs=cur.getSave("barCir"+nu,sd);
				let linexys=cur.getSave("linexy"+nu,sd);
				barCirs.show();
				linexys.show();
			}
		}
    }
    
    //移除组中的元素，
    removeAll(){
    	let cur=this;
//  	this.statics.removeAll();
//  	console.log(this.statics)
    	
    }
}

export default Chats;