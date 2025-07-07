import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { PHYSICS_CONFIG } from './config';

/**
 * Main Phaser.js game configuration
 * This sets up the game engine with all necessary settings for our platformer
 * Find out more: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
 */
const gameConfig: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },
    fps: {
        target: PHYSICS_CONFIG.FPS,
        forceSetTimeOut: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: PHYSICS_CONFIG.GRAVITY,
            fps: PHYSICS_CONFIG.FPS,
            debug: PHYSICS_CONFIG.DEBUG
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

let gameInstance: Game | null = null;

/**
 * Starts the Phaser.js game and cleans up any previous instance
 * @param parentElementId - The ID of the DOM element to contain the game
 * @returns The created game instance
 */
const StartGame = (parentElementId: string): Game => {
    // Clean up previous game instance to prevent memory leaks
    if (gameInstance) {
        gameInstance.destroy(true, false);
        gameInstance = null;
    }

    gameInstance = new Game({ ...gameConfig, parent: parentElementId });
    return gameInstance;
}

export default StartGame;
