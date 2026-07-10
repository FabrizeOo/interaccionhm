import * as THREE from 'three';
import gsap from 'gsap';

// Import local modular engine systems
import { sceneManager } from './scene.js';
import { cameraManager } from './camera.js';
import { lightsManager } from './lights.js';
import { environmentManager } from './environment.js';
import { assetLoader } from './loader.js';
import { controlsManager } from './controls.js';
import { playerManager } from './player.js';
import { collisionManager } from './collision.js';
import { interactionManager } from './interaction.js';
import { animationsManager } from './animations.js';
import { votingManager } from './voting.js';
import { dialogsManager } from './dialogs.js';
import { uiManager } from './ui.js';
import { arManager } from './ar.js';
import { audioManager } from './utils.js';

/**
 * ELECTIONS SIMULATOR MAIN CORE
 * Coordinates the application state machine, game updates, and event triggers.
 */
class MainApp {
    constructor() {
        this.currentState = 0; // State machine pointer
        this.loadedAssets = null;
        
        // 3D Scene holding meshes for active interaction
        this.heldBallot3D = null;
        this.doorOpened = false;
        this.dniSubmitted = false;
        this.ballotCollected = false;
        this.ballotFolded = false;
        this.voteCompleted = false;
    }

    /**
     * Entry point: Preloads assets and initializes modules
     */
    init() {
        console.log("Initializing ONPE 3D Voting Platform...");

        // 1. Initialize UI HUD & Welcome event binds
        uiManager.init(
            () => this.startSimulation(), // Start button hook
            () => this.resetSimulation()  // Reset button hook
        );

        dialogsManager.init();

        // 2. Initialize Three.js Engine Viewport
        const container = document.getElementById('canvas-container');
        sceneManager.init(container);
        
        // Setup lights
        lightsManager.init(sceneManager.getScene());

        // 3. Preload all GLB 3D models and ballot textures
        assetLoader.load(
            // Progress Callback
            (percent, filename) => {
                uiManager.updateLoader(percent, `Cargando archivo: ${filename}...`);
            },
            // Complete Callback
            (assets) => {
                this.loadedAssets = assets;
                uiManager.updateLoader(100, "¡Recursos cargados correctamente!");
                
                // Build classroom static structures
                environmentManager.buildRoom(sceneManager.getScene());
                
                // Place furniture and characters
                environmentManager.placeModels(assets.models, sceneManager.getScene());

                // Create floating red guide arrow
                this.createGuideArrow();

                // Setup PointerLock/Orbit controllers
                controlsManager.init(cameraManager.get(), sceneManager.canvas);

                // Setup loop systems
                sceneManager.addToUpdateList(controlsManager);
                sceneManager.addToUpdateList(playerManager);
                sceneManager.addToUpdateList(interactionManager);
                sceneManager.addToUpdateList(this); // Add MainApp itself for tick-checks
                
                // Register click interactions
                interactionManager.onInteract((type, object) => this.handleInteraction(type, object));

                // Start WebGL clock and frame rendering loop
                sceneManager.start(cameraManager.get());

                // Configure default orbital camera revolving around center classroom table
                cameraManager.get().position.set(0, 4.5, 9);
                controlsManager.orbit.target.set(0, 0.75, 0);
            }
        );

        // 4. Hook custom validation alerts in the 2D Ballot Canvas modal
        votingManager.onVoteValidated((isValid) => {
            // Can update UI warnings if needed
        });
        
        // Connect demo presets in ballot canvas sidebar
        document.getElementById('btn-demo-valid').addEventListener('click', () => votingManager.loadDemoPreset('valid'));
        document.getElementById('btn-demo-outside').addEventListener('click', () => {
            votingManager.loadDemoPreset('outside');
            dialogsManager.setCustomText("<span style='color:var(--accent-red); font-weight:700;'>❌ ESTE VOTO SERÍA NULO</span>. Has marcado fuera de los recuadros oficiales. Asegúrate de cruzar las líneas de tu X dentro de la casilla del partido.");
        });
        document.getElementById('btn-demo-double').addEventListener('click', () => {
            votingManager.loadDemoPreset('double');
            dialogsManager.setCustomText("<span style='color:var(--accent-red); font-weight:700;'>❌ ESTE VOTO SERÍA NULO</span>. Se han detectado marcas en múltiples partidos. Solo puedes elegir una opción.");
        });
        document.getElementById('btn-demo-wrong-symbol').addEventListener('click', () => {
            votingManager.loadDemoPreset('symbol');
            dialogsManager.setCustomText("<span style='color:var(--accent-red); font-weight:700;'>❌ ESTE VOTO SERÍA NULO</span>. Has dibujado un símbolo incorrecto (✓). Las únicas marcas válidas por ley electoral son una cruz (X) o un signo más (+).");
        });
        document.getElementById('btn-demo-scribble').addEventListener('click', () => {
            votingManager.loadDemoPreset('scribble');
            dialogsManager.setCustomText("<span style='color:var(--accent-red); font-weight:700;'>❌ ESTE VOTO SERÍA NULO</span>. La cédula presenta rayones o tachaduras, lo que invalida de inmediato el voto.");
        });

        // 5. Connect voting confirm actions
        document.getElementById('btn-confirm-vote').addEventListener('click', () => {
            this.confirmAndFoldBallot();
        });

        // Close button hooks
        document.getElementById('btn-close-help').addEventListener('click', () => uiManager.closeModal('help-modal'));
        document.getElementById('btn-close-ar').addEventListener('click', () => uiManager.closeModal('ar-modal'));

        // Undo / Clear ballot strokes
        document.getElementById('btn-undo-stroke').addEventListener('click', () => {
            if (votingManager.stampMarks.length > 0) {
                votingManager.stampMarks.pop();
            } else {
                votingManager.strokes.pop();
            }
            votingManager.draw();
            votingManager._updateValidation();
        });
        document.getElementById('btn-clear-ballot').addEventListener('click', () => {
            votingManager.resetView();
        });
    }

