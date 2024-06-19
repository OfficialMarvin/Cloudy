import { loadRuntime } from '@wonderlandengine/api';
import { ButtonComponent } from './button.js';

/* wle:auto-imports:start */
import { Cursor, CursorTarget, FingerCursor, HandTracking, HowlerAudioListener, ImageTexture, MouseLookComponent, PlayerHeight, TeleportComponent, VrModeActiveSwitch } from '@wonderlandengine/components';
/* wle:auto-imports:end */

// Constants and Runtime Options
const Constants = {
    ProjectName: 'MyWonderland1',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local'],
    WebXROptionalFeatures: ['local-floor', 'hand-tracking', 'hit-test'],
};

const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    xrOfferSession: {
        mode: 'auto',
        features: Constants.WebXRRequiredFeatures,
        optionalFeatures: Constants.WebXROptionalFeatures,
    },
    canvas: 'canvas',
};

// Load and initialize the Wonderland Engine runtime
const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
engine.onLoadingScreenEnd.once(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);
});

// Register components and load main scene
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(FingerCursor);
engine.registerComponent(HandTracking);
engine.registerComponent(HowlerAudioListener);
engine.registerComponent(ImageTexture);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(PlayerHeight);
engine.registerComponent(TeleportComponent);
engine.registerComponent(VrModeActiveSwitch);
engine.registerComponent(ButtonComponent);

try {
    await engine.loadMainScene(`${Constants.ProjectName}.bin`);
} catch (e) {
    console.error(e);
    window.alert(`Failed to load ${Constants.ProjectName}.bin:`, e);
}

// Setup interaction buttons for AR and VR
function setupButtonsXR() {
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.dataset.supported = engine.arSupported;
        arButton.addEventListener('click', () => requestSession('immersive-ar'));
    }
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.dataset.supported = engine.vrSupported;
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupButtonsXR);
} else {
    setupButtonsXR();
}
