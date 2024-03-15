const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');

export default class Environment {
  constructor(place, canvas, parameters) {
    const container = place;
    this.scene = new THREE.Scene();

    // console.log(container);
    this.parameters = parameters;
    this.canvas = canvas;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.container = container;
    this.createRenderer();
    this.createCamera();
    this.createOrbit();
    this.createLights();
    window.addEventListener('resize', () => this.windowResize(), false);
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer = renderer;
  }

  setCameraSettings() {
    const { camera, width, height, parameters, renderer } = this;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    camera.aspect = width / height;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const fullWidth = width * 2;
    const fullHeight = height * 1;

    camera.setViewOffset(
      fullWidth,
      fullHeight,
      width * (width >= 900 ? parameters.center : 0.5),
      height * 0,
      width,
      height
    );

    camera.updateProjectionMatrix();
  }

  createCamera() {
    const { scene, width, height, parameters } = this;

    const camera = new THREE.PerspectiveCamera(26, width / height, 1, 3500);
    camera.position.set(3, 2, -2);

    scene.fog = new THREE.Fog(0xffffff, 1300, 1500);

    this.scene.add(camera);
    this.camera = camera;

    this.setCameraSettings();
  }

  windowResize() {
    // console.log('windowResize', this);

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    const { camera, width, height, parameters } = this;

    this.setCameraSettings();
  }

  createLights() {
    const { scene, parameters } = this;
    const light = new THREE.DirectionalLight(0xffffff, 0.4);

    const theta = Math.PI * (0.26 - 0.5);
    const phi = 2 * Math.PI * (0.205 - 0.5);
    light.position.x = -parameters.distance * Math.cos(phi * 2);
    // light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);
    this.light = light;
    scene.add(light);

    const lightAmbient = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
    scene.add(lightAmbient);
    this.lightAmbient = lightAmbient;

    const lightBack = new THREE.PointLight(0xffffff, 0.45);
    lightBack.position.x = parameters.distance * Math.cos(phi * 2);
    lightBack.position.y =
      (parameters.distance * Math.sin(phi) * Math.sin(theta)) / 2;
    lightBack.position.z =
      -parameters.distance * Math.sin(phi) * Math.cos(theta);
    this.lightBack = lightBack;
    scene.add(lightBack);
  }

  createOrbit() {
    const controlsEl = this.container;
    const controls = new OrbitControls(this.camera, controlsEl);
    window.controls = controls;

    controlsEl.addEventListener('focus', () => {
      // console.log('controls: ', controls);
      this.controls.enableKeys = true;
      this.controls.autoRotate = false;
      this.controls.enableZoom = true;
    });
    controlsEl.addEventListener('blur', () => {
      // console.log('controls: ', controls);
      this.controls.enableKeys = false;
      this.controls.enableZoom = false;
      this.controls.autoRotate = this.parameters.rotate;
    });
    controls.maxPolarAngle = Math.PI * 0.8;
    controls.minPolarAngle = Math.PI * 0.1;
    controls.enableKeys = false;
    controls.enableZoom = false;
    controls.target.set(0, this.parameters.hpoint, 0);
    controls.minDistance = 1.0;
    controls.maxDistance = 300.0;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.screenSpacePanning = true;
    controls.rotateSpeed = 0.5;
    controls.panSpeed = 1;
    controls.autoRotate = this.parameters.rotate;
    // controls.autoRotateSpeed = 0.05;
    controls.autoRotateSpeed = 0.8;

    this.controls = controls;
    this.controlsEl = controlsEl;
  }

  render() {
    // console.log("lol")

    const { renderer, scene, camera, controls } = this;
    const cameraDist = this.camera.position.distanceTo(controls.target) + 20;
    scene.fog = new THREE.Fog(0xffffff, cameraDist, cameraDist * 2.8);
    controls.update();
    renderer.render(scene, camera);

    // requestAnimationFrame(() => this.render());
  }
}
