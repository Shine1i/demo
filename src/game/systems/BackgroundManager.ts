import { Scene, GameObjects } from 'phaser';
import { BACKGROUND_CONFIG } from '../config';

/**
 * Manages parallax background layers for the game scene
 * Handles creation, updates, and scrolling of all background elements
 */
export class BackgroundManager {
    private scene: Scene;
    
    // Background layer references
    private backSky: GameObjects.TileSprite;
    private skyGlow: GameObjects.TileSprite;
    private clouds: GameObjects.TileSprite;
    private planet: GameObjects.Image;
    private midgroundRocks: GameObjects.TileSprite;
    private foregroundRocks: GameObjects.TileSprite;
    private groundLayer: GameObjects.TileSprite;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Creates all background layers in the correct order (back to front)
     */
    createBackground(): void {
        const { width, height } = this.scene.scale;

        // Create all background layers from back to front
        this.backSky = this.createParallaxLayer('back-sky', width, height);
        this.midgroundRocks = this.createParallaxLayer('midground-rocks', width, height);
        this.skyGlow = this.createParallaxLayer('sky-glow', width, height);
        this.clouds = this.createParallaxLayer('sky-glow', width, height); // Note: uses same texture as skyGlow
        
        // Planet is a static image, not a tile sprite
        this.planet = this.scene.add.image(width / 2, height, 'planet')
            .setOrigin(0.5, 1)
            .setScrollFactor(0);
        
        this.foregroundRocks = this.createParallaxLayer('foreground-rocks', width, height);
        this.groundLayer = this.createParallaxLayer('ground', width, height);
    }

    /**
     * Creates a parallax background layer with consistent properties
     */
    private createParallaxLayer(textureKey: string, width: number, height: number): GameObjects.TileSprite {
        return this.scene.add.tileSprite(0, 0, width, height, textureKey)
            .setOrigin(0, 0)
            .setScrollFactor(0);
    }

    /**
     * Updates all parallax background layers based on camera position
     * Call this in the scene's update method
     */
    updateParallax(): void {
        const cameraScrollX = this.scene.cameras.main.scrollX;
        const scrollSpeeds = BACKGROUND_CONFIG.SCROLL_SPEEDS;

        // Update each layer with its respective scroll speed
        this.backSky.tilePositionX += scrollSpeeds.BACK_SKY;
        this.skyGlow.tilePositionX = cameraScrollX * scrollSpeeds.SKY_GLOW;
        this.clouds.tilePositionX = cameraScrollX * scrollSpeeds.CLOUDS;
        this.midgroundRocks.tilePositionX = cameraScrollX * scrollSpeeds.MIDGROUND_ROCKS;
        this.foregroundRocks.tilePositionX = cameraScrollX * scrollSpeeds.FOREGROUND_ROCKS;
        this.groundLayer.tilePositionX = cameraScrollX * scrollSpeeds.GROUND_LAYER;
        
        // Planet doesn't move - it's stationary in the background
    }

    /**
     * Cleanup method to destroy all background elements
     */
    destroy(): void {
        this.backSky?.destroy();
        this.skyGlow?.destroy();
        this.clouds?.destroy();
        this.planet?.destroy();
        this.midgroundRocks?.destroy();
        this.foregroundRocks?.destroy();
        this.groundLayer?.destroy();
    }
} 