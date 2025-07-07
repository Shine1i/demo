import { Scene, Physics, GameObjects } from 'phaser';
import { PLAYER_CONFIG, UI_CONFIG } from '../config';
import { InputManager } from './InputManager';

/**
 * Manages the player character including movement, animations, and effects
 * Provides a clean interface for player control and state management
 */
export class Player {
    private scene: Scene;
    private inputManager: InputManager;
    private sprite: Physics.Arcade.Sprite;
    private canMove: boolean = true;

    constructor(scene: Scene, inputManager: InputManager) {
        this.scene = scene;
        this.inputManager = inputManager;
        this.createPlayer();
    }

    /**
     * Creates the player sprite with physics and initial setup
     */
    private createPlayer(): void {
        // Create player sprite at starting position
        this.sprite = this.scene.physics.add.sprite(
            PLAYER_CONFIG.STARTING_X, 
            PLAYER_CONFIG.STARTING_Y, 
            'player'
        );
        
        // Configure player physics properties
        this.sprite.setScale(PLAYER_CONFIG.SCALE);
        this.sprite.setBounce(PLAYER_CONFIG.BOUNCE);
        this.sprite.setCollideWorldBounds(true);
        
        // Ensure player is on top of background layers
        this.sprite.setDepth(1000);
        
        // Wait one frame before starting animation to prevent jitter
        this.scene.time.delayedCall(50, () => {
            this.sprite.anims.play('idle');
        });
    }

    /**
     * Updates player movement based on input
     * Call this in the scene's update method
     */
    update(): void {
        this.handleMovement();
        this.preventPixelBlur();
    }

    /**
     * Handles player movement based on input from InputManager
     */
    private handleMovement(): void {
        // Check if movement is disabled (e.g., during UI interactions)
        if (!this.canMove) {
            this.sprite.setVelocityX(0);
            return;
        }

        const isOnGround = this.sprite.body!.touching.down;
        const direction = this.inputManager.getHorizontalDirection();
        const isRunning = this.inputManager.isRunning();
        
        // Calculate movement speed
        const speed = isRunning ? PLAYER_CONFIG.RUN_SPEED : PLAYER_CONFIG.WALK_SPEED;

        // Handle horizontal movement
        if (direction !== 0) {
            this.sprite.setVelocityX(direction * speed);
            this.sprite.setFlipX(direction < 0); // Flip sprite when moving left
            
            // Play running animation when on ground
            if (isOnGround) {
                this.sprite.anims.play('run', true);
            }
        } else {
            // No horizontal input - stop moving
            this.sprite.setVelocityX(0);
            
            // Play idle animation when on ground and not moving
            if (isOnGround) {
                this.sprite.anims.play('idle', true);
            }
        }

        // Handle jumping
        if (this.inputManager.isJumping() && isOnGround) {
            this.jump();
        }
    }

    /**
     * Makes the player jump and plays associated effects
     */
    private jump(): void {
        this.sprite.setVelocityY(PLAYER_CONFIG.JUMP_VELOCITY);
        this.sprite.anims.play('jump');
        this.playJumpDustEffect();
    }

    /**
     * Creates and plays the jump dust effect
     */
    private playJumpDustEffect(): void {
        const dust = this.scene.add.sprite(
            this.sprite.x, 
            this.sprite.y + UI_CONFIG.JUMP_DUST.Y_OFFSET, 
            'jump-dust'
        );
        
        dust.anims.play('jump-dust');
        
        // Clean up dust sprite when animation completes
        dust.on('animationcomplete', () => {
            dust.destroy();
        });
    }

    /**
     * Prevents pixel blur by rounding player position to whole numbers
     * Important for pixel-perfect rendering at low frame rates
     */
    private preventPixelBlur(): void {
        this.sprite.x = Math.round(this.sprite.x);
        this.sprite.y = Math.round(this.sprite.y);
    }

    /**
     * Gets the player's current position
     */
    getPosition(): { x: number; y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    /**
     * Gets the player sprite for physics interactions
     */
    getSprite(): Physics.Arcade.Sprite {
        return this.sprite;
    }

    /**
     * Enables player movement
     */
    enableMovement(): void {
        this.canMove = true;
    }

    /**
     * Disables player movement (e.g., during UI interactions)
     */
    disableMovement(): void {
        this.canMove = false;
        // Stop any current movement immediately
        this.sprite.setVelocityX(0);
    }

    /**
     * Returns whether the player can currently move
     */
    canPlayerMove(): boolean {
        return this.canMove;
    }

    /**
     * Cleanup method to destroy the player sprite
     */
    destroy(): void {
        this.sprite?.destroy();
    }
} 