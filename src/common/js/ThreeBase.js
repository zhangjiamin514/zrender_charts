/*theejs 基础场景模板*/

//ES6写法
//import {Scene} from 'three';
const THREE = require('three');
//import {WebGLRenderer, PerspectiveCamera, Scene, Fog} from 'three';
const OrbitControls = require("three-orbitcontrols");
const Stats = require("three-stats");

//import Stats from "three-stats";
import ThreeGroupLoader from './ThreeGroupLoader';

class ThreeBase {
    constructor(dom, autoRender = true, autoResize = true) {
        this.dom = dom;
        this.autoRender = autoRender;
        this.autoResize = autoResize;
        this.resourcesMap = null;
    }

    //有资源需要加载时,先加载资源,所有资源加载完毕后初始化3D场景;无资源加载时,直接初始化3D场景.
    init(ary) {
        if (ary) {
            this.initLoader(ary);
        } else {
            this.init3D();
        }
    }

    initLoader(ary) {
        this.loader = new ThreeGroupLoader();
        this.loader.eventDispatcher.addEventListener("loadProgress", (e) => {
            console.log(e);
        });
        this.loader.eventDispatcher.addEventListener("loadComplete", (e) => {
            this.resourcesMap = e.resultMap;
            //console.log(this.resourcesMap);
            this.init3D();
        });
        this.loader.load(ary);
    }

    init3D() {
        //-------------------- render ---------------------------//
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        //this.renderer.autoClear = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.dom.appendChild(this.renderer.domElement);

        //-------------------- scene ---------------------------//
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 2000, 3000);

        //-------------------- camera ---------------------------//
        let width = this.dom.offsetWidth;
        let height = this.dom.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 100, 4000);
        this.camera.position.set(0, 0, 1000);

        //-------------------- constrols ---------------------------//
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        //-------------------- stats ---------------------------//
        this.stats = new Stats.Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
        this.stats.dom.className = "stats";


        this.animate();
        this.initResize();
        this.initObject3D();
    }

    //直接返回controls对象，交给外部控制。
    getControls() {
        return this.controls;
    }

    initObject3D() {

    }

    /*------------------------------ render ---------------------------------*/
    animate() {
        if(this.autoRender){
            this.render();
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    //注意render() 与 renderFun的区别
    render() {
        this.stats && this.stats.begin();
        this.renderFun();
        this.stats && this.stats.end();
    }

    renderFun(){
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
            this.controls.update();
        }
    }

    /*------------------------------ resize ---------------------------------*/
    initResize() {
        if (this.autoResize) {
            window.addEventListener('resize', () => {
                this.resizeFun();
            }, false);
        }
        this.resizeFun();
    }

    resizeFun() {
        let width = this.dom.offsetWidth;
        let height = this.dom.offsetHeight;
        //
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

}

export default ThreeBase;