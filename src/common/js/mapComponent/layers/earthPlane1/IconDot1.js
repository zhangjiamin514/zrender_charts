import * as THREE from 'three';
import ScreenText from "../../utility/ScreenText.js";
import {TweenMax, Power2} from "gsap";

class IconDot{
	constructor(opt){

		if(!opt.container){
			console.error("缺少IconDot容器");
			return;
		}

		this.Box = new THREE.Group();
		opt.container.add(this.Box);

		this.texture = opt.texture;

		//
		
	}

	createIcon(data){

		let g = new THREE.PlaneBufferGeometry(80*this.texture.circle.image.width/this.texture.circle.image.height, 80);

		let m = new THREE.ShaderMaterial({
			uniforms: {
				map: {value: this.texture.circle},
				opacity: { value: 0 }
			},
			vertexShader: [
				"varying vec2 vUV;",
				"void main(void){",
					"vUV = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D map;",
				"uniform float opacity;",
				"varying vec2 vUV;",
				"void main(void){",
					"gl_FragColor = texture2D(map, vUV).rgba;",
					"gl_FragColor.a *= opacity;",
				"}"
			].join("\n"),
			transparent: true
		});
		let icon = new THREE.Mesh(g,m);
		icon.lookAt(data.position);
		icon.position.copy(data.position);
		this.Box.add(icon);
		// icon.userData.eventData = data;

		TweenMax.to(icon.material.uniforms.opacity, 0.6, {
			ease: Power2.easeInOut,
			value: 1
		});

	}

	createBar(position){

		let g = new THREE.BoxBufferGeometry(2,2,100);
		g.translate(0,0,50);
		let m = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0 }
			},
			vertexShader: [
				"varying float Z;",
				"void main(void){",
					"Z = position.z;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform float time;",
				"varying float Z;",
				"void main(void){",
					"float a = smoothstep(time, time-0.1, Z/100.);",

					"gl_FragColor = vec4(vec3(1.), a*Z/100.);",
				"}"
			].join("\n"),
			transparent: true
		});
		let bar = new THREE.Mesh(g,m);
		bar.lookAt(position);
		bar.position.copy(position);
		this.Box.add(bar);

		TweenMax.to(m.uniforms.time, 0.4, {
			value: 1.1,
			ease: Power2.easeInOut,
			delay: 0.2
		});

		//
		g = new THREE.Geometry();
		g.vertices.push(new THREE.Vector3());
		m = new THREE.PointsMaterial({ map: this.texture.dot, transparent: true, size: 0, depthTest: false });
		bar = new THREE.Points(g,m);
		bar.position.copy(position);
		bar.position.normalize().multiplyScalar(position.length()+100);
		this.Box.add(bar);

		TweenMax.to(m, 0.4, {
			size: 50,
			ease: Power2.easeInOut,
			delay: 0.4
		});
	}

	createText(data){
		let text = new ScreenText({
			text: data.name,
			fontSize: 48,
			position: new THREE.Vector3().copy(data.position).normalize().multiplyScalar(data.position.length()+140),
			container: this.Box,
			screenW: 4608,
			screenH: 2560,
			color: "#fff",
			blurColor: "#0054ff",
			opacity: 0
		});

		text.textPlane.position.copy(data.position);

		let time = {per: 0};
		TweenMax.to(time, 0.4, {
			per: 1,
			ease: Power2.easeInOut,
			onUpdate: function(){
				text.style({ opacity: time.per });
			},
			delay: 0.4
		})
	}

	setOption(option){

		for(let i=this.Box.children.length-1; i>=0; i--){
			this.Box.children[i].geometry.dispose();
			this.Box.remove(this.Box.children[i]);
		}

		for(let i=0; i<option.data.length; i++){
			this.createIcon(option.data[i]);
			this.createBar(option.data[i].position);
			this.createText(option.data[i]);
		}

	}
}

export default IconDot;