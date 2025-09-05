import { BaseScene } from "./BaseScene.js";

/**
 * QuizScene - Handles decision-making scenarios and integrity questions
 * Presents moral dilemmas and tracks player choices for scoring
 */
export class QuizScene extends BaseScene {
  constructor() {
    super("QuizScene");
    this.currentQuestion = 0;
    this.playerAnswers = [];
    this.integrityScore = 0;
  }

  init(data) {
    super.init(data);
    console.log("[QuizScene] init called with data:", data);
    
    // Always reset quiz state to ensure clean start
    console.log("[QuizScene] Initializing fresh quiz state");
    this.currentQuestion = 0;
    this.playerAnswers = [];
    this.integrityScore = 0;
    
    // Set scenario
    this.scenario = data?.scenario || "out_of_bounds";
    
    // If this is a reset from EndScene or has gameData with reset flag, preserve the reset info
    if ((data && data.reset) || (data?.gameData && data.gameData.reset)) {
      const timestamp = data.reset ? data.timestamp : data.gameData.timestamp;
      console.log("[QuizScene] Reset detected with timestamp:", timestamp);
      
      this.gameData = {
        playerChoices: [],
        integrityScore: 0,
        reset: true,
        timestamp: timestamp
      };
    } else {
      // Use provided gameData or create new one
      this.gameData = data?.gameData || { playerChoices: [], integrityScore: 0 };
    }
    
    console.log("[QuizScene] Initialized with scenario:", this.scenario);
    console.log("[QuizScene] Initialized with gameData:", this.gameData);
    console.log("[QuizScene] Starting with currentQuestion:", this.currentQuestion);
  }

  preload() {
    // Load quiz background (using same background as GameScene)
    this.load.image("quiz-background", "assets/intro-background.png");

    // Load character portraits for questions
    this.load.image(
      "nico-portrait",
      "assets/charecters/nico-runing-animation.png"
    );
    this.load.image("carla-portrait", "assets/charecters/carla-speaking.png");

    // Load Carla animation spritesheet (1816x408, 9 frames in 1 row with 10px padding)
    this.load.spritesheet(
      "carla-animation",
      "assets/charecters/carla-speaking.png",
      {
        frameWidth: 192.9, // Calculation: (1816 - (8 * 10)) / 9 = 192.9
        frameHeight: 408,
        spacing: 10, // Account for 10px padding between frames
      }
    );

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

    // Setup background
    this.setupBackground();

    // Setup quiz UI
    this.setupQuizUI();

    // Setup character animations
    this.setupCarlaAnimation();
    this.setupLeoAnimation();
    this.setupNicoAnimation();

    // Load scenario questions
    this.loadScenarioQuestions();

    // Start first question
    this.showQuestion();
  }

  /**
   * Setup Carla animation sprite and configuration
   */
  setupCarlaAnimation() {
    // Create Carla animation sprite - positioned where the character portrait is
    this.carlaSprite = this.add.sprite(
      this.centerX - 250,
      this.centerY - 100,
      "carla-animation"
    );
    this.carlaSprite.setScale(0.45); // Adjusted scale for the quiz scene
    this.carlaSprite.setOrigin(0.5, 0.5); // Center origin
    this.carlaSprite.setAlpha(0); // Initially hidden
    this.carlaSprite.setDepth(1001); // Ensure it appears above other elements

    // Create animation configuration
    this.anims.create({
      key: "carla-talk",
      frames: this.anims.generateFrameNumbers("carla-animation", {
        start: 0,
        end: 8,
      }),
      frameRate: 8, // 8 frames per second for fluid animation
      repeat: -1, // Loop infinitely
    });
  }

