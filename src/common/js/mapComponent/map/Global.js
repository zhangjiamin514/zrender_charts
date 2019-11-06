import * as THREE from 'three';
import GlobalBase from "../utility/GlobalBase.js";

class Global extends GlobalBase{
	constructor(container, camera){

		super(container);

		this.camera = camera;
		
		this.resources = [
			{id: "earthDiffuse", type: "texture", url: require('assetsDir/mapImages/earth.png')},
			{id: "china1", type: "texture", url: require('assetsDir/mapImages/chinaNew.png')},
			{id: "earthNormal1", type: "texture", url: require('assetsDir/mapImages/Earth_NormalNRM_6K.jpg')},
			{id: "line", type: "texture", url: require('assetsDir/mapImages/countryBorder.png')},
			{id: "chinaShadow", type: "texture", url: require('assetsDir/mapImages/ChinaShadow.png')}
		];

	}

	init(textures){
		super.init(textures);

		this.initGrid();
		this.initLand();
		this.initGlow();
		this.initGlow1();
		this.initGlow2();
		this.initChina(textures.chinaShadow.result);
		this.initChina(this.textures.china1.result, 13);
	}

	//	＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋

	initGrid(){
		let g = this.createGeometry();
		let m = new THREE.MeshBasicMaterial({ color: 0x091b32, wireframe: true, transparent: true, depthTest: false });

		this.container.add(new THREE.Mesh(g,m));
	}

	initLand(){

		
		//

		let g = this.createGeometry();

		let uniforms = {
			map: { value: this.textures.earthDiffuse.result },
			normalMap: { value: this.textures.earthNormal1.result },
			cameraP: { value: new THREE.Vector3(4000, 1000, 5000) },
			cameraP1: { value: new THREE.Vector3(1500, 5000, 1100) },
			color: { value: new THREE.Color(0x2c384d) }
		};

		let fS = [
			"const float R = " + (this.config.R*2000).toFixed(1.) + ";",
			"const float PI = 3.141592653589793;",

			"uniform sampler2D map;",
			"uniform sampler2D normalMap;",
			"uniform vec3 cameraP;",
			"uniform vec3 cameraP1;",
			"uniform vec3 color;",

			"float directLight(vec3 vP){",
				"vec3 N = normalize(n);",
				"vec3 L = normalize(vP-p);",

				//
				"vec3 mN = texture2D(normalMap, vUV).xyz - 0.5;",
				"vec4 rN = M * vec4(mN, 1.);",
				"float mA = max(0., dot(L, normalize(rN.xyz)));",

				"return mA;",
			"}",

			"void main(void){",
				//
				"vec3 uColor = texture2D(map, vUV).rgb;",

				"float a1 = directLight(cameraP);",
				"float a2 = directLight(cameraP1);",


				"gl_FragColor = vec4(uColor*pow((a1*0.8+a2*1.2), 1.), texture2D(map, vUV).a );",
				"gl_FragColor.rgb *= color;",
			"}"
		].join("\n");

		let m = this.createMaterial(uniforms, fS);

		this.container.add(new THREE.Mesh(g,m));
	}

	initGlow(){
		let box = new THREE.Mesh(new THREE.BoxGeometry(30,30,30), new THREE.MeshBasicMaterial({ color: "red", transparent: true, depthTest: false }));
		this.container.add(box);
		box.position.set(4000, 6000, 2000);
		//

		let g = this.createGeometry({r: 90});

		let uniforms = {
			cameraP: { value: this.camera.position },
			color: { value: new THREE.Color(0x6188bc) },
			lightP: { value: box.position }
		};

		let fS = [
			"const float R = " + (this.config.R*6).toFixed(1.) + ";",
			"const float PI = 3.141592653589793;",

			"uniform vec3 cameraP;",
			"uniform vec3 color;",
			"uniform vec3 lightP;",

			"void main(void){",

				"vec3 N = normalize(n);",
				"vec3 L = normalize(lightP-p);",
				"float mA = max(0., dot(L, N));",
				"mA = pow(mA, 4.);",

				//
				"float c = dot(normalize(cameraP - p), N);",
				"float t = 0.5*PI*(max(0.3 - c, 0.)/0.3) ;",

				"gl_FragColor = vec4(color,  mA * (1. - sin(t)) * (1. - smoothstep(0.15, 0.3, c)) );",
			"}"
		].join("\n");

		let m = this.createMaterial(uniforms, fS);
		this.glowM = m;
		m.depthTest = false;

		let glow = new THREE.Mesh(g,m);

		this.container.add(glow);
	}

