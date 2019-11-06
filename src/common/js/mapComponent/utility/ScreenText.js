import * as THREE from 'three';

/*
	{
		text;
		fontSize;
		color;
		backgroundColor;
		blurColor;
		
		screenW;
		screenH;
		position;
		modelM;
		container;
		align;

		opacity;
	}
*/

class ScreenText{
	constructor(opt){

		this.SCALE = 2;

		if(opt!=undefined){
			opt.text = opt.text || " ";
			opt.fontSize = (opt.fontSize || 12);
			opt.align = opt.align || "center";
			opt.color = opt.color || "#fff";
			opt.screenW = opt.screenW || 1900;
			opt.screenH = opt.screenH || 600;
			opt.weight = opt.weight || "normal";
			opt.opacity = !isNaN(opt.opacity) ? opt.opacity : 1;
		}

		this.opt = opt;
		this.canvas = opt.canvas || document.createElement("canvas");

		this.createTextPlane(opt.position);
	}

	createTextPlane(position){
		let offset = 0;
		if(this.opt.align == "right")
			offset = -1;
		else if(this.opt.align == "center")
			offset = -0.5;

		let pG = new THREE.PlaneBufferGeometry(0,0);
		let pM = new THREE.ShaderMaterial({
			uniforms: {
				_width: { value: 0 },
				_height: { value: 0 },
				_position: { value: position || new THREE.Vector3() },
				_map: { value: new THREE.Texture() },
				modelM: { value: this.opt.modelM || new THREE.Matrix4() },

				opacity: { value: this.opt.opacity },
				translate: { value: new THREE.Vector2() },
				scale: { value: new THREE.Vector2(1, 1) },

				color: { value: new THREE.Color(0xffffff) }
			},
			vertexShader: [
				"const float screenW = "+ this.opt.screenW.toFixed(1) +";",
				"const float screenH = "+ this.opt.screenH.toFixed(1) +";",
				"uniform float _width;",
				"uniform float _height;",
				"uniform vec3 _position;",
				"uniform vec2 translate;",
				"uniform vec2 scale;",
				"uniform mat4 modelM;",
				"varying vec2 vUV;",
				"void main(void){",
					"vUV = uv;",

					"vec4 transP = projectionMatrix * viewMatrix * modelM *vec4(_position, 1.);",

					"vec2 screenP = vec2( _width/screenW*2. * scale.x, _height/screenH*2. * scale.y ) * vec2( uv.x+"+ offset.toFixed(1) +", uv.y-0.5 ) + translate/vec2(screenW, screenH);",
					"gl_Position = vec4( screenP+transP.xy/transP.w, -1., 1. );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D _map;",
				"uniform float opacity;",
				"uniform vec3 color;",
				"varying vec2 vUV;",
				"void main(void){",
					"vec4 textColor = texture2D(_map, vUV).rgba;",
					"gl_FragColor = vec4(textColor.rgb*color, textColor.a*opacity);",
				"}"
			].join("\n"),
			transparent: true,
			// depthTest: false
		});
		this.textPlane = new THREE.Mesh(pG, pM);
		// this.textPlane.position.copy(position)
		this.opt.container.add(this.textPlane);

		this.text(this.opt.text);
	}

	text(txt){
		this.opt.text = txt;

		let textImg = this.createText(this.opt);
		this.textPlane.material.uniforms._map.value = new THREE.Texture(textImg);
		this.textPlane.material.uniforms._map.value.needsUpdate = true;

		this.textPlane.material.uniforms._width.value = textImg.width/this.SCALE;
		this.textPlane.material.uniforms._height.value = textImg.height/this.SCALE;
	}

	style(vars){

		for(let i in vars){
			if(this.textPlane.material.uniforms[i])
				this.textPlane.material.uniforms[i].value = vars[i];
		}
	}

	getWH(){
		return [this.textPlane.material.uniforms._width.value, this.textPlane.material.uniforms._height.value];
	}

	//
	createText(opt){

		if(!(opt.text instanceof Array)){
			let T = opt.text;
			opt.text = [{ text: opt.text }];
		}


		let canvas = this.canvas;
		this.canvas.width = 0;
		let ctx = canvas.getContext("2d");

		let width = 0, partL = [];
		for(let i=0; i<opt.text.length; i++){
			let L = ctx.measureText(opt.text[i].text).width/12*(opt.text[i].fontSize || opt.fontSize)*(this.SCALE);
			partL.push(L);
			width += L;
		}

		canvas.width = width;
		canvas.height = opt.fontSize * this.SCALE * 1.5;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		//
		let left = 0;
		for(let i=0; i<opt.text.length; i++){
			let backgroundColor = opt.text[i].backgroundColor || opt.backgroundColor;
			if(backgroundColor){
				ctx.fillStyle = backgroundColor;
				ctx.fillRect(left, 0, partL[i], canvas.height);
			}

			left += partL[i];
		}

		let left1 = 0;
		for(let i=0; i<opt.text.length; i++){
			let size = (opt.text[i].fontSize || opt.fontSize)*this.SCALE*0.8;
			ctx.font = opt.weight + " " + size + "px mars";

			let blurColor = opt.text[i].blurColor || opt.blurColor;
			if(blurColor){
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
				ctx.shadowBlur = Math.min(5, size/4);
				ctx.shadowColor = blurColor; 
			}

			ctx.fillStyle = opt.text[i].color || opt.color;
			ctx.fillText(opt.text[i].text, -(width/2 - left1 - partL[i]/2)+width/2, canvas.height / 2);

			left1 += partL[i];
		}

		return canvas;
	}

};

export default ScreenText;




