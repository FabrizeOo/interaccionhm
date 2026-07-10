import * as THREE from 'three';

/**
 * LIGHTS MANAGER
 * Sets up Ambient, Directional, and Point lighting with soft shadows.
 */
class LightsManager {
    constructor() {
        this.lights = [];
        this.sunLight = null;
        this.ambientLight = null;
        this.boothLight = null;
        this.tableLight = null;
    }

    /**
     * Initializes lights and adds them to the scene
     * @param {THREE.Scene} scene 
     */
    init(scene) {
        // 1. Ambient Light - Soft fill lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(this.ambientLight);
        this.lights.push(this.ambientLight);

        // 2. Sun / Directional Light - Simulates natural window lighting
        this.sunLight = new THREE.DirectionalLight(0xfff8ee, 0.85); // Warm sun tint
        this.sunLight.position.set(-8, 8, 4);
        
        // Shadow configuration for sun
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 1024;  // Reduced from 2048 for performance
        this.sunLight.shadow.mapSize.height = 1024;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 25;
        
        // Define shadow frustum
        const d = 10;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;
        this.sunLight.shadow.bias = -0.0005; // Prevent shadow acne
        
        scene.add(this.sunLight);
        this.lights.push(this.sunLight);

        // 3. Ceiling lights (PointLights) - no shadows for performance
        // Table ceiling light
        this.tableLight = new THREE.PointLight(0xeef5ff, 0.65, 8);
        this.tableLight.position.set(0, 3.2, 0); // Directly above voting table
        this.tableLight.castShadow = false; // Removed: point light shadows are expensive
        scene.add(this.tableLight);
        this.lights.push(this.tableLight);

        // Booth ceiling light
        this.boothLight = new THREE.PointLight(0xfff6ea, 0.55, 6);
        this.boothLight.position.set(-2, 3.2, -3); // Above the voting booth
        this.boothLight.castShadow = false; // Removed: point light shadows are expensive
        scene.add(this.boothLight);
        this.lights.push(this.boothLight);
    }
}

export const lightsManager = new LightsManager();
export default lightsManager;
