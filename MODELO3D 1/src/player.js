import * as THREE from 'three';
import { collisionManager } from './collision.js';
import { audioManager } from './utils.js';

/**
 * PLAYER MANAGER
 * Manages player inputs, first-person movement, state, and interaction ranges.
 */
class PlayerManager {
    constructor() {
        this.position = new THREE.Vector3(0, 1.65, 14); // Yard entrance
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.moveSpeed = 3.6; // Units per second
        this.playerHeight = 1.65;
        this.stepTimer = 0;
        this.stepInterval = 0.45; // Interval between footsteps in seconds
        this.movementEnabled = true;

        this.setupInputListeners();
    }

    setupInputListeners() {
        const onKeyDown = (event) => {
            if (!this.movementEnabled) return;
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.forward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.keys.backward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = true;
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.keys.forward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.keys.backward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = false;
                    break;
            }
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
    }

    /**
     * Resets keys when movement is disabled
     */
    resetKeys() {
        this.keys.forward = false;
        this.keys.backward = false;
        this.keys.left = false;
        this.keys.right = false;
    }

    enableMovement(enabled) {
        this.movementEnabled = enabled;
        if (!enabled) {
            this.resetKeys();
        }
    }

    /**
     * Updates player position and handles movement logic
     * @param {number} delta Delta time in seconds
     * @param {THREE.Camera} camera Three.js perspective camera
     */
    update(delta, camera) {
        if (!this.movementEnabled) return;

        // 1. Calculate direction vector relative to camera look angle
        this.direction.z = Number(this.keys.forward) - Number(this.keys.backward);
        this.direction.x = Number(this.keys.right) - Number(this.keys.left);
        this.direction.normalize(); // Ensure diagonal speed isn't faster

        const isMoving = this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;

        if (isMoving) {
            // Get camera flat horizontal forward vector (ignore Y tilt)
            const camForward = new THREE.Vector3();
            camera.getWorldDirection(camForward);
            camForward.y = 0;
            camForward.normalize();

            // Get camera right vector
            const camRight = new THREE.Vector3();
            camRight.copy(camForward).applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

            // Compute relative movement vector
            const moveVec = new THREE.Vector3();
            moveVec.addScaledVector(camForward, this.direction.z);
            moveVec.addScaledVector(camRight, this.direction.x);
            moveVec.normalize();

            // Proposed next position
            const desiredPos = this.position.clone().addScaledVector(moveVec, this.moveSpeed * delta);
            
            // Resolve collision and apply
            const resolvedPos = collisionManager.resolveCollision(this.position, desiredPos);
            this.position.copy(resolvedPos);
            this.position.y = this.playerHeight; // Keep constant floor height

            // Update camera position to follow player body
            camera.position.copy(this.position);

            // 2. Play footstep sounds at cadence intervals
            this.stepTimer += delta;
            if (this.stepTimer >= this.stepInterval) {
                audioManager.play('pasos');
                this.stepTimer = 0;
            }
        } else {
            this.stepTimer = this.stepInterval; // Reset timer so it starts immediately next walk
        }
    }

    /**
     * Checks if the player is within range of an interaction target
     * @param {THREE.Vector3} targetPos Position of the interactable object
     * @param {number} threshold Maximum distance allowed
     * @returns {boolean} True if within range
     */
    isNear(targetPos, threshold = 2.0) {
        // Compute flat distance (X and Z only)
        const dx = this.position.x - targetPos.x;
        const dz = this.position.z - targetPos.z;
        return Math.sqrt(dx * dx + dz * dz) <= threshold;
    }

    /**
     * Teleports player to a specific position
     */
    teleportTo(x, z) {
        this.position.set(x, this.playerHeight, z);
    }
}

export const playerManager = new PlayerManager();
export default playerManager;
