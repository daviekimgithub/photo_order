/* eslint-disable */

const THREE = require('three');

const OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

const ModelLoader = new THREE.OBJLoader();

export default class ModelMaping {
  constructor(environment, materials, url, loadingElement) {
    this.primeryModel = {};
    this.environment = environment;
    this.scene = environment.scene;
    this.loadingElement = loadingElement;
    this.materials = materials;
    this.modelUrl = url;

    this.textureLoader = new THREE.TextureLoader();
    this.CubeTextureLoader = new THREE.CubeTextureLoader();

    this.loading = true;

    if (url) this.setModel(url);
  }
  setLoading(state) {
    this.loading = state;
    if (this.loadingElement) {
      state
        ? this.loadingElement.classList.add('canvasContainer-loading--active')
        : this.loadingElement.classList.remove(
            'canvasContainer-loading--active'
          );
    }
  }
  setModel(url) {
    const { scene } = this;
    // console.log(scene);
    if (this.primeryModel) {
      scene.remove(this.primeryModel);
    }
    this.loadModel(url).then((model) => {
      this.primeryModel = model;
      scene.add(model);
    });
  }
  loadModel(url) {
    const { materials } = this;
    return new Promise((resolve, reject) => {
      this.setLoading(true);
      ModelLoader.load(
        url,
        (object) => {
          object.children.material = [materials.test1, materials.test2];
          object.children[0].material = materials.white1;
          object.children[1].material = materials.white2;
          this.setLoading(false);
          resolve(object);
        },
        (xhr) => {
          // console.log((xhr.loaded / xhr.total) * 100 + '%');
          if (xhr.loaded / xhr.total == 1) this.setLoading(true);
        },
        (error) => {
          // console.log('An error happened');
          this.setLoading(false);
          reject();
        }
      );
    });
  }
  setTexture(url) {
    const { materials } = this;
    if (url) {
      materials.white1.map = this.loadTexture(url);
    } else {
      materials.white1.map = false;
    }
  }
  loadTexture(url) {
    this.setLoading(true);
    return this.textureLoader.load(
      url,
      (object) => {
        this.setLoading(false);
      },
      (object) => {
        this.setLoading(false);
      }
    );
  }
}
