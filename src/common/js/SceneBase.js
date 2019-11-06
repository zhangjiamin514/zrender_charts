const THREE = require('three');
const OrbitControls = require("three-orbitcontrols");

class SceneBase {
    constructor(renderer) {

        this.canRender = false;

        //render
        this.renderer = renderer;

        //scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1000, 2000);
        //this.scene.background = 'rgba(0,0,0, 0)' ;

        //camera
        this.camera = new THREE.PerspectiveCamera(45, 1, 10, 3000);
        this.camera.position.set(0, 0, 1000);

        //constrols
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    getControls(){
        return this.controls;
    }

    resize(w, h) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        //this.renderer.setSize(w, h);
    }

    render() {
        if (this.renderer) {
            if (this.canRender) this.renderer.render(this.scene, this.camera);
            this.controls.update();
        }
    }
}

export default SceneBase;
