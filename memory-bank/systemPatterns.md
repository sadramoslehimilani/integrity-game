# System Patterns: Integrity - Out of Bounds

## Architecture Overview

The game follows a **Scene-based Architecture** using Phaser.js, with clear separation of concerns between game logic, UI, and assets. Each scene represents a distinct phase of the educational experience.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IntroScene    │ -> │   GameScene     │ -> │   QuizScene     │
│                 │    │                 │    │                 │
│ • Title Screen  │    │ • Soccer Field  │    │ • Questions     │
│ • Instructions  │    │ • Characters    │    │ • Scoring       │
│ • Play Button   │    │ • Dialogue      │    │ • Feedback      │
│ • Margarine Font│    │ • Transitions   │    │ • Progress      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       v
                                               ┌─────────────────┐
                                               │   EndScene      │
                                               │                 │
                                               │ • Results       │
                                               │ • Replay Option │
                                               │ • Share Feature │
                                               └─────────────────┘
```

### Implemented BaseScene Pattern

All scenes extend from `BaseScene.js` which provides:

- Scene transition management
- Responsive design utilities
- Consistent UI component creation
- Margarine font integration
- Loading state management

## Core Design Patterns

### Scene Management Pattern (✅ IMPLEMENTED)

```javascript
class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  // Implemented scene transition system
  transitionToScene(sceneKey, data = {}) {
    this.scene.start(sceneKey, data);
  }

  // Responsive design utilities
  getResponsiveSize(baseSize) {
    const scale = Math.min(
      this.cameras.main.width / 800,
      this.cameras.main.height / 600
    );
    return Math.max(baseSize * scale, baseSize * 0.5);
  }

  // Consistent UI creation with Margarine font
  createButton(x, y, text, callback, style = {}) {
    const defaultStyle = {
      fontFamily: "Margarine, cursive",
      fontSize: "24px",
      fill: "#ffffff",
      backgroundColor: "#4CAF50",
      padding: { x: 20, y: 10 },
    };
    // Implementation details...
  }
}
```

### State Machine Pattern

```javascript
class GameState {
  constructor() {
    this.currentState = "INTRO";
    this.states = {
      INTRO: new IntroState(),
      GAME: new GameState(),
      QUIZ: new QuizState(),
      END: new EndState(),
    };
  }

  transition(newState) {
    this.currentState.exit();
    this.currentState = this.states[newState];
    this.currentState.enter();
  }
}
```

### Observer Pattern for Events

```javascript
class EventManager {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}
```

## Component Relationships

### Character System (✅ IMPLEMENTED)

```
Character Positioning System
├── Nico (Main Character)
│   ├── Position: (200, 400)
│   ├── Label: "Nico" with Margarine font
│   └── Interactive: Ready for dialogue
├── Carla (Supporting Character)
│   ├── Position: (600, 400)
│   ├── Label: "Carla" with Margarine font
│   └── Interactive: Ready for dialogue
├── Coach Leo (Authority Figure)
│   ├── Position: (100, 200)
│   ├── Label: "Coach Leo" with Margarine font
│   └── Interactive: Ready for dialogue
└── Referee (Game Official)
    ├── Position: (700, 200)
    ├── Label: "Referee" with Margarine font
    └── Interactive: Ready for dialogue
```

### Dialogue System Framework

```javascript
// Implemented in GameScene.js
setupUI() {
  this.dialogueBox = this.add.rectangle(400, 500, 760, 120, 0x000000, 0.8);
  this.dialogueText = this.add.text(400, 500, '', {
    fontFamily: 'Margarine, cursive',
    fontSize: '18px',
    fill: '#ffffff',
    align: 'center',
    wordWrap: { width: 720 }
  }).setOrigin(0.5);
}
```

### UI System (✅ IMPLEMENTED)

```
UI Components (All with Margarine Font)
├── Buttons (BaseScene.createButton)
│   ├── Play Button (IntroScene)
│   ├── Instructions Button (IntroScene)
│   ├── Continue Button (GameScene)
│   └── Quiz Choice Buttons (QuizScene)
├── Text Displays (BaseScene.createStyledText)
│   ├── Title Text (All Scenes)
│   ├── Dialogue Text (GameScene)
│   ├── Question Text (QuizScene)
│   └── Feedback Text (QuizScene, EndScene)
├── Interactive Elements
│   ├── Instructions Overlay (IntroScene)
│   ├── Quiz Progress Display (QuizScene)
│   ├── Score Tracking (QuizScene)
│   └── Results Display (EndScene)
└── Responsive Design
    ├── Dynamic Scaling (All Scenes)
    ├── Flexible Layouts (All Scenes)
    └── Touch-Friendly Controls (All Scenes)
```

### Font Integration Pattern (✅ IMPLEMENTED)

```javascript
// Google Fonts integration in index.html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Margarine&display=swap" rel="stylesheet">

// Consistent font application across all scenes
const defaultStyle = {
  fontFamily: 'Margarine, cursive',
  // Other styling properties...
};
```

### Asset Management

```
AssetLoader
├── Spritesheets
│   ├── Character Sprites
│   │   ├── coach-leo-spritesheet (1000x657, 4 frames)
│   │   └── [other character animations]
│   ├── UI Elements
│   └── Effects
├── Audio
│   ├── Background Music
│   ├── Sound Effects
│   └── Voice Clips
└── Backgrounds
    ├── Soccer Field
    └── UI Overlays
