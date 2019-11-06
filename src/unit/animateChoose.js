
import TweenMax from "./TweenMax.min.js";

class animateC {
    constructor() {
        this.easeZ=[Power0.easeNone,Power1.easeInOut,Power2.easeInOut,Power3.easeInOut,Power4.easeInOut,Back.easeInOut.config(1.7),Elastic.easeInOut.config(1, 0.3),
        RoughEase.ease.config({ template: Bounce.easeInOut, strength: 1, points: 20, taper: "in", randomize: false, clamp: false})];
    }

    init(attribute) {
    	if(!attribute.ease)attribute.ease=this.easeZ[0];
    	else if(typeof(attribute.ease)=="number"){
    		if(attribute.ease<=7)attribute.ease=this.easeZ[attribute.ease];
    		else{
    			throw "动画参数小于等于7"
    		}
    	}
    	if(!attribute.delay)attribute.delay=0;
    	else{
    		attribute.delay=attribute.delay/1000;
    	}
    	if(!attribute.time)attribute.time=1;
    	else{
    		attribute.time=attribute.time/1000;
    	}
    	let attrib={},attrib2={};
    	attrib2.delay=attrib.delay=attribute.delay;
    	attrib2.ease=attrib.ease=attribute.ease;
    	attrib2.onUpdate=attrib.onUpdate=function(){attribute.target.dirty();};
//  	attrib2.repeat =-1;
    	let sty=attribute.style;
    	if(JSON.stringify(sty) != "{}" && sty){
	    	for(let name in sty){
			    attrib[name]=sty[name];
			}
	    	TweenMax.to(attribute.target.style, attribute.time, attrib);
    	}
    	let sty2=attribute.shape;
    	if(JSON.stringify(sty2) != "{}" && sty2){
	    	for(let name in sty2){
			    attrib2[name]=sty2[name];
			}
	    	TweenMax.to(attribute.target.shape, attribute.time, attrib2);
    	}
    	
    }
    
}

export default animateC;