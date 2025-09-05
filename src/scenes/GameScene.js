import { BaseScene } from "./BaseScene.js";

/**
 * GameScene - Main gameplay scene where the soccer practice scenario unfolds
 * Handles character interactions, story progression, and decision points
 */
export class GameScene extends BaseScene {
  constructor() {
    super("GameScene");
    this.currentStoryStep = 0;
    this.gameData = {
      playerChoices: [],
      integrityScore: 0,
    };
  }

  init(data) {
    super.init(data);
    console.log("[GameScene] init called with data:", data);
    
    // Always reset game state to ensure clean start
    console.log("[GameScene] Initializing fresh game state");
    this.currentStoryStep = 0;
    
    // If this is a reset from EndScene, preserve the reset flag and timestamp
    if (data && data.reset) {
      console.log("[GameScene] Reset detected with timestamp:", data.timestamp);
      this.gameData = {
        playerChoices: [],
        integrityScore: 0,
        playerName: data.playerName || "Nico",
        gameMode: data.gameMode || "story",
        reset: true,
        timestamp: data.timestamp
      };
    } else {
      // Normal game start
      this.gameData = {
        playerChoices: [],
        integrityScore: 0,
        playerName: data?.playerName || "Nico",
        gameMode: data?.gameMode || "story"
      };
    }
    
    console.log("[GameScene] Initialized with gameData:", this.gameData);
    console.log("[GameScene] Starting with currentStoryStep:", this.currentStoryStep);
  }

  preload() {
    // Load soccer field background using intro background for consistency
    this.load.image("soccer-field", "assets/intro-background.png"); // Using intro background for visual consistency

    // Load UI elements
    this.load.image("dialogue-box", "assets/phaser.png"); // Placeholder for dialogue box

    // Load Coach Leo animation spritesheet (1000x657, 4 frames in 1 row)
    this.load.spritesheet(
      "leo-animation",
      "assets/charecters/leo-animation.png",
      {
        frameWidth: 250, // Exact calculation: 1000/4 = 250
        frameHeight: 657,
      }
    );

    // Load Nico animation spritesheet (1951x314, 12 frames in 1 row with 10px padding)
    this.load.spritesheet(
      "nico-animation",
      "assets/charecters/nico-runing-animation.png",
      {
        frameWidth: 152.6, // Calculation: (1951 - (11 * 10)) / 12 = 152.6
        frameHeight: 314,
        spacing: 10, // Account for 10px padding between frames
      }
    );

    this.showLoading();
  }

  create() {
    super.create();
    this.hideLoading();
    
    console.log("[GameScene] create called with data:", this.gameData);
    
    // Reset game data if this is a new game
    this.currentStoryStep = 0;
    console.log("[GameScene] Reset currentStoryStep to", this.currentStoryStep);
    
    // Setup soccer field
    this.setupSoccerField();

    // Character setup removed - no placeholder characters

    // Setup UI
    this.setupUI();

    // Setup character animations
    this.setupCoachLeoAnimation();
    this.setupNicoAnimation();

    // Start the story
    this.startStory();
  }

  /**
   * Setup the soccer field background and environment
   */
  setupSoccerField() {
    // Add field background
    this.field = this.add.image(this.centerX, this.centerY, "soccer-field");
    this.field.setDisplaySize(this.gameWidth, this.gameHeight);
    // Clean background without any field markings
  }

  /**
   * Setup character sprites and positions - removed placeholder implementation
   */
  setupCharacters() {
    // Character system will be implemented when proper character assets are available
    this.characters = {};
    this.characterLabels = {};
  }

  /**
   * Add name labels for characters - removed placeholder implementation
   */
  addCharacterLabels() {
    // Character labels will be implemented when proper character assets are available
  }

