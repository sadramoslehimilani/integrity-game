import { BaseScene } from "./BaseScene.js";

/**
 * EndScene - Shows game results and provides replay options
 * Displays integrity score, feedback, and learning summary
 */
export class EndScene extends BaseScene {
  constructor() {
    super("EndScene");
  }

  init(data) {
    super.init(data);
    this.score = data.score || 0;
    this.maxScore = data.maxScore || 30;
    this.percentage = data.percentage || 0;
    this.grade = data.grade || "Try Again";
    this.answers = data.answers || [];
  }

  preload() {
    // Load end scene background (using existing asset as placeholder)
    this.load.image("end-background", "assets/intro-background.png");

    // Load celebration/result graphics
    this.load.image("trophy", "assets/phaser.png"); // Placeholder for trophy
    this.load.image("medal", "assets/phaser.png"); // Placeholder for medal

    this.showLoading();
  }

  create() {
    super.create();
    this.hideLoading();

    // Setup background
    this.setupBackground();

    // Setup results display
    this.setupResultsDisplay();

    // Setup action buttons
    this.setupActionButtons();

    // Add entrance animations
    this.addEntranceAnimations();
  }

  /**
   * Setup the end scene background
   */
  setupBackground() {
    this.background = this.add.image(
      this.centerX,
      this.centerY,
      "end-background"
    );
    this.background.setDisplaySize(this.gameWidth, this.gameHeight);

    // Add overlay for better text readability
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
   * Setup results display elements
   */
  setupResultsDisplay() {
    // Results container
    this.resultsContainer = this.add.container(0, 0);

    // Main results panel
    this.resultsPanel = this.add.rectangle(
      this.centerX,
      this.centerY - 50,
      700,
      500,
      0xffffff,
      0.95
    );
    this.resultsPanel.setStrokeStyle(6, this.getGradeColor());

    // Congratulations title
    this.titleText = this.createStyledText(
      this.centerX,
      this.centerY - 220,
      "Game Complete!",
      {
        fontSize: "42px",
        color: "#2c3e50",
        fontStyle: "bold",
      }
    );

    // Grade display
    this.gradeText = this.createStyledText(
      this.centerX,
      this.centerY - 160,
      this.grade,
      {
        fontSize: "36px",
        color: this.getGradeColor(),
        fontStyle: "bold",
      }
    );

    // Score display
    this.scoreText = this.createStyledText(
      this.centerX,
      this.centerY - 110,
      `Integrity Score: ${this.score} / ${this.maxScore}`,
      {
        fontSize: "24px",
        color: "#34495e",
      }
    );

    // Percentage display
    this.percentageText = this.createStyledText(
      this.centerX,
      this.centerY - 80,
      `${this.percentage}% Correct`,
      {
        fontSize: "20px",
        color: "#7f8c8d",
      }
    );

    // Achievement icon
    this.achievementIcon = this.add.image(
      this.centerX - 200,
      this.centerY - 140,
      this.getAchievementIcon()
    );
    this.achievementIcon.setScale(0.3);
    this.achievementIcon.setTint(this.getGradeColor());

    // Feedback message
    this.feedbackText = this.createStyledText(
      this.centerX,
      this.centerY - 20,
      this.getFeedbackMessage(),
      {
        fontSize: "18px",
        color: "#2c3e50",
        align: "center",
        wordWrap: { width: 600 },
      }
    );

    // Learning summary
    this.learningSummary = this.createStyledText(
      this.centerX,
      this.centerY + 60,
      this.getLearningSummary(),
      {
        fontSize: "16px",
        color: "#34495e",
        align: "center",
        wordWrap: { width: 600 },
        lineSpacing: 5,
      }
    );

    // Add all elements to results container
    this.resultsContainer.add([
      this.resultsPanel,
      this.titleText,
      this.gradeText,
      this.scoreText,
      this.percentageText,
      this.achievementIcon,
      this.feedbackText,
      this.learningSummary,
    ]);
  }

  /**
   * Setup action buttons
   */
  setupActionButtons() {
    // Play again button
    this.playAgainButton = this.createButton(
      this.centerX - 120,
      this.centerY + 180,
      "Play Again",
      () => this.playAgain(),
      {
        backgroundColor: "#3498db",
        fontSize: "20px",
      }
    );

    // Main menu button
    this.mainMenuButton = this.createButton(
      this.centerX + 120,
      this.centerY + 180,
      "Main Menu",
      () => this.goToMainMenu(),
      {
        backgroundColor: "#95a5a6",
        fontSize: "20px",
      }
    );

    // Share results button (placeholder functionality)
    this.shareButton = this.createButton(
      this.centerX,
      this.centerY + 240,
      "Share Results",
      () => this.shareResults(),
      {
        backgroundColor: "#e74c3c",
        fontSize: "16px",
      }
    );
  }

  /**
   * Add entrance animations
   */
  addEntranceAnimations() {
    // Start with everything invisible
    this.resultsContainer.setAlpha(0);
    this.playAgainButton.background.setAlpha(0);
    this.playAgainButton.text.setAlpha(0);
    this.mainMenuButton.background.setAlpha(0);
    this.mainMenuButton.text.setAlpha(0);
    this.shareButton.background.setAlpha(0);
    this.shareButton.text.setAlpha(0);

    // Animate results panel in
    this.tweens.add({
      targets: this.resultsContainer,
      alpha: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      ease: "Back.easeOut",
      onComplete: () => {
        // Scale back to normal
        this.tweens.add({
          targets: this.resultsContainer,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: "Power2.easeOut",
        });
      },
    });

    // Animate buttons in with delays
    this.tweens.add({
      targets: [this.playAgainButton.background, this.playAgainButton.text],
      alpha: 1,
      y: "+=20",
      duration: 500,
      delay: 1000,
      ease: "Back.easeOut",
    });

    this.tweens.add({
      targets: [this.mainMenuButton.background, this.mainMenuButton.text],
      alpha: 1,
      y: "+=20",
      duration: 500,
      delay: 1200,
      ease: "Back.easeOut",
    });

    this.tweens.add({
      targets: [this.shareButton.background, this.shareButton.text],
      alpha: 1,
      y: "+=20",
      duration: 500,
      delay: 1400,
      ease: "Back.easeOut",
    });

    // Add celebration particles for high scores
    if (this.percentage >= 80) {
      this.addCelebrationEffects();
    }
  }

  /**
   * Get color based on grade
   */
  getGradeColor() {
    if (this.percentage >= 90) return "#27ae60"; // Green
    if (this.percentage >= 70) return "#f39c12"; // Orange
    if (this.percentage >= 50) return "#3498db"; // Blue
    return "#e74c3c"; // Red
  }

  /**
   * Get achievement icon based on performance
   */
  getAchievementIcon() {
    if (this.percentage >= 80) return "trophy";
    return "medal";
  }

  /**
   * Get personalized feedback message
   */
  getFeedbackMessage() {
    if (this.percentage >= 90) {
      return "Outstanding! You showed excellent integrity and made honest choices throughout the game. You understand that being truthful builds trust and makes you a better teammate.";
    } else if (this.percentage >= 70) {
      return "Great job! You made mostly good choices and showed that you understand the importance of honesty. Keep practicing these values in real life!";
    } else if (this.percentage >= 50) {
      return "Good effort! You're learning about integrity. Remember, being honest might feel difficult sometimes, but it's always the right thing to do.";
    } else {
      return "Keep trying! Learning about integrity takes practice. Remember that being honest and truthful helps build trust with friends, family, and teammates.";
    }
  }

  /**
   * Get learning summary based on answers
   */
  getLearningSummary() {
    const totalQuestions = this.answers.length;
    const perfectAnswers = this.answers.filter(
      (a) => a.integrityPoints === 10
    ).length;

    let summary = `You answered ${perfectAnswers} out of ${totalQuestions} questions with perfect integrity.\n\n`;

    summary += "Key lessons learned:\n";
    summary += "• Honesty builds trust with others\n";
    summary +=
      "• It's important to tell the truth, even about small mistakes\n";
    summary += "• Being honest shows good character and integrity\n";
    summary +=
      "• Making the right choice isn't always easy, but it's always worth it";

    return summary;
  }

  /**
   * Add celebration effects for high scores
   */
  addCelebrationEffects() {
    // Create simple particle effect using existing sprites
    for (let i = 0; i < 10; i++) {
      const particle = this.add.image(
        this.centerX + Phaser.Math.Between(-200, 200),
        this.centerY - 300,
        "phaser"
      );
      particle.setScale(0.1);
      particle.setTint(Phaser.Math.Between(0x000000, 0xffffff));

      this.tweens.add({
        targets: particle,
        y: this.gameHeight + 100,
        x: particle.x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.PI2,
        alpha: 0,
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 1000),
        ease: "Power2.easeIn",
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Restart the game
   */
  playAgain() {
    this.transitionToScene("IntroScene");
  }

  /**
   * Go to main menu
   */
  goToMainMenu() {
    this.transitionToScene("IntroScene");
  }

  /**
   * Share results (placeholder functionality)
   */
  shareResults() {
    // Create share overlay
    const shareOverlay = this.add.container(0, 0);

    const overlayBg = this.add.rectangle(
      this.centerX,
      this.centerY,
      this.gameWidth,
      this.gameHeight,
      0x000000,
      0.8
    );
    overlayBg.setInteractive();

    const sharePanel = this.add.rectangle(
      this.centerX,
      this.centerY,
      500,
      300,
      0xffffff,
      0.95
    );
    sharePanel.setStrokeStyle(4, "#3498db");

    const shareTitle = this.add
      .text(this.centerX, this.centerY - 80, "Share Your Results!", {
        fontSize: "24px",
        fontFamily: "Margarine, cursive",
        color: "#2c3e50",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const shareText = this.add
      .text(
        this.centerX,
        this.centerY - 20,
        `I just played "Integrity: The Lost Whistle" and scored ${this.percentage}%!\nI learned about honesty and making the right choices.`,
        {
          fontSize: "16px",
          fontFamily: "Margarine, cursive",
          color: "#34495e",
          align: "center",
          wordWrap: { width: 400 },
        }
      )
      .setOrigin(0.5);

    const closeBtn = this.createButton(
      this.centerX,
      this.centerY + 80,
      "Close",
      () => shareOverlay.destroy(),
      {
        backgroundColor: "#95a5a6",
      }
    );

    shareOverlay.add([
      overlayBg,
      sharePanel,
      shareTitle,
      shareText,
      closeBtn.background,
      closeBtn.text,
    ]);

    // Animate share overlay in
    shareOverlay.setAlpha(0);
    this.tweens.add({
      targets: shareOverlay,
      alpha: 1,
      duration: 300,
      ease: "Power2.easeOut",
    });
  }
}