  /**
   * Setup Leo animation sprite and configuration
   */
  setupLeoAnimation() {
    // Create Leo animation sprite - positioned where the character portrait is
    this.leoSprite = this.add.sprite(
      this.centerX - 250,
      this.centerY - 100,
      "leo-animation"
    );
    this.leoSprite.setScale(0.35); // Adjusted scale for the quiz scene
    this.leoSprite.setOrigin(0.5, 0.5); // Center origin
    this.leoSprite.setAlpha(0); // Initially hidden
    this.leoSprite.setDepth(1001); // Ensure it appears above other elements

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
    // Create Nico animation sprite - positioned where the character portrait is
    this.nicoSprite = this.add.sprite(
      this.centerX - 250,
      this.centerY - 100,
      "nico-animation"
    );
    this.nicoSprite.setScale(0.45); // Adjusted scale for the quiz scene
    this.nicoSprite.setOrigin(0.5, 0.5); // Center origin
    this.nicoSprite.setAlpha(0); // Initially hidden
    this.nicoSprite.setDepth(1001); // Ensure it appears above other elements

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
   * Setup the quiz background
   */
  setupBackground() {
    this.background = this.add.image(
      this.centerX,
      this.centerY,
      "quiz-background"
    );
    this.background.setDisplaySize(this.gameWidth, this.gameHeight);

    // Add semi-transparent overlay for better text readability (same as IntroScene)
    this.overlay = this.add.rectangle(
      this.centerX,
      this.centerY,
      this.gameWidth,
      this.gameHeight,
      0x000000,
      0.5
    );
  }

  /**
   * Setup quiz UI elements
   */
  setupQuizUI() {
    // Question container
    this.questionContainer = this.add.container(0, 0);

    // Question background panel
    this.questionPanel = this.add.rectangle(
      this.centerX,
      this.centerY - 100,
      this.gameWidth - 100,
      300,
      0xecf0f1,
      0.95
    );
    this.questionPanel.setStrokeStyle(4, 0x3498db);

    // Character portrait
    this.characterPortrait = this.add.image(
      this.centerX - 250,
      this.centerY - 100,
      "nico-portrait"
    );
    this.characterPortrait.setScale(0.4);
    this.characterPortrait.setTint(0x3498db);

    // Question text
    this.questionText = this.add
      .text(this.centerX - 50, this.centerY - 150, "", {
        fontSize: "24px",
        fontFamily: "Margarine, cursive",
        color: "#2c3e50",
        align: "left",
        wordWrap: { width: 400 },
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // Scenario description
    this.scenarioText = this.add
      .text(this.centerX - 50, this.centerY - 80, "", {
        fontSize: "18px",
        fontFamily: "Margarine, cursive",
        color: "#34495e",
        align: "left",
        wordWrap: { width: 400 },
      })
      .setOrigin(0, 0.5);

    // Add to question container
    this.questionContainer.add([
      this.questionPanel,
      this.characterPortrait,
      this.questionText,
      this.scenarioText,
    ]);

    // Choice buttons container
    this.choiceContainer = this.add.container(0, 0);

    // Progress indicator
    this.progressText = this.add
      .text(this.gameWidth - 50, 50, "", {
        fontSize: "16px",
        fontFamily: "Margarine, cursive",
        color: "#ecf0f1",
        backgroundColor: "#34495e",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(1, 0);

    // Score indicator
    this.scoreText = this.add
      .text(50, 50, "Integrity Score: 0", {
        fontSize: "16px",
        fontFamily: "Margarine, cursive",
        color: "#ecf0f1",
        backgroundColor: "#27ae60",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0, 0);
  }

  /**
   * Load questions based on scenario
   */
  loadScenarioQuestions() {
    // Define questions for the "ball out of bounds" scenario
    this.questions = [
      {
        character: "Narrator",
        portrait: "nico-portrait",
        question: "The Out of Bounds Ball",
        scenario:
          "During practice, Nico sees the ball go out of bounds, but the referee doesn't notice and allows play to continue. Nico's team keeps possession. What should Nico do?",
        choices: [
          {
            text: "Tell the referee immediately that the ball went out",
            integrity: 10,
            feedback:
              "Excellent! Being honest right away shows great integrity.",
          },
          {
            text: "Wait until after the play to mention it",
            integrity: 5,
            feedback: "Good thinking, but it's better to be honest right away.",
          },
          {
            text: "Don't say anything since it benefits my team",
            integrity: 0,
            feedback:
              "This isn't the right choice. Honesty is always the best policy, even when it doesn't benefit you.",
          },
        ],
      },
      {
        character: "Carla",
        portrait: "carla-portrait",
        question: "Carla's Question",
        scenario:
          'Carla also saw the ball go out of bounds. She asks Nico, "Are you going to tell the referee it was out?" How should Nico respond?',
        choices: [
          {
            text: '"Yes, I should tell the truth even if it means losing possession."',
            integrity: 10,
            feedback:
              "Perfect! Nico shows he understands the importance of honesty.",
          },
          {
            text: '"Maybe... I\'m not sure what to do."',
            integrity: 3,
            feedback:
              "It's okay to feel uncertain, but the right thing to do is be honest.",
          },
          {
            text: '"No, it\'s not a big deal and it helps our team."',
            integrity: 0,
            feedback:
              "Even small mistakes matter. Being honest builds trust and shows true sportsmanship.",
          },
        ],
      },
      {
        character: "Coach Leo",
        portrait: "nico-portrait",
        question: "Coach's Lesson",
        scenario:
          'Coach Leo talks to the team about integrity. He asks, "Why is it important to be honest in sports, even when it might disadvantage your team?"',
        choices: [
          {
            text: '"Because fair play and honesty are more important than winning"',
            integrity: 10,
            feedback:
              "Exactly right! True sportsmanship values integrity over victory.",
          },
          {
            text: '"Because we might get in trouble if we get caught cheating"',
            integrity: 5,
            feedback:
              "That's one reason, but the best reason is that fair play and integrity are fundamental to good sportsmanship.",
          },
          {
            text: '"I don\'t know"',
            integrity: 2,
            feedback:
              "That's okay! The important thing is that honesty and fair play are more important than winning at all costs.",
          },
        ],
      },
      {
        character: "Coach Leo",
        portrait: "nico-portrait",
        question: "The Unearned Point",
        scenario:
          "During a game, you score a point, but you know the ball actually touched your hand first which should make it the other team's point. The referee didn't see it. What's the right thing to do?",
        choices: [
          {
            text: "Keep it secret",
            integrity: 0,
            feedback:
              "This choice doesn't show integrity. Being honest even when it costs you something is what true sportsmanship is about.",
          },
          {
            text: "Admit it even if you lose the point",
            integrity: 10,
            feedback:
              "Excellent! You showed great integrity by being honest even when it meant losing a point.",
          },
          {
            text: "Laugh because you were lucky",
            integrity: 0,
            feedback:
              "This isn't showing good sportsmanship. Integrity means being honest even when it's not in your favor.",
          },
        ],
      },
      {
        character: "Carla",
        portrait: "carla-portrait",
        question: "Supporting Your Team",
        scenario:
          "Your teammate misses an easy goal and looks upset. What do you do?",
        choices: [
          {
            text: "Tease them",
            integrity: 0,
            feedback:
              "This isn't kind or supportive. Everyone makes mistakes, and good teammates build each other up.",
          },
          {
            text: "Encourage them to keep going",
            integrity: 10,
            feedback:
              "Great job! Supporting teammates when they make mistakes shows true sportsmanship.",
          },
          {
            text: "Ignore them",
            integrity: 3,
            feedback:
              "While not being mean, ignoring someone who's upset isn't very supportive. Encouraging teammates helps build a stronger team.",
          },
        ],
      },
    ];
  }

  /**
   * Show current question
   */
  showQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.finishQuiz();
      return;
    }

    const question = this.questions[this.currentQuestion];

    // Update progress
    this.progressText.setText(
      `Question ${this.currentQuestion + 1} of ${this.questions.length}`
    );

    // Handle character display
    if (question.character === "Carla") {
      // Hide static portrait and show animated Carla
      this.characterPortrait.setAlpha(0);
      this.carlaSprite.setAlpha(1);
      this.leoSprite.setAlpha(0);
      this.nicoSprite.setAlpha(0);
      this.leoSprite.stop();
      this.nicoSprite.stop();
      this.carlaSprite.play("carla-talk");
    } else if (question.character === "Coach Leo") {
      // Hide static portrait and show animated Leo
      this.characterPortrait.setAlpha(0);
      this.carlaSprite.setAlpha(0);
      this.nicoSprite.setAlpha(0);
      this.carlaSprite.stop();
      this.nicoSprite.stop();
      this.leoSprite.setAlpha(1);
      this.leoSprite.play("leo-talk");
    } else if (question.character === "Narrator") {
      // Hide static portrait and show animated Nico for Narrator
      this.characterPortrait.setAlpha(0);
      this.carlaSprite.setAlpha(0);
      this.leoSprite.setAlpha(0);
      this.carlaSprite.stop();
      this.leoSprite.stop();
      this.nicoSprite.setAlpha(1);
      this.nicoSprite.play("nico-talk");
    } else {
      // Show static portrait and hide animated characters
      this.characterPortrait.setTexture(question.portrait);
      this.characterPortrait.setTint(0x3498db);
      this.characterPortrait.setAlpha(1);
      this.carlaSprite.setAlpha(0);
      this.leoSprite.setAlpha(0);
      this.nicoSprite.setAlpha(0);
      this.carlaSprite.stop();
      this.leoSprite.stop();
      this.nicoSprite.stop();
    }

    // Update question text
    this.questionText.setText(question.question);
    this.scenarioText.setText(question.scenario);

    // Clear previous choices
    this.choiceContainer.removeAll(true);

    // Create choice buttons
    this.createChoiceButtons(question.choices);

    // Animate question in
    this.questionContainer.setAlpha(0);
    this.tweens.add({
      targets: this.questionContainer,
      alpha: 1,
      y: "+=20",
      duration: 600,
      ease: "Back.easeOut",
    });
  }

  /**
   * Create choice buttons for current question
   */
  createChoiceButtons(choices) {
    const startY = this.centerY + 120;
    const buttonSpacing = 80;

    choices.forEach((choice, index) => {
      const button = this.createButton(
        this.centerX,
        startY + index * buttonSpacing,
        choice.text,
        () => this.selectChoice(choice, index),
        {
          fontSize: "18px",
          backgroundColor: "#3498db",
        }
      );

      // Adjust button width based on text length
      const textWidth = choice.text.length * 10;
      const buttonWidth = Math.max(400, Math.min(600, textWidth));
      button.background.setSize(buttonWidth, 60);

      // Add to choice container
      this.choiceContainer.add([button.background, button.text]);

      // Animate buttons in with delay
      button.background.setAlpha(0);
      button.text.setAlpha(0);

      this.tweens.add({
        targets: [button.background, button.text],
        alpha: 1,
        x: "+=20",
        duration: 400,
        delay: 200 + index * 100,
        ease: "Power2.easeOut",
      });
    });
  }

  /**
   * Handle choice selection
   */
  selectChoice(choice, choiceIndex) {
    // Disable all buttons to prevent multiple clicks
    this.choiceContainer.list.forEach((item) => {
      if (item.input) {
        item.disableInteractive();
      }
    });

    // Stop Carla's animation when a choice is selected
    if (this.carlaSprite && this.carlaSprite.anims.isPlaying) {
      this.carlaSprite.stop();
    }

    // Record answer
    this.playerAnswers.push({
      questionIndex: this.currentQuestion,
      choiceIndex: choiceIndex,
      integrityPoints: choice.integrity,
    });

    // Update score
    this.integrityScore += choice.integrity;
    this.scoreText.setText(`Integrity Score: ${this.integrityScore}`);

    // Get the selected button
    const selectedButton = {
      background: this.choiceContainer.list[choiceIndex * 2],
      text: this.choiceContainer.list[choiceIndex * 2 + 1],
    };

    // Add visual effects based on answer correctness
    if (choice.integrity > 0) {
      // Correct answer effect - green glow
      selectedButton.background.setStrokeStyle(4, 0x2ecc71);

      // Only show enhanced visual effect for full score (10 points)
      if (choice.integrity === 10) {
        // Create a container for all celebration effects
        const celebrationContainer = this.add.container(0, 0);

        // Create larger rectangle particles for correct answer effect
        for (let i = 0; i < 70; i++) {
          // More particles
          // Randomly choose between rectangles and stars for particles
          let particle;

          if (Math.random() > 0.5) {
            // Rectangle particles
            particle = this.add.rectangle(
              selectedButton.background.x,
              selectedButton.background.y,
              Phaser.Math.Between(8, 20), // Even larger particles
              Phaser.Math.Between(8, 20),
              Phaser.Math.Between(0x2ecc71, 0x27ae60) // Varying green shades
            );
          } else {
            // Star particles (using 5 connected lines to form a star)
            const starPoints = [];
            const outerRadius = Phaser.Math.Between(8, 15);
            const innerRadius = outerRadius / 2;
            const numPoints = 5;

            for (let i = 0; i < numPoints * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / numPoints;
              starPoints.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
              });
            }

            // Create star graphics
            particle = this.add.graphics();
            particle.fillStyle(0xffd700, 1); // Gold color for stars
            particle.beginPath();
            particle.moveTo(starPoints[0].x, starPoints[0].y);

            for (let i = 1; i < starPoints.length; i++) {
              particle.lineTo(starPoints[i].x, starPoints[i].y);
            }

            particle.closePath();
            particle.fillPath();
            particle.x = selectedButton.background.x;
            particle.y = selectedButton.background.y;
          }

          celebrationContainer.add(particle);

          // Animate each particle with more dramatic effect
          this.tweens.add({
            targets: particle,
            x: particle.x + Phaser.Math.Between(-200, 200), // Even wider spread
            y: particle.y + Phaser.Math.Between(-200, 200),
            alpha: 0,
            scale: Phaser.Math.FloatBetween(0.5, 2.0), // More varied scaling
            rotation: Phaser.Math.FloatBetween(-2 * Math.PI, 2 * Math.PI), // Rotation
            duration: Phaser.Math.Between(1000, 2000), // Longer animation
            ease: "Power2.easeOut",
            onComplete: () => {
              particle.destroy();
            },
          });
        }

        // More dramatic scale animation with multiple pulses
        this.tweens.add({
          targets: selectedButton.background,
          scaleX: 1.2, // Even bigger scale effect
          scaleY: 1.2,
          duration: 300,
          yoyo: true,
          repeat: 2, // More pulses
          ease: "Bounce.easeOut", // Bouncy effect
        });

        // Add a glow effect
        const glow = this.add
          .rectangle(
            selectedButton.background.x,
            selectedButton.background.y,
            selectedButton.background.width + 30, // Larger glow
            selectedButton.background.height + 30,
            0x2ecc71,
            0.6 // More visible
          )
          .setDepth(selectedButton.background.depth - 1);

        celebrationContainer.add(glow);

        // Animate the glow with pulsing effect
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.6, to: 0 },
          scale: { from: 1, to: 1.8 },
          duration: 1200,
          ease: "Sine.easeOut",
          onComplete: () => {
            glow.destroy();
          },
        });

        // Add a "Perfect!" text that appears and fades out
        const perfectText = this.add
          .text(
            selectedButton.background.x,
            selectedButton.background.y - 60,
            "Perfect!",
            {
              fontSize: "28px",
              fontFamily: "Margarine, cursive",
              color: "#FFD700", // Gold color
              stroke: "#000000",
              strokeThickness: 4,
              align: "center",
            }
          )
          .setOrigin(0.5);

        perfectText.setAlpha(0);
        celebrationContainer.add(perfectText);

        // Animate the perfect text
        this.tweens.add({
          targets: perfectText,
          y: perfectText.y - 40, // Float upward
          alpha: { from: 0, to: 1, duration: 300, yoyo: true, hold: 500 },
          scale: { from: 0.5, to: 1.2, duration: 300, yoyo: true, hold: 500 },
          duration: 1200,
          onComplete: () => {
            perfectText.destroy();
          },
        });
      } else {
        // Smaller effect for partially correct answers
        // Scale up and down animation
        this.tweens.add({
          targets: selectedButton.background,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
          yoyo: true,
          repeat: 1,
          ease: "Sine.easeInOut",
        });
      }
    } else {
      // Wrong answer effect - red flash and shake
      selectedButton.background.setStrokeStyle(4, 0xe74c3c);

      // Shake effect
      this.tweens.add({
        targets: selectedButton.background,
        x: "+=10",
        duration: 50,
        yoyo: true,
        repeat: 3,
        ease: "Sine.easeInOut",
      });

      // Red flash effect
      this.tweens.add({
        targets: selectedButton.background,
        fillColor: 0xe74c3c,
        duration: 100,
        yoyo: true,
        repeat: 1,
        ease: "Sine.easeInOut",
        onComplete: () => {
          selectedButton.background.fillColor = 0x3498db;
        },
      });
    }

