import * as THREE from 'three';
import MeshLine from "../../utility/MeshLine.js";
import ScreenText from "../../utility/ScreenText.js";
import {TweenMax, Power2} from "gsap";

class LinkLine{
	constructor(opt){

		this.Delay = opt.Delay || 0;
		this.rippleLocalName = opt.rippleLocalName || "to";
		this.dotMap = opt.dotMap || null;
		this.dotNum = opt.dotNum || 1;
		this.color = opt.color;

		this.Box = new THREE.Group();
		opt.container.add(this.Box);
	}

	setOption(option){

		for(let i = this.Box.children.length-1; i>=0; i--){
			this.Box.children[i].geometry.dispose();
			this.Box.children[i].material.dispose();
			this.Box.remove(this.Box.children[i]);
		}

		for(let i=0; i<option.data.length; i++){
			
			let delay = Math.random();
			
			this.createName(option.data[i].to, option.data[i].toName);

			this.createCP(option.data[i].from, option.data[i].to, option.data[i].cp1, option.data[i].cp2, delay);

			if(this.dotMap){
				if(i==0)
					this.createDot(option.data[i].from, 2);

				this.createDot(option.data[i].to, option.data[i].type);
			}
		}

		this.tick = this.Delay;
	}

	//	控制点	＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋

	createDot(position, index){
		let g = new THREE.PlaneBufferGeometry(400*this.dotMap.image.width*this.dotNum/this.dotMap.image.height, 400);
		let p = g.attributes.position.array;
		for(let i=0; i<p.length/3; i++){
			p[i*3] += position.x;
			p[i*3+1] += position.y;
			p[i*3+2] += position.z;
		}

		let m = new THREE.ShaderMaterial({
			uniforms: {
				map: { value: this.dotMap },
				num: { value: this.dotNum },
				type: { value: index || 0 },
				opacity: { value: 0 }
			},
			vertexShader: [
				"uniform vec3 translate;",
				"varying vec2 vUV;",
				"void main( void){",
					"vUV = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D map;",
				"uniform float opacity;",
				"uniform float num;",
				"uniform float type;",
				"varying vec2 vUV;",
				"void main( void){",
					"vec4 c = texture2D(map, vec2(vUV.x, (vUV.y+type)/num)).rgba;",

					"gl_FragColor = vec4(c.rgb, c.a*opacity);",
				"}"
			].join("\n"),
			transparent: true,
			depthTest: false
		})
		let plane = new THREE.Mesh(g,m);

		this.Box.add(plane);

		TweenMax.to(m.uniforms.opacity, 0.6, {
			value: 1,
			ease: Power2.easeInOut
		});
	}

	createName(position, name){

		let text = new ScreenText({
			text: name,
			fontSize: 72,
			position: position,
			container: this.Box,
			weight: "bold",
			screenW: 4608,
			screenH: 2560,
			color: "#f7fb0c"
		});

		text.style({ translate: new THREE.Vector2(0, 160) });
	}

