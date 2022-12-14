import * as THREE from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { GLTFLoader } from "three/addons/GLTFLoader.js";

let scene, renderer, camera;
let model, mixer, clock;

const crossFadeControls = [];
let currentBaseAction = "idle";

let allActions = [];
const baseActions = {
  idle: { weight: 1 },
  walk: { weight: 0 },
  run: { weight: 0 },
};

let panelSettings, numAnimations;

init();

function init() {
  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);

  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const loader = new GLTFLoader();
  loader.load("models/gltf/avatar/Xbot.gltf", function (gltf) {
    model = gltf.scene;
    scene.add(model);

    model.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    numAnimations = animations.length;

    for (let i = 0; i !== numAnimations; i++) {
      const clip = animations[i];

      const name = clip.name;

      const action = mixer.clipAction(clip);

      activateAction(action);

      if (baseActions[name]) {
        baseActions[name].action = action;
      }
      allActions.push(action);
    }

    animate();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(-1, 2, 3);

  createPanel();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.set(0, 1, 0);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function createPanel() {
  const panel = new GUI({ width: 310 });

  const baseActionFolder = panel.addFolder("Base Actions");
  const pauseFolder = panel.addFolder("pausing");
  const speedFolder = panel.addFolder("Speed");

  panelSettings = {
    "time scale": 1.0,
    "pause/continue": pauseContinue,
  };

  const baseNames = ["None", ...Object.keys(baseActions)];
  const baseNamesLength = baseNames.length;

  for (let i = 0; i !== baseNamesLength; ++i) {
    const name = baseNames[i];
    const settings = baseActions[name];

    panelSettings[name] = () => {
      const currentSettings = baseActions[currentBaseAction];
      const currentAction = currentSettings ? currentSettings.action : null;
      const action = settings ? settings.action : null;

      if (currentAction !== action) {
        prepareCrossFade(currentAction, action, 0.35);
      }
    };

    crossFadeControls.push(baseActionFolder.add(panelSettings, name));
  }

  pauseFolder.add(panelSettings, "pause/continue");

  speedFolder
    .add(panelSettings, "time scale", 0.0, 1.5, 0.01)
    .onChange(modifyTimeScale);

  crossFadeControls.forEach((control) => {
    control.setInactive = () => {
      control.domElement.classList.add("control-inactive");
    };

    control.setActive = () => {
      control.domElement.classList.remove("control-inactive");
    };

    const settings = baseActions[control.property];

    if (!settings || !settings.weight) {
      control.setInactive();
    }
  });
}

function activateAction(action) {
  const clip = action.getClip();
  const settings = baseActions[clip.name];

  if (settings) {
    setWeight(action, settings.weight);
    action.play();
  }
}

function pauseContinue() {
  allActions.forEach((action) => {
    if (action.paused) action.paused = false;
    else action.paused = true;
  });
}

function modifyTimeScale(speed) {
  mixer.timeScale = speed;
}

function prepareCrossFade(startAction, endAction, duration) {
  executeCrossFade(startAction, endAction, duration);

  if (endAction) {
    const clip = endAction.getClip();
    currentBaseAction = clip.name;
  } else {
    currentBaseAction = "None";
  }

  crossFadeControls.forEach((control) => {
    const name = control.property;
    if (name === currentBaseAction) control.setActive();
    else control.setInactive();
  });
}

function executeCrossFade(startAction, endAction, duration) {
  if (endAction) {
    setWeight(endAction, 1);
    endAction.time = 0;

    if (startAction) {
      return startAction.crossFadeTo(endAction, duration, true);
    }
    return endAction.fadeIn(duration);
  }

  startAction.fadeOut(duration);
}

function setWeight(action, weight) {
  action.enabled = true;
  action.setEffectiveTimeScale(1);
  action.setEffectiveWeight(weight);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i !== numAnimations; ++i) {
    const action = allActions[i];

    const clip = action.getClip();
    const settings = baseActions[clip.name];

    if (settings) {
      settings.weight = action.getEffectiveWeight();
    }
  }
  const mixerUpdateDelta = clock.getDelta();

  mixer.update(mixerUpdateDelta);

  renderer.render(scene, camera);
}
