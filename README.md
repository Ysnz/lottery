# 🎰 Interactive Giving Draw & Spin Lottery

This project is a sophisticated, interactive lottery and prize wheel application built with **React** and the **HTML5 Canvas API**. It goes beyond a simple prize wheel by offering a comprehensive "Giving Draw" management system within a sleek, modern modal interface. Users can add multiple prizes, spin for each one individually, and track winners in a dynamic and engaging way.

## ✨ Core Features

-   **🎁 Multi-Reward Management**: Add, configure, and manage multiple prize draws simultaneously in a single session.
-   ** modals**: All interactions happen within a beautiful and user-friendly modal.
-   **⚙️ Individual Spins**: Each prize row has its own spin button, triggering a unique wheel animation for that specific reward.
-   **🎉 Dynamic Winner Display**: Winning draws are elegantly highlighted, displaying the generated prize code.
-   **✏️ Full Control**: Easily add new prize rows or remove existing ones (both active and completed) on the fly.
-   **🚀 Advanced Physics-Based Animation**: The wheel features a custom easing function for a thrilling spin, with a dramatic slowdown effect to build suspense.
-   **🎨 Highly Customizable**:
    -   Easily change prize values (e.g., €5, €10, Free).
    -   Modify wheel segment colors.
    -   Adjust spin duration and animation behavior.
-   **📱 Fully Responsive**: Looks and works great on both desktop and mobile devices.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd spin-lottery
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```

    The application will be running at `http://localhost:3000`.

## 🎮 How to Use

1.  Click the **"START LOTTERY"** button to open the Giving Draw modal.
2.  **Configure a Prize**:
    -   Select a prize value (e.g., "Free entry", "€5", "€10").
    -   Enter a descriptive name for the prize in the text input.
3.  **Spin the Wheel**:
    -   Click the **"SPIN"** button on the prize row.
    -   A new screen will appear, and the wheel will start spinning automatically.
4.  **View the Winner**:
    -   After the wheel stops, the winner information card is displayed.
    -   Click **"Continue"** to return to the draw management modal. The winning row will now be updated with the prize code.
5.  **Manage Draws**:
    -   Click **"+Add Reward"** to add another prize row.
    -   Click the **"×"** button on any row to remove it.
6.  **Complete the Session**:
    -   Once you are finished, click the **"Complete"** button.

## 🛠️ Customization

All primary customizations can be done in `src/App.js` and `src/components/LotteryModal.js`.

### 1. Prize Options

To change the predefined prize values (the buttons like €5, €10), edit the `prizeOptions` array in `src/components/LotteryModal.js`:

```javascript
// src/components/LotteryModal.js
const prizeOptions = [
  { label: 'Free entry', value: 0 },
  { label: '€5', value: 5 },
  { label: '€10', value: 10 },
  // Add new options here
];
```

### 2. Wheel Colors

To change the colors of the wheel segments, modify the `segColors` array in `src/App.js`:

```javascript
// src/App.js
const segColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', /* ... more colors */
];
```

### 3. Spin Animation Behavior

You can fine-tune the wheel's spinning animation by adjusting props passed to the `WheelComponent` in `src/App.js` and modifying the `handleSpin` function.

-   **Spin Duration**: In `src/App.js`, the `handleSpin` function sets the duration. The default is a random duration between 14 and 22 seconds.
    ```javascript
    // src/App.js -> handleSpin()
    setSpinDuration(Math.random() * 8000 + 14000); // (8000ms base + 14000ms random)
    ```

-   **Animation Phases (`upDuration` / `downDuration`)**: The total duration is split into acceleration and deceleration phases.
    ```javascript
    // src/App.js -> <WheelComponent ... />
    <WheelComponent
      upDuration={1500}
      downDuration={spinDuration - 1500}
      // ... other props
    />
    ```
-   **Easing Function**: The physics of the slowdown are controlled by the `improvedEasing` function in `src/components/WheelComponent.js`. You can modify the logic here to create different animation curves.

## 📁 Project Structure

```
spin-lottery/
├── public/
│   └── index.html
└── src/
    ├── components/
    │   ├── LotteryModal.js      # Main modal for managing draws
    │   ├── LotteryModal.css     # Styles for the modal
    │   ├── WheelComponent.js    # The spinning wheel logic and canvas rendering
    │   ├── WheelComponent.css   # Styles for the wheel
    │   └── InfoPopup.js         # A simple notification popup
    ├── App.js                   # Main application component, manages state
    ├── App.css                  # Global application styles
    └── index.js                 # Application entry point
```

## 🌟 Key Concepts Explained

### State Management (React Hooks)

The application relies heavily on React Hooks (`useState`) in `App.js` to manage the global state, including:
-   `rewards`: An array of objects, where each object represents a prize draw row.
-   `showModal`, `showWheel`: Booleans to control the visibility of the modal and the wheel.
-   `spinTrigger`: A number that is incremented to force a re-render of the `WheelComponent`, allowing for repeated spins.

### Dynamic Component Rendering

The UI dynamically renders based on the state. For example, the `RewardRow` in `LotteryModal.js` renders differently if it has a `winner` property, and the `LotteryModal` itself only appears if `isOpen` is true.

### HTML5 Canvas for the Wheel

`WheelComponent.js` uses the Canvas API to draw the prize wheel. This is done for performance and to achieve smooth, 60fps animations that are not easily possible with standard CSS. The `requestAnimationFrame` loop in the `spin` function continuously redraws the canvas to create the spinning effect.

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