    // Show feedback after a short delay to allow effects to play
    this.time.delayedCall(1200, () => {
      this.showFeedback(choice.feedback, () => {
        this.currentQuestion++;
        this.showQuestion();
      });
    });
  }

  /**
   * Show feedback for selected choice
   */
  showFeedback(feedbackText, callback) {
    // Stop Carla's animation if it's playing
    if (this.carlaSprite && this.carlaSprite.anims.isPlaying) {
      this.carlaSprite.stop();
      this.carlaSprite.setAlpha(0);
    }

    // Create feedback overlay
    const feedbackOverlay = this.add.container(0, 0);

    const overlayBg = this.add.rectangle(
      this.centerX,
      this.centerY,
      this.gameWidth,
      this.gameHeight,
      0x000000,
      0.8
    );
    overlayBg.setInteractive();

    const feedbackPanel = this.add.rectangle(
      this.centerX,
      this.centerY,
      600,
      200,
      0xffffff,
      0.95
    );
    feedbackPanel.setStrokeStyle(4, 0x27ae60);

    const feedbackTextObj = this.add
      .text(this.centerX, this.centerY - 20, feedbackText, {
        fontSize: "20px",
        fontFamily: "Margarine, cursive",
        color: "#2c3e50",
        align: "center",
        wordWrap: { width: 500 },
      })
      .setOrigin(0.5);

    const continueBtn = this.createButton(
      this.centerX,
      this.centerY + 60,
      "Continue",
      () => {
        feedbackOverlay.destroy();
        callback();
      },
      {
        backgroundColor: "#27ae60",
      }
    );

    feedbackOverlay.add([
      overlayBg,
      feedbackPanel,
      feedbackTextObj,
      continueBtn.background,
      continueBtn.text,
    ]);

    // Animate feedback in
    feedbackOverlay.setAlpha(0);
    this.tweens.add({
      targets: feedbackOverlay,
      alpha: 1,
      duration: 300,
      ease: "Power2.easeOut",
    });
  }

  /**
   * Finish quiz and transition to end scene
   */
  finishQuiz() {
    // Calculate final score and grade
    const maxScore = this.questions.reduce((sum, q) => {
      return sum + Math.max(...q.choices.map((c) => c.integrity));
    }, 0);

    const percentage = Math.round((this.integrityScore / maxScore) * 100);

    let grade = "Try Again";
    if (percentage >= 90) grade = "Excellent!";
    else if (percentage >= 70) grade = "Good Job!";
    else if (percentage >= 50) grade = "Not Bad!";

    // Transition to end scene with results
    this.transitionToScene("EndScene", {
      score: this.integrityScore,
      maxScore: maxScore,
      percentage: percentage,
      grade: grade,
      answers: this.playerAnswers,
    });
  }
}
