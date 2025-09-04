import { BaseScene } from './BaseScene.js';

/**
 * IntroScene - Welcome screen for the Integrity game
 * Introduces the player to the game concept and provides entry point
 */
export class IntroScene extends BaseScene {
    constructor() {
        super('IntroScene');
    }

    preload() {
        // Load intro background
        this.load.image('intro-background', 'assets/intro-background.png');
        
        // Show loading indicator
        this.showLoading();
    }

    create() {
        super.create();
        
        // Hide loading indicator
        this.hideLoading();
        
        // Add background
        this.background = this.add.image(this.centerX, this.centerY, 'intro-background');
        this.background.setDisplaySize(this.gameWidth, this.gameHeight);
        
        // Add semi-transparent overlay for better text readability
        this.overlay = this.add.rectangle(this.centerX, this.centerY, this.gameWidth, this.gameHeight, 0x000000, 0.3);
        
        // Game title
        this.titleText = this.createStyledText(
            this.centerX, 
            this.centerY - 200, 
            'Integrity: The Lost Whistle',
            {
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#2c3e50',
                strokeThickness: 4
            }
        );
        
        // Subtitle
        this.subtitleText = this.createStyledText(
            this.centerX,
            this.centerY - 140,
            'A Game About Honesty and Making the Right Choice',
            {
                fontSize: '24px',
                color: '#ecf0f1',
                fontStyle: 'italic'
            }
        );
        
        // Welcome message
        this.welcomeText = this.createStyledText(
            this.centerX,
            this.centerY - 50,
            'Help Nico learn about integrity through\na soccer practice scenario.',
            {
                fontSize: '20px',
                color: '#ffffff',
                align: 'center'
            }
        );
        
        // Age recommendation
        this.ageText = this.createStyledText(
            this.centerX,
            this.centerY + 20,
            'Recommended for ages 6-9',
            {
                fontSize: '16px',
                color: '#bdc3c7',
                fontStyle: 'italic'
            }
        );
        
        // Start button
        this.startButton = this.createButton(
            this.centerX,
            this.centerY + 100,
            'Start Game',
            () => this.startGame(),
            {
                backgroundColor: '#e74c3c',
                fontSize: '28px'
            }
        );
        
        // Instructions button
        this.instructionsButton = this.createButton(
            this.centerX,
            this.centerY + 170,
            'How to Play',
            () => this.showInstructions(),
            {
                backgroundColor: '#3498db',
                fontSize: '20px'
            }
        );
        
        // Add entrance animations
        this.addEntranceAnimations();
    }
    
    /**
     * Add entrance animations for UI elements
     */
    addEntranceAnimations() {
        // Title animation
        this.titleText.setAlpha(0);
        this.tweens.add({
            targets: this.titleText,
            alpha: 1,
            y: this.titleText.y + 20,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Subtitle animation (delayed)
        this.subtitleText.setAlpha(0);
        this.tweens.add({
            targets: this.subtitleText,
            alpha: 1,
            duration: 800,
            delay: 500,
            ease: 'Power2.easeOut'
        });
        
        // Welcome text animation
        this.welcomeText.setAlpha(0);
        this.tweens.add({
            targets: this.welcomeText,
            alpha: 1,
            duration: 600,
            delay: 1000,
            ease: 'Power2.easeOut'
        });
        
        // Age text animation
        this.ageText.setAlpha(0);
        this.tweens.add({
            targets: this.ageText,
            alpha: 1,
            duration: 600,
            delay: 1200,
            ease: 'Power2.easeOut'
        });
        
        // Buttons animation
        this.startButton.background.setAlpha(0);
        this.startButton.text.setAlpha(0);
        this.instructionsButton.background.setAlpha(0);
        this.instructionsButton.text.setAlpha(0);
        
        this.tweens.add({
            targets: [this.startButton.background, this.startButton.text],
            alpha: 1,
            y: '+=20',
            duration: 600,
            delay: 1400,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: [this.instructionsButton.background, this.instructionsButton.text],
            alpha: 1,
            y: '+=20',
            duration: 600,
            delay: 1600,
            ease: 'Back.easeOut'
        });
    }
    
    /**
     * Start the main game
     */
    startGame() {
        this.transitionToScene('GameScene', {
            playerName: 'Nico',
            gameMode: 'story'
        });
    }
    
    /**
     * Show game instructions
     */
    showInstructions() {
        // Create instructions overlay
        if (this.instructionsOverlay) return;
        
        this.instructionsOverlay = this.add.container(0, 0);
        
        // Background overlay
        const overlayBg = this.add.rectangle(this.centerX, this.centerY, this.gameWidth, this.gameHeight, 0x000000, 0.8);
        overlayBg.setInteractive();
        
        // Instructions panel
        const panelBg = this.add.rectangle(this.centerX, this.centerY, 600, 400, 0xffffff, 0.95);
        panelBg.setStrokeStyle(4, 0x3498db);
        
        // Instructions title
        const instructionsTitle = this.add.text(this.centerX, this.centerY - 150, 'How to Play', {
            fontSize: '32px',
            fontFamily: 'Margarine, cursive',
            color: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Instructions text
        const instructionsContent = this.add.text(this.centerX, this.centerY - 50, 
            '• Watch the soccer practice scenario\n' +
            '• Listen to what happens during the game\n' +
            '• Choose what Nico should do\n' +
            '• Learn about honesty and integrity\n' +
            '• See how your choices affect the story',
            {
                fontSize: '18px',
                fontFamily: 'Margarine, cursive',
                color: '#34495e',
                align: 'left',
                lineSpacing: 10
            }
        ).setOrigin(0.5);
        
        // Close button
        const closeButton = this.createButton(
            this.centerX,
            this.centerY + 120,
            'Got it!',
            () => this.hideInstructions(),
            {
                backgroundColor: '#27ae60'
            }
        );
        
        // Add all elements to overlay container
        this.instructionsOverlay.add([
            overlayBg, panelBg, instructionsTitle, 
            instructionsContent, closeButton.background, closeButton.text
        ]);
        
        // Animate in
        this.instructionsOverlay.setAlpha(0);
        this.tweens.add({
            targets: this.instructionsOverlay,
            alpha: 1,
            duration: 300,
            ease: 'Power2.easeOut'
        });
    }
    
    /**
     * Hide instructions overlay
     */
    hideInstructions() {
        if (!this.instructionsOverlay) return;
        
        this.tweens.add({
            targets: this.instructionsOverlay,
            alpha: 0,
            duration: 300,
            ease: 'Power2.easeIn',
            onComplete: () => {
                this.instructionsOverlay.destroy();
                this.instructionsOverlay = null;
            }
        });
    }
}