    /**
     * ESCENA 1 -> ESCENA 2: Transition from Welcome Orbit to FPS Walk
     */
    startSimulation() {
        console.log("Starting simulation loop...");
        this.currentState = 1;
        this.updateGuideArrowPosition();

        // Transition camera from high rotation angle to player height at the school yard
        playerManager.teleportTo(0, 14); // Yard gate entrance
        playerManager.enableMovement(false); // Lock during camera pan

        const yardStartCameraPos = new THREE.Vector3(0, playerManager.playerHeight, 14);
        const yardLookTarget = new THREE.Vector3(0, playerManager.playerHeight, 5); // Looking at door

        controlsManager.disableAll();

        animationsManager.animateCameraTransition(
            cameraManager.get(),
            cameraManager.get().position, // Current position
            yardStartCameraPos,          // End position
            controlsManager.orbit.target, // Current target look
            yardLookTarget,              // End target look
            2.0,                         // Duration seconds
            () => {
                // Enable Pointer Lock Controls for First Person walking
                controlsManager.enableAll();
                controlsManager.setMode('pointerlock');
                playerManager.enableMovement(true);

                // Show step dialog instructions
                dialogsManager.showStep(1);
                uiManager.updateHUDProgress(1, "Ingresar al Local");
            }
        );
    }

    /**
     * Coordinates interactions triggered by raycast clicks on highlighted objects
     */
    handleInteraction(type, object) {
        if (this.currentState === 1 && type === 'door') {
            // ESCENA 2 -> ESCENA 3: Open classroom door
            this.openClassroomDoor(object);
        }
        else if (this.currentState === 2 && type === 'member') {
            // ESCENA 5: Present DNI to poll member
            this.presentDNIToMember();
        }
        else if (this.currentState === 4 && type === 'booth') {
            // ESCENA 6: Enter voting booth
            this.enterVotingBooth();
        }
        else if (this.currentState === 6 && type === 'urn') {
            // ESCENA 10 -> 11: Deposit folded ballot sheet
            this.insertBallotToUrn();
        }
    }

    /**
     * ESCENA 2 -> ESCENA 3: Open classroom door animation
     */
    openClassroomDoor(doorHingeGroup) {
        playerManager.enableMovement(false);
        controlsManager.unlock(); // Release pointerlock during scene transition
        
        audioManager.play('entrega'); // Door creaks/slides open sound
        this.doorOpened = true;

        // Rotate door hinge 90 degrees inward (negative Y rotation)
        gsap.to(doorHingeGroup.rotation, {
            y: -Math.PI / 2,
            duration: 1.2,
            ease: 'power1.inOut',
            onComplete: () => {
                // Smoothly transition player camera inside the classroom
                const insidePos = new THREE.Vector3(0, playerManager.playerHeight, 4.0);
                const insideLook = new THREE.Vector3(0, playerManager.playerHeight, 0);

                animationsManager.animateCameraTransition(
                    cameraManager.get(),
                    cameraManager.get().position,
                    insidePos,
                    new THREE.Vector3(0, playerManager.playerHeight, 5),
                    insideLook,
                    1.5,
                    () => {
                        // Re-enable FPS walking inside
                        controlsManager.lock();
                        playerManager.teleportTo(insidePos.x, insidePos.z);
                        playerManager.enableMovement(true);

                        // Advance state
                        this.currentState = 2;
                        this.updateGuideArrowPosition();
                        dialogsManager.showStep(2);
                        uiManager.updateHUDProgress(2, "Presentar DNI");
                    }
                );
            }
        });
    }

