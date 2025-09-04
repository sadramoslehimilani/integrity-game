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
    this.scenario = data.scenario || "lost_whistle";
    this.gameData = data.gameData || { playerChoices: [], integrityScore: 0 };
  }

  preload() {
    // Load quiz background (using existing asset as placeholder)
    this.load.image("quiz-background", "assets/space.png");

    // Load character portraits for questions
    this.load.image("nico-portrait", "assets/phaser.png");
    this.load.image("carla-portrait", "assets/phaser.png");

    this.showLoading();
  }

  create() {
    super.create();
    this.hideLoading();

    // Setup background
    this.setupBackground();

    // Setup quiz UI
    this.setupQuizUI();

    // Load scenario questions
    this.loadScenarioQuestions();

    // Start first question
    this.showQuestion();
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
    this.background.setTint(0x34495e); // Dark blue-gray tint

    // Add overlay for better readability
    this.overlay = this.add.rectangle(
      this.centerX,
      this.centerY,
      this.gameWidth,
      this.gameHeight,
      0x2c3e50,
      0.7
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
    // Define questions for the "lost whistle" scenario
    this.questions = [
      {
        character: "Narrator",
        portrait: "nico-portrait",
        question: "The Lost Whistle",
        scenario:
          "During practice, Nico accidentally kicks the ball and it hits the referee's whistle, knocking it into the bushes. The referee doesn't notice and continues the game. What should Nico do?",
        choices: [
          {
            text: "Tell the referee immediately what happened",
            integrity: 10,
            feedback:
              "Excellent! Being honest right away shows great integrity.",
          },
          {
            text: "Wait until after the game to tell the referee",
            integrity: 5,
            feedback: "Good thinking, but it's better to be honest right away.",
          },
          {
            text: "Don't say anything and hope no one notices",
            integrity: 0,
            feedback:
              "This isn't the right choice. Honesty is always the best policy.",
          },
        ],
      },
      {
        character: "Carla",
        portrait: "carla-portrait",
        question: "Carla's Question",
        scenario:
          'Carla saw what happened with the whistle. She asks Nico, "Are you going to tell the referee?" How should Nico respond?',
        choices: [
          {
            text: '"Yes, I should tell the truth about what happened."',
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
            text: '"No, it\'s not a big deal."',
            integrity: 0,
            feedback: "Even small mistakes matter. Being honest builds trust.",
          },
        ],
      },
      {
        character: "Coach Leo",
        portrait: "nico-portrait",
        question: "Coach's Lesson",
        scenario:
          'After Nico tells the truth, Coach Leo talks to the team about integrity. He asks, "Why is it important to be honest, even about small mistakes?"',
        choices: [
          {
            text: '"Because honesty helps people trust us"',
            integrity: 10,
            feedback: "Exactly right! Trust is built through honest actions.",
          },
          {
            text: '"Because we might get in trouble if we lie"',
            integrity: 5,
            feedback:
              "That's one reason, but the best reason is that honesty builds trust.",
          },
          {
            text: '"I don\'t know"',
            integrity: 2,
            feedback:
              "That's okay! The important thing is that honesty helps people trust us.",
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

    // Update character portrait
    this.characterPortrait.setTexture(question.portrait);
    if (question.character === "Carla") {
      this.characterPortrait.setTint(0xe74c3c);
    } else {
      this.characterPortrait.setTint(0x3498db);
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

    // Record answer
    this.playerAnswers.push({
      questionIndex: this.currentQuestion,
      choiceIndex: choiceIndex,
      integrityPoints: choice.integrity,
    });

    // Update score
    this.integrityScore += choice.integrity;
    this.scoreText.setText(`Integrity Score: ${this.integrityScore}`);

    // Show feedback
    this.showFeedback(choice.feedback, () => {
      this.currentQuestion++;
      this.showQuestion();
    });
  }

  /**
   * Show feedback for selected choice
   */
  showFeedback(feedbackText, callback) {
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
