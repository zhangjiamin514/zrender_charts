const THREE = require('three');

class ThreeEvent{
	constructor(dom, camera){
		//  探测器
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(0,1);
        //
        this.mouseX = 0;
        this.mouseY = 0;

        this.mouseoverList = [];
        this.clickList = [];

        this.dispatchList = [];
        //

        this.initDispatcher(dom, camera);
	}

	initDispatcher(dom, camera){

		let cur = this;

		//
		dom.addEventListener("mousemove", function(){
			
			if(!cur.mouseoverList.length)
				return;

			cur.mouseX = event.offsetX;
			cur.mouseY = event.offsetY;

			cur.mouse.x = ( event.offsetX / dom.clientWidth ) * 2 - 1;
			cur.mouse.y = - ( event.offsetY / dom.clientHeight ) * 2 + 1;

			cur.dispatching(cur.mouse, camera);
		}, false);

		//
		dom.addEventListener("click", function(){

			if(!cur.dispatchList.length)
				return;

			for(let i=0; i<cur.dispatchList.length; i++){
				for(let j=0; j<cur.clickList.length; j++){
					let index = cur.clickList[j].target.indexOf(cur.dispatchList[i]);

					if(index!=-1){
						cur.clickList[j].fun({
							type: "click",
							target: cur.dispatchList[i],
							left: cur.mouseX,
							top: cur.mouseY,
							uv: cur.mouse,
							data: cur.dispatchList[i].userData.eventData
						});
					}
				}
			}
		});
	}

	dispatching(mouse, camera){
		this.raycaster.setFromCamera( mouse, camera );

		this.dispatchList = [];

		//	mouseover
		for(let i=0; i<this.mouseoverList.length; i++){
			
			let intersects = this.raycaster.intersectObjects( this.mouseoverList[i].target );
			if(intersects.length){
				this.mouseoverList[i].fun({
					type: "mouseover",
					target: intersects[0].object,
					left: this.mouseX,
					top: this.mouseY,
					screenUV: mouse,
					targetUV: intersects[0].uv,
					data: intersects[0].object.userData.eventData,
					worldP: intersects[0].point
				});
				this.dispatchList.push(intersects[0].object)
			}
			else
				this.mouseoverList[i].fun(null);
			
		}
	}

	//	外部绑定事件	－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
	mouseover(ary, Fun){

		if(!ary instanceof Array)
			return;
 
		this.mouseoverList.push({
			target: ary,
			fun: Fun || function(){}
		});
	}

	click(ary, Fun){
		if(!ary instanceof Array)
			return;

		this.clickList.push({
			target: ary,
			fun: Fun || function(){}
		});

		//	
		let isExist = false;
		for(let i=0; i<this.mouseoverList.length; i++){
			if(ary == this.mouseoverList[i].target)
				isExist = true;
		}

		if(isExist)
			return;

		this.mouseoverList.push({
			target: ary,
			fun: function(){}
		});
	}
}

export default ThreeEvent;


