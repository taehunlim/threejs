import * as THREE from "/js/three/three.module.js";

let renderer, scene, camera, particles;

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

  particles = new THREE.Group();
  scene.add(particles);

  let geometry = new THREE.IcosahedronGeometry(2, 1);

  let material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });
  material.flatShading = true;

  for (let i = 0; i < 1000; i++) {
    let mesh = new THREE.Mesh(geometry, material);

    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 700);

    particles.add(mesh);
  }

  let lights = [];
  lights.push(new THREE.DirectionalLight(0xffffff, 1));
  lights.push(new THREE.DirectionalLight(0x9796f0, 1));
  lights.push(new THREE.DirectionalLight(0xfbc7d4, 1));

  lights[0].position.set(1, 0, 0);
  lights[1].position.set(0.75, 1, 0.5);
  lights[2].position.set(-0.75, -1, 0.5);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  particles.rotation.x += 0.0;
  particles.rotation.y -= 0.004;
  renderer.clear();

  renderer.render(scene, camera);
}
