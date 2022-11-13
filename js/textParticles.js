import * as THREE from "/js/three/three.module.js";
import { OrbitControls } from "/js/three/OrbitControls.js";
import { FontLoader } from "/js/three/FontLoader.js";
import { TextGeometry } from "/js/three/TextGeometry.js";

let renderer, scene, camera, geometry, material, particles;
let font;

const texts = [
  { label: "html" },
  { label: "css3" },
  { label: "sass" },
  { label: "javascript" },
  { label: "react" },
  { label: "git" },
  { label: "github" },
  { label: "restful apis" },
];

const fontLoader = new FontLoader();
const fontPath = "/js/three/fonts/";

fontLoader.load(fontPath + "gentilis_bold.typeface.json", (f) => {
  font = f;
  init();
  animate();
});

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

  material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });

  geometry = new TextGeometry("long text test", {
    font: font, // fontLoader를 통해 얻어온 폰트 객체
    size: 10, // mesh의 크기 (기본 값 100)
    height: 0, // 깊이(z) (기본 값 50)
    curveSegments: 10, // 하나의 커브를 구성하는 정점의 개수 (기본 값 12) = 값이 높을 수록 완벽한 곡선
  });
  geometry.computeBoundingBox();

  for (let i = 0; i < texts.length * 100; i++) {
    let mesh = new THREE.Mesh(geometry, material);
    const textWidth = mesh.geometry.boundingBox.max.x;

    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();

    mesh.position.multiplyScalar(90 + Math.random() * 1);
    mesh.position.x = mesh.position.x - textWidth / 2;

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

  // particles.rotation.x += 0.0;
  // particles.rotation.y -= 0.004;

  renderer.clear();

  renderer.render(scene, camera);
}
