import * as THREE from 'three';

/**
 * CAMERA MANAGER
 * Handles initialization, resizing, and animations of the perspective camera.
 */
class CameraManager {
    constructor() {
        this.camera = null;
        this.aspect = window.innerWidth / window.innerHeight;
        this.init();
    }

    init() {
        // Field of View, Aspect Ratio, Near plane, Far plane
        this.camera = new THREE.PerspectiveCamera(60, this.aspect, 0.1, 100);
        
        // Initial welcome view positioning (Looking down at the school entrance)
        this.camera.position.set(0, 5, 12);
        this.camera.lookAt(0, 1.5, 0);

        // Bind resize listener
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    /**
     * Updates camera aspect ratio on window resize
     */
    onWindowResize() {
        if (!this.camera) return;
        this.aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Resets camera to standard first person initial position
     */
    setToFirstPerson(playerHeight = 1.65) {
        this.camera.position.set(0, playerHeight, 14); // School yard entrance
        this.camera.rotation.set(0, 0, 0);
    }

    /**
     * Returns the camera instance
     */
    get() {
        return this.camera;
    }
}

export const cameraManager = new CameraManager();
export default cameraManager;
