const zrender = require('zrender');

class Y_Axis {
    constructor(par,opt) {
        this.par=par;
        this.zr = par.zr;
        this.initGroup();
        this.allW=this.zr.getWidth();
		this.allH=this.zr.getHeight();
		this.maxData=0;   //y最大值
		this.setInit(opt);
    }
    
    setInit(opt){
    	let cur =this;
    	this.y1=opt.y1;
		this.y2=opt.y2;
		this.x=opt.x;
		this.yh=this.y1-this.y2;   //y轴有效距离长度
		this.yline=opt.y2w;  //y轴线长度
		this.yz_dian=[];   //存储y轴点
		this.color=opt.color||"#000";  //字的颜色
		this.fontS=opt.fontS||14;  //字的大小
		this.fontF=opt.fontF||"Arial";  //字的字体
		this.rectW=opt.rectW||3;  //标点的宽
		this.rectH=opt.rectH||2; //标点的高
		this.colorR=opt.colorR||"#000";  //标点的颜色
		this.lineWidth=opt.lineWidth||2;  //线宽  
		this.colorL=opt.colorL||"#000";  //线颜色
		this.firstShow=opt.firstShow||"true";  //原点是否显示
		this.aniTime=opt.aniTime||300,   //y轴内元素动画时间
		this.aniDelay=opt.aniDelay||0,    //y轴内元素动画延迟时间
		this.anieasing=opt.anieasing|| Power0.easeNone   //y轴内元素缓动函数
		let yleng=opt.yleng||5;   //y轴的刻度数
		let ydata=opt.data||[];   //y轴数据
		
//		获取y轴最大值，通过最大值算出刻度
		for (let i=0;i<ydata.length;i++) {
			let nod=Math.max.apply(null, ydata[i]);
			if(cur.maxData<nod)cur.maxData=nod;
		}
		
		let maxstr=cur.maxData+"";
		let str1="";
		let str2="";
		let str3="";
		let srtleng=1;
		if(maxstr.length<3){
			str1=maxstr.substr(0,1)*1;
			str2=maxstr.substr(1,1)*1;
			if(str2>0)str1++;
		}
		else{
			str1=maxstr.substr(0,1)*1;
			str2=maxstr.substr(1,1)*1;
			str3=maxstr.substr(2,1)*1;
			if(str3>0)str2++;
			if(str2>9)str1++;
			str1=str1+""+str2;
			srtleng=2;
		}
		let maxz=""+str1;
		maxz=Math.ceil(maxz/yleng)*yleng;
		for (let i=srtleng;i<maxstr.length;i++) {
            maxz=maxz+"0";
        }
		maxz=maxz*1;
		cur.maxData=maxz;
		//用最大值获取y轴左边刻度占据多宽 ,如果不需要这个，需要手动设置的话，就把下面这些注释了，到x轴第二个点注释结束，然后上面配置直接写位置像素
		let maxTxt=new zrender.Text({
				style:{
					text:cur.maxData,
					textFill:"#54b3ea",
					x:-100,
					y:-105,
					fontSize:cur.fontS,
					fontFamily:cur.fontF
				},
			});
		let yztxtw=Math.ceil(maxTxt.getBoundingRect().width);
		this.x=10+yztxtw;   //y轴的x点
		//生成y轴刻度
		let dajg=parseInt(maxz/yleng);
		let shuzu=[];
        for (let i=0;i<yleng+1;i++) {
            let txts=0+dajg*i;
//          if(txts>10000)txts=txts/10000+"万";
            shuzu.push(txts);
        }
        
        this.drawY(shuzu);
    }

    initGroup() {
        this.groupY = new zrender.Group();
        this.zr.add(this.groupY);
    }
    
    drawY(data){
    	let cur = this;
    	cur.removeAll();
    	let lineY=new zrender.Line({
			shape:{
				x1:cur.x,
				y1:cur.y1,
				x2:cur.x,
				y2:cur.yline,
			},
			style:{
				stroke:cur.colorL,
				lineWidth:cur.lineWidth,
				opacity: 0,
			},
			silent:true,
		});
		cur.groupY.add(lineY);
		//
		let y_jg=cur.yh/(data.length-1);
		for (let i=0;i<data.length;i++) {
			let ry=cur.y1-1-i*y_jg;
			
			cur.yz_dian.push(ry);
			let re=new zrender.Rect({
				shape: {
			        x: cur.x-cur.rectW,
			        y: ry-cur.rectH/2,
			        width:cur.rectW,
			        height:cur.rectH
			    },
		        style: {
		            fill:cur.colorR,
		            opacity: 0,
		        },
		        silent:true,
		    });
			cur.groupY.add(re);
			let td = new zrender.Text({
				style: {
					text:data[i],
					x: cur.x-cur.rectW-2,
		        	y: ry-cur.rectH/2,
					textFill: cur.color,
					textAlign: 'right',
					fontSize:cur.fontS,
					fontFamily:cur.fontF,
					opacity: 0,
					textVerticalAlign:"middle"
				},
		    	silent:true,
			});
			cur.groupY.add(td);
			if(cur.firstShow=="false"&&i==0){
				re.hide();
				td.hide();
			}
		}
		
		
    }
    
    removeAll(){
    	let cur=this;
		this.groupY.removeAll();
    }
    showAll(){
    	let cur=this;
    	
    	this.groupY._children.map((v,j) =>{
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
    	this.groupY._children.map((v,j) =>{
    		v.animateTo({
					style:{
						opacity: 0,
					}
				}, 100, 'cubicOut');
    	});
    }
}

export default Y_Axis;