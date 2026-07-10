import gsap from 'gsap';
import * as THREE from 'three';

/**
 * ANIMATIONS SYSTEM
 * Handles cinematic camera transitions, procedural character movements, and voting object animations.
 */
class AnimationsManager {
    constructor() {
        this.time = 0;
    }

    /**
     * Smoothly animates the camera between two positions and look-at targets
     */
    animateCameraTransition(camera, startPos, endPos, startLook, endLook, duration = 2.0, onComplete = null) {
        // Temporarily disable controls during transition
        camera.position.copy(startPos);
        
        // Target object to animate lookAt
        const lookTarget = startLook.clone();

        const tl = gsap.timeline({
            onUpdate: () => {
                camera.position.set(posObj.x, posObj.y, posObj.z);
                camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
            },
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        const posObj = { x: startPos.x, y: startPos.y, z: startPos.z };

        tl.to(posObj, {
            x: endPos.x,
            y: endPos.y,
            z: endPos.z,
            duration: duration,
            ease: 'power2.inOut'
        }, 0);

        tl.to(lookTarget, {
            x: endLook.x,
            y: endLook.y,
            z: endLook.z,
            duration: duration,
            ease: 'power2.inOut'
        }, 0);
    }

    /**
     * Animates limbs of a humanoid model to simulate walking
     * @param {THREE.Object3D} character The loaded character model
     * @param {boolean} isWalking True if walking
     * @param {number} delta Time delta
     */
    animateHumanoidWalk(character, isWalking, delta) {
        if (!character) return;
        
        this.time += delta * 6.5; // Walk frequency

        const leftArm = character.getObjectByName('left_arm');
        const rightArm = character.getObjectByName('right_arm');
        const leftLeg = character.getObjectByName('left_leg');
        const rightLeg = character.getObjectByName('right_leg');

        if (isWalking) {
            // Legs swing opposite to each other
            if (leftLeg) leftLeg.rotation.x = Math.sin(this.time) * 0.45;
            if (rightLeg) rightLeg.rotation.x = -Math.sin(this.time) * 0.45;

            // Arms swing opposite to legs
            if (leftArm) leftArm.rotation.x = -Math.sin(this.time) * 0.35;
            if (rightArm) rightArm.rotation.x = Math.sin(this.time) * 0.35;
        } else {
            // Smoothly return to idle pose
            const lerpSpeed = 0.1;
            if (leftLeg) leftLeg.rotation.x = THREE.MathUtils.lerp(leftLeg.rotation.x, 0, lerpSpeed);
            if (rightLeg) rightLeg.rotation.x = THREE.MathUtils.lerp(rightLeg.rotation.x, 0, lerpSpeed);
            if (leftArm) leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, lerpSpeed);
            if (rightArm) rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, lerpSpeed);
        }
    }

    /**
     * Animates a hand-over gesture (reaching arm forward and back)
     */
    animateHandOver(character, onComplete = null) {
        const rightArm = character.getObjectByName('right_arm');
        if (!rightArm) {
            if (onComplete) onComplete();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        // Swing arm forward and up
        tl.to(rightArm.rotation, {
            x: -Math.PI / 3, // Reach out
            z: -Math.PI / 12,
            duration: 0.6,
            ease: 'power1.out'
        });

        // Hold position briefly
        tl.to(rightArm.rotation, {
            x: -Math.PI / 3,
            duration: 0.5
        });

        // Return to side
        tl.to(rightArm.rotation, {
            x: 0,
            z: 0,
            duration: 0.6,
            ease: 'power1.inOut'
        });
    }

    /**
     * Animates paper ballot folding inside the 3D scene
     */
    animateBallotFold(ballotGroup, onComplete = null) {
        if (!ballotGroup) {
            if (onComplete) onComplete();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        // 1. Zoom in and spin slightly
        tl.to(ballotGroup.position, {
            y: ballotGroup.position.y + 0.1,
            duration: 0.4,
            ease: 'power1.out'
        });

        // 2. Fold 1: Scale X to simulate a vertical middle fold
        tl.to(ballotGroup.scale, {
            x: 0.15, // Flattened
            z: 1.05, // Slightly bulge
            duration: 0.5,
            ease: 'power2.inOut'
        });

        // 3. Fold 2: Scale Z to simulate a horizontal fold
        tl.to(ballotGroup.scale, {
            z: 0.15, // Flattened on Z
            y: 0.08, // Thickness increase
            duration: 0.5,
            ease: 'power2.inOut'
        });

        // Rotate to final envelope shape
        tl.to(ballotGroup.rotation, {
            y: Math.PI / 2,
            x: Math.PI / 4,
            duration: 0.4,
            ease: 'power1.inOut'
        });
    }

    /**
     * Animates folded ballot sliding into the urn slot
     */
    animateBallotInsertion(ballotGroup, slotPos, onComplete = null) {
        if (!ballotGroup) {
            if (onComplete) onComplete();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
            }
        });

        // Hover over the slot
        tl.to(ballotGroup.position, {
            x: slotPos.x,
            y: slotPos.y + 0.15,
            z: slotPos.z,
            duration: 0.6,
            ease: 'power2.out'
        });

        // Align angle with slot
        tl.to(ballotGroup.rotation, {
            x: 0,
            y: 0, // Flat
            z: 0,
            duration: 0.3
        });

        // Slide down through slot (inserts)
        tl.to(ballotGroup.position, {
            y: slotPos.y - 0.18,
            duration: 0.6,
            ease: 'power1.in'
        });

        // Fade out scale (disappears inside urn)
        tl.to(ballotGroup.scale, {
            x: 0.001,
            y: 0.001,
            z: 0.001,
            duration: 0.2
        });
    }
}

export const animationsManager = new AnimationsManager();
export default animationsManager;
