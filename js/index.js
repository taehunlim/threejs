import * as THREE from "/js/three/three.module.js";

const VIEW_ANGLE = 75; // 카메라 시야각. 커질 수록 시야각이 넓어짐. 단위는 degree
const ASPECT = window.innerWidth / window.innerHeight; //시야의 가로세로비
const NEAR = 0.1; // 렌더링 할 물체 거리의 하한값. 너무 가까이 있는 물체를 그리는 것을 막기 위해 사용. 카메라로부터의 거리가 이 값보다 작은 물체는 화면에 그리지 않음. 0보다 크고 FAR 보다 작은 값을 가질 수 있다.
const FAR = 1000; // 렌더링 할 물체 거리의 상한값. 너무 멀리 있는 물체를 그리는 것을 막기위해 사용. 카메라로부터의 거리가 이 값보다 큰 물체는 화면에 그리지 않는다.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 뼈대
const geometry = new THREE.OctahedronGeometry();
// 특정한 질감, 색, 반사율 등을 갖는 물체의 표면
const material = new THREE.MeshLambertMaterial({ color: 0xff3030 });

// Mesh = Geometry 에 material 이 입혀진 오브젝트 = 물체
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 100;
pointLight.position.y = 100;
pointLight.position.z = 30;

scene.add(pointLight);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  const speed = Math.random() / 20;
  mesh.rotation.x += speed;
  mesh.rotation.y += speed;
  mesh.rotation.z += speed;

  renderer.render(scene, camera);
}

animate();
