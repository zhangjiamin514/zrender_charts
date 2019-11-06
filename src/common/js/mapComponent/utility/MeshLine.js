import * as THREE from 'three';

export default class MeshLine {
    constructor(vertices, options) {
        let defaultMaterialOptions = {
            lineWidth: 1,
            lineLength: 1,
            time: 0,
            sColor: 0x0005ff,
            eColor: 0xffffff,
            depthTest: true,
            transparent: true,
            blending: THREE.NormalBlending,
            opacity: 1,
            wireframe: false,
            fragmentShader: null,
            uniforms: {},
            delay: 0
        };
        this.materialOptions = Object.assign(defaultMaterialOptions, options);
        //
        return this.createMesh(vertices);
    }

    createMesh(vertices) {
        let geometry = this.createGeometry(vertices);
        let material = this.createMaterial();
        return new THREE.Mesh(geometry, material);
    }

    createMaterial() {
        let materialOptions = this.materialOptions;
        let uniforms = {
            sColor: {value: new THREE.Color(materialOptions.sColor)},
            eColor: {value: new THREE.Color(materialOptions.eColor)},
            time: {value: materialOptions.time},
            width: {value: materialOptions.lineWidth},
            opacity: {value: materialOptions.opacity},
            delay: { value: materialOptions.delay }
        };

        for(let i in materialOptions.uniforms){
            uniforms[i] = materialOptions.uniforms[i];
        }

        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: [
                "attribute vec3 prevPositions;",
                "attribute vec3 nextPositions;",

                "uniform float width;",

                "varying vec2 vUV;",
                "void main(void){",
                    "vUV = uv;",

                    "vec4 zeroP = modelViewMatrix * vec4( 0., 0., 0., 1. );",
                    "vec4 curP = modelViewMatrix * vec4(position, 1.);",
                    "vec4 preV = modelViewMatrix * vec4(prevPositions, 1.);",
                    "vec4 nextV = modelViewMatrix * vec4(nextPositions, 1.);",

                    "float side = dot(curP.xyz/curP.w - zeroP.xyz/zeroP.w, vec3(0., 0., 1.));",

                    "vec2 curP2 = curP.xy/curP.w;",

                    "vec2 p1 = preV.xy/preV.w - curP2;",
                    "vec2 p2 = nextV.xy/nextV.w - curP2;",

                    "vec2 dirV = vec2(0.);",


                    "if(length(p1)==0. || length(p2)==0.){",
                        "if(length(p1) > 0.)",
                            "p1 = -normalize(p1);",

                        "if(length(p2) > 0.)",
                            "p2 = normalize(p2);",

                        "vec3 p3 = vec3(p1 + p2, 0.);",

                        "dirV = normalize(cross(p3, vec3(0., 0., 1.))).xy;",
                    "}",
                    "else{",
                        "p1 = normalize(p1);",
                        "p2 = normalize(p2);",

                        "float angle = acos(dot(p1, p2));",

                        "if(angle<0.6){",
                            "vec3 p3 = vec3(p1 + p2, 0.);",

                            "dirV = normalize(cross(p3, vec3(0., 0., 1.))).xy;",
                        "}",
                        "else{",
                            "dirV = normalize(p1 + p2);",

                            "vec3 p3 = cross(vec3(dirV, 0.), vec3(p2, 0.));",
                            "if(p3.z<0.)",
                                "dirV *= -1.;",
                        "}",

                        
                    "}",

                    "curP.xy += (width*(0.5-uv.y)*dirV);",

                    "gl_PointSize = 20.;",
                    "gl_Position = projectionMatrix * curP;",
                "}"
            ].join("\n"),
            fragmentShader: this.materialOptions.fragmentShader ? ([
                    "uniform vec3 sColor;",
                    "uniform vec3 eColor;",
                    "uniform float opacity;",
                    "uniform float time;",
                    "uniform float delay;",
                    "varying vec2 vUV;",
                ].join("\n") + this.materialOptions.fragmentShader) : [
                "uniform vec3 sColor;",
                "uniform vec3 eColor;",
                "uniform float opacity;",
                "uniform float time;",
                "uniform float delay;",

                "varying vec2 vUV;",
                "void main(void){",
                    "float t = mod(max(0., time-delay), 2.);",

                    "float u = smoothstep(t-"+this.materialOptions.lineLength.toFixed(1)+", t-"+(this.materialOptions.lineLength*0.02).toFixed(1)+", vUV.x) - smoothstep(t-"+(this.materialOptions.lineLength*0.02).toFixed(1)+", t, vUV.x);",
                    "float v = 1. - smoothstep(0.1, 0.5, abs(vUV.y-0.5));",

                    "gl_FragColor = vec4(mix(sColor, eColor, v*u), u*opacity);",
                "}"
            ].join("\n"),
            transparent: materialOptions.transparent,
            depthTest: materialOptions.depthTest,
            blending: materialOptions.blending,
            wireframe: materialOptions.wireframe
        });
    }

    createGeometry(vertices) {
        let verticesCount = vertices.length;
        let bufferGeometry = new THREE.PlaneBufferGeometry(0, 0, 1, verticesCount - 1);
        let prevPositions = new Float32Array(verticesCount * 3 * 2);
        let nextPositions = new Float32Array(verticesCount * 3 * 2);
        let uv = bufferGeometry.attributes.uv.array;
        let per = new Float32Array(verticesCount * 1 * 2);
        let position = bufferGeometry.attributes.position.array;


        for (let j = 0; j < verticesCount * 2; j += 2) {
            let ratio = j / 2 / (verticesCount - 1);


            // index
            let current = vertices[j / 2];
            let prev = vertices[(j === 0 ? j : j - 2) / 2];
            let next = vertices[(j === (verticesCount - 1) * 2 ? j : j + 2) / 2];
            // position
            position[j * 3] = current.x;
            position[j * 3 + 1] = current.y;
            position[j * 3 + 2] = current.z;
            position[j * 3 + 3] = current.x;
            position[j * 3 + 4] = current.y;
            position[j * 3 + 5] = current.z;

            // prev
            prevPositions[j * 3] = prev.x;
            prevPositions[j * 3 + 1] = prev.y;
            prevPositions[j * 3 + 2] = prev.z;
            prevPositions[j * 3 + 3] = prev.x;
            prevPositions[j * 3 + 4] = prev.y;
            prevPositions[j * 3 + 5] = prev.z;

            // next
            nextPositions[j * 3] = next.x;
            nextPositions[j * 3 + 1] = next.y;
            nextPositions[j * 3 + 2] = next.z;
            nextPositions[j * 3 + 3] = next.x;
            nextPositions[j * 3 + 4] = next.y;
            nextPositions[j * 3 + 5] = next.z;

            uv[j * 2] = ratio;
            uv[j * 2 + 2] = ratio;
            uv[j * 2 + 1] = 0;
            uv[j * 2 + 3] = 1;
            //
            per[j] = ratio;
            per[j + 1] = ratio;
        }

        bufferGeometry.addAttribute('prevPositions', new THREE.BufferAttribute(prevPositions, 3));
        bufferGeometry.addAttribute('nextPositions', new THREE.BufferAttribute(nextPositions, 3));
        bufferGeometry.addAttribute('per', new THREE.BufferAttribute(per, 1));

        return bufferGeometry
    }
}
