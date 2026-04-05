# Debugging Guide for Saint Quest

## Issue: Quests Not Progressing

If you're stuck on one quest and clicking buttons just gives points without moving to the next quest:

### Quick Fix: Clear Your Browser Data

1. **Open Browser Console:**
   - Press `F12` or `Right Click → Inspect`
   - Go to "Console" tab

2. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   ```
   - Type this in the console and press Enter
   - Refresh the page (`Cmd+R` or `Ctrl+R`)

3. **Verify it worked:**
   ```javascript
   localStorage.getItem('saintQuestProgress')
   ```
   - Should return `null` after clearing

### Alternative: Use Incognito/Private Window

- Open `http://localhost:3000` in an incognito/private browser window
- This starts with fresh data (no localStorage)

## What Was the Problem?

The game saves your progress in the browser's localStorage. If you had:
- Old progress from earlier testing
- Completed quests already
- A different quest index

...it would load that old state and cause issues.

## Testing Fresh Start

To test from the beginning:
1. Clear localStorage (see above)
2. Refresh page
3. Click "Begin Your Quest"
4. Select Carlo Acutis
5. You should see "Quest 1/8" at the top
6. Complete the full flow: Story → Challenge → Result → Reward
7. After clicking "Continue Your Journey", you should see "Quest 2/8"

## Expected Quest Flow

For each quest, you should see these stages in order:

1. **Story Stage** 📖
   - Read the story about Carlo
   - Click "Continue to Challenge →"

2. **Challenge Stage** 🤔
   - Read the question
   - Select an answer (A, B, C, or D)
   - Click "Submit Answer ✓"

3. **Result Stage** ✓ or 💡
   - See if you got it right
   - Read the explanation
   - Click "See Your Rewards →"

4. **Reward Stage** 🎉
   - See your virtue points earned
   - Click "Continue Your Journey →"
   - **THIS SHOULD MOVE TO THE NEXT QUEST**

## Checking Current State

In browser console, check your current state:

```javascript
JSON.parse(localStorage.getItem('saintQuestProgress'))
```

You should see:
- `currentQuestIndex` - which quest you're on (0-7 for Carlo)
- `currentSaintId` - should be "carlo"
- `virtues` - your accumulated points
- `completedQuests` - array of quest IDs you've finished

## If Still Not Working

Check the dev server output:
```bash
tail -f /private/tmp/claude-501/-Users-rowan-ClaudeCodeProjects/tasks/bad580d.output
```

Look for errors or warnings.
