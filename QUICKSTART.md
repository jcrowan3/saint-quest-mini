# Quick Start Guide

## Running Saint Quest Locally

1. **Navigate to the project:**
   ```bash
   cd /Users/rowan/ClaudeCodeProjects/saint-quest
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in your browser:**
   - Go to [http://localhost:3000](http://localhost:3000)
   - The game should load immediately!

## Testing on Tablet/Chromebook

Once the dev server is running:
- On the same WiFi network, use: `http://192.168.86.40:3000`
- Or deploy to Vercel (see below) for a permanent URL

## Deploy to Vercel (Free & Easy)

1. **Create a Vercel account** at [vercel.com](https://vercel.com) (free)

2. **Option A - Using the CLI:**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Option B - Using GitHub:**
   - Push this folder to a new GitHub repository
   - Connect your GitHub account to Vercel
   - Import the repository
   - Click "Deploy"

Your game will be live at a URL like: `saint-quest.vercel.app`

## Game Flow

1. **Home Page** - Introduction and "Begin Your Quest" button
2. **Saint Selection** - Choose from 4 saints:
   - St. Francis of Assisi
   - St. Paul the Apostle
   - St. Thérèse of Lisieux
   - Blessed Carlo Acutis
3. **Quest Journey** - Complete 3 quests per saint:
   - Read the story
   - Answer a challenge (trivia, dilemma, or memory)
   - Earn virtue points
4. **Completion** - Achieve "sainthood" and see your virtue progress

## Troubleshooting

**Server won't start:**
- Make sure you ran `npm install` first
- Check that port 3000 isn't already in use

**Page not loading:**
- Wait a few seconds after starting the server
- Check the terminal for any error messages
- Try refreshing the browser

**Progress not saving:**
- Progress is saved to your browser's localStorage
- Clearing browser data will reset progress
- Each browser/device has separate progress

## Next Steps

- Try all 4 saints and complete their quests
- Share the deployed URL with students for testing
- Customize saint data in `lib/data/saints.ts`
- Add more quests or saints as needed

Enjoy your journey to sainthood! 🎉
