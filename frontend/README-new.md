# Deshi Bites - Asian Street Food

A React TypeScript application for Deshi Bites, an Asian street food restaurant in Chemnitz, Germany.

## Features

- **Interactive Menu**: Browse different categories of Asian street food
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, modern interface with smooth animations
- **Add to Cart**: Interactive buttons with visual feedback
- **Category Filtering**: Filter menu items by category (Momos, Fritters, Rice Dishes, etc.)

## Menu Categories

- 🥟 Momos (various types of dumplings)
- 🍤 Fritters  
- 🍚 Rice Dishes
- 🍜 Noodles
- ⭐ Specials
- 🥤 Drinks

## Technologies Used

- **React 19** with TypeScript
- **CSS3** with modern features (Grid, Flexbox, Gradients)
- **Responsive Design** with media queries
- **Component-based Architecture**

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Main header with logo and contact info
│   ├── DeliveryNotice.tsx  # Delivery time notice banner
│   ├── Hero.tsx            # Hero section with main heading
│   ├── MenuNav.tsx         # Navigation buttons for categories
│   ├── MenuGrid.tsx        # Grid container for menu items
│   └── MenuItem.tsx        # Individual menu item component
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # Main application component
├── App.css                # Main stylesheet
└── index.tsx             # Application entry point
```

## Features Details

### Menu Items
Each menu item includes:
- Title and price
- Detailed ingredient description
- Category classification
- Dietary badges (Veg, Halal)
- Spice level indicators
- Interactive "Add to Cart" functionality

### Responsive Design
- Desktop: Multi-column grid layout
- Mobile: Single column layout with adjusted spacing
- Touch-friendly buttons and navigation

### Animations
- Smooth hover effects on buttons and menu items
- Fade-in animations for menu items
- Interactive feedback on button clicks

## Contact

For questions about this project, please contact the Deshi Bites team in Chemnitz, Germany.

---

Built with ❤️ using React and TypeScript
