import * as THREE from "/js/three/three.module.js";
import { GLTFLoader } from "/js/three/GLTFLoader.js";
import { OrbitControls } from "/js/three/OrbitControls.js";

const VIEW_ANGLE = 75;
const ASPECT = window.innerWidth / window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xffff00, 10);
scene.add(light);
scene.background = new THREE.Color("white");

camera.position.set(0, 0, 5);
renderer.setSize(window.innerWidth, window.innerHeight);
controls.update();

const loader = new GLTFLoader();
loader.load("/assets/images/3d/car/scene.gltf", (gltf) => {
  scene.add(gltf.scene);
  renderer.render(scene, camera);

  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
  }

  animate();
});
