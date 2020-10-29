declare module 'consts:workerUrl' {
  const url: string;
  export default url;
}

declare module 'https://threejs.org/examples/jsm/*' {
  const BoxLineGeometry: any;
  const VRButton: any;
  const XRControllerModelFactory: any;
  export { BoxLineGeometry, VRButton, XRControllerModelFactory };
}
