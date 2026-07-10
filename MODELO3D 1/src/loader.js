import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * LOADER MANAGER
 * Manages loading of all 3D assets, textures, and coordinates progress UI.
 */
class AssetLoader {
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.manager);
        this.textureLoader = new THREE.TextureLoader(this.manager);
        
        this.assets = {
            models: {},
            textures: {}
        };

        this.onProgressCallback = null;
        this.onCompleteCallback = null;

        this.setupManager();
    }

    setupManager() {
        // Track overall progress
        this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const percent = Math.round((itemsLoaded / itemsTotal) * 100);
            
            // Log file loaded
            const filename = url.substring(url.lastIndexOf('/') + 1);
            console.log(`Loading: ${filename} (${percent}%)`);

            if (this.onProgressCallback) {
                this.onProgressCallback(percent, filename);
            }
        };

        this.manager.onLoad = () => {
            console.log('All assets loaded successfully!');
            if (this.onCompleteCallback) {
                this.onCompleteCallback(this.assets);
            }
        };

        this.manager.onError = (url) => {
            console.error(`Error loading asset: ${url}`);
        };
    }

    /**
     * Start the loading process
     * @param {function} onProgress (percent, statusText)
     * @param {function} onComplete (loadedAssets)
     */
    load(onProgress, onComplete) {
        this.onProgressCallback = onProgress;
        this.onCompleteCallback = onComplete;

        // 1. Load Textures
        const textureFiles = {
            ballot_front: './textures/ballot_page_1.png',
            ballot_back: './textures/ballot_page_2.png'
        };

        for (const [key, path] of Object.entries(textureFiles)) {
            this.textureLoader.load(path, (texture) => {
                // Configure texture filtering for high resolution crispness
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.anisotropy = 8; // Anisotropic filtering for oblique views in the booth
                this.assets.textures[key] = texture;
            });
        }

        // 2. Load GLTF Models
        const modelFiles = {
            mesa: './models/mesa.glb',
            silla: './models/silla.glb',
            anfora: './models/anfora.glb',
            cabina: './models/cabina.glb',
            dni: './models/dni.glb',
            lapicero: './models/lapicero.glb',
            cedula: './models/cedula.glb',
            persona: './models/persona.glb',
            miembro_mesa: './models/miembro_mesa.glb'
        };

        for (const [key, path] of Object.entries(modelFiles)) {
            this.gltfLoader.load(
                path,
                (gltf) => {
                    // Process model materials and shadows
                    gltf.scene.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                            
                            // Optimize materials loaded from trimesh colored vertices
                            if (node.material) {
                                node.material.roughness = 0.6;
                                node.material.metalness = 0.1;
                                
                                // Specific adjustments
                                if (node.name.includes('metal') || node.name.includes('leg')) {
                                    node.material.roughness = 0.3;
                                    node.material.metalness = 0.6;
                                }
                                if (node.name.includes('ballot') || node.name.includes('sheet')) {
                                    node.material.roughness = 0.9;
                                    node.material.metalness = 0.0;
                                }
                                if (node.name.includes('tip') || node.name.includes('photo')) {
                                    node.material.roughness = 0.2;
                                    node.material.metalness = 0.8;
                                }
                            }
                        }
                    });
                    
                    this.assets.models[key] = gltf.scene;
                },
                undefined,
                (error) => {
                    console.error(`Error loading GLTF model ${key} from ${path}:`, error);
                }
            );
        }
    }
}

export const assetLoader = new AssetLoader();
export default assetLoader;
