/*
	地球组件模版
*/
import * as THREE from 'three';
import EarthBase from "../utility/EarthBase.js";
import TextureMesh from "../utility/TextureMesh.js";
import THreeMath from '../utility/THreeMath.js';
import {TweenMax, Power2, TimelineLite} from "gsap";

class EarthTemplate extends EarthBase{
	constructor(container, camera, renderer){
		
		super({
			R: 2000
		});

		let cur = this;
		this.container = container;
		this.camera = camera;
		this.Ztop = 15;

		this.threeMath = new THreeMath(camera);

		this.TextureMesh = new TextureMesh({
			renderer: renderer,
			width: 2048,
			height: 1024
		});

		this.mapData = null;

		this.resources = [
			{ id: "chinaNew", url: require('assetsDir/mapImages/chinaNew.png'), type: "texture" },
			{ id: "line", url: require('assetsDir/mapImages/china1.png'), type: "texture" },
			{ id: "earth", url: require('assetsDir/mapImages/earth.png'), type: "texture" },
			{ id: "border", url: require('assetsDir/mapImages/countryBorder.png'), type: "texture" },
			{ id: "normalMap", url: require('assetsDir/mapImages/Earth_NormalNRM_6K.jpg'), type: "texture" },
		];

	}

	//	资源加载后初始化
	init(textures){
		super.init(textures);

		//	底层阴影面
		
		this.createBottom();
		this.createWorldMap();
		this.createWorldLine();
		this.createChinaMap();
	}

	//	＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
	createChinaMap(){
		//
		let range = { x: [73.44696044921875, 135.08583068847656], y: [-2.336233377456665, 59.30263686180115] };

		let UNIFORMS = {
			color: { value: new THREE.Color(0x8c0505) },
			map: { value: this.textures.chinaNew.result },
			normalMap: { value: this.textures.normalMap.result },
			opacity: { value: 1 },
			cameraP: { value: new THREE.Vector3(-1, 1, 2).normalize() },
			translate: { value: this.getMapPosition([ (range.x[0]+range.x[1])/2, (range.y[0]+range.y[1])/2 ]) }
		};

		let g = this.createGeometry({
			uNum: 9,
			vNum: 9,
			range: range
		});
		let uv = g.attributes.uv;
		let normalUV = new Float32Array(100*2);
		for(let i=0; i<100; i++){
			let xA = (range.x[1] - range.x[0])*uv.array[i*2] + range.x[0];
			let yA = (range.y[1] - range.y[0])*uv.array[i*2 + 1] + range.y[0];

			normalUV[i*2] = (xA + 180 + 200)%360/360;
			normalUV[i*2 + 1] = (yA + 90)/180;
		}
		g.addAttribute("normalUV", new THREE.BufferAttribute(normalUV, 2));


		let m = this.createMaterial(UNIFORMS, [

			"uniform vec3 color;",
			"uniform float opacity;",
			"uniform sampler2D map;",
			"uniform sampler2D normalMap;",
			"uniform vec3 cameraP;",

			"void main(void){",

				"vec3 rN = normalize(texture2D(normalMap, vN).rgb - 0.5);",

				"float rF = max(0., dot(cameraP, rN));",

				"vec4 mColor = texture2D(map, vUV).rgba;",
				"gl_FragColor = vec4(mColor.rgb, mColor.a);",
			"}"
		].join("\n"));

		let plane = new THREE.Mesh(g, m);

		this.container.add( plane );
	}

	//
	createWorldMap(){
		let UNIFORMS = {
			color: { value: new THREE.Color(0x002d64) },
			map: { value: this.textures.earth.result },
			normalMap: { value: this.textures.normalMap.result },
			opacity: { value: 1 },
			cameraP: { value: new THREE.Vector3(-1, 1, 2).normalize() }
		};

		let g = this.createGeometry({
			uNum: 9,
			vNum: 9
		});


		let m = this.createMaterial(UNIFORMS, [

			"uniform vec3 color;",
			"uniform float opacity;",
			"uniform sampler2D map;",
			"uniform sampler2D normalMap;",
			"uniform vec3 cameraP;",

			"void main(void){",

				"vec3 rN = normalize(texture2D(normalMap, vUV).rgb - 0.5);",

				"float rF = max(0., dot(cameraP, rN));",

				"vec4 mColor = texture2D(map, vUV).rgba;",
				"gl_FragColor = vec4(color*((1.-rF)*5. + 0.1), mColor.a);",
			"}"
		].join("\n"));

		let plane = new THREE.Mesh(g, m);

		this.container.add( plane );

	}

	createWorldLine(){
		let UNIFORMS = {
			color: { value: new THREE.Color(0x0078fd) },
			map: { value: this.textures.border.result }
		};

		let g = this.createGeometry({
			uNum: 9,
			vNum: 9
		});


		let m = this.createMaterial(UNIFORMS, [

			"uniform vec3 color;",
			"uniform sampler2D map;",

			"void main(void){",

				"float a = texture2D(map, vUV).a;",
				"gl_FragColor = vec4(color, a);",
			"}"
		].join("\n"));

		let plane = new THREE.Mesh(g, m);

		this.container.add( plane );

	}

	createBottom(){
		let UNIFORMS = {
			color: { value: new THREE.Color(0x40b7fd) },
			map: { value: this.textures.earth.result }
		};

		let g = this.createGeometry({
			uNum: 9,
			vNum: 9
		});


		let m = this.createMaterial(UNIFORMS, [

			"uniform vec3 color;",
			"uniform sampler2D map;",

			"void main(void){",

				"float a = texture2D(map, vUV).a;",
				"gl_FragColor = vec4(color, a);",
			"}"
		].join("\n"));

		let plane = new THREE.Mesh(g, m);
		plane.position.y = -10;
		plane.position.z = -80;

		this.container.add( plane );

	}

	//
	setOption(COLOR){

	}

	

};

export default EarthTemplate;



