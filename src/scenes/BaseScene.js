/**
 * BaseScene - Shared functionality for all game scenes
 * Provides common methods for scene transitions, UI management, and asset loading
 */
export class BaseScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
    this.sceneKey = key;
  }

  /**
   * Initialize common scene properties
   */
  init(data) {
    this.gameData = data || {};
    this.isTransitioning = false;
    
    // Setup responsive scaling early so it's available in preload
    this.setupResponsiveDesign();
  }

  /**
   * Create common UI elements and setup
   */
  create() {
    // Add fade-in transition
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Initialize UI container
    this.uiContainer = this.add.container(0, 0);
  }

  /**
   * Setup responsive design for different screen sizes
   */
  setupResponsiveDesign() {
    const { width, height } = this.sys.game.config;
    this.gameWidth = width;
    this.gameHeight = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  /**
   * Transition to another scene with fade effect
   * @param {string} targetScene - The key of the scene to transition to
   * @param {object} data - Data to pass to the next scene
   */
  transitionToScene(targetScene, data = {}) {
    if (this.isTransitioning) {
      console.log(
        `[${this.sceneKey}] Already transitioning, ignoring request to ${targetScene}`
      );
      return;
    }

    console.log(
      `[${this.sceneKey}] Transitioning to ${targetScene} with data:`,
      data
    );
    this.isTransitioning = true;

    // Fade out current scene
    this.cameras.main.fadeOut(500, 0, 0, 0);

    // Start next scene after fade completes
    this.cameras.main.once("camerafadeoutcomplete", () => {
      console.log(`[${this.sceneKey}] Fade complete, starting ${targetScene}`);
      this.scene.start(targetScene, data);
    });
  }

  /**
   * Create a styled button with hover effects
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - Button text
   * @param {function} callback - Click callback function
   * @param {object} style - Button styling options
   */
  createButton(x, y, text, callback, style = {}) {
    const defaultStyle = {
      fontSize: "24px",
      fontFamily: "Margarine, cursive",
      color: "#ffffff",
      backgroundColor: "#2ecc71",
      padding: { x: 20, y: 10 },
      borderRadius: 8,
    };

    const buttonStyle = { ...defaultStyle, ...style };

    // Create button background
    const buttonBg = this.add.rectangle(
      x,
      y,
      200,
      50,
      Phaser.Display.Color.HexStringToColor(buttonStyle.backgroundColor).color
    );
    buttonBg.setInteractive({ useHandCursor: true });

    // Create button text
    const buttonText = this.add
      .text(x, y, text, {
        fontSize: buttonStyle.fontSize,
        fontFamily: buttonStyle.fontFamily,
        color: buttonStyle.color,
      })
      .setOrigin(0.5);

    // Add hover effects
    buttonBg.on("pointerover", () => {
      buttonBg.setScale(1.05);
      buttonText.setScale(1.05);
    });

    buttonBg.on("pointerout", () => {
      buttonBg.setScale(1);
      buttonText.setScale(1);
    });

    // Add click handler
    buttonBg.on("pointerdown", callback);

    return { background: buttonBg, text: buttonText };
  }

  /**
   * Create styled text with consistent formatting
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - Text content
   * @param {object} style - Text styling options
   */
  createStyledText(x, y, text, style = {}) {
    const defaultStyle = {
      fontSize: "32px",
      fontFamily: "Margarine, cursive",
      color: "#2c3e50",
      align: "center",
      wordWrap: { width: this.gameWidth * 0.8 },
    };

    const textStyle = { ...defaultStyle, ...style };

    return this.add.text(x, y, text, textStyle).setOrigin(0.5);
  }

  /**
   * Show loading indicator
   */
  showLoading() {
    if (this.loadingText) return;

    // Create a loading container to ensure proper centering
    this.loadingContainer = this.add.container(this.centerX, this.centerY);
    
    // Create background for loading indicator
    this.loadingBg = this.add.graphics();
    this.loadingBg.fillStyle(0x000000, 0.7);
    this.loadingBg.fillRoundedRect(-100, -40, 200, 80, 16);
    this.loadingBg.lineStyle(4, 0x3498db, 1);
    this.loadingBg.strokeRoundedRect(-100, -40, 200, 80, 16);
    
    // Add loading text
    this.loadingText = this.add
      .text(0, 0, "Loading...", {
        fontSize: "28px",
        fontFamily: "Margarine, cursive",
        color: "#ffffff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5);
    
    // Add loading spinner
    this.loadingSpinner = this.add.graphics();
    this.loadingSpinner.lineStyle(4, 0x3498db, 1);
    this.loadingSpinner.beginPath();
    this.loadingSpinner.arc(0, -60, 15, 0, Math.PI * 1.5, false);
    this.loadingSpinner.strokePath();
    
    // Add to container
    this.loadingContainer.add([this.loadingBg, this.loadingText, this.loadingSpinner]);
    
    // Ensure container is at the top of the display list
    this.loadingContainer.setDepth(1000);

    // Add pulsing animation to text
    this.tweens.add({
      targets: this.loadingText,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    
    // Add rotation animation to spinner
    this.tweens.add({
      targets: this.loadingSpinner,
      rotation: Math.PI * 2,
      duration: 1500,
      repeat: -1,
      ease: 'Linear'
    });
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    if (this.loadingContainer) {
      // Stop any running tweens
      this.tweens.killTweensOf(this.loadingText);
      this.tweens.killTweensOf(this.loadingSpinner);
      
      // Destroy container and all children
      this.loadingContainer.destroy();
      
      // Reset references
      this.loadingContainer = null;
      this.loadingText = null;
      this.loadingBg = null;
      this.loadingSpinner = null;
    }
  }

  /**
   * Cleanup when scene shuts down
   */
  shutdown() {
    this.isTransitioning = false;
    this.hideLoading();
  }
}
