import { GameObjects, Scene } from 'phaser';

/**
 * Quest Board UI system - displays quest information in a popup window
 * Shows quest text, hints, and interactive buttons with proper structure
 */
export class QuestBoard {
    private scene: Scene;
    private questBoard: GameObjects.Image;
    private questTitle: GameObjects.Text;
    private questInstructions: GameObjects.Text;
    private hintImage: GameObjects.Image;
    private hintLabel: GameObjects.Text;
    private okButton: GameObjects.Image;
    private container: GameObjects.Container;
    private isVisible: boolean = false;
    private onCloseCallback?: () => void;

    constructor(scene: Scene) {
        this.scene = scene;
        this.createQuestBoard();
    }

    /**
     * Creates the quest board UI elements with proper structure
     */
    private createQuestBoard(): void {
        // Calculate screen center using camera dimensions for proper centering
        // This ensures the quest board stays centered regardless of camera position in the world
        const screenCenterX = this.scene.cameras.main.width / 2;
        const screenCenterY = this.scene.cameras.main.height / 2;

        // Create the quest board background - scale it properly to fit content
        this.questBoard = this.scene.add.image(0, 0, 'questBoard');
        this.questBoard.setScale(0.4);
        this.questBoard.setOrigin(0.5); // Ensure the image is centered within the container

        // Create quest title (heading) - adjusted for 0.4 scale
        this.questTitle = this.scene.add.text(
            0,
            -90,
            "Wake the Ooze",
            {
                fontFamily: 'PlanesValMore, Arial Black, Arial',
                fontSize: '24px',
                color: '#8B4513',
                align: 'center'
            }
        );
        this.questTitle.setOrigin(0.5);

        // Create quest instructions with bullet points - adjusted spacing
        this.questInstructions = this.scene.add.text(
            0,
            -40,
            "\n• Sign the letter 'W' in ASL language\n• This will wake up the sleeping Ooze\n• Use the hint below as a guide",
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#2a2a2a',
                align: 'left',
                lineSpacing: 6,
                wordWrap: { width: 280 }
            }
        );
        this.questInstructions.setOrigin(0.5);

        // Create hint label - adjusted position
        this.hintLabel = this.scene.add.text(
            0,
            25,
            "ASL Sign Hint:",
            {
                fontFamily: 'Arial Black, Arial',
                fontSize: '12px',
                color: '#4A4A4A',
                align: 'center'
            }
        );
        this.hintLabel.setOrigin(0.5);

        // Create hint image (ASL W sign) - adjusted position for better fit
        this.hintImage = this.scene.add.image(0, 65, 'aslW');
        this.hintImage.setScale(0.2); // Smaller scale for better fit with 0.4 board scale
        
        // Add border around hint image for better visibility - adjusted size
        const hintBorder = this.scene.add.graphics();
        hintBorder.lineStyle(1, 0x666666);
        hintBorder.strokeRoundedRect(-35, 40, 70, 50, 3);

        // Create OK button with better positioning - adjusted for smaller board
        this.okButton = this.scene.add.image(0, 110, 'play-button');
        this.okButton.setScale(0.25);
        this.okButton.setDepth(1002); // Higher depth than container
        this.okButton.setInteractive({ useHandCursor: true });
        this.okButton.on('pointerdown', () => {
            console.log('OK button clicked!'); // Debug log
            this.hideQuestBoard();
            if (this.onCloseCallback) {
                this.onCloseCallback();
            }
        });
        this.okButton.on('pointerover', () => {
            this.okButton.setTint(0xdddddd);
            this.okButton.setScale(0.3);
        });
        this.okButton.on('pointerout', () => {
            this.okButton.clearTint();
            this.okButton.setScale(0.25);
        });

      

        // Create container to group all elements and center them properly
        // Position container so the quest board background is centered on screen
        this.container = this.scene.add.container(screenCenterX, screenCenterY, [
            this.questBoard,
            this.questTitle,
            this.questInstructions,
            this.hintLabel,
            hintBorder,
            this.hintImage,
            this.okButton
        ]);

        // Set scroll factor to 0 to make UI independent of camera movement
        // This ensures the quest board stays fixed to the screen center
        this.container.setScrollFactor(0);

        // Set individual scroll factors and depths for all elements
        this.questBoard.setScrollFactor(0).setDepth(1000);
        this.questTitle.setScrollFactor(0).setDepth(1001);
        this.questInstructions.setScrollFactor(0).setDepth(1001);
        this.hintLabel.setScrollFactor(0).setDepth(1001);
        this.hintImage.setScrollFactor(0).setDepth(1001);
        this.okButton.setScrollFactor(0); // Button already has depth 1002

        // Set high depth to appear above everything
        this.container.setDepth(1000);

        // Initially hide the quest board
        this.container.setVisible(false);
    }

    /**
     * Shows the quest board popup
     */
    showQuestBoard(onCloseCallback?: () => void): void {
        if (!this.isVisible) {
            this.onCloseCallback = onCloseCallback;
            this.container.setVisible(true);
            this.isVisible = true;
            
            // Add a subtle fade-in effect with scale animation
            this.container.setAlpha(0);
            this.container.setScale(0.8);
            this.scene.tweens.add({
                targets: this.container,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });
        }
    }

    /**
     * Hides the quest board popup
     */
    hideQuestBoard(): void {
        if (this.isVisible) {
            this.scene.tweens.add({
                targets: this.container,
                alpha: 0,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    this.container.setVisible(false);
                    this.isVisible = false;
                }
            });
        }
    }


    /**
     * Returns whether the quest board is currently visible
     */
    isQuestBoardVisible(): boolean {
        return this.isVisible;
    }

    /**
     * Updates the quest title
     */
    updateQuestTitle(title: string): void {
        this.questTitle.setText(title);
    }

    /**
     * Updates the quest instructions
     */
    updateQuestInstructions(instructions: string): void {
        this.questInstructions.setText(instructions);
    }

    /**
     * Updates the hint image
     */
    updateHintImage(imageKey: string): void {
        this.hintImage.setTexture(imageKey);
    }

    /**
     * Cleanup method
     */
    destroy(): void {
        this.container?.destroy();
    }
}