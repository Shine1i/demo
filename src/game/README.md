# Game Code Structure Guide

This guide explains how the game code is organized after refactoring for better readability and maintainability.

## 📁 Folder Structure

```
src/game/
├── config/           # Game configuration and constants
├── scenes/           # Phaser.js scenes (different game screens)
├── systems/          # Modular game systems
└── README.md         # This guide
```

## 🎮 How the Game Works

### Game Flow
1. **Boot** → Loads essential assets
2. **Preloader** → Loads all game assets and creates animations
3. **MainMenu** → Shows the main menu with play/info buttons
4. **Game** → The main platformer gameplay
5. **GameOver** → Shows when the game ends

### Game Systems

The game is organized into modular systems that handle specific responsibilities:

#### 🎯 **Player System** (`systems/Player.ts`)
- Manages the player character
- Handles movement, jumping, and animations
- Creates visual effects like jump dust
- **Key Features:**
  - Arrow keys or WASD for movement
  - Spacebar or Up arrow to jump
  - Hold Shift to run faster
  - Automatic animations based on movement state

#### 🌄 **Background Manager** (`systems/BackgroundManager.ts`)
- Controls all parallax background layers
- Creates depth illusion by moving layers at different speeds
- **Layers (back to front):**
  - Back Sky → Slowest moving
  - Sky Glow & Clouds → Slow
  - Midground Rocks → Medium
  - Foreground Rocks → Fast
  - Ground Layer → Moves with player

#### 🎮 **Input Manager** (`systems/InputManager.ts`)
- Centralizes all keyboard input handling
- Provides clean methods to check player actions
- **Controls:**
  - Arrow Keys / WASD: Movement
  - Space/Up: Jump
  - Shift: Run
  - Escape: Return to menu

#### 🚧 **Obstacle System** (`systems/obstacles/`)
- **BaseObstacle**: Template for all obstacles
- **OozeObstacle**: Sleeping monster that blocks progress
  - Shows chat bubble when player approaches
  - Prevents player from progressing until puzzle is solved
  - Demonstrates extensible obstacle design

## ⚙️ Configuration System

All game settings are centralized in `config/GameConstants.ts`:

- **WORLD_CONFIG**: World size, ground position
- **PLAYER_CONFIG**: Movement speeds, starting position, scale
- **OBSTACLE_CONFIG**: Obstacle positions and behavior
- **BACKGROUND_CONFIG**: Parallax scroll speeds
- **UI_CONFIG**: Chat bubbles, effects timing
- **PHYSICS_CONFIG**: Gravity, frame rate settings
- **CAMERA_CONFIG**: Camera following behavior

## 🔧 Adding New Features

### Adding a New Obstacle
1. Create a new class extending `BaseObstacle`
2. Implement the required methods: `setupObstacle()`, `update()`, `onPlayerInteract()`
3. Add obstacle configuration to `GameConstants.ts`
4. Instantiate in the main Game scene

### Adding New Player Abilities
1. Add input handling to `InputManager`
2. Add new methods to `Player` class
3. Update configuration constants if needed

### Adding Background Elements
1. Load assets in `Preloader`
2. Add to `BackgroundManager.createBackground()`
3. Configure scroll speed in `BACKGROUND_CONFIG`

## 🎨 Code Style Guidelines

### Naming Conventions
- **Classes**: PascalCase (`Player`, `BackgroundManager`)
- **Methods**: camelCase (`updateParallax`, `isJumping`)
- **Constants**: UPPER_SNAKE_CASE (`PLAYER_CONFIG`, `WORLD_SIZE`)
- **Private methods**: camelCase with descriptive names

### Comments
- **Class level**: Explain purpose and main responsibilities
- **Method level**: Describe what the method does and when to use it
- **Inline**: Explain complex logic or important details
- **Configuration**: Document what each setting controls

### Organization Principles
- **Single Responsibility**: Each class has one main job
- **Dependency Injection**: Pass dependencies through constructors
- **Configuration Centralization**: All magic numbers in constants
- **Clean Interfaces**: Public methods are simple and descriptive

## 🚀 Getting Started

To understand the code:

1. **Start with `scenes/Game.ts`** - The main coordinator
2. **Read `config/GameConstants.ts`** - Understand all the settings
3. **Explore `systems/Player.ts`** - See how player movement works
4. **Check `systems/BackgroundManager.ts`** - Learn about parallax
5. **Look at `systems/obstacles/OozeObstacle.ts`** - Understand obstacles

## 💡 Key Concepts for Beginners

### Phaser.js Fundamentals
- **Scenes**: Different screens/states of the game
- **Sprites**: 2D images that can move and animate
- **Physics**: Automatic collision detection and gravity
- **Animations**: Sequences of sprite frames
- **Containers**: Groups of visual elements

### Game Architecture
- **Systems Thinking**: Break complex problems into smaller parts
- **Event-Driven**: Game responds to player input and collisions
- **State Management**: Track what the player and game objects are doing
- **Asset Pipeline**: Load → Create → Update → Cleanup

This refactored structure makes it much easier to:
- Add new obstacles and puzzles
- Modify player abilities
- Adjust game balance through configuration
- Understand how each part works independently
- Debug issues by isolating systems 