    /**
     * ESCENA 5: Present DNI Card
     */
    presentDNIToMember() {
        if (this.dniSubmitted) return;
        this.dniSubmitted = true;

        playerManager.enableMovement(false);
        controlsManager.unlock();

        // Trigger character limb raise gesture on poll member
        const pollOfficer = environmentManager.placedModels.miembro;
        
        animationsManager.animateHandOver(pollOfficer, () => {
            // Animate DNI sliding forward on the table desk
            const dniCard = environmentManager.placedModels.dni;
            audioManager.play('click');

            gsap.to(dniCard.position, {
                z: -0.15, // slides closer to poll officer
                duration: 0.8,
                ease: 'power1.out',
                onComplete: () => {
                    // Update state to step 3 (Recoger Cédula)
                    this.currentState = 3;
                    this.updateGuideArrowPosition();
                    
                    // Show a button on the instruction HUD to Pick Up Ballot
                    dialogsManager.showStep(3, [
                        {
                            text: "Recoger Cédula y Lapicero",
                            class: "btn-secondary btn-large",
                            onClick: () => this.collectBallotSheet()
                        }
                    ]);
                    uiManager.updateHUDProgress(3, "Recoger Cédula");
                }
            });
        });
    }

    /**
     * ESCENA 5 -> ESCENA 6: Pick Up ballot sheet and pen
     */
    collectBallotSheet() {
        audioManager.play('entrega'); // rustle
        this.ballotCollected = true;

        // Hide pen on desk
        const pen = environmentManager.placedModels.lapicero;
        if (pen) pen.visible = false;

        // Reset step instructions
        this.currentState = 4;
        this.updateGuideArrowPosition();
        dialogsManager.showStep(4);
        uiManager.updateHUDProgress(4, "Caminar a la Cabina");
        
        // Re-lock pointer to walk
        controlsManager.lock();
        playerManager.enableMovement(true);
    }

    /**
     * ESCENA 6 -> ESCENA 7: Zoom into booth and open interactive ballot 2D overlay
     */
    enterVotingBooth() {
        playerManager.enableMovement(false);
        controlsManager.unlock();

        const targetCamPos = new THREE.Vector3(-2.5, 1.25, -2.6);
        const targetLookPos = new THREE.Vector3(-2.5, 0.8, -3.2);
        
        animationsManager.animateCameraTransition(
            cameraManager.get(),
            cameraManager.get().position,
            targetCamPos,
            new THREE.Vector3(cameraManager.get().position.x, playerManager.playerHeight, cameraManager.get().position.z - 1),
            targetLookPos,
            1.2,
            () => {
                // Show the modal FIRST so the wrapper has layout dimensions
                uiManager.showOverlay('voting-modal');

                // Wait one frame for layout then initialise canvas
                requestAnimationFrame(() => {
                    const canvas = document.getElementById('interactive-ballot-canvas');
                    votingManager.init(canvas, this.loadedAssets.textures);
                });

                this.currentState = 5;
                this.updateGuideArrowPosition();
                dialogsManager.showStep(5);
                uiManager.updateHUDProgress(5, 'Marcar Cédula');
            }
        );
    }

