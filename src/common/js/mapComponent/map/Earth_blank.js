/*
	地球组件模版
*/
import * as THREE from 'three';
import EarthBase from "../utility/EarthBase.js";
import THreeMath from '../utility/THreeMath.js';
import {TweenMax, Power2, TimelineLite} from "gsap";

class EarthTemplate extends EarthBase{
	constructor(container, camera, renderer){
		
		super({
			R: 2000,
			scale: [0.85, 1]
		});

		let cur = this;
		this.container = container;
		this.camera = camera;
		this.Ztop = 15;

		this.threeMath = new THreeMath(camera);

		this.mapData = null;

		this.resources = [
			{ id: "china", url: require('assetsDir/mapImages/china.png'), type: "texture" },
			{ id: "chinaNew", url: require('assetsDir/mapImages/chinaNew.png'), type: "texture" },
			{ id: "earth", url: require('assetsDir/mapImages/worldMap.png'), type: "texture" },
			{ id: "chinaDashLine", url: require('assetsDir/mapImages/chinaDashLine.png'), type: "texture" },
			{ id: "province", url: require('assetsDir/mapImages/province.png'), type: "texture" },
			{ id: "southSea", url: require('assetsDir/mapImages/nanhai.png'), type: "texture" }
		];

	}

	//	资源加载后初始化
	init(textures){
		super.init(textures);

		//	底层阴影面
		
		this.chinaDashLine = this.createChinaMap(this.textures.chinaDashLine.result, new THREE.Vector3(0, -18, -60));
		this.chinaDashLine.material.uniforms.color.value = new THREE.Color(0x00466f);
		this.chinaDashLine.material.uniforms.opacity.value = 0;
		
		this.chinaDashLine1 = this.createChinaMap(this.textures.chinaDashLine.result, new THREE.Vector3(0, -12, -40));
		this.chinaDashLine1.material.uniforms.color.value = new THREE.Color(0x00466f);
		this.chinaDashLine1.material.uniforms.opacity.value = 0;

		this.chinaPlaneBottom = this.createChinaMap(this.textures.china.result, new THREE.Vector3(0, -6, -20));
		this.chinaPlaneBottom.material.uniforms.color.value = new THREE.Color(0x0066e8);
		this.chinaPlaneBottom.material.uniforms.opacity.value = 0;

		
		this.createBottom();
		this.createWorldMap();
		this.createTip();

		this.chinaPlane = this.createChinaMap(this.textures.china.result);
		this.chinaBorder = this.createChinaMap(this.textures.chinaNew.result);
		this.chinaBorder.material.uniforms.color.value = new THREE.Color(0x00eaff);

		this.chinaText = this.createChinaMap(this.textures.province.result);
		this.chinaText.material.uniforms.color.value = new THREE.Color(0x48d5ff);
		this.chinaText.material.uniforms.opacity.value = 0;
		this.chinaText.position.set(0, 0, 2);

	}

	//	＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
	createChinaMap(texture, position){
		//
		let range = { x: [73.44696044921875, 135.08583068847656], y: [-2.336233377456665, 59.30263686180115] };

		let UNIFORMS = {
			map: { value: texture },
			color: { value: new THREE.Color(0x0083ff) },
			change: { value: 0 },
			opacity: { value: 1 },
			translate: { value: this.getMapPosition([ (range.x[0]+range.x[1])/2, (range.y[0]+range.y[1])/2 ]).add( position || new THREE.Vector3() ) }
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
			"uniform float change;",
			"uniform sampler2D map;",
			"uniform float opacity;",

			"void main(void){",
				"vec4 c = texture2D(map, vUV).rgba;",

				"gl_FragColor = vec4( mix(color, c.rgb, change), c.a*opacity );",
			"}"
		].join("\n"));

		let plane = new THREE.Mesh(g, m);

		this.container.add( plane );

		return plane;
	}

	//
	createWorldMap(){

		let UNIFORMS = {
			color: { value: new THREE.Color(0x002d64) },
			map: { value: this.textures.earth.result },
			opacity: { value: 1 }
		};

		let g = this.createGeometry({
			uNum: 9,
			vNum: 9
		});


		let m = this.createMaterial(UNIFORMS, [

			"uniform vec3 color;",
			"uniform sampler2D map;",
			"uniform float opacity;",

			"void main(void){",

				"gl_FragColor = texture2D(map, vUV).rgba;",
				"gl_FragColor *= opacity;",
			"}"
		].join("\n"));

		let plane = new THREE.Mesh(g, m);
		this.worldMap = plane;

		this.container.add( plane );

	}

	createBottom(){

		let UNIFORMS = {
			color: { value: new THREE.Color(0x40b7fd) },
			map: { value: this.textures.earth.result },
			opacity: { value: 1 }
		};

		let g = this.createGeometry({
			uNum: 9,
			vNum: 9
		});

		let m = this.createMaterial(UNIFORMS, [

			"uniform vec3 color;",
			"uniform sampler2D map;",
			"uniform float opacity;",

			"void main(void){",

				"float a = texture2D(map, vUV).a;",
				"gl_FragColor = vec4(color, a*opacity);",
			"}"
		].join("\n"));

		let plane = new THREE.Mesh(g, m);
		plane.position.y = -10;
		plane.position.z = -80;

		this.bottomPlane = plane;

		this.container.add( plane );

	}

	createTip(){

		let g = new THREE.PlaneBufferGeometry(300*this.textures.southSea.result.image.width/this.textures.southSea.result.image.height, 300);
		// let m = new THREE.MeshBasicMaterial({ map: this.textures.southSea.result, transparent: true, depthTest: false });
		let m = new THREE.ShaderMaterial({
			uniforms: {
				map: { value: this.textures.southSea.result },
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
			transparent: true,
			depthTest: false
		})

		this.southSeaPlane = new THREE.Mesh(g,m);
		this.southSeaPlane.position.copy( this.getMapPosition([131.826084, 19]) );

		this.container.add(this.southSeaPlane);
	}

	//
	changeMap(type){

		if(type==0){
			TweenMax.to([this.chinaText.material.uniforms.opacity, this.southSeaPlane.material.uniforms.opacity, this.chinaDashLine.material.uniforms.opacity, this.chinaDashLine.material.uniforms.opacity, this.chinaDashLine1.material.uniforms.opacity, this.chinaPlaneBottom.material.uniforms.opacity, this.chinaPlane.material.uniforms.change], 0.8, {
				value: 0,
				ease: Power2.easeInOut
			});

			TweenMax.to([ this.bottomPlane.material.uniforms.opacity, this.worldMap.material.uniforms.opacity], 0.7, {
				value: 1,
				ease: Power2.easeInOut
			});
		}
		else if(type==1){
			TweenMax.to([this.chinaText.material.uniforms.opacity, this.southSeaPlane.material.uniforms.opacity, this.chinaDashLine.material.uniforms.opacity, this.chinaDashLine1.material.uniforms.opacity, this.chinaPlaneBottom.material.uniforms.opacity, this.chinaPlane.material.uniforms.change], 0.8, {
				value: 1,
				ease: Power2.easeInOut
			});

			TweenMax.to([this.bottomPlane.material.uniforms.opacity, this.worldMap.material.uniforms.opacity], 0.7, {
				value: 0,
				ease: Power2.easeInOut
			});
		}
	}

};

export default EarthTemplate;



