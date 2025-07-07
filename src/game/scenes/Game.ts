import { Scene } from 'phaser';
import { WORLD_CONFIG, CAMERA_CONFIG } from '../config';
import { BackgroundManager, InputManager, Player, OozeObstacle } from '../systems';

/**
 * Main game scene where the platformer gameplay happens
 * This scene coordinates all the game systems and manages the game world
 */
export class Game extends Scene {
    // Game system managers
    private backgroundManager: BackgroundManager;
    private inputManager: InputManager;
    private player: Player;
    private oozeObstacle: OozeObstacle;
    
    // State tracking to prevent unnecessary updates
    private isPlayerNearOoze: boolean = false;

    constructor() {
        super('Game');
    }

    /**
     * Creates all game systems and sets up the game world
     */
    create(): void {
        this.setupGameWorld();
        this.createGameSystems();
        this.createGameElements();
        this.setupPhysicsCollisions();
        this.setupCamera();
    }

    /**
     * Updates all game systems each frame
     */
    update(): void {
        // Update all game systems
        this.backgroundManager.updateParallax();
        this.player.update();
        this.oozeObstacle.update();
        
        // Check for player-obstacle interactions
        this.checkObstacleInteractions();
    }

    /**
     * Sets up the game world boundaries and physics
     */
    private setupGameWorld(): void {
        const worldHalfSize = WORLD_CONFIG.WORLD_SIZE / 2;

        // Set up infinite world bounds to prevent hitting walls
        this.cameras.main.setBounds(-worldHalfSize, 0, WORLD_CONFIG.WORLD_SIZE, WORLD_CONFIG.WORLD_HEIGHT);
        this.physics.world.setBounds(-worldHalfSize, 0, WORLD_CONFIG.WORLD_SIZE, WORLD_CONFIG.WORLD_HEIGHT);
    }

    /**
     * Creates and initializes all game systems
     */
    private createGameSystems(): void {
        this.backgroundManager = new BackgroundManager(this);
        this.inputManager = new InputManager(this);
        this.player = new Player(this, this.inputManager);
    }

    /**
     * Creates game elements like backgrounds and obstacles
     */
    private createGameElements(): void {
        this.backgroundManager.createBackground();
        this.oozeObstacle = new OozeObstacle(this, this.player);
    }

    /**
     * Sets up physics collisions between game objects
     */
    private setupPhysicsCollisions(): void {
        // Create ground platform for player to stand on
        const groundPlatform = this.createGroundPlatform();
        this.physics.add.collider(this.player.getSprite(), groundPlatform);

        // Create invisible quest blocker wall behind the ooze
        const questBlocker = this.createQuestBlocker();
        this.physics.add.collider(this.player.getSprite(), questBlocker);

        // Make the ooze itself block player movement
        this.physics.add.collider(this.player.getSprite(), this.oozeObstacle.getSprite());
    }

    /**
     * Creates the ground platform that the player stands on
     */
    private createGroundPlatform(): Phaser.Physics.Arcade.StaticGroup {
        const ground = this.physics.add.staticGroup();
        const groundY = this.scale.height - WORLD_CONFIG.GROUND_OFFSET_FROM_BOTTOM;
        const worldHalfSize = WORLD_CONFIG.WORLD_SIZE / 2;
        
        // Create visible ground platform for debugging (semi-transparent green)
        const groundPlatform = this.add.rectangle(
            -worldHalfSize, 
            groundY, 
            WORLD_CONFIG.WORLD_SIZE, 
            WORLD_CONFIG.GROUND_PLATFORM_HEIGHT, 
            0x00ff00, 
            0.3
        ).setOrigin(0, 0);
        
        this.physics.add.existing(groundPlatform, true);
        ground.add(groundPlatform);
        
        return ground;
    }

    /**
     * Creates an invisible wall that blocks player progression past the ooze
     */
    private createQuestBlocker(): Phaser.Physics.Arcade.Body {
        const oozePosition = this.oozeObstacle.getPosition();
        const questBlocker = this.add.rectangle(
            oozePosition.x + 80, // Offset behind the ooze
            this.scale.height / 2, 
            20, // Narrow wall
            this.scale.height, 
            0xff0000, 
            0 // Invisible
        ).setOrigin(0.5);
        
        this.physics.add.existing(questBlocker, true);
        return questBlocker.body as Phaser.Physics.Arcade.Body;
    }

    /**
     * Sets up the camera to follow the player with pixel-perfect rendering
     */
    private setupCamera(): void {
        // Configure camera to follow player with pixel-perfect movement
        this.cameras.main.startFollow(
            this.player.getSprite(), 
            true, 
            CAMERA_CONFIG.LERP_X, 
            CAMERA_CONFIG.LERP_Y
        );
        
        // Enable pixel-perfect rendering for crisp visuals at low frame rates
        this.cameras.main.roundPixels = CAMERA_CONFIG.ROUND_PIXELS;
        }

    /**
     * Checks for interactions between the player and obstacles
     * Only updates bubble visibility when the state actually changes
     */
    private checkObstacleInteractions(): void {
        if (!this.oozeObstacle) {
            return;
        }
        
        const playerPosition = this.player.getPosition();
        const isNearOoze = this.oozeObstacle.isPlayerNearby(playerPosition);
        
        // Only call show/hide methods when the state changes
        if (isNearOoze !== this.isPlayerNearOoze) {
            this.isPlayerNearOoze = isNearOoze;
            
            if (isNearOoze) {
                this.oozeObstacle.showChatBubble();
            } else {
                this.oozeObstacle.hideChatBubble();
            }
        }
        
        // Check for interaction input when player is near the ooze
        if (isNearOoze && this.inputManager.isInteractPressed()) {
            this.oozeObstacle.onPlayerInteract();
        }
    }

    /**
     * Cleanup method called when the scene shuts down
     */
    shutdown(): void {
        // Clean up all game systems
        this.backgroundManager?.destroy();
        this.inputManager?.destroy();
        this.player?.destroy();
        this.oozeObstacle?.destroy();

        // Clean up all child objects
        this.children.each((child) => child.destroy());
    }
}



