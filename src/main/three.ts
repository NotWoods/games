import * as THREE from 'three';

import { VRButton } from 'https://threejs.org/examples/jsm/webxr/VRButton.js';
import domeRadius from 'consts:radius';
import { ControllerManager } from './controller';
import { Sound, Sphere } from './sound';
import { toThreeVector, WorkerThread } from './push-from-worker';
import { IndicatorCone } from './cone';
import { Dome } from './dome';

let camera: THREE.PerspectiveCamera;
let audioListener: THREE.AudioListener;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let controller1: ControllerManager, controller2: ControllerManager;
let beepMesh: Sphere, pointerResult: Sphere;
let raycaster: THREE.Raycaster;
let cone: IndicatorCone;
let bgm: HTMLAudioElement;
let dome: Dome

let room: THREE.Object3D;

let worker: WorkerThread;

const radius = 0.08;
let normal = new THREE.Vector3();
const relativeVelocity = new THREE.Vector3();

const clock = new THREE.Clock();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    7
  );
  camera.position.set(0, 1.6, 3);

  audioListener = new THREE.AudioListener();
  camera.add(audioListener);

  raycaster = new THREE.Raycaster();
  raycaster.camera = camera;

  dome = new Dome(domeRadius);
  scene.add(dome.obj);

  cone = new IndicatorCone();
  scene.add(cone.obj);

  const beepSound = new Sound(audioListener);
  beepSound.load('assets/audio/echo.wav');
  beepMesh = new Sphere(0.08);
  beepMesh.mesh.add(beepSound.audio);

  const beepOutline = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.08, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide })
  );
  beepOutline.scale.multiplyScalar(1.1);
  beepOutline.visible = false;
  scene.add(beepOutline);
  scene.add(beepMesh.mesh);

  const pointerResultRadius = 0.08;
  pointerResult = new Sphere(pointerResultRadius);

  const goodSound = new Sound(audioListener);
  goodSound.load('assets/audio/correct.wav');
  pointerResult.mesh.add(goodSound.audio);

  const badSound = new Sound(audioListener);
  badSound.load('assets/audio/incorrect.wav');
  pointerResult.mesh.add(badSound.audio);

  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xf76a6f,
    side: THREE.BackSide,
  });
  const pointerResultOutline = new THREE.Mesh(
    new THREE.SphereBufferGeometry(pointerResultRadius, 12, 10),
    outlineMaterial
  );
  pointerResultOutline.scale.multiplyScalar(1.1);
  pointerResultOutline.visible = false;
  scene.add(pointerResultOutline);
  scene.add(pointerResult.mesh);

  worker = new WorkerThread(raycaster);
  worker.onMessage = (data) => {
    switch (data.type) {
      case 'play_audio': {
        const { audioPosition } = data;
        beepMesh.mesh.position.copy(toThreeVector(audioPosition));
        beepOutline.position.copy(beepMesh.mesh.position);
        beepSound.play();

        cone.hide();
        beepMesh.visible = false;
        beepOutline.visible = false;
        pointerResultOutline.visible = false;
        pointerResult.visible = false;
        break;
      }
      case 'display_result': {
        const { pointerPosition, line, goodGuess } = data;
        if (pointerPosition) {
          pointerResult.mesh.position.copy(toThreeVector(pointerPosition));
          pointerResultOutline.position.copy(pointerResult.mesh.position);
          pointerResultOutline.visible = true;
          pointerResult.visible = true;
          beepMesh.visible = true;
          beepOutline.visible = true;

          if (line) {
            cone.show(
              line.length,
              toThreeVector(pointerPosition),
              toThreeVector(line.end)
            );
          }

          outlineMaterial.color.setHex(goodGuess ? 0x6af797 : 0xf76a6f);
        }

        if (goodGuess) {
          goodSound.play();
        } else {
          badSound.play();
        }
        dome.fade();
        break;
      }
    }
  };

  bgm = document.getElementById('bgm') as HTMLAudioElement;
  const bgmPanner = new THREE.PositionalAudio(audioListener);
  bgmPanner.setMediaElementSource(bgm);

  const circle = new THREE.CircleBufferGeometry(domeRadius, 20);
  const floor = new THREE.Mesh(
    circle,
    new THREE.MeshLambertMaterial({
      color: 0x000000,
    })
  );
  floor.geometry.rotateX(-Math.PI / 2);
  floor.add(bgmPanner);
  scene.add(floor);

  let roomBox = new THREE.Group();
  scene.add(roomBox);
  room = roomBox;

  scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  //

  document.body.appendChild(VRButton.createButton(renderer));

  // controllers

  controller1 = new ControllerManager(renderer.xr, 0);
  scene.add(controller1.controller);

  controller2 = new ControllerManager(renderer.xr, 1);
  scene.add(controller2.controller);

  scene.add(controller1.grip);
  scene.add(controller2.grip);

  function onSelect(this: ControllerManager) {
    worker.sendPlayerClick(this, [dome.obj, floor]);
  }
  controller1.onselect = onSelect;
  controller2.onselect = onSelect;

  //

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  renderer.setAnimationLoop(render);
}

let xrSessionStarted = false;
function render() {
  const delta = clock.getDelta(); // slow down simulation
  cone.mixer.update(delta);
  dome.mixer.update(delta);

  const xrSession = renderer.xr.getSession() != null;
  if (xrSession !== xrSessionStarted) {
    xrSessionStarted = xrSession;
    if (xrSession) {
      bgm.play();
      worker.start();
    } else {
      bgm.pause();
    }
  }

  const debug = controller1.isSqueezing || controller2.isSqueezing;
  beepMesh.debug = debug;

  beepMesh.render();
  pointerResult.render();

  controller1.render();
  controller2.render();
  cone.render();
  dome.render();

  //

  const range = 3 - radius;

  for (let i = 0; i < room.children.length; i++) {
    const object = room.children[i];

    object.position.x += object.userData.velocity.x * delta;
    object.position.y += object.userData.velocity.y * delta;
    object.position.z += object.userData.velocity.z * delta;

    // keep objects inside room

    if (object.position.x < -range || object.position.x > range) {
      object.position.x = THREE.MathUtils.clamp(
        object.position.x,
        -range,
        range
      );
      object.userData.velocity.x = -object.userData.velocity.x;
    }

    if (object.position.y < radius || object.position.y > 6) {
      object.position.y = Math.max(object.position.y, radius);

      object.userData.velocity.x *= 0.98;
      object.userData.velocity.y = -object.userData.velocity.y * 0.8;
      object.userData.velocity.z *= 0.98;
    }

    if (object.position.z < -range || object.position.z > range) {
      object.position.z = THREE.MathUtils.clamp(
        object.position.z,
        -range,
        range
      );
      object.userData.velocity.z = -object.userData.velocity.z;
    }

    for (let j = i + 1; j < room.children.length; j++) {
      const object2 = room.children[j];

      normal.copy(object.position).sub(object2.position);

      const distance = normal.length();

      if (distance < 2 * radius) {
        normal.multiplyScalar(0.5 * distance - radius);

        object.position.sub(normal);
        object2.position.add(normal);

        normal.normalize();

        relativeVelocity
          .copy(object.userData.velocity)
          .sub(object2.userData.velocity);

        normal = normal.multiplyScalar(relativeVelocity.dot(normal));

        object.userData.velocity.sub(normal);
        object2.userData.velocity.add(normal);
      }
    }

    object.userData.velocity.y -= 9.8 * delta;
  }

  renderer.render(scene, camera);
}
