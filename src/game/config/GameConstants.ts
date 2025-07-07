/**
 * Game configuration constants
 * This file centralizes all magic numbers and configuration values used throughout the game
 */

export const WORLD_CONFIG = {
    // World bounds and size
    WORLD_SIZE: 1000000,
    WORLD_HEIGHT: 1080,
    
    // Ground and platform configuration
    GROUND_OFFSET_FROM_BOTTOM: 100,
    GROUND_PLATFORM_HEIGHT: 64,
} as const;

export const PLAYER_CONFIG = {
    // Position and scale
    STARTING_X: 300,
    STARTING_Y: 800,
    SCALE: 3,
    BOUNCE: 0.1,
    
    // Movement speeds
    WALK_SPEED: 200,
    RUN_SPEED: 300,
    JUMP_VELOCITY: -500,
    
    // Animation frame rates
    IDLE_FRAME_RATE: 4,
    RUN_FRAME_RATE: 12,
    JUMP_FRAME_RATE: 12,
} as const;

export const OBSTACLE_CONFIG = {
    // Ooze obstacle configuration
    OOZE: {
        X_POSITION: 1200,
        Y_OFFSET: 50, // Offset from ground level
        SCALE: 3,
        ANIMATION_FRAME_RATE: 2,
        INTERACTION_DISTANCE: 100,
        QUEST_BLOCKER_OFFSET: 80,
        QUEST_BLOCKER_WIDTH: 20,
    },
} as const;

export const BACKGROUND_CONFIG = {
    // Parallax scroll speeds
    SCROLL_SPEEDS: {
        BACK_SKY: 0.1,
        SKY_GLOW: 0.1,
        CLOUDS: 0.1,
        MIDGROUND_ROCKS: 0.2,
        FOREGROUND_ROCKS: 0.3,
        GROUND_LAYER: 1.0, // Same speed as player
    },
} as const;

export const UI_CONFIG = {
    // Chat bubble configuration
    CHAT_BUBBLE: {
        X_OFFSET: 135,
        Y_OFFSET: -65,
        SCALE: 0.4,
        TEXT_FONT_SIZE: '12px',
        ANIMATION_DURATION: 2000,
        ANIMATION_SCALE: 1.02,
    },
    
    // Jump dust effect
    JUMP_DUST: {
        Y_OFFSET: 30,
        FRAME_RATE: 15,
    },
} as const;

export const PHYSICS_CONFIG = {
    // Physics world settings
    GRAVITY: { x: 0, y: 800 },
    FPS: 60,
    DEBUG: false,
} as const;

export const CAMERA_CONFIG = {
    // Camera following settings
    LERP_X: 1,
    LERP_Y: 1,
    ROUND_PIXELS: true,
} as const; 