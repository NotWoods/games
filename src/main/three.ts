import * as THREE from 'three';

import { VRButton } from 'https://threejs.org/examples/jsm/webxr/VRButton.js';
import domeRadius from 'consts:radius';
import { ControllerManager } from './controller';
import { Sound } from './sound';
import { Sphere } from './sphere';
import { toThreeVector, WorkerThread } from './push-from-worker';
import { IndicatorCone } from './cone';
import { Dome } from './dome';
import { Score } from './score';

let camera: THREE.PerspectiveCamera;
let audioListener: THREE.AudioListener;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let controller1: ControllerManager, controller2: ControllerManager;
let beepMesh: Sphere, pointerResult: Sphere;
let raycaster: THREE.Raycaster;
let cone: IndicatorCone;
let bgm: HTMLAudioElement;
let dome: Dome;

let worker: WorkerThread;

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
  beepMesh = new Sphere(0.08, 0xffffff, true);
  beepMesh.mesh.add(beepSound.audio);
  beepMesh.addToGroup(scene);

  pointerResult = new Sphere(0.08, 0xf76a6f);

  const goodSound = new Sound(audioListener);
  goodSound.load('assets/audio/correct.wav');
  pointerResult.mesh.add(goodSound.audio);

  const badSound = new Sound(audioListener);
  badSound.load('assets/audio/incorrect.wav');
  pointerResult.mesh.add(badSound.audio);

  pointerResult.addToGroup(scene);

  const score = new Score();
  score.setScore('0')

  //

  worker = new WorkerThread(raycaster);
  worker.onMessage = (data) => {
    switch (data.type) {
      case 'play_audio': {
        const { audioPosition } = data;
        beepMesh.setPosition(toThreeVector(audioPosition));
        beepSound.play();

        cone.hide();
        beepMesh.visible = false;
        pointerResult.visible = false;
        break;
      }
      case 'display_result': {
        const { pointerPosition, line, goodGuess } = data;
        score.setScore(data.score.toString());
        if (pointerPosition) {
          pointerResult.setPosition(toThreeVector(pointerPosition));
          pointerResult.visible = true;
          beepMesh.visible = true;

          if (line) {
            cone.show(
              line.length,
              toThreeVector(pointerPosition),
              toThreeVector(line.end)
            );
          }

          pointerResult.outlineMaterial.color.setHex(
            goodGuess ? 0x6af797 : 0xf76a6f
          );
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
  floor.add(score.group);
  scene.add(floor);

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

  controller1.render();
  controller2.render();
  cone.render();
  dome.render();

  //

  renderer.render(scene, camera);
}
