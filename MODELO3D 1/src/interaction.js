import * as THREE from 'three';
import { playerManager } from './player.js';
import { uiManager } from './ui.js';
import { audioManager } from './utils.js';

/**
 * INTERACTION SYSTEM
 * Uses raycasting to detect what object the player is looking at and triggers events.
 */
class InteractionManager {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 4.0; // Max raycast interaction distance (4 meters)
        this.mouseCenter = new THREE.Vector2(0, 0); // Always center in Pointer Lock

        this.interactables = [];
        this.activeIntersection = null;
        
        // Emissive hover effect storage
        this.hoveredObject = null;
        this.originalEmissive = new THREE.Color(0,0,0);
        
        this.onInteractCallback = null;

        // Setup click listener
        window.addEventListener('click', this.onMouseClick.bind(this));
    }

    /**
     * Registers a 3D mesh as interactable
     * @param {THREE.Object3D} object Three.js group or mesh
     * @param {string} type 'door' | 'member' | 'booth' | 'urn'
     * @param {THREE.Vector3} triggerPos Position to check player closeness
     */
    register(object, type, triggerPos) {
        // Tag object with details
        object.userData = {
            isInteractable: true,
            type: type,
            triggerPos: triggerPos || object.position.clone()
        };
        this.interactables.push(object);
    }

    clear() {
        this.interactables = [];
        this.activeIntersection = null;
        this.hoveredObject = null;
    }

    /**
     * Raycasts from screen center to detect nearby meshes
     * Called in render loop
     * @param {number} delta Time delta
     * @param {THREE.Camera} camera 
     */
    update(delta, camera) {
        if (playerManager.keys.forward === undefined) return; // Wait for initializations

        // Throttle raycasting to every 2nd frame (imperceptible lag, halves CPU cost)
        this._rayFrame = (this._rayFrame || 0) + 1;
        if (this._rayFrame % 2 !== 0) return;

        // Raycast only if player is in control
        this.raycaster.setFromCamera(this.mouseCenter, camera);
        
        // Traverse all meshes inside our registered interactable groups
        const intersects = this.raycaster.intersectObjects(this.interactables, true);
        
        let foundValid = false;

        if (intersects.length > 0) {
            // Find parent interactable group
            let obj = intersects[0].object;
            while (obj && !obj.userData.isInteractable) {
                obj = obj.parent;
            }

            if (obj && obj.userData.isInteractable) {
                const type = obj.userData.type;
                const triggerPos = obj.userData.triggerPos;

                // Check distance
                if (playerManager.isNear(triggerPos, 3.2)) {
                    foundValid = true;
                    this.activeIntersection = { object: obj, type: type };
                    
                    // Highlight the object
                    this.applyHoverHighlight(obj);
                    
                    // Update HUD instructions to show clickable status
                    uiManager.showInteractionPrompt(type);
                }
            }
        }

        if (!foundValid) {
            this.clearHoverHighlight();
            this.activeIntersection = null;
            uiManager.hideInteractionPrompt();
        }
    }

    /**
     * Gives the target mesh an emissive hover outline look
     */
    applyHoverHighlight(obj) {
        if (this.hoveredObject === obj) return;
        
        // Clear previous highlight
        this.clearHoverHighlight();
        
        this.hoveredObject = obj;
        
        // Highlight all meshes in the group
        obj.traverse((child) => {
            if (child.isMesh && child.material) {
                // Save original emissive color if not saved yet
                if (!child.userData.savedEmissive) {
                    child.userData.savedEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0,0,0);
                }
                
                // Add soft yellow glow for hover
                if (child.material.emissive) {
                    child.material.emissive.setHex(0x332a05); // Subtle gold glow
                }
            }
        });
    }

    clearHoverHighlight() {
        if (!this.hoveredObject) return;
        
        this.hoveredObject.traverse((child) => {
            if (child.isMesh && child.material && child.userData.savedEmissive) {
                if (child.material.emissive) {
                    child.material.emissive.copy(child.userData.savedEmissive);
                }
            }
        });
        
        this.hoveredObject = null;
    }

    /**
     * Mouse click event listener
     */
    onMouseClick(event) {
        // Only trigger interaction if we have a valid focused target and Pointer Lock is active
        if (this.activeIntersection) {
            const { type, object } = this.activeIntersection;
            console.log(`Interacted with: ${type}`);
            
            audioManager.play('click');
            
            if (this.onInteractCallback) {
                this.onInteractCallback(type, object);
            }
        }
    }

    onInteract(callback) {
        this.onInteractCallback = callback;
    }
}

export const interactionManager = new InteractionManager();
export default interactionManager;
