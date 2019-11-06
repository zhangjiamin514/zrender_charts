const zrender = require('zrender');

class X_Axis {
    constructor(par,opt) {
    	this.par=par;
        this.zr = par.zr;
        this.initGroup();
        this.allW=this.zr.getWidth();
		this.allH=this.zr.getHeight();
		this.setInit(opt);
		
    }
    
    setInit(opt){
    	this.x1=opt.x1;
		this.x2=opt.x2;
		this.y=opt.y;
		this.xh=this.x2-this.x1-opt.x2w;   //x轴有效距离长度
		this.xline=this.allW-opt.x2w;  //x轴线长度
		this.xz_dian=[];   //存储x轴点
		this.color=opt.color||"#000";  //字的颜色
		this.fontS=opt.fontS||14;  //字的大小
		this.fontF=opt.fontF||"Arial";  //字的字体
		this.rectW=opt.rectW||2;  //标点的宽
		this.rectH=opt.rectH||3; //标点的高
		this.colorR=opt.colorR||"#000";  //标点的颜色
		this.lineWidth=opt.lineWidth||2;  //线宽  
		this.colorL=opt.colorL||"#000";  //线颜色
		this.firstShow=opt.firstShow||"true";  //原点是否显示
		this.aniTime=opt.aniTime||300,   //y轴内元素动画时间
		this.aniDelay=opt.aniDelay||0,    //y轴内元素动画延迟时间
		this.anieasing=opt.anieasing|| Power0.easeNone   //y轴内元素缓动函数
    }
    
    initGroup() {
        this.groupX = new zrender.Group();
        this.zr.add(this.groupX);
    }
    
    drawX(data){
    	let cur = this;
    	cur.removeAll();
    	let lineX=new zrender.Line({
			shape:{
				x1:cur.x1,
				y1:cur.y,
				x2:cur.xline,
				y2:cur.y,
			},
			style:{
				stroke:cur.colorL,
				lineWidth:cur.lineWidth,
				opacity:0
			},
			silent:true,
		});
		cur.groupX.add(lineX);
		//
		cur.xz_dian=[];
		let x_jg=cur.xh/(data.length-1);
		for (let i=0;i<data.length;i++) {
			let rx=cur.x1+1+i*x_jg;
			cur.xz_dian.push(rx);
			let re=new zrender.Rect({
				shape: {
			        x: rx-cur.rectW/2,
			        y: cur.y+1,
			        width:cur.rectW,
			        height:cur.rectH
			    },
		        style: {
		            fill:cur.colorR,
					opacity:0
		        },
		        silent:true,
		    });
			cur.groupX.add(re);
			let td = new zrender.Text({
				style: {
					text:data[i],
					x: rx-cur.rectW/2,
		        	y: cur.y+cur.rectH+2,
					textFill: cur.color,
					textAlign: 'center',
					fontSize:cur.fontS,
					fontFamily:cur.fontF,
					textVerticalAlign:"top",
					opacity:0
				},
		    	silent:true,
			});
			cur.groupX.add(td);
			if(cur.firstShow=="false"&&i==0){
				re.hide();
				td.hide();
			}
		}
		
    }
    
    removeAll(){
    	let cur=this;
    	this.groupX.removeAll();
//		this.groupX._children.map((v,j) =>{
//  		cur.groupX.remove(v);
//  		console.log(j)
//  	});
    }
    showAll(){
    	let cur=this;
    	this.groupX._children.map((v,j) =>{
    		let attribute={
				target:v,  //需要缓动的对象
				ease:cur.anieasing,
				time:cur.aniTime,   //动画持续时间，一般是秒
				delay: cur.aniDelay,  //动画延迟时间，一般是秒
				style:{
					opacity:1
				},
			}
			cur.par.anic.init(attribute);
//  		cur.par.anic.init("opacity",v,cur.aniDelay,1);
//  		v.animateTo({
//					style:{
//						opacity: 1,
//					}
//				}, cur.aniTime,cur.aniDelay,cur.anieasing);
    	});
    }
    hideAll(){
    	this.groupX._children.map((v,j) =>{
    		v.animateTo({
					style:{
						opacity: 0,
					}
				}, 100, 'cubicOut');
    	});
    }
    
}

export default X_Axis;