import * as THREE from 'three';

/**
 * THREE.JS WEBGL SCENE CONTROLLER
 * Initializes scene, renderer, shadow systems, WebXR bindings, and the core render loop.
 */
class SceneManager {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.canvas = null;
        
        // Loop update queue
        this.updatables = [];
        this.clock = new THREE.Clock();
    }

    /**
     * Initializes the WebGL context
     * @param {HTMLDivElement} container Element to append the canvas
     */
    init(container) {
        // 1. Create Scene & Fog for depth
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a192f); // Dark slate blue background
        this.scene.fog = new THREE.FogExp2(0x0a192f, 0.018);

        // 2. Create WebGL Renderer – performance-first settings
        const isLowEnd = navigator.hardwareConcurrency <= 4 || window.devicePixelRatio > 2;
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: !isLowEnd,   // Skip AA on low-end / high-DPI screens
            alpha: false,
            powerPreference: "high-performance",
            precision: 'mediump'    // mediump is faster, visually identical here
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Cap pixel ratio – anything above 1.5 is imperceptible but doubles fill cost
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        
        // Use BasicShadowMap – much cheaper than PCFSoft, still good-looking
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        
        // Lighter tone mapping (less GPU math per pixel)
        this.renderer.toneMapping = THREE.LinearToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        // Append to DOM
        this.canvas = this.renderer.domElement;
        container.appendChild(this.canvas);

        // Pause rendering when browser tab is hidden to save GPU
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this._paused = true;
            else { this._paused = false; this.clock.getDelta(); }
        });

        // Bind window resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    /**
     * Window resizing hook
     */
    onWindowResize() {
        if (!this.renderer) return;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }

    /**
     * Registers an object's update function to the render loop
     * @param {object} object Object with an update(delta) function
     */
    addToUpdateList(object) {
        if (typeof object.update === 'function') {
            this.updatables.push(object);
        }
    }

    clearUpdateList() {
        this.updatables = [];
    }

    /**
     * Starts the rendering loop
     * Uses renderer.setAnimationLoop instead of requestAnimationFrame for WebXR compatibility
     */
    start(camera) {
        this.clock.getDelta();
        this._paused = false;
        
        this.renderer.setAnimationLoop(() => {
            if (this._paused) return;
            const delta = Math.min(this.clock.getDelta(), 0.05); // clamp spike frames

            for (const updatable of this.updatables) {
                updatable.update(delta, camera);
            }

            this.renderer.render(this.scene, camera);
        });
        
        console.log('WebGL Animation loop started');
    }

    /** Pause WebGL render (e.g. while voting modal is open) */
    pauseRender() { this._paused = true; }

    /** Resume WebGL render */
    resumeRender() { this._paused = false; this.clock.getDelta(); }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    getRenderer() {
        return this.renderer;
    }

    getScene() {
        return this.scene;
    }
}

export const sceneManager = new SceneManager();
export default sceneManager;
