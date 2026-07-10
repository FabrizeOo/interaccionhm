import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

/**
 * CONTROLS MANAGER
 * Sets up and manages PointerLockControls (for FPS) and OrbitControls (for cinematic views).
 */
class ControlsManager {
    constructor() {
        this.pointerLock = null;
        this.orbit = null;
        this.activeMode = 'orbit'; // 'orbit' or 'pointerlock'
        this.enabled = true;
    }

    /**
     * Initializes controls with camera and canvas element
     * @param {THREE.Camera} camera 
     * @param {HTMLCanvasElement} domElement 
     */
    init(camera, domElement) {
        this.domElement = domElement;

        // 1. Initialize PointerLockControls (First Person)
        this.pointerLock = new PointerLockControls(camera, document.body);

        // PointerLock events
        const controlsHint = document.getElementById('controls-hint');
        const crosshair = document.getElementById('crosshair');

        this.pointerLock.addEventListener('lock', () => {
            controlsHint.classList.add('hidden');
            crosshair.classList.remove('hidden');
            console.log('Pointer locked');
        });

        this.pointerLock.addEventListener('unlock', () => {
            if (this.activeMode === 'pointerlock') {
                controlsHint.classList.remove('hidden');
            }
            crosshair.classList.add('hidden');
            console.log('Pointer unlocked');
        });

        // 2. Initialize OrbitControls (Inspection / Welcome rotation)
        this.orbit = new OrbitControls(camera, domElement);
        this.orbit.enableDamping = true;
        this.orbit.dampingFactor = 0.05;
        this.orbit.maxPolarAngle = Math.PI / 2 - 0.05; // Don't clip through ground
        this.orbit.minDistance = 2;
        this.orbit.maxDistance = 20;

        // Start in orbit mode for welcome view
        this.setMode('orbit');
    }

    /**
     * Toggles between OrbitControls and PointerLockControls
     * @param {string} mode 'orbit' | 'pointerlock'
     */
    setMode(mode) {
        if (!this.enabled) return;
        this.activeMode = mode;

        const controlsHint = document.getElementById('controls-hint');
        const crosshair = document.getElementById('crosshair');

        if (mode === 'pointerlock') {
            // Disable Orbit
            this.orbit.enabled = false;
            
            // Show pointer lock overlay hint
            controlsHint.classList.remove('hidden');
            crosshair.classList.add('hidden'); // hidden until locked

            // Request pointer lock click listener on canvas container
            const container = this.domElement.parentElement;
            this.lockListener = () => {
                if (this.activeMode === 'pointerlock') {
                    this.pointerLock.lock();
                }
            };
            container.addEventListener('click', this.lockListener);
        } else {
            // Exit pointer lock if active
            this.pointerLock.unlock();
            
            // Remove click to lock listener
            const container = this.domElement.parentElement;
            if (this.lockListener) {
                container.removeEventListener('click', this.lockListener);
            }

            // Hide crosshairs/hints
            controlsHint.classList.add('hidden');
            crosshair.classList.add('hidden');

            // Enable Orbit
            this.orbit.enabled = true;
            
            // Focus orbit controls target to center classroom table
            this.orbit.target.set(0, 0.75, 0);
            this.orbit.update();
        }
        console.log(`Controls mode set to: ${mode}`);
    }

    /**
     * Lock PointerLock controls directly
     */
    lock() {
        if (this.pointerLock && this.activeMode === 'pointerlock') {
            this.pointerLock.lock();
        }
    }

    /**
     * Unlock PointerLock controls directly
     */
    unlock() {
        if (this.pointerLock) {
            this.pointerLock.unlock();
        }
    }

    /**
     * Updates controls during render loop
     */
    update() {
        if (!this.enabled) return;
        
        if (this.activeMode === 'orbit') {
            this.orbit.update();
        }
    }

    disableAll() {
        this.enabled = false;
        this.orbit.enabled = false;
        this.pointerLock.unlock();
        
        // Hide hints
        document.getElementById('controls-hint').classList.add('hidden');
        document.getElementById('crosshair').classList.add('hidden');
    }

    enableAll() {
        this.enabled = true;
        this.setMode(this.activeMode);
    }
}

export const controlsManager = new ControlsManager();
export default controlsManager;
