import * as THREE from 'three';

/*
	3D 常用数学计算：
		矩阵运算；
		旋转矩阵；
		透视转换；
		平滑差值;
		//
		常用滤波器
*/
class THreeMath{
	constructor(camera){
		this.camera = camera || null;
	}
	//	矩阵(mat4) * 向量(vec3) => vec3
	matMultiplyvec(mat4, vec3){

		let m = mat4.elements;

		let out = [];
		for(let i=0; i<4; i++){
			out[i] = m[i]*vec3.x + m[i + 4]*vec3.y + m[i + 8]*vec3.z + m[i + 12];
		}

		out[3] = out[3] || 1/3;

		return new THREE.Vector3( out[0]/out[3], out[1]/out[3], out[2]/out[3] );
	}

	/*＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋*/
	//	绕 X 轴旋转
	rotateX(rotateV, angle){

		let matrix = new THREE.Matrix4();
		matrix.set(
			1,	0,					0,					0,
			0,	Math.cos(angle),	Math.sin(angle),	0,
			0,	-Math.sin(angle),	Math.cos(angle),	0,
			0,	0,					0,					1
		);

		return this.matMultiplyvec(matrix, rotateV);
	}

	//	绕 Y 轴旋转
	rotateY(rotateV, angle){

		let matrix = new THREE.Matrix4();
		matrix.set(
			Math.cos(angle),	0,	-Math.sin(angle),	0,
			0,					1,	0,					0,
			Math.sin(angle),	0,	Math.cos(angle),	0,
			0,					0,	0,					1
		);

		return this.matMultiplyvec(matrix, rotateV);
	}

	//	绕 Z 轴旋转
	rotateZ(rotateV, angle){

		let matrix = new THREE.Matrix4();
		matrix.set(
			Math.cos(angle),	Math.sin(angle),	0,	0,
			-Math.sin(angle),	Math.cos(angle),	0,	0,
			0,					0,					1,	0,
			0,					0,					0,	1
		);

		return this.matMultiplyvec(matrix, rotateV);
	}

	//	绕任意轴旋转
	rotateAround(rotateV, aroundV, angle){
		let r = new THREE.Vector3().copy(aroundV);
		r.normalize();

		let matrix = new THREE.Matrix4();
		matrix.set(
			Math.cos(angle) + (1-Math.cos(angle))*r.x*r.x, 		(1-Math.cos(angle))*r.x*r.y + Math.sin(angle)*r.z,	(1-Math.cos(angle))*r.z*r.x - Math.sin(angle)*r.y, 0,
			(1-Math.cos(angle))*r.x*r.y - Math.sin(angle)*r.z,	Math.cos(angle) + (1-Math.cos(angle))*r.y*r.y,		(1-Math.cos(angle))*r.y*r.z + Math.sin(angle)*r.x, 0,
			(1-Math.cos(angle))*r.x*r.z + Math.sin(angle)*r.y,	(1-Math.cos(angle))*r.z*r.y - Math.sin(angle)*r.x,	Math.cos(angle) + (1-Math.cos(angle))*r.z*r.z, 0,
			0, 0, 0, 1
		);

		return this.matMultiplyvec(matrix, rotateV);
	}

	/*＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋*/
	//	3D 坐标转换到屏幕坐标
	worldToScreen(transformV, camera){
		camera = camera || this.camera;
		if(!camera)
			return false;

		let projectionM = new THREE.Matrix4().copy(camera.projectionMatrix);
		let worldM = new THREE.Matrix4().copy(camera.matrixWorldInverse);
		if(worldM.elements[12]==0 && worldM.elements[13]==0 && worldM.elements[14]==0){
			let m1 = new THREE.Matrix4().makeRotationX(camera.rotation.x);
			let m2 = new THREE.Matrix4().makeRotationY(camera.rotation.y);
			let m3 = new THREE.Matrix4().makeRotationZ(camera.rotation.z);

			worldM.multiplyMatrices(m1, m2);
			worldM.multiply(m3);

			worldM.elements[12] -= camera.position.x;
			worldM.elements[13] -= camera.position.y;
			worldM.elements[14] -= camera.position.z;
		}

		let out = this.matMultiplyvec(worldM, transformV);
		return this.matMultiplyvec(projectionM, out);
	}

