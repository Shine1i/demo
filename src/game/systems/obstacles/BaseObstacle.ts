import { Scene, Physics, GameObjects } from 'phaser';

/**
 * Base class for all game obstacles
 * Provides common functionality that can be extended by specific obstacle types
 */
export abstract class BaseObstacle {
    protected scene: Scene;
    protected sprite: Physics.Arcade.Sprite;
    protected interactionDistance: number;

    constructor(scene: Scene, x: number, y: number, textureKey: string, interactionDistance: number = 200) {
        this.scene = scene;
        this.interactionDistance = interactionDistance;
        this.createSprite(x, y, textureKey);
        this.setupObstacle();
    }

    /**
     * Creates the obstacle sprite
     */
    protected createSprite(x: number, y: number, textureKey: string): void {
        this.sprite = this.scene.physics.add.staticSprite(x, y, textureKey);
    }

    /**
     * Abstract method to be implemented by specific obstacle types
     * Sets up the obstacle's unique properties and behavior
     */
    protected abstract setupObstacle(): void;

    /**
     * Checks if the player is close enough to interact with this obstacle
     */
    isPlayerNearby(playerPosition: { x: number; y: number }): boolean {
        const distance = Phaser.Math.Distance.Between(
            playerPosition.x, 
            playerPosition.y, 
            this.sprite.x, 
            this.sprite.y
        );
        return distance < this.interactionDistance;
    }

    /**
     * Gets the obstacle's position
     */
    getPosition(): { x: number; y: number } {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    /**
     * Gets the obstacle sprite for physics interactions
     */
    getSprite(): Physics.Arcade.Sprite {
        return this.sprite;
    }

    /**
     * Abstract method for obstacle-specific updates
     */
    abstract update(): void;

    /**
     * Abstract method for handling player interaction
     */
    abstract onPlayerInteract(): void;

    /**
     * Cleanup method to destroy the obstacle
     */
    destroy(): void {
        this.sprite?.destroy();
    }
} 