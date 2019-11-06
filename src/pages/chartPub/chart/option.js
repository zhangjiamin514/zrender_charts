import X_Axis from "../../../unit/X_Axis.js";
import Y_Axis from "../../../unit/Y_Axis.js";
import Legend from "../../../unit/legend.js";
import Tooltip from "../../../unit/Tooltip.js";

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
			y2:150,  //第二个点
			y2w:140,   //距离上边的间距
			x:45,  //轴线的x值
			yleng:3,
			color:"#54b3ea",  //字的颜色
			fontS:28, //字的大小
			fontF:"DIN",//字的字体
			rectW:3,  //标点的宽
			rectH:3,  //标点的高
			colorR:"#00e0fe",  //标点的颜色
			lineWidth:1,  //线宽  
			colorL:"#123764",  //线颜色
			firstShow:"true", //原点是否显示,
			data:opt.data,   //y轴数据
			aniTime:300,   //y轴内元素动画时间
			aniDelay:0,    //y轴内元素动画延迟时间
			anieasing:"cubicOut"   //y轴内元素缓动函数
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
			color:"#54b3ea",  //字的颜色
			fontS:28, //字的大小
			fontF:"DIN",//字的字体
			rectW:3,  //标点的宽
			rectH:3,  //标点的高.
			colorR:"#00e0fe",  //标点的颜色
			lineWidth:1,  //线宽  
			colorL:"#123764",  //线颜色
			firstShow:"false",   //原点是否显示
			aniTime:300,   //x轴内元素动画时间
			aniDelay:0,    //x轴内元素动画延迟时间
			anieasing:"cubicOut"   //x轴内元素缓动函数
		};
		//实例化x轴配置
		if(!cur.x_Z)cur.x_Z=new X_Axis(cur,xpot);
		else{
			cur.x_Z.setInit(xpot);
		}
		
		//传入x轴y轴数据，获取xy轴点
    	cur.x_Z.drawX(opt.xTime);
    	
    	//生成图例
    	let legopt={
    		x:10,  //图例第一个x位置
    		y:44,  //图例y位置
    		width:30, //图例矩形宽度
    		height:15,//图例矩形高度
    		lengetxt:["实施","未实施"], //图例标题
    		clor:["#dceeff","#00eaff"], //图例块颜色
    		titleClor:"#00baff", //图例文字颜色
    		fontSize:34, //图例文字颜色
    		hideClor:"#cccccc",  //图例不显示状态颜色
    		interval1:20,  //矩形和文字之间的距离
    		interval2:50,  //第一组和第二组之间的距离
    		direction:"true",  //图例横向还是竖向，true 为横向，false 为竖向
    		aniTime:300,   //图例内元素动画时间
			aniDelay:0,    //图例内元素动画延迟时间
			anieasing:"cubicOut",   //y轴内元素缓动函数
			align:"left"   //图例水平位置 left，middle，right
    		
    	}
    	if(!cur.leg)cur.leg=new Legend(cur.zr,legopt,cur);   //传入zr，配置，当前的组件
    	
    	//生成提示框样式
    	let toolopt={
    		textFill:"#f8a201", //提示文字颜色
    		fontSize:34, //提示文字颜色
    		textPadding:[10,20], //提示框内边距
    		textBorderColor:"#01cbfd",  //提示框颜色
			textBorderWidth:2,  //提示框线宽
			aniTime:300,   //提示框内元素动画时间
			aniDelay:0,    //提示框内元素动画延迟时间
			anieasing:"cubicOut"   //提示框内元素缓动函数
    		
    	};
    	if(!cur.tool)cur.tool=new Tooltip(cur.zr,toolopt);  //生成提示框，调用提示框显示:drawT(x位置，y位置，显示内容数组)，调用提示框隐藏:hide()
    	
    }
    
}

export default Option;