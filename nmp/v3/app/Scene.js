import $ from 'jquery';
import * as THREE from 'three';
import OrbitControls from './Orbit';

class Scene {
  constructor() {
    var mainEl = document.getElementsByTagName('main')[0],
        width = $(mainEl).width(),
        height = $(mainEl).height(),
        aspect = width/height,
        D = 1;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas: document.getElementById('stage')
    });
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-D*aspect, D*aspect, D, -D, 1, 1000),
    this.camera.zoom = 0.05;

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(this.scene.position);
    this.camera.updateProjectionMatrix();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI/2 - 0.1;
    this.controls.maxZoom = 0.2;
    this.controls.minZoom = 0.02;

    window.addEventListener('resize', () => {
      var width = mainEl.clientWidth,
          height = mainEl.clientHeight;
      this.camera.aspect = width/height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }, false);

    var pointLight = new THREE.PointLight(0xffffff, 0.3, 50);
    pointLight.position.set(0, 20, 0);
    this.scene.add(pointLight);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}

export default Scene;
