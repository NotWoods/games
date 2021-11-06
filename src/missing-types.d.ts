declare module 'consts:workerUrl' {
  const url: string;
  export default url;
}

declare module 'https://threejs.org/examples/jsm/geometries/TextGeometry.js' {
  import * as THREE from 'three';
  import { Font } from 'https://threejs.org/examples/jsm/loaders/FontLoader.js';

  export interface TextGeometryOptions extends THREE.ExtrudeGeometryOptions {
    font: Font;
    size?: number;
    height?: number;
  }

  export class TextGeometry extends THREE.ExtrudeGeometry {
    constructor(text: string, parameters?: TextGeometryOptions);
  }
}

declare module 'https://threejs.org/examples/jsm/loaders/FontLoader.js' {
  import * as THREE from 'three';

  export class Font {
    constructor(data: unknown);
    generateShapes(text: string, size?: number);
  }

  export class FontLoader extends THREE.Loader {
    parse(json: unknown): Font;
  }
}

declare module 'https://threejs.org/examples/jsm/webxr/VRButton.js' {
  export class VRButton {
    static createButton(renderer: THREE.Renderer): HTMLButtonElement;
  }
}

declare module 'https://threejs.org/examples/jsm/webxr/XRControllerModelFactory.js' {
  import * as THREE from 'three';

  export class XRControllerModel extends THREE.Object3D {}

  export class XRControllerModelFactory {
    constructor(gltfLoader?: unknown | null);

    createControllerModel(controller): XRControllerModel;
  }
}
