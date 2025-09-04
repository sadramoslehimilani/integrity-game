import { IntroScene } from './scenes/IntroScene.js';
import { GameScene } from './scenes/GameScene.js';
import { QuizScene } from './scenes/QuizScene.js';
import { EndScene } from './scenes/EndScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Integrity: The Lost Whistle',
    description: 'An educational game about honesty and making the right choices',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#4a90e2',
    pixelArt: false,
    scene: [IntroScene, GameScene, QuizScene, EndScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
            