	initGlow1(){
		//

		let g = this.createGeometry({r: 70});

		let uniforms = {
			cameraP: { value: this.camera.position },
			color: { value: new THREE.Color(0x015bfd) },
			lightP: { value: new THREE.Vector3(-3000, 6000, 6000) }
		};

		let fS = [
			"const float R = " + (this.config.R*6).toFixed(1.) + ";",
			"const float PI = 3.141592653589793;",

			"uniform vec3 cameraP;",
			"uniform vec3 color;",
			"uniform vec3 lightP;",

			"void main(void){",

				"vec3 N = normalize(n);",
				"vec3 L = normalize(lightP-p);",
				"float mA = max(0., dot(L, N));",
				"mA = pow(mA, 2.);",

				//
				"float c = dot(normalize(cameraP - p), N);",
				"float t = 0.5*PI*(max(0.3 - c, 0.)/0.3) ;",

				"gl_FragColor = vec4(color, 1.3 * mA * (1. - sin(t)) * (1. - smoothstep(0.15, 0.3, c)) );",
			"}"
		].join("\n");

		let m = this.createMaterial(uniforms, fS);
		this.glowM = m;
		m.depthTest = false;

		let glow = new THREE.Mesh(g,m);

		this.container.add(glow);
	}

	initGlow2(){

		//

		let g = this.createGeometry({r: 0});

		let uniforms = {
			cameraP: { value: this.camera.position },
			color: { value: new THREE.Color(0xffffff) },
			lightP: { value: new THREE.Vector3(-3000, 8000, 5000) }
		};

		let fS = [
			"const float R = " + (this.config.R*6).toFixed(1.) + ";",
			"const float PI = 3.141592653589793;",

			"uniform vec3 cameraP;",
			"uniform vec3 color;",
			"uniform vec3 lightP;",

			"void main(void){",

				"vec3 N = normalize(n);",
				"vec3 L = normalize(lightP-p);",
				"float mA = max(0., dot(L, N));",
				"mA = pow(mA, 4.);",

				//
				"float c = dot(normalize(cameraP - p), N);",
				"float t = 0.5*PI*(max(0.2 - c, 0.)/0.2) ;",

				"gl_FragColor = vec4(color, mA * (1. - sin(t)) * (1. - smoothstep(0.08, 0.14, c)) );",
			"}"
		].join("\n");

		let m = this.createMaterial(uniforms, fS);
		this.glowM = m;
		m.depthTest = false;
		m.blending = THREE.AdditiveBlending;

		let glow = new THREE.Mesh(g,m);

		this.container.add(glow);
	}

	initChina(texture, z){

		let range = { x: [73.44696044921875, 135.08583068847656], y: [-2.336233377456665, 59.30263686180115] };

		let uS = 12, vS = 12;
		let g = new THREE.PlaneBufferGeometry(1, 1, uS-1, vS-1);
		let position = g.attributes.position;
		let uv = g.attributes.uv;

		for(let i=0; i<uS*vS; i++){

			let xA = (range.x[1] - range.x[0])*uv.array[i*2] + range.x[0];
			let yA = (range.y[1] - range.y[0])*uv.array[i*2 + 1] + range.y[0];

			let p = this.getMapPosition([xA, yA], z);
			position.array[i*3] = p.x;
			position.array[i*3+1] = p.y;
			position.array[i*3+2] = p.z;
		}
		position.needsUpdate = true;

		let m = new THREE.ShaderMaterial({
			uniforms: {
				map: { value: texture },
				color: { value: new THREE.Color(0x246aa4) }
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
				"uniform vec3 color;",

				"varying vec2 vUV;",

				"void main(void){",
					"gl_FragColor = vec4( color, texture2D(map, vUV).a );",
				"}"
			].join("\n"),
			transparent: true,
			depthTest: false
		});

		this.container.add(new THREE.Mesh(g,m));

	}
};

export default Global;


