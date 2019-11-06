import * as THREE from 'three';
import {TweenMax, Power2} from "gsap";
import chinaGeo from "commonDir/js/mapComponent/utility/china.geo.json";

class AreaBlock{

	/*{
		container, texture, iconNum, size
	}*/
	constructor(opt){

		if(!opt.container){
			console.error("缺少AreaBlock容器");
			return;
		}

		this.Box = new THREE.Group();
		opt.container.add(this.Box);

		this.R = opt.R || 2000;
		this.scale = [0.8,1];
		// this.texture = opt.texture || new THREE.Texture();

		//
		this.eventTarget = [];


		this.createBlock();
	}

	createBlock(){

		for(let i=0; i<chinaGeo.features.length; i++){
			let coord = chinaGeo.features[i].geometry.coordinates;

			let mergeMesh = new THREE.Geometry();

			if(chinaGeo.features[i].geometry.type=="Polygon"){
				
				for(let j=0; j<1; j++){
					let s = new THREE.Shape();
					let v = [];
					for(let k=0; k<coord[j].length; k++){

						let curP = this.getMapPosition(coord[j][k]);
						v.push(curP);
					}

					s.setFromPoints(v);

					let g = new THREE.ShapeGeometry(s);
					mergeMesh.merge(g);
				}
			}
			else{

				for(let j=0; j<coord.length; j++){
					
					for(let k=0; k<coord[j].length; k++){

						let s = new THREE.Shape();
						let v = [];
						for(let l=0; l<coord[j][k].length; l++){
							let curP = this.getMapPosition(coord[j][k][l]);
							v.push(curP);
						}

						s.setFromPoints(v);

						let g = new THREE.ShapeGeometry(s);
						mergeMesh.merge(g);
					}

				}
			}

			let block = new THREE.Mesh(mergeMesh, new THREE.ShaderMaterial({ 
				uniforms: {
					// map: { value: this.texture },
					color: { value: new THREE.Color(0xffffff) }
				}, 
				vertextShader: [
					"void main(void){",
						"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);",
					"}"
				].join("\n"),
				fragmentShader: [
					"uniform vec3 color;",
					"void main(void){",
						"gl_FragColor = vec4(color*0.7, 1.);",
					"}"
				].join("\n"),
				transparent: true,
				depthTest: false
			}));
			block.name = chinaGeo.features[i].properties.name;
			block.visible = false;

			this.Box.add(block);
		}
	}

	setOption(option){

		for(let i=0; i<this.Box.children.length; i++){
			this.Box.children[i].visible = false;
		}

		for(let i=this.eventTarget.length-1; i>=0; i--){
			this.eventTarget.pop();
		}

		for(let i=0; i<option.data.length; i++){
			
			let block = this.Box.getObjectByName(option.data[i].name);
			block.visible = true;
			block.material.uniforms.color.value = new THREE.Color(option.data[i].color);
			block.userData.color = new THREE.Color(option.data[i].color);

			this.eventTarget.push(block);
		}

	}

	eventDispatch(event){
		if(!event){
			if(this.overTarget){
				for(let i=0; i<this.eventTarget.length; i++){
					this.eventTarget[i].material.uniforms.color.value = this.eventTarget[i].userData.color;
				}
			}

			this.overTarget = null;
		}
		else{

			// console.log(this.overTarget!=event.target)
			if(!this.overTarget || this.overTarget!=event.target){
				for(let i=0; i<this.eventTarget.length; i++){
					this.eventTarget[i].material.uniforms.color.value = this.eventTarget[i].userData.color;
				}

				event.target.material.uniforms.color.value = new THREE.Color(0x02e5f7);

				this.overTarget = event.target;
			}

			
		}
	}

	getMapPosition(coord){

		if(isNaN(parseFloat(coord[0])) || isNaN(parseFloat(coord[1])))
			return new THREE.Vector2();

		let U = (coord[0] + 180 + 200)%360 - 180;

		let u = U/180*Math.PI;
		let v = coord[1]/180*Math.PI;

		return new THREE.Vector2(u*this.R*this.scale[0], v*this.R*this.scale[1]);
	}

	//	鼠标触发事件
	

	show(isShow){
		this.Box.visible = !!isShow;
	}
}

export default AreaBlock;

