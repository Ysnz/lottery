# 🎰 Spin Lottery - Wheel of Fortune

A beautiful and interactive wheel of fortune (prize wheel) built with React and Canvas API. This project is inspired by the [Custom wheel of prize with canvas](https://dev.to/sababg/custom-wheel-of-prize-with-canvas-589h) article.

## ✨ Features

- 🎯 Interactive spinning wheel with smooth animations
- 🎨 Beautiful gradient design with glassmorphism effects
- 📱 Responsive design that works on mobile and desktop
- 🎁 Customizable prizes and colors
- 🔄 Multiple spins allowed
- 🎉 Winner announcement with animations
- ⚡ Smooth physics-based spinning animation

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spin-lottery
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎮 How to Play

1. Click on the wheel to start spinning
2. Wait for the wheel to stop naturally
3. See what prize you've won!
4. Click "Spin Again" to try your luck again

## 🛠️ Customization

### Changing Prizes

Edit the `segments` array in `src/App.js`:

```javascript
const segments = [
  "1000 TL", 
  "500 TL", 
  "250 TL", 
  "100 TL", 
  "50 TL", 
  "25 TL",
  "10 TL",
  "5 TL"
];
```

### Changing Colors

Edit the `segColors` array in `src/App.js`:

```javascript
const segColors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
  "#F7DC6F"  // Gold
];
```

### Wheel Configuration

You can customize the wheel behavior by modifying the props passed to `WheelComponent`:

```javascript
<WheelComponent
  segments={segments}
  segColors={segColors}
  winningSegment=""           // Set to force a specific result
  onFinished={onFinished}     // Callback when spinning ends
  primaryColor="black"        // Center button color
  primaryColoraround="#ffffffb4" // Outer border color
  contrastColor="white"       // Text color
  buttonText="SPIN"          // Center button text
  isOnlyOnce={false}         // Allow multiple spins
  size={190}                 // Wheel size
  upDuration={50}            // Spin up duration
  downDuration={2000}        // Spin down duration
/>
```

## 📁 Project Structure

```
src/
├── components/
│   ├── WheelComponent.js    # Main wheel component
│   └── WheelComponent.css   # Wheel-specific styles
├── App.js                   # Main application component
├── App.css                  # Application styles
├── index.js                 # Application entry point
└── index.css                # Global styles
```

## 🎨 Styling

The application uses modern CSS features including:
- CSS Grid and Flexbox for layout
- CSS animations and transitions
- Glassmorphism effects with backdrop-filter
- Gradient backgrounds
- Responsive design with media queries

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🌟 Features Explained

### Physics-Based Animation
The wheel uses mathematical formulas to create realistic spinning physics:
- Acceleration phase (upDuration)
- Deceleration phase (downDuration)
- Smooth easing functions for natural movement

### Canvas Rendering
The wheel is drawn using HTML5 Canvas API for:
- Smooth animations at 60fps
- Precise control over drawing
- Hardware acceleration

### State Management
Uses React hooks for:
- Tracking wheel state
- Managing winner display
- Handling user interactions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the [Custom wheel of prize with canvas](https://dev.to/sababg/custom-wheel-of-prize-with-canvas-589h) article
- Built with React and modern web technologies
- Uses HTML5 Canvas for smooth animations

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ and React 