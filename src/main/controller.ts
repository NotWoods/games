import * as THREE from 'three';
import { XRControllerModelFactory } from 'https://threejs.org/examples/jsm/webxr/XRControllerModelFactory.js';

// The XRControllerModelFactory will automatically fetch controller models
// that match what the user is holding as closely as possible. The models
// should be attached to the object returned from getControllerGrip in
// order to match the orientation of the held device.

const controllerModelFactory = new XRControllerModelFactory();

function buildController(data: { targetRayMode: 'tracked-pointer' | 'gaze' }) {
  let geometry, material;

  switch (data.targetRayMode) {
    /**
     * tracked-pointer indicates that the target ray originates from either a
     * handheld device or other hand-tracking mechanism and represents that the
     * user is using their hands or the held device for pointing.
     * The orientation of the target ray relative to the tracked object MUST
     * follow platform-specific ergonomics guidelines when available. In the
     * absence of platform-specific guidance, the target ray SHOULD point in
     * the same direction as the user’s index finger if it was outstretched.
     */
    case 'tracked-pointer':
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
      );
      geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
      );

      material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });

      return new THREE.Line(geometry, material);

    /**
     * gaze indicates the target ray will originate at the viewer and follow
     * the direction it is facing. (This is commonly referred to as a "gaze
     * input" device in the context of head-mounted displays.)
     */
    case 'gaze':
      geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(
        0,
        0,
        -1
      );
      material = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        transparent: true,
      });
      return new THREE.Mesh(geometry, material);
  }
}

interface Controller extends THREE.Group {
  userData: {
    isSelecting: boolean;
  };
}

export class ControllerManager {
  readonly controller: Controller;
  readonly grip: THREE.Group;

  isSelecting = false;

  constructor(xrManager: THREE.WebXRManager, id: number) {
    this.controller = xrManager.getController(id) as Controller;
    this.controller.addEventListener('selectstart', this.onSelectStart);
    this.controller.addEventListener('selectend', this.onSelectEnd);
    this.controller.addEventListener('connected', function (
      this: THREE.Group,
      event
    ) {
      this.add(buildController(event.data));
    });
    this.controller.addEventListener('disconnected', function (
      this: THREE.Group
    ) {
      this.remove(this.children[0]);
    });

    this.grip = xrManager.getControllerGrip(id);
    this.grip.add(controllerModelFactory.createControllerModel(this.grip));
  }

  onSelectStart = () => {
    this.isSelecting = true;
  }

  onSelectEnd = () => {
    this.isSelecting = false;
  }

  render() {
    const line = this.controller.children[0] as THREE.Line | THREE.Mesh | undefined;
    const lineMaterial = line?.material as THREE.LineBasicMaterial | THREE.MeshBasicMaterial | undefined;

    if (this.isSelecting) {
      lineMaterial?.color?.setHex(0x00ff00);
    } else {
      lineMaterial?.color?.setHex(0xff0000);
    }
  }
}
