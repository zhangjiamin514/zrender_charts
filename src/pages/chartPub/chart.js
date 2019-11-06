//import AniC from "../../unit/animateChoose.js";
//const zrender = require('zrender');
const echarts = require('echarts');

class Chats{
	constructor(dom){
		//生成需要的全局变量
		this.myChart = echarts.init(dom);
//		this.zr=zrender.init(dom);
//		this.allW=this.zr.getWidth();
//		this.allH=this.zr.getHeight();
//		this.saveData=[];   //存放所有组件生成的元素
//		
//		this.maxData=0;//数据最大值
//		
//		this.init();  //调用创建组方法
//		this.anic=new AniC();
	}
	init(){
		//创建组，添加到zrender中
//		this.group = new zrender.Group();
//		this.zr.add(this.group);
//		//把组件需要的东西都分组存放，新建多个组，把生成的圆，矩形等加入到组里，然后存入到全局元素存放处，
//		this.statics = new zrender.Group();
//		this.group.add(this.statics);
//		//触碰矩形
//		this.rectmous = new zrender.Group();
//		this.group.add(this.rectmous);
		
		
		
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
    	
    	this.drawPublic(opt);   //画里面的组件
    	
    }
    
    //传入配置，数据等信息，去画组件，可以自己新建方法函数，生成静态元素方法，动态元素方法
    drawPublic(opt){
		let cur=this;
		let cx=cur.allW/2;
		let cy=cur.allH/2;
//		
//		let chartc=new zrender.Circle({
//			shape:{
//				cx:cx,
//				cy:cy,
//				r:50
//			},style:{
//				fill:"#000000"
//			}
//		});
//		
//		cur.statics.add(chartc);
		
		

        // 指定图表的配置项和数据
        let categories = [];
	    for (var i = 0; i < 9; i++) {
	        categories[i] = {
	            name: '类目' + i
	        };
	    }
	    let datal=[];
	    let linksl=[];
	    opt.nodes.map(function(v,e){
	    	let jd={};
	    	jd.id=e;
	    	jd.yid=v.id;
	    	jd.name=v.properties.name;
	    	datal.push(jd);
	    });
	    opt.relationships.map(function(v,e){
	    	let jdr={};
	    	jdr.id=v.id;
	    	
	    	datal.map(function(x,y){
		    	if(v.startNode==x.yid)jdr.source=x.id;
		    	if(v.endNode==x.yid)jdr.target=x.id;
		    	
		    });
	    	
	    	
	    	linksl.push(jdr);
	    });
	    console.log(datal,linksl);
        let option = {
        legend: {
            data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
        },
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
                normal: {
                    position: 'right',
                    formatter: '{b}'
                }
            },
            draggable: false,
            data: datal,
//          categories: webkitDep.categories,
            force: {
                // initLayout: 'circular'
                // repulsion: 20,
                edgeLength: 50,
                repulsion: 40,
                gravity: 0.1
            },
            edges: linksl
        }]
    };

        // 使用刚指定的配置项和数据显示图表。
        cur.myChart.setOption(option);
		
	}
    
}

export default Chats;