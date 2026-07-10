import * as THREE from 'three';
import { interactionManager } from './interaction.js';

/**
 * ENVIRONMENT SYSTEM
 * Generates room geometry (walls, floor, ceiling, doors, chalkboard) and handles placement of loaded 3D models.
 */
class EnvironmentManager {
    constructor() {
        this.classroomGroup = new THREE.Group();
        this.doorHinge = null;
        this.placedModels = {};
    }

    /**
     * Creates and returns the classroom room and surrounding layout
     */
    buildRoom(scene) {
        // 1. FLOOR (Light Grey Tiled Floor)
        const floorGeo = new THREE.PlaneGeometry(14, 25);
        const floorMat = new THREE.MeshStandardMaterial({ 
            color: 0xe2e8f0, 
            roughness: 0.35,
            metalness: 0.05
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, 4.5); // Center the classroom and yard
        floor.receiveShadow = true;
        this.classroomGroup.add(floor);

        // 2. WALLS (Classroom: -6 to +6 X, -6.5 to 6 Z)
        const wallMat = new THREE.MeshStandardMaterial({ 
            color: 0xf1f5f9, 
            roughness: 0.9 
        });
        const wallBaseMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a, // Dark blue-slate baseboard
            roughness: 0.7
        });

        // Back wall (Z = -6.5)
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(12.2, 3.5, 0.2), wallMat);
        backWall.position.set(0, 1.75, -6.5);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        this.classroomGroup.add(backWall);

        // Left wall (X = -6)
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 12.8), wallMat);
        leftWall.position.set(-6, 1.75, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.classroomGroup.add(leftWall);

        // Right wall (X = +6)
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 12.8), wallMat);
        rightWall.position.set(6, 1.75, 0);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        this.classroomGroup.add(rightWall);

        // Front wall (Z = 6.2) with a double door opening (X = -1.2 to 1.2)
        const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.5, 0.2), wallMat);
        frontWallLeft.position.set(-3.6, 1.75, 6.2);
        frontWallLeft.castShadow = true;
        frontWallLeft.receiveShadow = true;
        this.classroomGroup.add(frontWallLeft);

        const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.5, 0.2), wallMat);
        frontWallRight.position.set(3.6, 1.75, 6.2);
        frontWallRight.castShadow = true;
        frontWallRight.receiveShadow = true;
        this.classroomGroup.add(frontWallRight);

        const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 0.2), wallMat);
        frontWallTop.position.set(0, 3.0, 6.2);
        frontWallTop.castShadow = true;
        frontWallTop.receiveShadow = true;
        this.classroomGroup.add(frontWallTop);

        // Classroom Ceiling
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 12.8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(0, 3.5, 0);
        this.classroomGroup.add(ceiling);

        // 3. CHALKBOARD/WHITEBOARD (On back wall)
        const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.6, 0.05), new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.4 }));
        boardFrame.position.set(0, 1.8, -6.35);
        const board = new THREE.Mesh(new THREE.BoxGeometry(4.3, 1.4, 0.06), new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 })); // Dark green board
        board.position.set(0, 1.8, -6.34);
        board.receiveShadow = true;
        this.classroomGroup.add(boardFrame);
        this.classroomGroup.add(board);

        // 4. INTERACTIVE DOOR
        // Setup door hinge group so it rotates about the edge pivot
        this.doorHinge = new THREE.Group();
        this.doorHinge.position.set(-1.1, 0, 6.2); // hinge anchor point at side
        
        const doorLeaf = new THREE.Mesh(
            new THREE.BoxGeometry(2.1, 2.4, 0.06),
            new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 }) // Wood brown door
        );
        doorLeaf.position.set(1.05, 1.2, 0); // Offset leaf by half width so hinge stays on side
        doorLeaf.castShadow = true;
        doorLeaf.receiveShadow = true;
        
        // Add handle
        const handle = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 10, 10),
            new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.2 })
        );
        handle.position.set(1.95, 1.1, 0.05);
        doorLeaf.add(handle);

        this.doorHinge.add(doorLeaf);
        this.classroomGroup.add(this.doorHinge);
        
        // Register door with interaction manager
        interactionManager.register(this.doorHinge, 'door', new THREE.Vector3(0, 0, 6.5));

        // 5. WINDOWS (Cutouts on left wall)
        // Simulated glass meshes
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 0.5
        });
        const win1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.5, 2.5), glassMat);
        win1.position.set(-5.9, 2.0, -2.5);
        const win2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.5, 2.5), glassMat);
        win2.position.set(-5.9, 2.0, 2.5);
        this.classroomGroup.add(win1);
        this.classroomGroup.add(win2);

        scene.add(this.classroomGroup);
    }

    /**
     * Places the preloaded GLB models into their respective layout positions
     * @param {object} models Preloaded GLTF object dictionary
     * @param {THREE.Scene} scene 
     */
    placeModels(models, scene) {
        // Helper clone method to instantiate model nodes cleanly
        const cloneGltf = (gltf) => {
            return gltf.clone();
        };

        // 1. ELECTION TABLE (Mesa)
        // Located in the center-front of the classroom [0, 0, 0]
        const mesa = cloneGltf(models.mesa);
        mesa.position.set(0, 0, 0.0);
        mesa.rotation.set(0, 0, 0);
        scene.add(mesa);
        this.placedModels.mesa = mesa;

        // 2. CHAIRS (Sillas)
        // Chair 1: Behind table for the poll officer
        const sillaOfficer = cloneGltf(models.silla);
        sillaOfficer.position.set(0, 0, -0.65);
        sillaOfficer.rotation.set(0, 0, 0); // facing front
        scene.add(sillaOfficer);

        // Chair 2: In front of table (voter seat)
        const sillaVoter = cloneGltf(models.silla);
        sillaVoter.position.set(0, 0, 0.65);
        sillaVoter.rotation.set(0, Math.PI, 0); // facing back table
        scene.add(sillaVoter);

        // 3. VOTING BOOTH (Cabina)
        // Located in the back-left corner facing away for privacy
        const cabina = cloneGltf(models.cabina);
        cabina.position.set(-2.5, 0, -3.0);
        cabina.rotation.set(0, Math.PI / 4, 0); // Rotated so opening is accessible
        scene.add(cabina);
        this.placedModels.cabina = cabina;
        
        // Register cabina for interaction
        interactionManager.register(cabina, 'booth', new THREE.Vector3(-2.2, 0, -2.6));

        // 4. ANFORA STAND & ANFORA (Ballot Urn)
        // Let's place the yellow urn on a separate desk on the right side of the room
        const urnDesk = cloneGltf(models.mesa);
        urnDesk.position.set(2.2, 0, -2.0);
        urnDesk.scale.set(0.6, 0.8, 0.6); // Slightly smaller desk
        urnDesk.rotation.set(0, Math.PI / 2, 0);
        scene.add(urnDesk);

        const anfora = cloneGltf(models.anfora);
        anfora.position.set(2.2, 0.73 * 0.8, -2.0); // Placed on top of the desk
        anfora.rotation.set(0, Math.PI / 2, 0);
        scene.add(anfora);
        this.placedModels.anfora = anfora;
        
        // Register anfora for interaction
        interactionManager.register(anfora, 'urn', new THREE.Vector3(1.8, 0, -1.8));

        // 5. DNI (ID Card) & PEN (Lapicero)
        // Placed on the electoral table in front of the officer
        const dni = cloneGltf(models.dni);
        dni.position.set(-0.25, 0.76, 0.1);
        dni.rotation.set(0, Math.PI / 6, 0);
        scene.add(dni);
        this.placedModels.dni = dni;

        const lapicero = cloneGltf(models.lapicero);
        lapicero.position.set(0.2, 0.765, 0.1);
        lapicero.rotation.set(0.04, -Math.PI / 3, -Math.PI / 2); // laying down flat on desk
        scene.add(lapicero);
        this.placedModels.lapicero = lapicero;

        // 6. HUMANOIDS
        // Poll Member (Miembro de mesa) - Sitting on officer chair
        const miembro = cloneGltf(models.miembro_mesa);
        miembro.position.set(0, 0, -0.65);
        miembro.rotation.set(0, 0, 0);
        scene.add(miembro);
        this.placedModels.miembro = miembro;
        
        // Register member for interaction (to hand DNI / pick ballot)
        interactionManager.register(miembro, 'member', new THREE.Vector3(0, 0, 0.5));

        // Waiting Voters Queue in the yard ( Z = 10, Z = 13 )
        const citizen1 = cloneGltf(models.persona);
        citizen1.position.set(-1.0, 0, 10.0);
        citizen1.rotation.set(0, Math.PI, 0); // facing school
        scene.add(citizen1);

        const citizen2 = cloneGltf(models.persona);
        citizen2.position.set(1.0, 0, 12.8);
        citizen2.rotation.set(0, Math.PI + 0.1, 0);
        scene.add(citizen2);
    }
}

export const environmentManager = new EnvironmentManager();
export default environmentManager;
