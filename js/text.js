import * as THREE from "/js/three/three.module.js";

import { TextGeometry } from "/js/three/TextGeometry.js";
import { FontLoader } from "/js/three/FontLoader.js";

const fontPath = "/js/three/fonts/";

let fontLoader = new FontLoader();
fontLoader.load(fontPath + "gentilis_bold.typeface.json", (font) => {
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
  const geometry = new TextGeometry("text", {
    font: font, // fontLoader를 통해 얻어온 폰트 객체
    size: 10, // mesh의 크기 (기본 값 100)
    height: 0, // 깊이(z) (기본 값 50)
    curveSegments: 1, // 하나의 커브를 구성하는 정점의 개수 (기본 값 12) = 값이 높을 수록 완벽한 곡선
    bevelEnabled: true, // 베벨링 처리 여부 (기본 값 false)
    bevelThickness: 0.5, // 베벨링 두께(z) (기본 값 10)
    bevelSize: 0.5, // shape의 외곽선으로부터 얼마나 멀리 베벨링할 것인지에 대한 거리값 (기본 값 8)
  });
  geometry.computeBoundingBox();

  // 특정한 질감, 색, 반사율 등을 갖는 물체의 표면
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });

  // Mesh = Geometry 에 material 이 입혀진 오브젝트 = 물체
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const centerOffset =
    -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  mesh.position.x = centerOffset;

  camera.position.z = 20;

  function animate() {
    requestAnimationFrame(animate);

    // const speed = Math.random() / 20;
    // mesh.rotation.x += speed;
    // mesh.rotation.y += speed;
    // mesh.rotation.z += speed;

    renderer.render(scene, camera);
  }

  animate();
});
