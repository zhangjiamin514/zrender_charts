import * as THREE from 'three';
import {TweenMax, Power2, Linear} from "gsap";

/*
	{
		renderer: 渲染器,
		width: 	  texture 宽度,
		height:   texture 高度,
	}
*/
class TextureMesh{
	constructor(opt){

		this.camera = new THREE.Camera();
		this.renderer = opt.renderer;
		this.width = opt.width || 2048;
		this.height = opt.height || 1024;

		this.scene = new THREE.Scene();
		this.renderTarget = new THREE.WebGLRenderTarget( this.width, this.height, {
            format: THREE.RGBAFormat,
            type: ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) ? THREE.HalfFloatType : THREE.FloatType,
            stencilBuffer: false
		} );

	}

	render(){

		//
		this.renderer.render(this.scene, this.camera, this.renderTarget);

		return this.renderTarget.texture;
	}

	add(obj){
		this.scene.add(obj);
	}

	clear(){

		for(let i=this.scene.children.length-1; i>=0; i--){
			this.scene.children[i].geometry.dispose();
			this.scene.remove(this.scene.children[i]);
		}
	}

	getBuffer(u,v,sizeX,sizeY){
		sizeX = sizeX || 1;
		sizeY = sizeY || 1;

        let pixelBuffer = new Float32Array( sizeX*sizeY*4 );
        this.renderer.readRenderTargetPixels(this.renderTarget, Math.floor(u*this.width), Math.floor(v*this.height), sizeX, sizeY, pixelBuffer);

        return pixelBuffer;
    };
}

export default TextureMesh;


