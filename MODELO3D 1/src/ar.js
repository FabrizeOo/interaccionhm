import * as THREE from 'three';

/**
 * AUGMENTED REALITY (AR) MANAGER
 * Handles WebXR AR device compatibility, hit-testing, and native mobile AR intents.
 */
class ARManager {
    constructor() {
        this.xrSession = null;
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;
        
        // Android/iOS native viewer links template helper
        // Since Scene Viewer requires absolute URLs, we detect the host
        this.baseUrl = window.location.origin + window.location.pathname;
    }

    /**
     * Checks if WebXR AR is supported in the current browser/device
     * @returns {Promise<boolean>}
     */
    async isARSupported() {
        if ('xr' in navigator) {
            try {
                return await navigator.xr.isSessionSupported('immersive-ar');
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    /**
     * Generates a Google Scene Viewer AR intent link for Android devices.
     * Allows launching native Android AR without loading the full WebGL website.
     * @param {string} modelPath Relative path to .glb file
     * @param {string} title Description shown in AR
     */
    getAndroidIntent(modelPath, title = "Organismo Electoral - 3D") {
        // Clean model path
        const absoluteModelUrl = new URL(modelPath, window.location.href).href;
        
        // Google Scene Viewer intent format
        const intent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(absoluteModelUrl)}&title=${encodeURIComponent(title)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
        return intent;
    }

    /**
     * Launches native mobile AR viewer depending on platform
     * @param {string} modelName 'cedula' | 'anfora' | 'cabina'
     */
    launchMobileAR(modelName) {
        const modelPaths = {
            cedula: './models/cedula.glb',
            anfora: './models/anfora.glb',
            cabina: './models/cabina.glb'
        };

        const path = modelPaths[modelName];
        const ua = navigator.userAgent.toLowerCase();
        
        if (ua.includes('android')) {
            // Launch Android Scene Viewer
            const intent = this.getAndroidIntent(path, `Simulador Electoral: ${modelName.toUpperCase()}`);
            window.location.href = intent;
        } else if (ua.includes('iphone') || ua.includes('ipad')) {
            // iOS Quick Look requires USDZ files.
            // Model Viewer does auto-conversion or works via WebXR, so we open the AR modal.
            const modalBtn = document.getElementById('btn-hud-ar');
            if (modalBtn) modalBtn.click();
        } else {
            // Desktop: Open the AR Modal with QR code for scanning
            const modalBtn = document.getElementById('btn-hud-ar');
            if (modalBtn) modalBtn.click();
        }
    }

    /**
     * Configures the Three.js scene for a WebXR AR Session
     * @param {THREE.WebGLRenderer} renderer 
     * @param {THREE.Scene} scene 
     * @param {THREE.Camera} camera 
     */
    async startWebXRSession(renderer, scene, camera) {
        if (!navigator.xr) return;

        const sessionInit = { requiredFeatures: ['hit-test'] };
        this.xrSession = await navigator.xr.requestSession('immersive-ar', sessionInit);
        
        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType('local');
        await renderer.xr.setSession(this.xrSession);

        // Hide regular 2D overlays during AR
        document.body.classList.add('xr-active');

        // Reset scene positioning to zero for AR anchor
        scene.position.set(0, 0, 0);

        this.xrSession.addEventListener('end', () => {
            this.xrSession = null;
            this.hitTestSource = null;
            this.hitTestSourceRequested = false;
            renderer.xr.enabled = false;
            document.body.classList.remove('xr-active');
            console.log("AR Session Ended");
        });
        
        console.log("AR Session Started");
    }
}

export const arManager = new ARManager();
export default arManager;
