//ES6写法

const THREE = require('three');
import ThreeGroupLoader from './ThreeGroupLoader';

class ThreeBase {
    constructor(dom) {
        this.dom = dom;
        this.width = dom.clientWidth;
        this.height = dom.clientHeight;
        this.resourcesMap = {};

        this.tick = 0;
    }

    //有资源需要加载时,先加载资源,所有资源加载完毕后初始化3D场景;无资源加载时,直接初始化3D场景.
    init() {

        this.initRender();
        this.initCamera();
        this.initScene();
        this.initLight();
        // this.initResize();
    }

    init3D(ary){

        if (ary && ary.length>0) {
            this.initLoader(ary);
        } else {
            this.initObject3D();
        }
    }

    initLoader(ary) {
        this.loader = new ThreeGroupLoader();
        this.loader.eventDispatcher.addEventListener("loadProgress", (e) => {
        });
        this.loader.eventDispatcher.addEventListener("loadComplete", (e) => {
            this.resourcesMap = e.resultMap;
            this.initObject3D();
        });
        this.loader.load(ary);
    }

    initRender() {
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        //this.render.autoClear = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // this.renderer.setPixelRatio(1);
        this.renderer.setSize(this.width, this.height);
        this.dom.appendChild(this.renderer.domElement);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 100, 18000);
        this.camera.position.set(0, 0, 30000);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 0, 3000);
    }

    initLight() {

    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }

        this.tick++;
    }


    /*initResize() {
        let cur = this;
        window.addEventListener('resize', () => {
            cur.resize();
        }, false);
        this.resize();
    }

    resize() {
        let width = this.width;
        let height = this.height;
        //
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }*/

    initObject3D() {
        let width = this.width;
        let height = this.height;
        //
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

export default ThreeBase;