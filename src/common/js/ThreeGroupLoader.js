const THREE = require('three');
const OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

class ThreeGroupLoader {
    constructor() {
        this.eventDispatcher = new THREE.EventDispatcher();
        this.resultMap = {};
        this.loaderMap = {
            "image": THREE.ImageLoader,
            "texture": THREE.TextureLoader,
            "xhr": THREE.XHRLoader,
            "json": THREE.JSONLoader,
            "obj": THREE.OBJLoader,
            "file": THREE.FileLoader
        };
    }

    load(ary) {
        const manager = new THREE.LoadingManager();
        manager.onProgress = (item, loaded, total) => {
            this.loadProgress(loaded, total);
            if (loaded >= total) {
                this.loadComplete();
            }
        };
        for (let i = 0; i < ary.length; i++) {
            let obj = ary[i];
            this.createLoader(obj, manager);
        }
    }


    createLoader(obj, manager) {
        let {id, type, url} = obj;
        const typeLoader = this.loaderMap[type];
        const loader = new typeLoader(manager);
        loader.load(url, (result) => {
            this.resultMap[id] = {'type': type, 'result': result};
        });
    }

    loadProgress(loaded, total) {
        this.eventDispatcher.dispatchEvent({type: "loadProgress", loaded: loaded, total: total});
    }

    loadComplete() {
        this.eventDispatcher.dispatchEvent({type: "loadComplete", resultMap: this.resultMap});
    }
}

export default ThreeGroupLoader;
