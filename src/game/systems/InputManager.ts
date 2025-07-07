import { Scene, Input } from 'phaser';

/**
 * Manages all input controls for the game
 * Centralizes keyboard input handling and provides a clean interface for movement queries
 */
export class InputManager {
    private scene: Scene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey: Input.Keyboard.Key;
    private shiftKey: Input.Keyboard.Key;
    private escKey: Input.Keyboard.Key;
    private interactKey: Input.Keyboard.Key;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setupControls();
    }

    /**
     * Sets up all keyboard controls and input listeners
     */
    private setupControls(): void {
        // Create cursor keys (arrow keys)
        this.cursors = this.scene.input.keyboard!.createCursorKeys();
        
        // Add additional keys for enhanced controls
        const additionalKeys = this.scene.input.keyboard!.addKeys('W,S,A,D,SPACE,SHIFT,E') as any;
        this.spaceKey = additionalKeys.SPACE;
        this.shiftKey = additionalKeys.SHIFT;
        this.interactKey = additionalKeys.E;
        
        // Add escape key for returning to menu
        this.escKey = this.scene.input.keyboard!.addKey(Input.Keyboard.KeyCodes.ESC);
        this.escKey.on('down', () => {
            this.scene.scene.start('MainMenu');
        });
    }

    /**
     * Checks if the player should move left
     */
    isMovingLeft(): boolean {
        return this.cursors.left!.isDown;
    }

    /**
     * Checks if the player should move right
     */
    isMovingRight(): boolean {
        return this.cursors.right!.isDown;
    }

    /**
     * Checks if the player should jump
     */
    isJumping(): boolean {
        return this.cursors.up!.isDown || this.spaceKey.isDown;
    }

    /**
     * Checks if the player is running (holding shift)
     */
    isRunning(): boolean {
        return this.scene.input.keyboard!.checkDown(this.shiftKey, 0);
    }

    /**
     * Checks if any horizontal movement is happening
     */
    isMovingHorizontally(): boolean {
        return this.isMovingLeft() || this.isMovingRight();
    }

    /**
     * Gets the horizontal movement direction (-1 for left, 1 for right, 0 for none)
     */
    getHorizontalDirection(): number {
        if (this.isMovingLeft()) return -1;
        if (this.isMovingRight()) return 1;
        return 0;
    }

    /**
     * Checks if the interaction key (E) was just pressed
     */
    isInteractPressed(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.interactKey);
    }

    /**
     * Cleanup method to remove event listeners
     */
    destroy(): void {
        this.escKey?.off('down');
    }
} 