    /**
     * ESCENA 8: Close voting modal, spawn 3D ballot on booth desk, and fold it
     */
    confirmAndFoldBallot() {
        audioManager.play('click');
        uiManager.hideOverlay('voting-modal');

        const scene = sceneManager.getScene();

        // Build a simple flat paper mesh (fallback-safe — no need for the GLB)
        const ballotGeo = new THREE.PlaneGeometry(0.21, 0.297); // A4 proportions in metres
        const ballotMat = new THREE.MeshStandardMaterial({
            map: (this.loadedAssets && this.loadedAssets.textures && this.loadedAssets.textures.ballot_front)
                ? this.loadedAssets.textures.ballot_front
                : null,
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide
        });

        // Remove old ballot if it exists
        if (this.heldBallot3D) scene.remove(this.heldBallot3D);

        this.heldBallot3D = new THREE.Mesh(ballotGeo, ballotMat);
        this.heldBallot3D.position.set(-2.5, 0.82, -3.0);
        this.heldBallot3D.rotation.set(-Math.PI / 2, 0, 0); // Flat on the shelf
        this.heldBallot3D.scale.set(1, 1, 1);
        this.heldBallot3D.castShadow = true;
        scene.add(this.heldBallot3D);

        // Trigger 3D fold animation
        animationsManager.animateBallotFold(this.heldBallot3D, () => {
            audioManager.play('entrega');
            this.ballotFolded = true;

            const boothExitPos = new THREE.Vector3(-2.3, playerManager.playerHeight, -2.2);
            const exitLook = new THREE.Vector3(0, playerManager.playerHeight, 0);

            animationsManager.animateCameraTransition(
                cameraManager.get(),
                cameraManager.get().position,
                boothExitPos,
                new THREE.Vector3(-2.5, 0.8, -3.2),
                exitLook,
                1.0,
                () => {
                    this.currentState = 6;
                    this.updateGuideArrowPosition();
                    dialogsManager.showStep(6);
                    uiManager.updateHUDProgress(6, 'Depositar en Ánfora');
                    this.heldBallot3D.visible = false;
                    controlsManager.lock();
                    playerManager.teleportTo(boothExitPos.x, boothExitPos.z);
                    playerManager.enableMovement(true);
                }
            );
        });
    }

    /**
     * ESCENA 11: Insert ballot sheet into the urn slot
     */
    insertBallotToUrn() {
        if (this.voteCompleted) return;
        this.voteCompleted = true;
        this.updateGuideArrowPosition();

        playerManager.enableMovement(false);
        controlsManager.unlock();

        // Urn and slot positions
        const urn = environmentManager.placedModels.anfora;
        const slotWorldPos = new THREE.Vector3(2.2, 0.584 * 0.8 + 0.12, -2.0); // Height of slot

        // Make the folded ballot visible again, positioned near player hand/view
        const camera = cameraManager.get();
        const handPos = new THREE.Vector3();
        camera.getWorldPosition(handPos);
        handPos.y -= 0.3; // slightly lower than eye height
        
        this.heldBallot3D.position.copy(handPos);
        this.heldBallot3D.scale.set(0.6, 0.6, 0.6); // Scale down
        this.heldBallot3D.visible = true;

        // Pan camera to focus on the ballot box
        const urnCamPos = new THREE.Vector3(1.5, playerManager.playerHeight - 0.15, -1.5);
        const urnLook = new THREE.Vector3(2.2, 0.5, -2.0);

        animationsManager.animateCameraTransition(
            camera,
            camera.position.clone(),
            urnCamPos,
            new THREE.Vector3(camera.position.x, playerManager.playerHeight, camera.position.z - 1),
            urnLook,
            0.8,
            () => {
                // Trigger flying/sliding animation into slot
                animationsManager.animateBallotInsertion(this.heldBallot3D, slotWorldPos, () => {
                    audioManager.play('confirmacion'); // Success chime!
                    
                    // Show success card overlay
                    uiManager.showOverlay('success-screen');
                    
                    // Return controls mode to Orbit (cinematic overview rotating)
                    controlsManager.setMode('orbit');
                    controlsManager.orbit.target.copy(urnLook);
                });
            }
        );
    }

    /**
     * RESETS simulation parameters to state 1
     */
    resetSimulation() {
        console.log("Resetting simulation...");
        
        // Remove 3D ballot clones
        if (this.heldBallot3D) {
            sceneManager.getScene().remove(this.heldBallot3D);
            this.heldBallot3D = null;
        }

        // Close door
        if (environmentManager.doorHinge) {
            environmentManager.doorHinge.rotation.y = 0;
        }

        // Reset DNI position
        const dni = environmentManager.placedModels.dni;
        if (dni) {
            dni.position.set(-0.25, 0.76, 0.1);
        }

        // Make pen visible
        const pen = environmentManager.placedModels.lapicero;
        if (pen) pen.visible = true;

        // Reset state booleans
        this.doorOpened = false;
        this.dniSubmitted = false;
        this.ballotCollected = false;
        this.ballotFolded = false;
        this.voteCompleted = false;
        this.currentState = 1;
        this.updateGuideArrowPosition();

        // Reset interactive ballot
        votingManager.resetView();

        // Teleport back to gate entrance
        playerManager.teleportTo(0, 14);
        cameraManager.setToFirstPerson();
        
        // Lock controls
        controlsManager.enableAll();
        controlsManager.setMode('pointerlock');
        playerManager.enableMovement(true);

        // Update dialog steps
        dialogsManager.showStep(1);
        uiManager.updateHUDProgress(1, "Ingresar al Local");
        
        // Hide success overlay screen
        uiManager.hideOverlay('success-screen');
        uiManager.hideOverlay('voting-modal');
    }

