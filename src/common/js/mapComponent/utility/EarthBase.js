/*
	地球组件基类，包含：
		生成 goemetry
		生成 material、
		坐标转换

*/

import * as THREE from 'three';

class EarthBase{

	constructor(opt){

		this.option = {};

		if(opt){
			this.option.R = opt.R || 171;
			this.option.scale =  opt.scale || [1,1];
			this.option.center =  opt.center || [0,0];
		}
		else{
			this.option = {
				R: 171,
				scale: [1,1]
			};
		}

		this.resources = null;

	}

	init(textures){
		this.textures = textures || {};
	}

	createGeometry(opt){

		let config = {
			range: opt.range || { x: [-180, 180], y: [-90, 90] },
			uNum: opt.uNum || 2,
			vNum: opt.vNum || 2
		};


		let goemetry = new THREE.PlaneBufferGeometry(this.option.R*this.option.scale[0]*(config.range.x[1]-config.range.x[0])/180*Math.PI, this.option.R*this.option.scale[1]*(config.range.y[1]-config.range.y[0])/180*Math.PI, config.uNum-1, config.vNum-1);		

		return goemetry;
	}

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
			"varying vec2 vN;",
		].join("\n");

		fS = varying + fS;

		//	
		let material = new THREE.ShaderMaterial({
			uniforms: Uniforms,
			vertexShader: [
				"attribute vec2 normalUV;",
				"uniform vec3 translate;",

				"varying vec2 vUV;",
				"varying vec3 p;",
				"varying vec3 n;",
				"varying vec2 vN;",
				"void main(void){",

					"vN = normalUV;",
					"vUV = uv;",
					"p = position;",
					"n = normal;",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4(position + translate, 1.);",
				"}"
			].join("\n"),
			fragmentShader: fS,
			transparent: true,
			depthTest: false
		});

		return material;
	}

	getMapPosition(coord, Z){

		if(isNaN(parseFloat(coord[0])) || isNaN(parseFloat(coord[1])))
			return new THREE.Vector3();

		Z = Z || 0;

		let U = (coord[0] + 180 + 200)%360 - 180;

		let u = U/180*Math.PI;
		let v = coord[1]/180*Math.PI;

		return new THREE.Vector3(u*this.option.R*this.option.scale[0], v*this.option.R*this.option.scale[1], (this.Ztop || 0) + Z);
	}
}

export default EarthBase;