```

### Animation Asset Structure

```
assets/
├── images/
│   ├── characters/
│   │   ├── leo-animation.png (1000x657, 4 frames)
│   │   ├── nico-runing-animation.png (1951x314, 12 frames with 10px spacing)
│   │   ├── carla-speaking.png (1816x408, 9 frames with 10px spacing)
│   │   └── [other character spritesheets]
│   └── backgrounds/
└── audio/ (pending)
```

## Critical Implementation Paths

### Game Flow Control

1. **Scene Transitions**: Managed through Phaser's scene system with data passing
2. **Decision Branching**: Player choice determines outcome animations and messages
3. **Progress Tracking**: Quiz answers tracked for feedback and scoring
4. **Replay Logic**: End scene provides seamless restart capability

### Animation System

```javascript
class AnimationManager {
  playSequence(character, sequence) {
    // Play animation frames in order
    // Handle completion callbacks
    // Manage timing and transitions
  }

  createTween(target, properties, duration) {
    // Create smooth transitions
    // Handle easing functions
    // Support callbacks
  }
}

// Character spritesheet animation implementation examples

// Coach Leo animation
this.anims.create({
    key: 'coach-leo-animation',
    frames: this.anims.generateFrameNumbers('leo-animation', {
        start: 0,
        end: 3
    }),
    frameRate: 4,
    repeat: -1
});

// Nico animation
this.anims.create({
    key: 'nico-talk',
    frames: this.anims.generateFrameNumbers('nico-animation', {
        start: 0,
        end: 11
    }),
    frameRate: 12,
    repeat: -1
});

// Carla animation
this.anims.create({
    key: 'carla-talk',
    frames: this.anims.generateFrameNumbers('carla-animation', {
        start: 0,
        end: 8
    }),
    frameRate: 9,
    repeat: -1
});

// Character sprite positioning with animation
const coachLeoSprite = this.add.sprite(x, y, 'leo-animation')
    .setScale(0.5)
    .setOrigin(0, 1)
    .setDepth(1000)
    .setAlpha(0)
    .play('coach-leo-animation');
```

### Input Handling

```javascript
class InputController {
  setupButton(button, callback) {
    // Add hover effects
    // Handle click/touch events
    // Provide visual feedback
    // Prevent multiple rapid clicks
  }

  handleKeyboardNavigation() {
    // Arrow key navigation
    // Enter/Space for selection
    // Accessibility support
  }
}
```

## Key Technical Decisions

### Scene Architecture Decision

**Decision**: Use Phaser's built-in scene system instead of custom state management
**Rationale**:

- Official Phaser.js pattern
- Built-in lifecycle management
- Automatic asset cleanup
- Easy transitions with data passing

### Asset Loading Strategy

**Decision**: Progressive loading with preload scenes
**Rationale**:

- Faster initial load times
- Better user experience
- Memory management
- Loading screen feedback

### Animation Approach

**Decision**: Spritesheet animations with tweening
**Rationale**:

- Smooth 60fps performance
- Memory efficient
- Easy to create and modify
- Consistent timing control

### UI Framework Choice

**Decision**: Custom Phaser.js UI components
**Rationale**:

- Full control over styling
- Consistent with game aesthetic
- Better performance than DOM elements
- Touch-friendly for mobile

## Data Flow Patterns

### Player Decision Flow

```
User Input → Input Validation → State Update → Animation Trigger → Message Display → Scene Transition
```

### Quiz System Flow

```
Question Display → Answer Selection → Validation → Feedback Animation → Score Update → Next Question/Completion
```

### Asset Loading Flow

```
Scene Preload → Asset Queue → Progress Tracking → Completion Callback → Scene Creation
```

## Error Handling Patterns

### Asset Loading Errors

```javascript
try {
  this.load.spritesheet("character", "assets/character.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
} catch (error) {
  console.error("Asset loading failed:", error);
  // Fallback to placeholder
}
```

### Scene Transition Errors

```javascript
this.scene
  .start("GameScene", {
    playerChoice: this.selectedChoice,
  })
  .catch((error) => {
    console.error("Scene transition failed:", error);
    // Handle gracefully
  });
```

## Performance Optimization Patterns

### Object Pooling

```javascript
class ParticlePool {
  constructor(scene, size) {
    this.pool = [];
    for (let i = 0; i < size; i++) {
      this.pool.push(scene.add.particles(0, 0, "particle"));
    }
  }

  get() {
    return this.pool.pop() || this.createNew();
  }

  release(particle) {
    particle.setActive(false);
    this.pool.push(particle);
  }
}
```

### Texture Atlas Usage

- Combine multiple small images into single texture
- Reduce draw calls
- Improve rendering performance
- Easier asset management

## Testing Patterns

### Scene Testing

```javascript
describe("GameScene", () => {
  test("should handle player decision correctly", () => {
    const scene = new GameScene();
    scene.create();
    scene.makeDecision("truth");
    expect(scene.playerChoice).toBe("truth");
  });
});
```

### Animation Testing

```javascript
describe("AnimationManager", () => {
  test("should play animation sequence", () => {
    const manager = new AnimationManager();
    const mockCharacter = { play: jest.fn() };
    manager.playSequence(mockCharacter, ["idle", "kick"]);
    expect(mockCharacter.play).toHaveBeenCalledWith("kick");
  });
});
```
