import X_Axis from "../../../unit/X_Axis.js";
import Y_Axis from "../../../unit/Y_Axis.js";

class Option{
	constructor(optio,opt){
		//生成需要的全局变量
		
		this.op=optio;
		this.setXYLT(opt);  //调用创建组方法
		
	}
    
    //生成xy轴刻度信息，图例，提示框
    setXYLT(opt){
    	let cur=this.op;
		let ypot={
			y1:cur.allH-45,   //第一个点
			y2:30,  //第二个点
			y2w:0,   //距离上边的间距
			x:45,  //轴线的x值
			yleng:6,
			color:"#ffeb3b",  //字的颜色
			fontS:14, //字的大小
			fontF:"DIN",//字的字体
			rectW:3,  //标点的宽
			rectH:3,  //标点的高
			colorR:"#ffeb3b",  //标点的颜色
			lineWidth:1,  //线宽  
			colorL:"#ffeb3b",  //线颜色
			firstShow:"true", //原点是否显示,
			data:opt.data,   //y轴数据
			aniTime:1000,   //y轴内元素动画时间
			aniDelay:0,    //y轴内元素动画延迟时间
			anieasing:RoughEase.ease.config({ template: Bounce.easeInOut, strength: 1, points: 20, taper: "none", randomize: false, clamp: false})   //y轴内元素缓动函数
		};
		
		//实例化y轴配置
		if(!cur.y_Z)cur.y_Z=new Y_Axis(cur,ypot);
		else{
			cur.y_Z.setInit(ypot);
		}
		cur.maxData=cur.y_Z.maxData;
		
		let xpot={
			x1:cur.y_Z.x,   //x轴第一个点
			x2:cur.allW-cur.y_Z.x,  //x轴第二个点
			x2w:0,   //距离右边的间距
			y:cur.allH-45,  //轴线的y值
			color:"#ffeb3b",  //字的颜色
			fontS:14, //字的大小
			fontF:"DIN",//字的字体
			rectW:3,  //标点的宽
			rectH:3,  //标点的高.
			colorR:"#ffeb3b",  //标点的颜色
			lineWidth:1,  //线宽  
			colorL:"#ffeb3b",  //线颜色
			firstShow:"false",   //原点是否显示
			aniTime:1000,   //x轴内元素动画时间
			aniDelay:0,    //x轴内元素动画延迟时间
			anieasing:RoughEase.ease.config({ template: Bounce.easeInOut, strength: 1, points: 20, taper: "none", randomize: false, clamp: false})   //x轴内元素缓动函数
		};
		//实例化x轴配置
		if(!cur.x_Z)cur.x_Z=new X_Axis(cur,xpot);
		else{
			cur.x_Z.setInit(xpot);
		}
		
		//传入x轴y轴数据，获取xy轴点
    	cur.x_Z.drawX(opt.xTime);
    	
    }
    
}

export default Option;