	createCP(sP, eP, cp1, cp2, delay){

		cp1 = cp1 || 0;
		cp2 = cp2 || 0;

		let direV = new THREE.Vector3().subVectors(eP, sP);
		let D = direV.length();

		direV.normalize();
		direV.z = Math.sin(cp1);

		let bD = (Math.random() * 0.1 + 0.3)*D;

		let croV = new THREE.Vector3(0,0,1).cross(direV);
		croV.multiplyScalar(bD/3);
		if(direV.x<0)
			croV.multiplyScalar(-1);

		let CP1 = new THREE.Vector3().copy(direV).multiplyScalar(bD);

		let CP2 = new THREE.Vector3().copy(CP1);
		CP2.x *= -1;
		CP2.y *= -1;

		CP1.add(croV);
		CP2.add(croV);

		CP1.add(sP);
		CP2.add(eP);
		//

		this.createLine({
			from: sP,
			to: eP,
			cp1: CP1,
			cp2: CP2,
			delay: delay
		});
		this.createLine({
			from: sP,
			to: eP,
			cp1: CP1,
			cp2: CP2,
			delay: delay,
			width: 50,
			opacity: 0.3
		});

		//
		this.createPartLine({
			from: sP,
			to: eP,
			opacity: 0.7,
			size: 4,
			delay: delay,
			cp1: CP1,
			cp2: CP2,
			opacity: 0.8,
			segment: 5
		});
		this.createRipple(eP, delay);
		this.createRipple(eP, delay+0.2);

		//
		this.createPartLine({
			from: sP,
			to: eP,
			opacity: 0.7,
			size: 4,
			delay: delay+0.5,
			cp1: CP1,
			cp2: CP2,
			opacity: 0.8,
			segment: 5
		});
		this.createRipple(eP, delay+0.5);
		this.createRipple(eP, delay+0.2+0.5);

		//
		this.createPartLine({
			from: sP,
			to: eP,
			opacity: 0.7,
			size: 4,
			delay: delay+1,
			cp1: CP1,
			cp2: CP2,
			opacity: 0.8,
			segment: 5
		});
		this.createRipple(eP, delay+1);
		this.createRipple(eP, delay+0.2+1);

		//
		this.createPartLine({
			from: sP,
			to: eP,
			opacity: 0.7,
			size: 4,
			delay: delay+1.5,
			cp1: CP1,
			cp2: CP2,
			opacity: 0.8,
			segment: 10
		});
		this.createRipple(eP, delay+1.5);
		this.createRipple(eP, delay+0.2+1.5);
	}

	//	线	＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋

	createLine(opt){

		let N = 40;
		//

		let Vertices = [];
		for(let i=0; i<N; i++){
			Vertices.push({
				x: this.bezier(opt.from.x, opt.to.x, opt.cp1.x, opt.cp2.x, i/(N-1)),
				y: this.bezier(opt.from.y, opt.to.y, opt.cp1.y, opt.cp2.y, i/(N-1)),
				z: this.bezier(opt.from.z, opt.to.z, opt.cp1.z, opt.cp2.z, i/(N-1))
			});
		}

		let line = new MeshLine(Vertices, {
			lineWidth: opt.width || 12,
			sColor: this.color,
			eColor: this.color,
			lineLength: 1.7,
			blending: THREE.AdditiveBlending,
			opacity: opt.opacity || 0.8,
			depthTest: false,
			fragmentShader: [
				"void main(void){",
					"float c = smoothstep(time, time-0.01, vUV.x);",

					"float a = smoothstep(0.5, 0., abs(vUV.y-0.5));",
					"float b = smoothstep(0.5, 0., abs(vUV.x-0.5));",
					"gl_FragColor = vec4(sColor, c*a*opacity*(b*0.7 + 0.3));",
				"}"
			].join("\n")
		});
		line.userData.delay = opt.delay || 0;
		line.name = "static";
		this.Box.add(line);

		TweenMax.to(line.material.uniforms.time, 1.4, {
			value: 1.2,
			ease: Power2.easeInOut,
			delay: Math.random()*0.6
		});
	}

	//	线头	＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋

