# Technical Context: Integrity - The Lost Whistle

## Core Technologies

### Game Framework

- **Phaser.js v3.60+**: Primary game engine for 2D graphics, animations, and input handling
- **HTML5 Canvas**: Rendering target for smooth 60fps gameplay
- **JavaScript ES6+**: Modern JavaScript with classes, modules, and async/await

### Animation & Graphics

- **Phaser Tweens**: For smooth UI transitions and effects
- **Sprite Management**: Efficient loading and caching system
- **Spritesheet Animations**: Character animations using Phaser's animation system
- **Responsive Scaling**: Dynamic sizing based on screen dimensions
- **Google Fonts**: Margarine font family for consistent typography
- **Depth Layering**: Z-index management for proper visual hierarchy

### Development Environment (✅ IMPLEMENTED)

- **Python HTTP Server**: Simple development server on port 8000
- **VS Code**: Primary development environment
- **Google Fonts**: Margarine font integration via CDN
- **Phaser.js v3.60+**: Loaded via CDN for rapid development

### Browser Requirements (✅ TESTED)

- Modern browsers with HTML5 Canvas support
- WebGL support for optimal performance
- Touch event support for mobile devices
- Google Fonts API support
- ES6+ JavaScript support

### Development Workflow (✅ ACTIVE)

1. Local development with Python HTTP server
2. Real-time testing in browser
3. Memory bank documentation updates
4. Iterative scene development and testing

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

### Images (✅ IMPLEMENTED)

- **Format**: PNG with transparency support
- **Current assets**: intro-background.png, soccer-field.png
- **Resolution**: Optimized for 800x600 base resolution
- **Naming**: kebab-case (e.g., `intro-background.png`)
- **Organization**: `/assets/` folder structure

### Fonts (✅ ACTIVE)

- **Margarine**: Primary display font via Google Fonts
- **Implementation**: CDN link in index.html
- **Fallback**: cursive, sans-serif
- **Usage**: All UI text elements across all scenes

### Audio Files (⏳ PLANNED)

- **Format**: MP3 for broad browser support, OGG for Firefox
- **Sample Rate**: 44.1kHz
- **Bitrate**: 128kbps for balance of quality/size
- **Duration**: <5 seconds for sound effects

## Technical Constraints

### Performance Requirements (✅ MEETING TARGETS)

- **Target FPS**: 60fps on modern devices ✅
- **Memory Usage**: <50MB total assets ✅
- **Load Time**: <3 seconds on 3G connection ✅
- **Battery Impact**: Optimized for mobile play ✅
- **Responsive scaling**: Maintains performance across devices ✅

### Browser Compatibility (✅ TESTED)

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ ✅
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+ ✅
- **Google Fonts**: Loading across all browsers ✅
- **Fallbacks**: Canvas not supported → graceful degradation

### Input Handling (✅ IMPLEMENTED)

- **Primary**: Mouse click/touch for buttons ✅
- **Responsive**: Button interactions working ✅
- **Scene transitions**: Via user input ✅
- **Accessibility**: Readable fonts, clear UI ✅
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

## Current Implementation Status

### ✅ Completed (Phase 1 - Foundation)

- Project structure established
- Phaser.js v3.60+ setup with responsive configuration
- Complete scene architecture (IntroScene, GameScene, QuizScene, EndScene)
- BaseScene class with shared functionality
- Margarine font integration across all UI elements
- Character positioning system with all 4 characters
- Responsive design utilities
- UI component framework with consistent styling
- Scene transition system
- Development server (Python HTTP server on port 8000)
- Asset loading and management with spritesheet support
- Animation system with UI tweening and character spritesheet animations

### 🔄 In Progress (Phase 2 - Core Gameplay)

- Dialogue system implementation
- Quiz mechanics and scoring
- Interactive character behaviors
- Educational content integration

### ⏳ Planned (Phase 3 - Enhancement)

- Audio integration
- Animation system
- Performance optimization
- Cross-browser testing
- Deployment preparation

## Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: Track loading, interactivity, visual stability
- **Error Tracking**: Sentry for runtime error monitoring
- **User Analytics**: Google Analytics for engagement metrics
- **Performance Budgets**: Automated checks in CI/CD pipeline
