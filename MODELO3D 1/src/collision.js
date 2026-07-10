import { checkAABBCollision2D } from './utils.js';

/**
 * COLLISION SYSTEM
 * Defines obstacle boundary boxes and solves player movement sliding.
 */
class CollisionManager {
    constructor() {
        // Dynamic list of bounding boxes: { minX, maxX, minZ, maxZ, label }
        this.obstacles = [];
        this.playerRadius = 0.35; // Radius of player's body cylinder
        this.setupDefaultObstacles();
    }

    /**
     * Sets up static walls and furniture boundaries
     */
    setupDefaultObstacles() {
        // 1. Exterior Yard / Classroom Walls
        // Let's assume the classroom is from X = -5 to +5, and Z = -6 to +6.
        // There is an entrance door at Z = 6.
        // Yard is Z = 6 to 15.
        // We restrict player movement bounds:
        this.bounds = {
            minX: -6.0,
            maxX: 6.0,
            minZ: -6.5,
            maxZ: 15.0 // yard length
        };

        // Inner classroom boundaries (when inside classroom)
        // Walls of the school building:
        // Left wall: X = -5
        // Right wall: X = 5
        // Back wall: Z = -6
        // Front wall with door: Z = 6 (except door width X = -1.2 to +1.2)
        
        // Let's add furniture bounding boxes:
        this.obstacles = [
            // Electoral Table (mesa): Center of room
            // Mesh is at [0, 0, 0], extents X: 1.6, Z: 0.8
            { minX: -0.9, maxX: 0.9, minZ: -0.5, maxZ: 0.5, label: 'electoral_table' },
            
            // Urn/Anfora Table (located near the table or on it)
            // If on table, player collides with table.
            
            // Voting Booth (cabina): Left side of the room
            // Mesh is at [-2.5, 0, -3.0], extents X: 0.8, Z: 0.6
            { minX: -3.0, maxX: -2.0, minZ: -3.4, maxZ: -2.6, label: 'voting_booth' },
            
            // Chairs (sillas): 
            // Officer chair: [0, 0, -0.8] (behind table)
            { minX: -0.3, maxX: 0.3, minZ: -1.1, maxZ: -0.5, label: 'officer_chair' },
            // Voter chair: [0, 0, 0.8] (in front of table)
            { minX: -0.3, maxX: 0.3, minZ: 0.5, maxZ: 1.1, label: 'voter_chair' },
            
            // Left Wall boundary (X = -5)
            { minX: -6.5, maxX: -4.8, minZ: -7.0, maxZ: 6.2, label: 'left_wall' },
            // Right Wall boundary (X = 5)
            { minX: 4.8, maxX: 6.5, minZ: -7.0, maxZ: 6.2, label: 'right_wall' },
            // Back Wall boundary (Z = -6)
            { minX: -6.0, maxX: 6.0, minZ: -7.0, maxZ: -5.8, label: 'back_wall' },
            
            // Front Classroom Wall left segment: X = -5 to -1.2, Z = 6
            { minX: -6.0, maxX: -1.2, minZ: 5.8, maxZ: 6.5, label: 'front_wall_left' },
            // Front Classroom Wall right segment: X = 1.2 to 5, Z = 6
            { minX: 1.2, maxX: 6.0, minZ: 5.8, maxZ: 6.5, label: 'front_wall_right' }
        ];
    }

    /**
     * Adds a dynamic obstacle boundary box
     */
    addObstacle(minX, maxX, minZ, maxZ, label = 'dynamic') {
        this.obstacles.push({ minX, maxX, minZ, maxZ, label });
    }

    /**
     * Resolves movement and returns the collision-corrected position vector
     * @param {THREE.Vector3} currentPos Current player position
     * @param {THREE.Vector3} desiredPos Proposed next position
     * @returns {THREE.Vector3} Allowed next position
     */
    resolveCollision(currentPos, desiredPos) {
        const nextPos = desiredPos.clone();
        
        // 1. Constrain to world bounds
        if (nextPos.x < this.bounds.minX + this.playerRadius) nextPos.x = this.bounds.minX + this.playerRadius;
        if (nextPos.x > this.bounds.maxX - this.playerRadius) nextPos.x = this.bounds.maxX - this.playerRadius;
        if (nextPos.z < this.bounds.minZ + this.playerRadius) nextPos.z = this.bounds.minZ + this.playerRadius;
        if (nextPos.z > this.bounds.maxZ - this.playerRadius) nextPos.z = this.bounds.maxZ - this.playerRadius;
        
        // 2. Solve collisions axis by axis (sliding collision)
        // Check X axis collision
        let xCollides = false;
        for (const obs of this.obstacles) {
            if (checkAABBCollision2D(nextPos.x, currentPos.z, obs.minX, obs.maxX, obs.minZ, obs.maxZ, this.playerRadius)) {
                xCollides = true;
                break;
            }
        }
        if (xCollides) {
            nextPos.x = currentPos.x; // Block movement along X
        }

        // Check Z axis collision
        let zCollides = false;
        for (const obs of this.obstacles) {
            if (checkAABBCollision2D(nextPos.x, nextPos.z, obs.minX, obs.maxX, obs.minZ, obs.maxZ, this.playerRadius)) {
                zCollides = true;
                break;
            }
        }
        if (zCollides) {
            nextPos.z = currentPos.z; // Block movement along Z
        }

        return nextPos;
    }
}

export const collisionManager = new CollisionManager();
export default collisionManager;