	createPartLine(opt){

		opt.scale = opt.scale || 1;
		opt.opacity = opt.opacity || 1;
		opt.size = opt.size || 4;
		opt.segment = Math.max(1., opt.segment) || 2;
		opt.startPer = isNaN(parseFloat(opt.startPer)) ? 1 : opt.startPer;

		let L = new THREE.Vector3().subVectors(opt.from, opt.to).length();
		let n = Math.max(1., Math.floor(L/opt.segment/2));
		let per = 1/opt.segment/n/1.5;
		n = Math.max(5, Math.floor(n*opt.scale));

		//
		let position = [];

		for(let j=0; j<n; j++){

			position[j*3] = (opt.startPer - per*j)-1;
			position[j*3 + 1] = (1-j/(n-1))*0.9 + 0.1;
			position[j*3 + 2] = (1-j/(n-1));
		}

		let g = new THREE.BufferGeometry();
		g.addAttribute("position", new THREE.BufferAttribute(new Float32Array(position), 3));

		let m = new THREE.ShaderMaterial({
			uniforms: {
				startP: { value: opt.from },
				endP: { value: opt.to },
				CP1: { value: opt.cp1 },
				CP2: { value: opt.cp2 },
				color: { value: this.color },
				time: { value: 0 }
			},
			vertexShader: [
				"uniform vec3 startP;",
				"uniform vec3 endP;",
				"uniform float time;",
				"uniform vec3 CP1;",
				"uniform vec3 CP2;",
				// "varying float vA;",

				"vec3 bezier(vec3 p1, vec3 p2, vec3 cp1, vec3 cp2, float t){",
					"return p1*pow((1.-t), 3.) + 3.*cp1*t*pow((1.-t), 2.) + 3.*cp2*t*t*(1.-t) + p2*t*t*t;",
				"}",

				"void main(void){",
					// "vA = position.z;",
					"vec3 newP = bezier(startP, endP, CP1, CP2, mod(max(0., position.x+time), 1.));",
					"gl_PointSize = (1. - smoothstep(0.999, 1., position.x+time)) * position.y * "+ opt.size.toFixed(1) +";",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4(newP, 1.);",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform vec3 color;",
				// "varying float vA;",
				"void main(void){",

					"float a = 1. - smoothstep(0., 0.5, length(gl_PointCoord.xy-0.5));",
					"gl_FragColor = vec4(color/4., a*"+ opt.opacity.toFixed(1.) +");",
				"}"
			].join("\n"),
			transparent: true,
			depthTest: false,
			blending: THREE.AdditiveBlending
		});

		let line = new THREE.Points(g,m);
		line.userData.delay = opt.delay;
		this.Box.add(line);

	}

	createRipple(coord, delay){

		let n = 18;
		let g = new THREE.BufferGeometry();
		let position = new Float32Array(n*3);
		for(let i=0; i<n; i++){
			let a = i/(n-1) * Math.PI*2;
			position[i*3] = Math.cos(a) * 300;
			position[i*3+1] = Math.sin(a) * 300;
			position[i*3+2] = 0;
		}
		g.addAttribute("position", new THREE.BufferAttribute(position, 3));

		let m = new THREE.ShaderMaterial({
			uniforms: {
				color: { value: this.color },
				time: { value: 0 },
				coord: { value: coord }
			},
			vertexShader: [
				"uniform vec3 coord;",
				"uniform float time;",
				"varying float t;",
				"void main(void){",
					"t = smoothstep(0.9, 2.2, time);",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4(position*t+coord, 1.);",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform vec3 color;",
				"varying float t;",
				"void main(void){",
					"gl_FragColor = vec4(color*2., 1.-t);",
				"}"
			].join("\n"),
			transparent: true,
			depthTest: false
		});

		let circle = new THREE.Line(g,m);
		circle.userData.delay = delay;
		this.Box.add(circle);
	}

	render(){

		if(!this.Box.visible)
			return;

		this.tick += 0.01;

		for(let i=0; i<this.Box.children.length; i++){
			if(this.Box.children[i].name!="static" && this.Box.children[i].material.uniforms && this.Box.children[i].material.uniforms.time){
				this.Box.children[i].material.uniforms.time.value = Math.max(0., this.tick - this.Box.children[i].userData.delay);
				this.Box.children[i].material.uniforms.time.value %= 2;
			}
		}
	}

	bezier(p1, p2, cp1, cp2, t){
		return p1*Math.pow((1-t), 3) + 3*cp1*t*Math.pow((1-t), 2) + 3*cp2*t*t*(1-t) + p2*t*t*t;
	}

	show(isHide){
		this.Box.visible = !!isHide;
	}
}

export default LinkLine;

