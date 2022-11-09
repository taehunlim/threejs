import * as THREE from "/js/three/three.module.js";
import { OrbitControls } from "/js/three/OrbitControls.js";

let renderer, scene, camera, geometry, material, particles;

window.onload = function () {
  init();
  animate();
};

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;

  scene.add(camera);

  drawParticles();

  setLights();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  controls.maxDistance = 1000;
  controls.minDistance = 50;
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function drawParticles() {
  particles = new THREE.Group();

  geometry = new THREE.IcosahedronGeometry(2, 1);

  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 100; i++) {
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 100);

    particles.add(mesh);
  }
  scene.add(particles);
}

function setLights() {
  const ambientLight = new THREE.AmbientLight(0x999999, 0.5);

  scene.add(ambientLight);
}

function animate() {
  requestAnimationFrame(animate);

  particles.rotation.x += 0.0;
  particles.rotation.y -= 0.004;

  renderer.clear();

  renderer.render(scene, camera);
}
