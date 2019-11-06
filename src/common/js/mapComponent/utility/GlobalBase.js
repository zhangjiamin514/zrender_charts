import * as THREE from 'three';

class GlobalBase{

	constructor(container, opt){

		this.config = {
			R: opt ? (opt.R || 4000) : 4000,
			uNum: opt ? (opt.uNum || 50) : 50,
			vNum: opt ? (opt.vNum || 40) : 40
		};

		this.container = container;
		this.resources = [];
	}

	init(textures){
		this.textures = textures || {};
		// this.initCoord();
	}

	initCoord(){

		let xArix = new THREE.Mesh(new THREE.BoxGeometry(10000,20,20), new THREE.MeshBasicMaterial({color: "red"}));
		this.container.add(xArix);

		let yArix = new THREE.Mesh(new THREE.BoxGeometry(20,10000,20), new THREE.MeshBasicMaterial({color: "green"}));
		this.container.add(yArix);

		let zArix = new THREE.Mesh(new THREE.BoxGeometry(20,20,10000), new THREE.MeshBasicMaterial({color: "blue"}));
		this.container.add(zArix);
	}

	//	创建集合体
	createGeometry(opt){

		let r = opt ? (opt.r || 0) : 0;

		let g = new THREE.SphereBufferGeometry(this.config.R + r, this.config.uNum, this.config.vNum);

		let position = g.attributes.position.array;
		let aR = new Float32Array(position.length);
		let aA = new Float32Array(position.length/3);
		for(let i=0; i<position.length/3; i++){

			let p1 = new THREE.Vector3(0,0,1);
			let p2 = new THREE.Vector3(position[i*3], position[i*3+1], position[i*3+2]).normalize();
			let rV = new THREE.Vector3(0,0,1).cross(p2).normalize();

			aR[i*3] = rV.x;
			aR[i*3+1] = rV.y;
			aR[i*3+2] = rV.z;

			aA[i] = Math.PI*2 - Math.acos(p1.dot(p2));
		}
		g.addAttribute("aR", new THREE.BufferAttribute(aR, 3));
		g.addAttribute("aA", new THREE.BufferAttribute(aA, 1));

		return g;
	}

	//
	createMaterial(Uniforms, fS){
		Uniforms = Uniforms || {};

		//
		fS = (isNaN(fS) && fS) ? fS : [
			"void main(void){",
				"gl_FragColor = vec4(1.);",
			"}"
		].join("\n");

		let varying = [
			"varying vec2 vUV;",
			"varying vec3 p;",
			"varying vec3 n;",
			"varying mat4 M;",
		].join("\n");

		fS = varying + fS;

		//
		let material = new THREE.ShaderMaterial({
			uniforms: Uniforms,
			vertexShader: [
				"attribute vec3 aR;",
				"attribute float aA;",

				"varying vec2 vUV;",
				"varying vec3 p;",
				"varying vec3 n;",
				"varying mat4 M;",

				"mat4 rotationMatrix(vec3 axis, float angle) {",

				    "axis = normalize(axis);",
				    "float s = sin(angle);",
				    "float c = cos(angle);",
				    "float oc = 1.0 - c;",

				    "return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);",
				"}",

				"void main(void){",
					"vUV = uv;",
					"p = position;",
					"n = normal;",
					"M = rotationMatrix(aR, aA);",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);",
				"}"
			].join("\n"),
			fragmentShader: fS,
			transparent: true
		});

		return material;
	}

	//

	getMapPosition(coord, h){

		if(isNaN(parseFloat(coord[0])) || isNaN(parseFloat(coord[1])))
			return new THREE.Vector3();

		let R = this.config.R + (h || 0);

		let u = -(coord[0]-160)%360/360 * Math.PI*2, v = coord[1]/180 * Math.PI;

		return new THREE.Vector3(
			Math.cos(v) * Math.cos(u) * R,
			Math.sin(v) * R,
			Math.cos(v) * Math.sin(u) * R
		);
	}
}

export default GlobalBase;






