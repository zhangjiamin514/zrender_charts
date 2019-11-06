
class numberA {
    constructor() {
        
    }
    //需要变化的元素，传入数值，小数保留几位
    init(opt,numw,decimal) {
    	opt.animate('style', false)
		.when(1000, {
			text: numw*1
		})
		.during(function(num, time) {
			let txt=parseFloat(num.text).toFixed(decimal)*1;
			num.text = txt;
		})
		.start();
    }
    
}

export default numberA;