  /**
   * Setup UI elements for dialogue and choices
   */
  setupUI() {
    // Dialogue container
    this.dialogueContainer = this.add.container(0, 0);

    // Dialogue background
    this.dialogueBg = this.add.rectangle(
      this.centerX,
      this.gameHeight - 120,
      this.gameWidth - 40,
      200,
      0x2c3e50,
      0.9
    );
    this.dialogueBg.setStrokeStyle(3, 0x3498db);

    // Dialogue text
    this.dialogueText = this.add
      .text(this.centerX, this.gameHeight - 140, "", {
        fontSize: "20px",
        fontFamily: "Margarine, cursive",
        color: "#ecf0f1",
        align: "center",
        wordWrap: { width: this.gameWidth - 100 },
      })
      .setOrigin(0.5);

    // Speaker name
    this.speakerText = this.add.text(60, this.gameHeight - 200, "", {
      fontSize: "18px",
      fontFamily: "Margarine, cursive",
      color: "#f39c12",
      fontStyle: "bold",
    });

    // Choice buttons container
    this.choiceContainer = this.add.container(0, 0);

    // Add to dialogue container
    this.dialogueContainer.add([
      this.dialogueBg,
      this.dialogueText,
      this.speakerText,
    ]);

    // Initially hide dialogue
    this.dialogueContainer.setAlpha(0);

    // Continue button
    this.continueButton = this.createButton(
      this.gameWidth - 100,
      this.gameHeight - 60,
      "Continue",
      () => this.continueStory(),
      {
        fontSize: "16px",
        backgroundColor: "#27ae60",
      }
    );
    this.continueButton.background.setAlpha(0);
    this.continueButton.text.setAlpha(0);
  }

  /**
   * Setup Coach Leo animation sprite and configuration
   */
  setupCoachLeoAnimation() {
    // Create Coach Leo animation sprite - positioned above dialogue box
    this.coachLeoSprite = this.add.sprite(
      80,
      this.gameHeight - 280,
      "leo-animation"
    );
    this.coachLeoSprite.setScale(0.5); // Scale down to fit above dialog area
    this.coachLeoSprite.setOrigin(0, 1); // Anchor to bottom-left
    this.coachLeoSprite.setAlpha(0); // Initially hidden
    this.coachLeoSprite.setDepth(1000); // Ensure it appears above dialogue box

    // Create animation configuration
    this.anims.create({
      key: "leo-talk",
      frames: this.anims.generateFrameNumbers("leo-animation", {
        start: 0,
        end: 3,
      }),
      frameRate: 4, // 4 frames per second for slower animation
      repeat: -1, // Loop infinitely
    });
  }

  /**
   * Setup Nico animation sprite and configuration
   */
  setupNicoAnimation() {
    // Create Nico animation sprite - positioned above dialogue box on the left side like Coach Leo
    this.nicoSprite = this.add.sprite(
      80,
      this.gameHeight - 300,
      "nico-animation"
    );
    this.nicoSprite.setScale(0.55); // Adjusted scale for new dimensions
    this.nicoSprite.setOrigin(0, 1); // Anchor to bottom-left like Coach Leo
    this.nicoSprite.setAlpha(0); // Initially hidden
    this.nicoSprite.setDepth(1000); // Ensure it appears above dialogue box

    // Create animation configuration
    this.anims.create({
      key: "nico-talk",
      frames: this.anims.generateFrameNumbers("nico-animation", {
        start: 0,
        end: 11,
      }),
      frameRate: 8, // 8 frames per second for fluid animation
      repeat: -1, // Loop infinitely
    });
  }

  /**
   * Start the story sequence
   */
  startStory() {
    // Story steps array
    this.storySteps = [
      {
        speaker: "Narrator",
        text: "Welcome to soccer practice! Nico and his teammates are getting ready for a friendly scrimmage.",
        action: "highlight",
        target: "nico",
      },
      {
        speaker: "Coach Leo",
        text: "Alright team! Today we're going to practice fair play and good sportsmanship. Remember, it's not just about winning!",
        action: "highlight",
        target: "coachLeo",
      },
      {
        speaker: "Nico",
        text: "I'm ready, Coach! I've been practicing my passing skills all week.",
        action: "highlight",
        target: "nico",
      },
      {
        speaker: "Coach Leo",
        text: "That's great to hear, Nico! Let's see those skills in action today.",
        action: "highlight",
        target: "coachLeo",
      },
      {
        speaker: "Narrator",
        text: "The practice match begins. Nico is playing well, but then something unexpected happens...",
        action: "setup_scenario",
      },
      {
        speaker: "Nico",
        text: "Hmm, I'm pretty sure that ball went out of bounds, but the referee didn't see it. Should I say something?",
        action: "highlight",
        target: "nico",
      },
    ];

    this.currentStoryStep = 0;
    this.showDialogue();
  }

