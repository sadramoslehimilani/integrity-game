# System Patterns: Integrity - The Lost Whistle

## Architecture Overview

The game follows a **Scene-based Architecture** using Phaser.js, with clear separation of concerns between game logic, UI, and assets. Each scene represents a distinct phase of the educational experience.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IntroScene    │ -> │   GameScene     │ -> │   QuizScene     │
│                 │    │                 │    │                 │
│ • Title Screen  │    │ • Story Setup   │    │ • Reflection    │
│ • Character     │    │ • Decision      │    │ • Questions     │
│   Intros        │    │ • Outcomes      │    │ • Feedback      │
│ • Menu Options  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       v
                                               ┌─────────────────┐
                                               │   EndScene      │
                                               │                 │
                                               │ • Challenge     │
                                               │ • Replay Option │
                                               │ • Credits       │
                                               └─────────────────┘
```

## Core Design Patterns

### Scene Management Pattern

```javascript
class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  preload() {
    // Asset loading logic
  }

  create() {
    // Scene initialization
  }

  update(time, delta) {
    // Game loop logic
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

### Character System

```
Character (Base Class)
├── Nico (Player Character)
│   ├── Idle Animation
│   ├── Kick Animation
│   ├── Thinking Pose
│   └── Raise Hand Animation
├── Carla (Friend)
│   ├── Idle Animation
│   ├── Applaud Animation
│   └── Disappointed Animation
├── Coach Leo
│   ├── Idle Animation
│   └── Nodding Animation
└── Referee
    ├── Idle Animation
    └── Pointing Animation
```

### UI System

```
UI Components
├── Buttons
│   ├── DecisionButton (Truth/Silent)
│   ├── MenuButton (Play/About/Quit)
│   └── QuizButton (Multiple Choice)
├── Text Displays
│   ├── DialogueBox
│   ├── MoralMessage
│   └── QuizQuestion
└── Effects
    ├── ThoughtBubble
    ├── SparkleEffect
    └── ParticleSystem
```

### Asset Management

```
AssetLoader
├── Spritesheets
│   ├── Character Sprites
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
