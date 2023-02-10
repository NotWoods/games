import * as THREE from 'three';
import { domeRadius } from '../consts';
import { IndicatorCone } from './cone';
import { ControllerManager } from './controller';
import { Dome } from './dome';
import { WorkerThread } from './push-from-worker';
import { Score } from './score';
import { Sound } from './sound';
import { Sphere } from './sphere';
import { Timer } from './timer';
import { VRButton } from './vr-button';

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
let timer: Timer;

let worker: WorkerThread;

const clock = new THREE.Clock();
const mixers: THREE.AnimationMixer[] = [];

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
  mixers.push(cone.mixer);

  const beepSound = new Sound(audioListener);
  beepSound.load('./audio/echo.wav');
  beepMesh = new Sphere(0.08, 0xffffff, true);
  beepMesh.mesh.add(beepSound.audio);
  beepMesh.addToGroup(scene);
  cone.endpoints.push(beepMesh.material, beepMesh.outlineMaterial);

  pointerResult = new Sphere(0.08, 0xf76a6f);

  const goodSound = new Sound(audioListener);
  goodSound.load('./audio/correct.wav');
  pointerResult.mesh.add(goodSound.audio);

  const badSound = new Sound(audioListener);
  badSound.load('./audio/incorrect.wav');
  pointerResult.mesh.add(badSound.audio);

  pointerResult.addToGroup(scene);

  const score = new Score();
  score.setScore('0');
  timer = new Timer(domeRadius);
  scene.add(timer.line);

  //

  const fadeOutKF = new THREE.NumberKeyframeTrack(
    '.material.opacity',
    [0, 5],
    [1, 0]
  );

  const domeMixer = new THREE.AnimationMixer(dome.obj);
  mixers.push(domeMixer);
  const fadeOutAction = domeMixer.clipAction(
    new THREE.AnimationClip('FadeOutDome', 5, [fadeOutKF])
  );
  fadeOutAction.clampWhenFinished = true;
  fadeOutAction.loop = THREE.LoopOnce;
  domeMixer.addEventListener('finished', () => {
    dome.obj.visible = false;
  });

  const url = new URL(location.toString());
  if (url.searchParams.has('demo')) {
    domeMixer.timeScale = 0;
  }

  //

  worker = new WorkerThread(raycaster);
  worker.onPlayAudio = ({ audioPosition, maxTime }) => {
    beepMesh.setPosition(audioPosition);
    beepSound.play();

    cone.hide();
    beepMesh.visible = false;
    pointerResult.visible = false;
    timer.reset(maxTime);
  };
  worker.onDisplayResult = (data) => {
    const { pointerPosition, line, goodGuess } = data;
    score.setScore(data.score.toString());
    timer.paused = true;
    if (pointerPosition) {
      pointerResult.setPosition(pointerPosition);
      pointerResult.visible = true;
      beepMesh.visible = true;

      if (line) {
        cone.show(line.length, pointerPosition, line.end);
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
    fadeOutAction.play();
  };
  timer.addEventListener('out_of_time', () => {
    worker.sendOutOfTime();
  });

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
  for (const mixer of mixers) {
    mixer.update(delta);
  }
  timer.update(delta);

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

  //

  renderer.render(scene, camera);
}
