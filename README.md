# Saint Quest - Journey to Sainthood

An educational web game for 5th-8th graders where players journey with saints, complete quests, and grow in virtue.

## Features

- **4 Saints**: St. Francis, St. Paul, St. Thérèse, and St. Carlo Acutis
- **3 Quests per Saint**: Each with story, challenge, and virtue rewards
- **Virtue Tracking**: Faith, Mercy, Courage, and Wisdom
- **Challenge Types**: Trivia, decision dilemmas, and memory match
- **Progress Saving**: Uses localStorage to save progress
- **Responsive Design**: Works on tablets, Chromebooks, and desktop

## Getting Started

### Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd saint-quest
   vercel
   ```

3. **Follow the prompts** and your app will be live!

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Vercel will automatically detect Next.js and configure everything.

## Project Structure

```
saint-quest/
├── app/
│   ├── page.tsx           # Landing page
│   ├── saints/
│   │   └── page.tsx       # Saint selection
│   ├── quest/
│   │   └── page.tsx       # Quest gameplay
│   └── layout.tsx         # Root layout with GameProvider
├── components/
│   ├── SaintCard.tsx      # Saint selection cards
│   ├── QuestView.tsx      # Quest story and challenges
│   └── VirtueTracker.tsx  # Virtue progress display
├── lib/
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── data/
│   │   └── saints.ts      # Saint and quest data
│   └── context/
│       └── GameContext.tsx # Game state management
```

## Tech Stack

- **Framework**: Next.js 15 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: localStorage (browser)
- **Hosting**: Vercel (recommended)

## Future Enhancements (Roadmap)

### Phase 2
- Voice narration for stories
- Saint relic collection system
- Parent dashboard for progress tracking

### Phase 3
- Mobile app (React Native)
- Offline mode
- More saints and quests

## Development

To modify saint data or add new quests, edit:
- `lib/data/saints.ts`

To add new challenge types:
- Update `lib/types/index.ts`
- Modify `components/QuestView.tsx`

## License

Copyright © 2026 Saint Quest. All rights reserved.
