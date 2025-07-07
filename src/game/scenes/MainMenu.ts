import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    private sky: GameObjects.TileSprite;
    private clouds: GameObjects.TileSprite;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const { width, height } = this.scale;

        // Add background layers
        this.sky = this.add.tileSprite(0, 0, width, height, 'menu-sky').setOrigin(0, 0);
        this.add.image(0, height, 'menu-rocks').setOrigin(0, 1).setScale(width / 1920, height / 1080);
        this.add.image(0, height, 'menu-hills2').setOrigin(0, 1).setScale(width / 1920, height / 1080);
        this.add.image(0, height, 'menu-hills1').setOrigin(0, 1).setScale(width / 1920, height / 1080);
        this.add.image(0, height, 'menu-trees').setOrigin(0, 1).setScale(width / 1920, height / 1080);
        this.add.image(0, height, 'menu-ground').setOrigin(0, 1).setScale(width / 1920, height / 1080);
        this.clouds = this.add.tileSprite(0, 0, width, height, 'menu-clouds').setOrigin(0, 0);

        // Use custom font for the title
        const title = this.add.text(width / 2, height * 0.45, 'Welcome to SignQuest!', {
            fontFamily: 'PlanesValMore, Arial Black, Arial',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        })
            .setOrigin(0.5);

        // Add Play Button (positioned to the left)
        const playButton = this.add.image(width / 2 - 100, height * 0.65, 'play-button')
            .setDisplaySize(120, 120)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                playButton.setDisplaySize(130, 130);
            })
            .on('pointerout', () => {
                playButton.setDisplaySize(120, 120);
            })
            .on('pointerdown', () => {
                playButton.setDisplaySize(110, 110);
            })
            .on('pointerup', () => {
                playButton.setDisplaySize(130, 130);
                this.startGame();
            });

        // Add Info Button (positioned to the right)
        const infoButton = this.add.image(width / 2 + 100, height * 0.65, 'info-button')
            .setDisplaySize(120, 120)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                infoButton.setDisplaySize(130, 130);
            })
            .on('pointerout', () => {
                infoButton.setDisplaySize(120, 120);
            })
            .on('pointerdown', () => {
                infoButton.setDisplaySize(110, 110);
            })
            .on('pointerup', () => {
                infoButton.setDisplaySize(130, 130);
                this.showHelp();
            });
    }

    update() {
        this.clouds.tilePositionX += 0.5;
    }

    startGame ()
    {
        this.scene.start('Game');
    }

    showHelp ()
    {
        // For now, just show a simple alert-style text
        // In a full game, you might create a separate Help scene or modal
        const helpText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Help:\n\nUse arrow keys to move\nSpacebar to jump\n\nClick anywhere to close', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 20 },
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            helpText.destroy();
        });
    }

    shutdown() {
        this.children.each(c => c.destroy());
        if (this.sky) this.sky.destroy();
        if (this.clouds) this.clouds.destroy();
    }
}
