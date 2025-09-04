import { BaseScene } from './BaseScene.js';

/**
 * GameScene - Main gameplay scene where the soccer practice scenario unfolds
 * Handles character interactions, story progression, and decision points
 */
export class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
        this.currentStoryStep = 0;
        this.gameData = {
            playerChoices: [],
            integrityScore: 0
        };
    }

    preload() {
        // Load soccer field background (placeholder for now)
        this.load.image('soccer-field', 'assets/space.png'); // Using existing asset as placeholder
        
        // Load character sprites (placeholders)
        this.load.image('nico', 'assets/phaser.png'); // Placeholder for Nico
        this.load.image('carla', 'assets/phaser.png'); // Placeholder for Carla
        this.load.image('coach-leo', 'assets/phaser.png'); // Placeholder for Coach Leo
        this.load.image('referee', 'assets/phaser.png'); // Placeholder for Referee
        
        // Load UI elements
        this.load.image('dialogue-box', 'assets/phaser.png'); // Placeholder for dialogue box
        
        this.showLoading();
    }

    create() {
        super.create();
        this.hideLoading();
        
        // Setup soccer field
        this.setupSoccerField();
        
        // Setup characters
        this.setupCharacters();
        
        // Setup UI
        this.setupUI();
        
        // Start the story
        this.startStory();
    }
    
    /**
     * Setup the soccer field background and environment
     */
    setupSoccerField() {
        // Add field background
        this.field = this.add.image(this.centerX, this.centerY, 'soccer-field');
        this.field.setDisplaySize(this.gameWidth, this.gameHeight);
        this.field.setTint(0x4CAF50); // Green tint to make it look more like grass
        
        // Add field markings (simple rectangles for now)
        this.fieldMarkings = this.add.group();
        
        // Center circle
        const centerCircle = this.add.circle(this.centerX, this.centerY, 80);
        centerCircle.setStrokeStyle(4, 0xffffff);
        centerCircle.setFillStyle(0x4CAF50, 0);
        this.fieldMarkings.add(centerCircle);
        
        // Goal areas
        const leftGoal = this.add.rectangle(50, this.centerY, 100, 200);
        leftGoal.setStrokeStyle(4, 0xffffff);
        leftGoal.setFillStyle(0x4CAF50, 0);
        this.fieldMarkings.add(leftGoal);
        
        const rightGoal = this.add.rectangle(this.gameWidth - 50, this.centerY, 100, 200);
        rightGoal.setStrokeStyle(4, 0xffffff);
        rightGoal.setFillStyle(0x4CAF50, 0);
        this.fieldMarkings.add(rightGoal);
    }
    
    /**
     * Setup character sprites and positions
     */
    setupCharacters() {
        this.characters = {};
        
        // Nico (main character) - positioned center-left
        this.characters.nico = this.add.image(this.centerX - 200, this.centerY + 50, 'nico');
        this.characters.nico.setScale(0.3);
        this.characters.nico.setTint(0x3498db); // Blue tint to distinguish
        
        // Carla (teammate) - positioned center-right
        this.characters.carla = this.add.image(this.centerX + 200, this.centerY + 50, 'carla');
        this.characters.carla.setScale(0.3);
        this.characters.carla.setTint(0xe74c3c); // Red tint to distinguish
        
        // Coach Leo - positioned on sideline
        this.characters.coachLeo = this.add.image(this.centerX - 300, this.centerY - 200, 'coach-leo');
        this.characters.coachLeo.setScale(0.4);
        this.characters.coachLeo.setTint(0xf39c12); // Orange tint to distinguish
        
        // Referee - positioned center field
        this.characters.referee = this.add.image(this.centerX, this.centerY - 100, 'referee');
        this.characters.referee.setScale(0.35);
        this.characters.referee.setTint(0x2c3e50); // Dark tint for referee
        
        // Add character labels
        this.addCharacterLabels();
        
        // Initially hide all characters except Nico
        Object.keys(this.characters).forEach(key => {
            if (key !== 'nico') {
                this.characters[key].setAlpha(0.7);
            }
        });
    }
    
    /**
     * Add name labels for characters
     */
    addCharacterLabels() {
        this.characterLabels = {};
        
        this.characterLabels.nico = this.add.text(
            this.characters.nico.x, 
            this.characters.nico.y + 60, 
            'Nico', 
            { fontSize: '16px', fontFamily: 'Margarine, cursive', color: '#ffffff', backgroundColor: '#3498db', padding: { x: 8, y: 4 } }
        ).setOrigin(0.5);
        
        this.characterLabels.carla = this.add.text(
            this.characters.carla.x, 
            this.characters.carla.y + 60, 
            'Carla', 
            { fontSize: '16px', fontFamily: 'Margarine, cursive', color: '#ffffff', backgroundColor: '#e74c3c', padding: { x: 8, y: 4 } }
        ).setOrigin(0.5);
        
        this.characterLabels.coachLeo = this.add.text(
            this.characters.coachLeo.x, 
            this.characters.coachLeo.y + 70, 
            'Coach Leo', 
            { fontSize: '16px', fontFamily: 'Margarine, cursive', color: '#ffffff', backgroundColor: '#f39c12', padding: { x: 8, y: 4 } }
        ).setOrigin(0.5);
        
        this.characterLabels.referee = this.add.text(
            this.characters.referee.x, 
            this.characters.referee.y + 60, 
            'Referee', 
            { fontSize: '16px', fontFamily: 'Margarine, cursive', color: '#ffffff', backgroundColor: '#2c3e50', padding: { x: 8, y: 4 } }
        ).setOrigin(0.5);
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
        this.dialogueText = this.add.text(
            this.centerX, 
            this.gameHeight - 140, 
            '', 
            {
                fontSize: '20px',
                fontFamily: 'Margarine, cursive',
                color: '#ecf0f1',
                align: 'center',
                wordWrap: { width: this.gameWidth - 100 }
            }
        ).setOrigin(0.5);
        
        // Speaker name
        this.speakerText = this.add.text(
            60, 
            this.gameHeight - 200, 
            '', 
            {
                fontSize: '18px',
                fontFamily: 'Margarine, cursive',
                color: '#f39c12',
                fontStyle: 'bold'
            }
        );
        
        // Choice buttons container
        this.choiceContainer = this.add.container(0, 0);
        
        // Add to dialogue container
        this.dialogueContainer.add([this.dialogueBg, this.dialogueText, this.speakerText]);
        
        // Initially hide dialogue
        this.dialogueContainer.setAlpha(0);
        
        // Continue button
        this.continueButton = this.createButton(
            this.gameWidth - 100,
            this.gameHeight - 60,
            'Continue',
            () => this.continueStory(),
            {
                fontSize: '16px',
                backgroundColor: '#27ae60'
            }
        );
        this.continueButton.background.setAlpha(0);
        this.continueButton.text.setAlpha(0);
    }
    
    /**
     * Start the story sequence
     */
    startStory() {
        // Story steps array
        this.storySteps = [
            {
                speaker: 'Narrator',
                text: 'Welcome to soccer practice! Nico and his teammates are getting ready for a friendly scrimmage.',
                action: 'highlight',
                target: 'nico'
            },
            {
                speaker: 'Coach Leo',
                text: 'Alright team! Today we\'re going to practice fair play and good sportsmanship. Remember, it\'s not just about winning!',
                action: 'highlight',
                target: 'coachLeo'
            },
            {
                speaker: 'Narrator',
                text: 'The practice match begins. Nico is playing well, but then something unexpected happens...',
                action: 'setup_scenario'
            }
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
        this.speakerText.setText(step.speaker + ':');
        this.dialogueText.setText(step.text);
        
        // Show dialogue container
        this.tweens.add({
            targets: this.dialogueContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2.easeOut'
        });
        
        // Show continue button
        this.tweens.add({
            targets: [this.continueButton.background, this.continueButton.text],
            alpha: 1,
            duration: 500,
            delay: 300,
            ease: 'Power2.easeOut'
        });
        
        // Handle special actions
        if (step.action === 'highlight' && step.target) {
            this.highlightCharacter(step.target);
        }
    }
    
    /**
     * Highlight a specific character
     */
    highlightCharacter(characterKey) {
        // Reset all characters
        Object.keys(this.characters).forEach(key => {
            this.characters[key].setAlpha(0.7);
            this.characters[key].setScale(key === 'nico' ? 0.3 : key === 'coachLeo' ? 0.4 : 0.35);
        });
        
        // Highlight target character
        if (this.characters[characterKey]) {
            this.characters[characterKey].setAlpha(1);
            this.tweens.add({
                targets: this.characters[characterKey],
                scaleX: this.characters[characterKey].scaleX * 1.2,
                scaleY: this.characters[characterKey].scaleY * 1.2,
                duration: 300,
                yoyo: true,
                ease: 'Power2.easeInOut'
            });
        }
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
            ease: 'Power2.easeIn'
        });
        
        // Hide dialogue
        this.tweens.add({
            targets: this.dialogueContainer,
            alpha: 0,
            duration: 300,
            ease: 'Power2.easeIn',
            onComplete: () => {
                this.currentStoryStep++;
                this.showDialogue();
            }
        });
    }
    
    /**
     * Start the decision point where player makes choices
     */
    startDecisionPoint() {
        // This will transition to QuizScene for the decision-making part
        this.transitionToScene('QuizScene', {
            scenario: 'lost_whistle',
            gameData: this.gameData
        });
    }
}