	//	屏幕坐标转3D坐标
	screenToWorld(transformV, camera){
		camera = camera || this.camera;
		if(!camera)
			return false;

		let projectionM = new THREE.Matrix4().copy(camera.projectionMatrix);
		projectionM.getInverse(projectionM);

		let worldM = new THREE.Matrix4().copy(camera.matrixWorld);
		if(worldM.elements[12]==0 && worldM.elements[13]==0 && worldM.elements[14]==0){
			let m1 = new THREE.Matrix4().makeRotationX(camera.rotation.x);
			let m2 = new THREE.Matrix4().makeRotationY(camera.rotation.y);
			let m3 = new THREE.Matrix4().makeRotationZ(camera.rotation.z);

			worldM.multiplyMatrices(m1, m2);
			worldM.multiply(m3);

			worldM.elements[12] -= camera.position.x;
			worldM.elements[13] -= camera.position.y;
			worldM.elements[14] -= camera.position.z;

			worldM.getInverse(worldM);
		}
		

		let out = this.matMultiplyvec(projectionM, transformV);
		return this.matMultiplyvec(worldM, out);
	}

	/*＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋＋*/
	//	线性差值
	mix(a, b, t){
		return (b-a)*t + a;
	}

	//	平滑差值
	smoothStep(a, b, x){
		let t = (x - a)/(b - a);
		t = Math.min(1., t);
		t = Math.max(0., t);

		return t*t * ( 3 - 2*t );
	}

	//	三次贝赛尔曲线
	/*
		p1: 起始点；
		p2: 终止点；
		cp1: 控制点一；
		cp2: 控制点二；
		t: [0~1]
	*/
	bezier(p1, p2, cp1, cp2, t){
		return p1*Math.pow((1-t), 3) + 3*cp1*t*Math.pow((1-t), 2) + 3*cp2*t*t*(1-t) + p2*t*t*t;
	}

	//
	rgbToHsl(rgb) {
	    let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
	    let max = Math.max(r, g, b), min = Math.min(r, g, b);
	    let h, s, l = (max + min) / 2;

	    if (max == min){ 
	        h = s = 0; // achromatic
	    } else {
	        let d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max) {
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }

	    return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
	}

	//	rgb转十六进制
	rgbToHex(color){

		let that = color;
		//十六进制颜色值的正则表达式
		let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		// 如果是rgb颜色表示
		if (/^(rgb|RGB)/.test(that)) {
		    let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
		    let strHex = "#";
		    for (let i=0; i<aColor.length; i++) {
		        let hex = Number(aColor[i]).toString(16);
		        if (hex.length < 2) {
		            hex = '0' + hex;    
		        }
		        strHex += hex;
		    }
		    if (strHex.length !== 7) {
		        strHex = that;    
		    }
		    return strHex;
		} else if (reg.test(that)) {
		    let aNum = that.replace(/#/,"").split("");
		    if (aNum.length === 6) {
		        return that;    
		    } else if(aNum.length === 3) {
		        let numHex = "#";
		        for (let i=0; i<aNum.length; i+=1) {
		            numHex += (aNum[i] + aNum[i]);
		        }
		        return numHex;
		    }
		}
		return that;
	}

	//	十六进制转rgb
	HexToRgb(sColor){
		sColor = sColor.toLowerCase();
		//十六进制颜色值的正则表达式
		let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		// 如果是16进制颜色
		if (sColor && reg.test(sColor)) {
		    if (sColor.length === 4) {
		        let sColorNew = "#";
		        for (let i=1; i<4; i+=1) {
		            sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
		        }
		        sColor = sColorNew;
		    }
		    //处理六位的颜色值
		    let sColorChange = [];
		    for (let i=1; i<7; i+=2) {
		        sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
		    }
		    return "rgb(" + sColorChange.join(",") + ")";
		}
		return sColor;
	}
}

export default THreeMath;

