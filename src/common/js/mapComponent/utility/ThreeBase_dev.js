//ES6写法

const THREE = require('three');
const OrbitControls = require("three-orbitcontrols");
// const Stats = require("three-stats");

//import Stats from "three-stats";
import ThreeGroupLoader from './ThreeGroupLoader';

class ThreeBase {
    constructor(dom) {
        this.dom = dom;
        this.resourcesMap = {};

        this.width = dom.clientWidth;
        this.height = dom.clientHeight;
        // this.canOrbit = false;
    }

    //有资源需要加载时,先加载资源,所有资源加载完毕后初始化3D场景;无资源加载时,直接初始化3D场景.
    init() {

        this.initRender();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initResize();

        //
        // this.initStats();
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
            // console.log(e);
        });
        this.loader.eventDispatcher.addEventListener("loadComplete", (e) => {
            this.resourcesMap = e.resultMap;
            //console.log(this.resourcesMap);
            this.initObject3D();
        });
        this.loader.load(ary);
    }

    initStats(){
        this.stats = new Stats.Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
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
        this.camera.position.set(0, 0, 1000);
        //
        this.controls = new OrbitControls( this.camera ,this.renderer.domElement);
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
            // if (this.canOrbit) {
                // this.controls.update();
            // }
                // this.stats.update();
        }
    }


    initResize() {
        window.addEventListener('resize', () => {
            this.resize();
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
    }

    statsBegin(){
        this.stats && this.stats.begin();
    }

    statsEnd(){
        this.stats && this.stats.end();
    }

    initObject3D() {

    }
}

export default ThreeBase;