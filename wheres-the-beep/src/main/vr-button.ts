import * as THREE from 'three';

declare global {
  interface Navigator {
    xr: XRSystem;
  }

  interface XRSystem {
    isSessionSupported(mode: THREE.XRSessionMode): Promise<boolean>;
    requestSession(
      mode: THREE.XRSessionMode,
      options: THREE.XRSessionInit
    ): Promise<THREE.XRSession>;
  }
}

export class VRButton {
  static createButton(
    renderer: THREE.WebGLRenderer
  ): HTMLButtonElement | HTMLAnchorElement {
    const button = document.createElement('button');
    button.className = 'vr-button vr-button--available vr-button--enter';

    function showEnterVR(/*device*/) {
      let currentSession: THREE.XRSession | null = null;

      function onSessionStarted(session: THREE.XRSession) {
        session.addEventListener('end', onSessionEnded);

        renderer.xr.setSession(session);
        button.textContent = 'EXIT VR';
        button.classList.remove('vr-button--enter');
        button.classList.add('vr-button--exit');

        currentSession = session;
      }

      function onSessionEnded(/*event*/) {
        currentSession!.removeEventListener('end', onSessionEnded);

        button.textContent = 'ENTER VR';
        button.classList.remove('vr-button--exit');
        button.classList.add('vr-button--enter');

        currentSession = null;
      }

      //

      button.hidden = false;

      button.textContent = 'ENTER VR';

      button.onclick = function () {
        if (currentSession === null) {
          // WebXR's requestReferenceSpace only works if the corresponding feature
          // was requested at session creation time. For simplicity, just ask for
          // the interesting ones as optional features, but be aware that the
          // requestReferenceSpace call will fail if it turns out to be unavailable.
          // ('local' is always available for immersive sessions and doesn't need to
          // be requested separately.)

          navigator.xr
            .requestSession('immersive-vr', {
              optionalFeatures: [
                'local-floor',
                'bounded-floor',
                'hand-tracking',
              ],
            })
            .then(onSessionStarted);
        } else {
          currentSession.end();
        }
      };
    }

    function disableButton() {
      button.hidden = false;

      button.disabled = true;

      button.onclick = null;
    }

    function showWebXRNotFound() {
      disableButton();

      button.textContent = 'VR NOT SUPPORTED';
    }

    if ('xr' in navigator) {
      button.id = 'VRButton';
      button.hidden = true;

      navigator.xr
        .isSessionSupported('immersive-vr')
        .then(function (supported) {
          supported ? showEnterVR() : showWebXRNotFound();
        });

      return button;
    } else {
      const message = document.createElement('a');
      message.className = 'vr-button vr-button--not-available';

      if (window.isSecureContext === false) {
        message.href = document.location.href.replace(/^http:/, 'https:');
        message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
      } else {
        message.href = 'https://immersiveweb.dev/';
        message.innerHTML = 'WEBXR NOT AVAILABLE';
      }

      return message;
    }
  }
}
