import * as THREE from 'three';
import {TweenMax, Linear} from "gsap";

class IconDot{

	/*{
		container, texture, iconNum, size
	}*/
	constructor(opt){

		if(!opt.container){
			console.error("缺少IconDot容器");
			return;
		}

		this.Box = new THREE.Group();
		opt.container.add(this.Box);

		this.texture = opt.texture || new THREE.Texture();
		this.iconNum = opt.iconNum || 2;

		this.size = opt.size || 50;

		//
		this.eventTarget = [];
		
	}

	createNode(data){
		let g = new THREE.PlaneBufferGeometry(this.size*this.texture.image.width*this.iconNum/this.texture.image.height, this.size);

		let m = new THREE.ShaderMaterial({
			uniforms: {
				map: {value: this.texture},
				iconIndex: { value: data.type },
				coord: { value: data.position },
				iconNum: { value: this.iconNum },
				opacity: { value: 0 }
			},
			vertexShader: [
				"uniform vec3 coord;",
				"varying vec2 vUV;",
				"void main(void){",
					"vUV = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D map;",
				"uniform float iconIndex;",
				"uniform float iconNum;",
				"uniform float opacity;",
				"varying vec2 vUV;",
				"void main(void){",
					"vec4 uColor = texture2D(map, vec2(vUV.x, (vUV.y+iconIndex)/iconNum)).rgba;",
					"gl_FragColor = uColor;",
				"}"
			].join("\n"),
			transparent: true,
			depthTest: false
		});
		let icon = new THREE.Mesh(g,m);
		icon.position.copy(data.position);

		return icon;

	}

	createIcon(data){

		let icon = this.createNode(data);

		this.Box.add(icon);
		icon.userData.eventData = data;
		this.eventTarget.push(icon);

		TweenMax.to(icon.rotation, 3, {
			ease: Linear.easeNone,
			z: Math.PI*2,
			repeat: -1
		});

		for(let i=0; i<data.nodes.length; i++){
			this.Box.add(this.createNode(data.nodes[i]));
		}

	}

	setOption(option){

		for(let i=this.Box.children.length-1; i>=0; i--){
			this.Box.children[i].geometry.dispose();
			this.Box.remove(this.Box.children[i]);
		}
		for(let i=this.eventTarget.length-1; i>=0; i--){
			this.eventTarget.pop();
		}

		for(let i=0; i<option.data.length; i++){
			this.createIcon(option.data[i]);
		}

	}

	selectDot(array){
		
		for(let i=0; i<this.Box.children.length; i++){
			this.Box.children[i].visible = !!(array.indexOf(this.Box.children[i].material.uniforms.iconIndex.value)!=-1);
		}

	}

	//	鼠标触发事件
	eventDispatch(event){


		// let intersects = raycaster.intersectObjects(this.Box.children);
		// if(intersects.length)
		// 	return intersects[0].object.userData.dataOne;
		// else
		// 	return false;
	}

	show(isShow){
		this.Box.visible = !!isShow;
	}
}

export default IconDot;