  /**
   * Show dialogue with current story step
   */
  showDialogue() {
    const step = this.storySteps[this.currentStoryStep];

    if (!step) {
      this.startDecisionPoint();
      return;
    }

    // Update speaker and text
    this.speakerText.setText(step.speaker + ":");
    this.dialogueText.setText(step.text);

    // Show/hide Coach Leo animation based on speaker
    if (step.speaker === "Coach Leo") {
      // Show and start Coach Leo animation
      this.coachLeoSprite.play("leo-talk");
      this.tweens.add({
        targets: this.coachLeoSprite,
        alpha: 1,
        duration: 500,
        ease: "Power2.easeOut",
      });

      // Hide Nico animation when Coach Leo is speaking
      this.tweens.add({
        targets: this.nicoSprite,
        alpha: 0,
        duration: 300,
        ease: "Power2.easeOut",
        onComplete: () => {
          this.nicoSprite.stop(); // Stop animation when hidden
        },
      });
    } else if (step.speaker === "Nico") {
      // Show and start Nico animation
      this.nicoSprite.play("nico-talk");
      this.tweens.add({
        targets: this.nicoSprite,
        alpha: 1,
        duration: 500,
        ease: "Power2.easeOut",
      });

      // Hide Coach Leo animation when Nico is speaking
      this.tweens.add({
        targets: this.coachLeoSprite,
        alpha: 0,
        duration: 300,
        ease: "Power2.easeOut",
        onComplete: () => {
          this.coachLeoSprite.stop(); // Stop animation when hidden
        },
      });
    } else {
      // Hide both character animations for other speakers
      this.tweens.add({
        targets: [this.coachLeoSprite, this.nicoSprite],
        alpha: 0,
        duration: 300,
        ease: "Power2.easeOut",
        onComplete: () => {
          this.coachLeoSprite.stop(); // Stop animations when hidden
          this.nicoSprite.stop();
        },
      });
    }

    // Show dialogue container
    this.tweens.add({
      targets: this.dialogueContainer,
      alpha: 1,
      duration: 500,
      ease: "Power2.easeOut",
    });

    // Show continue button
    this.tweens.add({
      targets: [this.continueButton.background, this.continueButton.text],
      alpha: 1,
      duration: 500,
      delay: 300,
      ease: "Power2.easeOut",
    });

    // Handle special actions
    if (step.action === "highlight" && step.target) {
      this.highlightCharacter(step.target);
    }
  }

  /**
   * Highlight a specific character - placeholder implementation
   */
  highlightCharacter(characterKey) {
    // Character highlighting will be implemented when proper character assets are available
    console.log(`Would highlight character: ${characterKey}`);
  }

  /**
   * Continue to next story step
   */
  continueStory() {
    // Hide continue button
    this.tweens.add({
      targets: [this.continueButton.background, this.continueButton.text],
      alpha: 0,
      duration: 300,
      ease: "Power2.easeIn",
    });

    // Hide dialogue
    this.tweens.add({
      targets: this.dialogueContainer,
      alpha: 0,
      duration: 300,
      ease: "Power2.easeIn",
      onComplete: () => {
        this.currentStoryStep++;
        this.showDialogue();
      },
    });
  }

  /**
   * Start the decision point where player makes choices
   */
  startDecisionPoint() {
    // This will transition to QuizScene for the decision-making part
    this.transitionToScene("QuizScene", {
      scenario: "out_of_bounds",
      gameData: this.gameData,
    });
  }
}
