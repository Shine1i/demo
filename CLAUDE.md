# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **2D platformer game** built with **Phaser 3** and packaged as a **desktop application** using **Tauri**. The codebase follows a modular, component-based architecture.

### Key Entry Points
- `src/main.ts` - Application bootstrap
- `src/game/main.ts` - Phaser game initialization  
- `src-tauri/src/main.rs` - Rust/Tauri desktop app entry

### Core Architecture
- **Scene-based**: Boot → Preloader → MainMenu → Game → GameOver
- **System-based**: Modular systems for player, background, obstacles, input
- **Configuration-driven**: Centralized constants in `src/game/config/GameConstants.ts`

### Directory Structure
```
src/
├── game/
│   ├── main.ts              # Game initialization
│   ├── config/              # Game constants and configuration
│   ├── scenes/              # Phaser game scenes
│   └── systems/             # Game systems (Player, Background, etc.)
├── assets/                  # Game assets (sprites, backgrounds, fonts)
└── main.ts                  # App entry point
```

## Game Configuration

All game constants are centralized in `src/game/config/GameConstants.ts`:
- `WORLD_CONFIG` - World size and bounds
- `PLAYER_CONFIG` - Player movement, animation, physics
- `OBSTACLE_CONFIG` - Obstacle behavior and positioning
- `BACKGROUND_CONFIG` - Parallax scrolling speeds
- `UI_CONFIG` - Chat bubbles, effects, UI elements
- `PHYSICS_CONFIG` - Gravity, FPS, debug settings
- `CAMERA_CONFIG` - Camera following and rendering

## Technology Stack

- **Phaser 3.88.2** - Game engine
- **Tauri 2.x** - Desktop app framework (Rust + WebView)
- **Vite 6.0.3** - Build tool and dev server
- **TypeScript 5.6.2** - Type-safe JavaScript
- **Pixel Art Style** - 3x scaled sprites with pixel-perfect rendering

## Game Systems

### Player System (`src/game/systems/Player.ts`)
- Movement: Arrow keys/WASD, Space/Up for jump, Shift for run
- Physics: Arcade physics with gravity and collision detection
- Animations: Idle, run, jump with proper state management

### Background System (`src/game/systems/BackgroundManager.ts`)
- Multi-layer parallax scrolling with different speeds
- Layers: Sky, clouds, midground rocks, foreground rocks, ground

### Obstacle System (`src/game/systems/obstacles/`)
- Base class pattern for extensible obstacles
- Current implementation: Ooze monster with proximity interaction

## Development Guidelines
* Always read entire files. Otherwise, you don’t know what you don’t know, and will end up making mistakes, duplicating code that already exists, or misunderstanding the architecture.
* Commit early and often. When working on large tasks, your task could be broken down into multiple logical milestones. After a certain milestone is completed and confirmed to be ok by the user, you should commit it. If you do not, if something goes wrong in further steps, we would need to end up throwing away all the code, which is expensive and time consuming.
* Your internal knowledgebase of libraries might not be up to date. When working with any external library, unless you are 100% sure that the library has a super stable interface, you will look up the latest syntax and usage via either Context7 mcp server (first preference)  or Perplexity mcp (less preferred, only use if Context7 is not available or enough)
* Do not say things like: “x library isn’t working so I will skip it”. Generally, it isn’t working because you are using the incorrect syntax or patterns. This applies doubly when the user has explicitly asked you to use a specific library, if the user wanted to use another library they wouldn’t have asked you to use a specific one in the first place.
* Always run linting after making major changes. Otherwise, you won’t know if you’ve corrupted a file or made syntax errors, or are using the wrong methods, or using methods in the wrong way.
* Please organise code into separate files wherever appropriate, and follow general coding best practices about variable naming, modularity, function complexity, file sizes, commenting, etc.
* Code is read more often than it is written, make sure your code is always optimised for readability and intuative undrestanding without over engineering.
* Unless explicitly asked otherwise, the user never wants you to do a “dummy” implementation of any given task. Never do an implementation where you tell the user: “This is how it *would* look like”. Just implement the thing.
* Whenever you are starting a new task, it is of utmost importance that you have clarity about the task. You should ask the user follow up questions if you do not, rather than making incorrect assumptions.
* Do not carry out large refactors unless explicitly instructed to do so.
* When starting on a new task, you should first understand the current architecture, identify the files you will need to modify, and come up with a Plan. In the Plan, you will think through architectural aspects related to the changes you will be making, consider edge cases, and identify the best approach for the given task. Get your Plan approved by the user before writing a single line of code.
* If you are running into repeated issues with a given task, figure out the root cause instead of throwing random things at the wall and seeing what sticks, or throwing in the towel by saying “I’ll just use another library / do a dummy implementation”.
* You are an incredibly talented and experienced polyglot with decades of experience in diverse areas such as software architecture, system design, development, UI & UX, copywriting, and more.
* When doing UI & UX work, make sure your designs are both aesthetically pleasing, easy to use, and follow UI / UX best practices. You pay attention to interaction patterns, micro-interactions, and are proactive about creating smooth, engaging user interfaces that delight users.
* When you receive a task that is very large in scope or too vague, you will first try to break it down into smaller subtasks. If that feels difficult or still leaves you with too many open questions, push back to the user and ask them to consider breaking down the task for you, or guide them through that process. This is important because the larger the task, the more likely it is that things go wrong, wasting time and energy for everyone involved.