    createGuideArrow() {
        const scene = sceneManager.getScene();
        
        // Create a Group to hold the arrow parts
        this.guideArrow = new THREE.Group();
        
        // Let's make a beautiful red glowing arrow pointing down:
        // Tip: a cone pointing down (rotated)
        const coneGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
        coneGeo.rotateX(Math.PI); // rotate to point down
        
        // Stem: a cylinder above the cone
        const cylinderGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 16);
        cylinderGeo.translate(0, 0.3, 0); // shift up so it sits above the cone
        
        const arrowMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 1.0,
            roughness: 0.2,
            metalness: 0.8
        });
        
        const cone = new THREE.Mesh(coneGeo, arrowMat);
        const cylinder = new THREE.Mesh(cylinderGeo, arrowMat);
        
        this.guideArrow.add(cone);
        this.guideArrow.add(cylinder);
        
        // Default position and height
        this.guideArrow.position.set(0, 10, 0); // Start high and hidden
        this.guideArrow.visible = false;
        
        scene.add(this.guideArrow);
        
        this.arrowBaseY = 1.8; // default base height
    }

    updateGuideArrowPosition() {
        if (!this.guideArrow) return;
        
        // If not in a state that requires walking to a target, hide it
        if (this.currentState === 0 || this.currentState === 5 || this.currentState > 6 || this.voteCompleted) {
            this.guideArrow.visible = false;
            return;
        }
        
        this.guideArrow.visible = true;
        
        switch (this.currentState) {
            case 1: // Ingresar al Local (Classroom door)
                this.guideArrow.position.set(0, 1.8, 6.2);
                this.arrowBaseY = 1.8;
                break;
            case 2: // Presentar DNI (Poll member table)
                this.guideArrow.position.set(0, 1.5, 0.1);
                this.arrowBaseY = 1.5;
                break;
            case 3: // Recoger Cédula (Poll member table button)
                this.guideArrow.position.set(0, 1.5, 0.1);
                this.arrowBaseY = 1.5;
                break;
            case 4: // Caminar a la Cabina (Voting booth)
                this.guideArrow.position.set(-2.5, 1.9, -3.0);
                this.arrowBaseY = 1.9;
                break;
            case 6: // Depositar en Ánfora (Ballot box / Urn)
                this.guideArrow.position.set(2.2, 1.6, -2.0);
                this.arrowBaseY = 1.6;
                break;
            default:
                this.guideArrow.visible = false;
                break;
        }
    }

    /**
     * Tick loop runner (called every frame)
     */
    update(delta, camera) {
        // Smoothly bounce the guide arrow
        if (this.guideArrow && this.guideArrow.visible) {
            const time = performance.now() * 0.005;
            this.guideArrow.position.y = this.arrowBaseY + Math.sin(time) * 0.12;
            this.guideArrow.rotation.y = time * 0.8;
        }

        // Throttle idle animation to ~10fps (no need for 60fps sine updates)
        this._idleTimer = (this._idleTimer || 0) + delta;
        if (this._idleTimer < 0.1) return;
        this._idleTimer = 0;

        const pollOfficer = environmentManager.placedModels.miembro;
        if (pollOfficer) {
            const time = performance.now() * 0.001;
            const leftArm = pollOfficer.getObjectByName('left_arm');
            const head = pollOfficer.getObjectByName('head');

            if (leftArm && !this.dniSubmitted) {
                leftArm.rotation.z = Math.sin(time) * 0.03 - 0.05;
            }
            if (head) {
                head.rotation.y = Math.sin(time * 0.5) * 0.05;
            }
        }
    }
}

// ----------------------------------------------------
// APPLICATION STARTUP
// ----------------------------------------------------
const app = new MainApp();
window.app = app;
window.sceneManager = sceneManager;
window.cameraManager = cameraManager;

window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
