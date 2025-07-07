import { GameObjects } from 'phaser';
import { BaseObstacle } from './BaseObstacle';
import { OBSTACLE_CONFIG, UI_CONFIG, WORLD_CONFIG } from '../../config';
import { QuestBoard } from '../QuestBoard';
import { Player } from '../Player';

/**
 * The Ooze obstacle - a sleeping monster that blocks player progress
 * Shows a chat bubble when the player is nearby
 */
export class OozeObstacle extends BaseObstacle {
    private chatBubbleImage: GameObjects.Image;
    private chatBubbleText: GameObjects.Text;
    private chatBubbleVisible: boolean = false;
    private questBoard: QuestBoard | null = null;
    private player: Player;

    constructor(scene: Phaser.Scene, player: Player) {
        const groundY = scene.scale.height - WORLD_CONFIG.GROUND_OFFSET_FROM_BOTTOM;
        const oozeY = groundY - OBSTACLE_CONFIG.OOZE.Y_OFFSET;
        
        super(
            scene, 
            OBSTACLE_CONFIG.OOZE.X_POSITION, 
            oozeY, 
            'ooze', 
            OBSTACLE_CONFIG.OOZE.INTERACTION_DISTANCE
        );
        
        this.player = player;
    }

    /**
     * Sets up the Ooze-specific properties
     */
    protected setupObstacle(): void {
        // Configure Ooze sprite properties
        this.sprite.setScale(OBSTACLE_CONFIG.OOZE.SCALE);
        this.sprite.anims.play('ooze-sleep');
        
        // Create the chat bubble
        this.createChatBubble();
        
        // Initialize the quest board (will be created when needed)
        this.initializeQuestBoard();
    }

    /**
     * Initialize the quest board after the constructor completes
     */
    private initializeQuestBoard(): void {
        if (!this.questBoard) {
            this.questBoard = new QuestBoard(this.scene);
        }
    }

    /**
     * Creates a simple chat bubble using separate image and text objects
     * This approach avoids container complexity and is easier for beginners to understand
     */
    private createChatBubble(): void {
        // Calculate bubble position relative to the ooze sprite
        const bubbleX = this.sprite.x + UI_CONFIG.CHAT_BUBBLE.X_OFFSET;
        const bubbleY = this.sprite.y + UI_CONFIG.CHAT_BUBBLE.Y_OFFSET;
        
        // Create chat bubble image
        this.chatBubbleImage = this.scene.add.image(bubbleX, bubbleY, 'chatbubble');
        this.chatBubbleImage.setScale(UI_CONFIG.CHAT_BUBBLE.SCALE);
        this.chatBubbleImage.setDepth(100); // Ensure it appears above background

        // Create chat bubble text
        this.chatBubbleText = this.scene.add.text(
            bubbleX, 
            bubbleY - 5,
            "Zzzz… Who goes there...?\n💤 So sleepy… 💤\nPress E to interact! ✋",
            {
                fontFamily: 'Arial Black, Arial',
                fontSize: UI_CONFIG.CHAT_BUBBLE.TEXT_FONT_SIZE,
                color: '#2a2a2a',
                align: 'center',
                lineSpacing: 4,
                wordWrap: { width: 200 }
            }
        );
        this.chatBubbleText.setOrigin(0.5);
        this.chatBubbleText.setDepth(101); // Above the bubble image

        // Initially hide both elements
        this.hideChatBubble();
    }

    /**
     * Updates the obstacle state - shows/hides chat bubble based on player proximity
     */
    update(): void {
        // Chat bubble visibility is controlled by the proximity check in the main game scene
        // This method can be extended for other Ooze-specific behaviors
    }

    /**
     * Shows the chat bubble when player is nearby
     */
    showChatBubble(): void {
        if (!this.chatBubbleVisible && this.chatBubbleImage && this.chatBubbleText) {
            this.chatBubbleImage.setVisible(true);
            this.chatBubbleText.setVisible(true);
            this.chatBubbleVisible = true;
        }
    }

    /**
     * Hides the chat bubble when player moves away
     */
    hideChatBubble(): void {
        if (this.chatBubbleVisible && this.chatBubbleImage && this.chatBubbleText) {
            this.chatBubbleImage.setVisible(false);
            this.chatBubbleText.setVisible(false);
            this.chatBubbleVisible = false;
        }
    }

    /**
     * Handles player interaction with the Ooze
     * Shows the quest board with ASL puzzle instructions and disables player movement
     */
    onPlayerInteract(): void {
        // Hide the chat bubble when showing quest board
        this.hideChatBubble();
        
        // Disable player movement while quest board is shown
        this.player.disableMovement();
        
        // Ensure quest board is initialized
        this.initializeQuestBoard();
        
        // Show the quest board with ASL puzzle
        if (this.questBoard) {
            this.questBoard.showQuestBoard(() => {
                // Re-enable player movement when quest board is closed
                this.player.enableMovement();
                console.log('Quest board closed, player movement re-enabled');
            });
        }
    }

    /**
     * Cleanup method that also destroys the chat bubble elements
     */
    destroy(): void {
        this.chatBubbleImage?.destroy();
        this.chatBubbleText?.destroy();
        this.questBoard?.destroy();
        super.destroy();
    }
} 