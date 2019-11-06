const zrender = require('zrender');

class Legend {
    constructor(zr,opt,par) {
        this.zr = zr;
        this.allW=this.zr.getWidth();
		this.allH=this.zr.getHeight();
		this.opt={
			x:opt.x||10,  //图例第一个x位置
    		y:opt.y||44,  //图例y位置
    		width:opt.width||30, //图例矩形宽度
    		height:opt.height||15,//图例矩形高度
    		lengetxt:opt.lengetxt||["实施","未实施"], //图例标题
    		clor:opt.clor||["#dceeff","#00eaff"], //图例块颜色
    		titleClor:opt.titleClor||"#00baff", //图例文字颜色
    		fontSize:opt.fontSize||34, //图例文字颜色
    		hideClor:opt.hideClor||"#cccccc",  //图例不显示状态颜色
    		interval1:opt.interval1||20,  //矩形和文字之间的距离
    		interval2:opt.interval2||50,  //第一组和第二组之间的距离
    		direction:opt.direction||"true",  //图例横向还是竖向，true为横向，false为竖向
    		aniTime:opt.aniTime||300,   //图例内元素动画时间
			aniDelay:opt.aniDelay||0,    //图例内元素动画延迟时间
			anieasing:opt.anieasing||"cubicOut",   //y轴内元素缓动函数
			align:opt.align||"left"   //图例水平位置 left，middle，right
		};
		this.parentC=par;
		this.initGroup();
		
    }

    initGroup() {
        this.groupL = new zrender.Group();
        this.zr.add(this.groupL);
        this.drawL();
        
    }
    funf(){
    	let cur=this;
      	cur.groupL._children.map((v,j) =>{
        	v.on('click', (e) => {
        		let one1=0;
        		let one2=0;
        		if(j%2==0){
        			one1=j;
        			one2=j+1;
        		}else{
        			one2=j;
        			one1=j-1;
        		}
        		let num=one1/2;
        		let show=true;
    			if(cur.groupL._children[one1].style.fill!=cur.opt.hideClor){   //判断当前的状态是否选中,然后改变元素的属性状态
    				cur.groupL._children[one1].attr({
	    				style:{
	    					fill:cur.opt.hideClor,
	    				}
        			});
        			cur.groupL._children[one2].attr({
        				style:{
        					textFill:cur.opt.hideClor,
        				}
        			});
        			show=false;
        			
    			}else{
    				cur.groupL._children[one1].attr({
	    				style:{
	    					fill:cur.opt.clor[one1/2],
	    				}
        			});
        			cur.groupL._children[one2].attr({
        				style:{
        					textFill:cur.opt.titleClor,
        				}
        			});
        			show=true;
    			}
        			
        		//判断是点击了第几组，返回数字第几组和是否显示
        		cur.parentC.legendF(num,show);
	        	
	        });
        });
    	
    }
    
    drawL(){
    	let cur = this;
    	cur.removeAll();
		//
		let xn=0;
		let yn=0;
		let nowx=0;
		let nowy=cur.opt.y;
		
		let zuwidth=0;
		let zuheight=0;
		
		for (let i=0;i<cur.opt.lengetxt.length;i++) {
			let tuliR=new zrender.Rect({
					shape:{
						x:xn,
						y:yn,
						width:cur.opt.width,
						height:cur.opt.height
					},
					style:{
						fill:cur.opt.clor[i],
						opacity: 0,
					},
				});
				cur.groupL.add(tuliR);
				
			let tuliTxt=new zrender.Text({
				style:{
					text:cur.opt.lengetxt[i],
					textFill:cur.opt.titleClor,
					x:tuliR.getBoundingRect().x+tuliR.getBoundingRect().width+cur.opt.interval1,
					y:tuliR.getBoundingRect().y,
					fontSize:cur.opt.fontSize,
					fontFamily:"Microsoft yahei",
					opacity: 0,
				},
			});
			cur.groupL.add(tuliTxt);
			zuheight=tuliTxt.getBoundingRect().height;
			yn=(tuliTxt.getBoundingRect().height-tuliR.getBoundingRect().height)/2;
			if(cur.opt.direction=="true"){
				zuwidth=zuwidth+tuliR.getBoundingRect().width+tuliTxt.getBoundingRect().width+cur.opt.interval1+cur.opt.interval2;
				if(i==cur.opt.lengetxt.length-1){
					zuwidth=zuwidth-cur.opt.interval2;
				}
			}else{
				let now=tuliR.getBoundingRect().width+tuliTxt.getBoundingRect().width+cur.opt.interval1;
				if(zuwidth<now)zuwidth=now;
				
			}
		}
		
		if(cur.opt.align=="middle"){nowx=(cur.allW-zuwidth)/2;}
		else if(cur.opt.align=="left"){nowx=cur.opt.x;}
		else if(cur.opt.align=="right"){nowx=cur.allW-zuwidth-cur.opt.x;}
		
		cur.groupL._children.map((v,j) =>{
			if(j%2==0){
				v.attr({
					shape:{
						x:nowx,
						y:nowy+yn
					}
				});
			}else{
				v.attr({
					style:{
						x:cur.groupL._children[j-1].getBoundingRect().x+cur.groupL._children[j-1].getBoundingRect().width+cur.opt.interval1,
						y:cur.groupL._children[j-1].getBoundingRect().y-yn,
					}
				});
				if(cur.opt.direction=="true"){
					nowx=v.getBoundingRect().x+v.getBoundingRect().width+cur.opt.interval2;
				}else{
					nowy=zuheight+cur.opt.interval2;
				}
			}
		});
		this.funf();
    }
    
    removeAll(){
    	let cur=this;
		this.groupL.removeAll();
    }
    showAll(){
    	let cur=this;
    	this.groupL._children.map((v,j) =>{
    		v.animateTo({
					style:{
						opacity: 1,
					}
				}, cur.opt.aniTime,cur.opt.aniDelay,cur.opt.anieasing);
    	});
    }
    hideAll(){
    	this.groupL._children.map((v,j) =>{
    		v.animateTo({
					style:{
						opacity: 0,
					}
				}, 100, 'cubicOut');
    	});
    }
}

export default Legend;