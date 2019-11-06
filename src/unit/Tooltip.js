const zrender = require('zrender');

class Tooltip {
    constructor(zr,opt) {
        this.zr = zr;
        this.allW=this.zr.getWidth();
		this.allH=this.zr.getHeight();
		this.opt={
    		textFill:opt.textFill||"#f8a201", //提示文字颜色
    		fontSize:opt.fontSize||34, //提示文字颜色
    		textPadding:opt.textPadding||[10,20], //提示框内边距
    		textBorderColor:opt.textBorderColor||"#01cbfd",  //提示框颜色
			textBorderWidth:opt.textBorderWidth||2,  //提示框线宽
			aniTime:opt.aniTime||300,   //提示框内元素动画时间
			aniDelay:opt.aniDelay||0,    //提示框内元素动画延迟时间
			anieasing:opt.anieasing||"cubicOut"   //提示框内元素缓动函数
		};
		this.initGroup();
		
    }

    initGroup() {
        this.groupT = new zrender.Group();
        this.zr.add(this.groupT);
        
    }
    //x值，y值，内容组，内容对齐左右
    drawT(tx,ty,zu,txzi){
    	let cur = this;
    	
		let txt="";
		for (let i=0;i<zu.length;i++) {
				let oldt="\n";
				if(i==zu.length-1)oldt="";
				txt=txt+zu[i]+oldt;
		}
		if(!cur.bartxt){
			cur.bartxt = new zrender.Text({
	            style:{
					text:txt,
					textFill:cur.opt.textFill,
					x:tx,
					y:ty,
					fontSize:cur.opt.fontSize,
					textAlign:tx<cur.allW/2?"left":"right",
					fontFamily:"Microsoft yahei",
					opacity:0,
					textPadding:cur.opt.textPadding,
					textBorderColor:cur.opt.textBorderColor,
					textBorderWidth:cur.opt.textBorderWidth
				},
	            silent:true,
	            z:9
			});
			cur.groupT.add(cur.bartxt);
		}
		cur.bartxt.animateTo({
				style:{
					text:txt,
					x:tx,
					y:ty,
					opacity: 1,
				}
		}, cur.opt.aniTime,cur.opt.aniDelay,cur.opt.anieasing);
		cur.bartxt.attr({
				style:{
					textAlign:txzi,
				}
		});
    }
    
    hide(){
    	let cur=this;
		cur.bartxt.animateTo({
					style:{
						opacity: 0,
					}
		}, 100, 'cubicOut');
    	
    }
}

export default Tooltip;