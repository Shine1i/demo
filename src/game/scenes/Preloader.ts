import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(640, 360, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(640, 360, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(640-230, 360, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Set the base path for assets
        this.load.setPath('src/assets');

        //  Load the assets for the game - Replace with your own assets
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        // Load menu background assets
        this.load.image('menu-sky', 'backgrounds/platformer_background_3/Layers/layer07_Sky.png');
        this.load.image('menu-clouds', 'backgrounds/platformer_background_3/Layers/layer05_Clouds.png');
        this.load.image('menu-hills1', 'backgrounds/platformer_background_3/Layers/layer04_Hills_2.png');
        this.load.image('menu-hills2', 'backgrounds/platformer_background_3/Layers/layer03_Hills_1.png');
        this.load.image('menu-trees', 'backgrounds/platformer_background_3/Layers/layer02_Trees.png');
        this.load.image('menu-ground', 'backgrounds/platformer_background_3/Layers/layer01_Ground.png');

        // Load parallax background layers (new assets)
        this.load.image('back-sky', 'backgrounds/planet/6.png');
        this.load.image('sky-glow', 'backgrounds/planet/5.png');
        this.load.image('planet', 'backgrounds/planet/4.png');
        this.load.image('midground-rocks', 'backgrounds/planet/3.png');
        this.load.image('foreground-rocks', 'backgrounds/planet/2.png');
        this.load.image('ground', 'backgrounds/planet/1.png');

        // Load jump dust effect
        this.load.spritesheet('jump-dust', 'character/Double_Jump_Dust_5.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load UI assets
        this.load.image('chatbubble', 'Png/chatbuble.png');
        this.load.image('play-button', 'Png/play.png');
        this.load.image('info-button', 'Png/info.png');
        this.load.image('questBoard', 'Png/questBoard.png');
        
        // Load ASL sign assets
        this.load.image('aslW', 'signs/aslW.jpg');
        
        // Load custom font using CSS @font-face (more reliable)
        this.loadCustomFont();

        // Load new character spritesheet
        this.load.spritesheet('player', 'character/AnimationSheet_Character.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load Ooze monster spritesheet
        this.load.spritesheet('ooze', 'monsters/Ooze/Idle.png', {
            frameWidth: 38,
            frameHeight: 38
        });
    }

    create ()
    {
        // Create character animations
        this.createPlayerAnimations();
        this.createJumpDustAnimation();
        this.createOozeAnimations();

        //  Move to the MainMenu
        this.scene.start('MainMenu');
    }

    /**
     * Creates all player character animations from the sprite sheet
     * These animations are used by the Player system for character movement
     */
    createPlayerAnimations(): void
    {
        // Idle animation (including blinking) - plays when player is not moving
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'player', frame: 0 },
                { key: 'player', frame: 1 },
                { key: 'player', frame: 8 },
                { key: 'player', frame: 9 },
            ],
            frameRate: 4,
            repeat: -1 // Loop forever
        });

        // Running animation - plays when player is moving horizontally
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
            frameRate: 12,
            repeat: -1 // Loop forever
        });

        // Jump animation - plays once when player jumps
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 40, end: 47 }),
            frameRate: 12,
            repeat: 0 // Play once only
        });
    }

    /**
     * Creates the jump dust effect animation
     * This provides visual feedback when the player jumps
     */
    createJumpDustAnimation(): void
    {
        // Jump dust animation - appears briefly when player jumps
        this.anims.create({
            key: 'jump-dust',
            frames: this.anims.generateFrameNumbers('jump-dust', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: 0 // Play once then destroy
        });
    }

    /**
     * Creates animations for the Ooze obstacle
     * The Ooze is a sleeping monster that blocks the player's path
     */
    createOozeAnimations(): void
    {
        // Ooze sleeping animation - slow, peaceful breathing while asleep
        this.anims.create({
            key: 'ooze-sleep',
            frames: [
                { key: 'ooze', frame: 0 },
                { key: 'ooze', frame: 1 },
                { key: 'ooze', frame: 2 },
                { key: 'ooze', frame: 3 },
            ],
            frameRate: 3, // Slow animation for sleeping effect
            repeat: -1 // Loop forever while sleeping
        });
    }

    /**
     * Loads custom font using CSS @font-face method
     */
    private loadCustomFont(): void {
        // Create CSS @font-face declaration
        const fontFace = new FontFace('PlanesValMore', 'url(src/assets/fonts/Planes_ValMore.ttf)');
        
        // Load the font and add it to the document
        fontFace.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
        }).catch((error) => {
            console.warn('Failed to load custom font:', error);
        });
    }
}
