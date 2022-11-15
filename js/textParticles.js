import * as THREE from "/js/three/three.module.js";
import { OrbitControls } from "/js/three/OrbitControls.js";
import { FontLoader } from "/js/three/FontLoader.js";
import { TextGeometry } from "/js/three/TextGeometry.js";

let renderer, scene, camera, mesh, geometry, material, particles, particleBgs;
let font;
let geometries = [];
let labelId;

let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let currentTarget;

const texts = [
  { id: 0, label: "html", url: "https://www.naver.com/" },
  { id: 1, label: "css3", url: "https://www.naver.com/" },
  { id: 3, label: "sass", url: "https://www.naver.com/" },
  { id: 4, label: "javascript", url: "https://www.naver.com/" },
  { id: 5, label: "react", url: "https://www.naver.com/" },
  { id: 6, label: "git", url: "https://www.naver.com/" },
  { id: 7, label: "github", url: "https://www.naver.com/" },
  { id: 8, label: "restful apis", url: "https://www.naver.com/" },
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
  document.addEventListener("click", onMouseClick, false);
  document.addEventListener("mousemove", handlePointer, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function drawParticles() {
  particles = new THREE.Group();
  particleBgs = new THREE.Group();

  material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });

  const textLength = texts.length;
  const repeat = 1;
  for (let i = 0, j = textLength * repeat; i < j; i++) {
    if (i < textLength) {
      const geometry = new TextGeometry(texts[i].label, {
        font: font,
        size: 10,
        height: 0,
        curveSegments: 10, // 하나의 커브를 구성하는 정점의 개수 (기본 값 12) = 값이 높을 수록 완벽한 곡선
      });

      geometry.computeBoundingBox();
      geometry.url = texts[i].url;
      geometry.textId = texts[i].id;

      labelId = texts[i].id;

      geometries.push(geometry);
    }

    geometry = geometries[i % textLength];
    mesh = new THREE.Mesh(geometry, material);

    const textSize = mesh.geometry.boundingBox.max;
    const { x: textWidth } = textSize;

    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 1);
    mesh.position.x = mesh.position.x - textWidth / 2;

    mesh.labelId = labelId;

    particles.add(mesh);

    drawPlaneForText(mesh);
  }

  scene.add(particles);
  scene.add(particleBgs);
}

function drawPlaneForText(textMesh) {
  const { x, y } = textMesh.geometry.boundingBox.max;

  const geometry = new THREE.PlaneGeometry(x, y);
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(
    textMesh.position.x,
    textMesh.position.y,
    textMesh.position.z
  );
  mesh.position.x = textMesh.position.x + x / 2;
  mesh.position.y = textMesh.position.y + y / 2;

  mesh.labelId = labelId;
  particleBgs.add(mesh);
}

function setLights() {
  const ambientLight = new THREE.AmbientLight(0x999999, 0.5);

  scene.add(ambientLight);
}

function onMouseClick(event) {
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(particles);
  if (intersects.length > 0) {
    const { object } = intersects[0];
    const { url } = object.geometry;

    window.open(url);
  }
}

function handlePointer(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  handleHoverEvent();
}

function handleHoverEvent() {
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(particleBgs);

  if (intersects.length > 0) {
    const { object } = intersects[0];

    const currentTextMesh = particles.children.filter(
      (r) => r.labelId === object.labelId
    )[0];

    currentTarget = currentTextMesh;
    currentTarget.scale.x = 1.5;
    currentTarget.scale.y = 1.5;
  } else {
    if (currentTarget) {
      currentTarget.scale.x = 1;
      currentTarget.scale.y = 1;
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  // meshs[0].rotation.x += 1;
  // particles.rotation.x += 0.0;
  // particles.rotation.y -= 0.004;

  renderer.clear();

  renderer.render(scene, camera);
}
