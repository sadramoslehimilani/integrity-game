# Technical Context: Integrity - The Lost Whistle

## Core Technologies

### Game Framework

- **Phaser.js v3.60+**: Primary game engine for 2D graphics, animations, and input handling
- **HTML5 Canvas**: Rendering target for smooth 60fps gameplay
- **JavaScript ES6+**: Modern JavaScript with classes, modules, and async/await

### Development Environment

- **Node.js 16+**: Runtime for build tools and development server
- **npm/yarn**: Package management and script running
- **Webpack/Vite**: Module bundling and asset optimization
- **VS Code**: Primary IDE with Phaser.js extensions

## Project Structure

```
integrity-game/
├── src/
│   ├── scenes/
│   │   ├── IntroScene.js
│   │   ├── GameScene.js
│   │   ├── QuizScene.js
│   │   └── EndScene.js
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Characters.js
│   │   └── UI.js
│   ├── utils/
│   │   ├── AssetLoader.js
│   │   ├── AnimationManager.js
│   │   └── SoundManager.js
│   └── config/
│       ├── GameConfig.js
│       └── SceneConfig.js
├── assets/
│   ├── spritesheets/
│   ├── backgrounds/
│   ├── audio/
│   └── ui/
├── dist/
└── memory-bank/
```

## Dependencies

### Core Dependencies

```json
{
  "phaser": "^3.60.0",
  "webpack": "^5.75.0",
  "webpack-cli": "^5.0.0",
  "webpack-dev-server": "^4.11.0"
}
```

### Development Dependencies

```json
{
  "@babel/core": "^7.20.0",
  "@babel/preset-env": "^7.20.0",
  "babel-loader": "^9.1.0",
  "css-loader": "^6.7.0",
  "html-webpack-plugin": "^5.5.0"
}
```

## Asset Specifications

### Spritesheets

- **Format**: PNG with transparency
- **Frame Size**: 64x64px (characters), 32x32px (objects)
- **Animation Frames**: 4-8 frames per animation
- **Compression**: Lossless for quality preservation

### Audio Files

- **Format**: MP3 for broad browser support, OGG for Firefox
- **Sample Rate**: 44.1kHz
- **Bitrate**: 128kbps for balance of quality/size
- **Duration**: <5 seconds for sound effects

### Background Images

- **Resolution**: 800x600px base, responsive scaling
- **Format**: PNG for quality, JPEG for optimization
- **File Size**: <500KB per background

## Technical Constraints

### Performance Requirements

- **Target FPS**: 60fps on modern devices
- **Memory Usage**: <50MB total assets
- **Load Time**: <3 seconds on 3G connection
- **Battery Impact**: Optimized for mobile play

### Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Fallbacks**: Canvas not supported → graceful degradation

### Input Handling

- **Primary**: Mouse click/touch for buttons
- **Secondary**: Keyboard navigation for accessibility
- **Mobile**: Touch events with gesture prevention
- **Responsive**: UI scales from 320px to 1920px width

## Development Workflow

### Local Development

```bash
npm install
npm run dev     # Start development server
npm run build   # Production build
npm run serve   # Serve production build
```

### Asset Pipeline

1. **Source Assets**: High-resolution AI-generated images
2. **Optimization**: Automated compression and format conversion
3. **Loading**: Progressive loading with preload scenes
4. **Caching**: Browser caching for improved reload performance

### Testing Strategy

- **Unit Tests**: Jest for utility functions
- **Integration Tests**: Playwright for end-to-end scenarios
- **Performance Tests**: Lighthouse for web vitals
- **Cross-browser**: BrowserStack for compatibility testing

## Deployment

### Build Process

- **Minification**: Terser for JavaScript, CSSNano for styles
- **Asset Optimization**: Image compression, audio optimization
- **Bundle Splitting**: Separate vendor and game code
- **Source Maps**: For debugging production issues

### Hosting Requirements

- **Static Hosting**: Netlify, Vercel, or GitHub Pages
- **CDN**: For global asset distribution
- **HTTPS**: Required for modern browser features
- **Compression**: Gzip/Brotli for faster loading

## Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: Track loading, interactivity, visual stability
- **Error Tracking**: Sentry for runtime error monitoring
- **User Analytics**: Google Analytics for engagement metrics
- **Performance Budgets**: Automated checks in CI/CD pipeline
