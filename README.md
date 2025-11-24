# FooTable - Football Game Tracker ⚽

A modern web application to track results from weekend football games with friends!

## Features

- **Game Management**: Add new games with team lineups, scores, date, and location
- **Player Statistics**: Automatic tracking of wins, draws, losses, and win percentage for each player
- **Recent Games**: View your most recent game results at a glance
- **Top Players Leaderboard**: See who's performing best based on win percentage
- **Quick Stats**: Overview of total games, players, and average goals

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your system:
- [Node.js](https://nodejs.org/) (version 18 or higher)

### Installation

1. Clone or download this repository
2. Open the project folder in VS Code
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

1. **Adding a Game**: Click the "Add New Game" button to record a new match
2. **Enter Game Details**:
   - Select the date of the game
   - Add player names for each team (comma-separated)
   - Enter the final score
   - Optionally add the location where you played

3. **View Results**: The dashboard automatically updates with:
   - Recent game results
   - Updated player statistics
   - Overall statistics

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: Local Storage (browser-based)

## Data Storage

All game data and player statistics are stored locally in your browser's local storage. This means:
- ✅ Your data persists between browser sessions
- ✅ No external servers or accounts needed
- ⚠️ Data is tied to the specific browser/device you're using

## Development

To contribute or modify the application:

1. Make changes to the source code
2. Test your changes with `npm run dev`
3. Build for production with `npm run build`

## Future Enhancements

Potential features that could be added:
- Export data to CSV/Excel
- Player photos and profiles
- Game photos and notes
- Advanced statistics and charts
- Tournament brackets
- Mobile app version

---

Enjoy tracking your football games! ⚽🏆
