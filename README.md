# Saint Quest

An interactive Catholic saints adventure game. Choose a saint, journey through their story, answer challenges, and build your virtue profile — all in your browser.

**[Play Now](https://jcrowan3.github.io/saint-quest-mini/)** — no install needed, works on desktop and mobile.

---

## Features

- **8 playable saints** — St. Francis of Assisi, St. Carlo Acutis, St. Joan of Arc, St. Thomas Aquinas, St. Teresa of Calcutta, St. Patrick, St. Therese of Lisieux, and Bl. Pier Giorgio Frassati
- **48 quests** with rich narrative storytelling and historical fun facts
- **4 challenge types** — trivia questions, moral dilemmas, matching pairs, and timeline ordering
- **3 difficulty levels** — Easy (with answer reveals), Normal, and Hard (with a 15-second countdown timer)
- **Daily Challenge** — a new challenge every day with shareable results you can copy to your clipboard
- **Achievement system** — 8 unlockable achievements with toast notifications (First Steps, Perfect Saint, Scholar, Master Scholar, Speed Demon, Virtue Master, Streak King, Well Rounded)
- **Virtue radar chart** — a canvas-drawn chart tracking your growth across virtues like Faith, Mercy, Courage, and Wisdom
- **Streak and combo bonuses** — maintain correct-answer streaks for bonus virtue points
- **Score multipliers** — earn more on higher difficulties
- **Save and resume** — progress is stored in localStorage so you can pick up where you left off
- **Particle effects, sound, and animations** — polished visual and audio feedback throughout
- **Fully responsive** — plays well on phones, tablets, and desktops

## How to Play

1. **Choose a saint** from the selection screen. Each saint has a unique avatar, story arc, and set of associated virtues.
2. **Select a difficulty** — Easy, Normal, or Hard. Hard mode adds a countdown timer to each challenge.
3. **Journey through quests** — read each story segment, then face a challenge. Challenges come in four forms:
   - **Trivia** — pick the correct answer from multiple choices
   - **Dilemma** — choose the most virtuous response to a moral scenario
   - **Matching** — pair saints with their famous associations
   - **Timeline** — arrange historical events in chronological order
4. **Earn virtues** — correct answers reward virtue points (Mercy, Courage, Faith, Wisdom, and more). Your virtue profile is displayed as a radar chart.
5. **Build streaks** — consecutive correct answers increase your streak counter and earn bonus points.
6. **Unlock achievements** — complete milestones like finishing all 8 saints, getting a perfect score, or reaching a 5+ streak.
7. **Try the Daily Challenge** — a unique challenge generated each day. Share your results with friends.

## Architecture

Saint Quest is a **single self-contained HTML file** (`docs/index.html`) with no external dependencies beyond Google Fonts. Everything — HTML structure, CSS styles, JavaScript logic, and all game data — lives in one file.

- **No build step** — open the file and play
- **No framework** — vanilla HTML, CSS, and JavaScript
- **Persistence** — all progress, settings, and achievements are saved to `localStorage`
- **Deployment** — served via GitHub Pages from the `docs/` directory
- **Security** — HTML escaping for dynamic content, safe JSON parsing with fallbacks

## Data Format

The `data/` directory contains the original structured data files used during development. The production game embeds this data directly in `docs/index.html`.

- **`saints.json`** — 8 saints with name, avatar emoji, description, and associated virtues
- **`quests.json`** — 48+ quests organized by saint ID, each with story text, challenge type, and reward virtues
- **`reflections.json`** — 365 daily liturgical reflections keyed by month-day

Challenge types in quest data: `trivia` (multiple choice), `dilemma` (moral choice), `matching` (pair items), `timeline` (order events chronologically).

## Run Locally

```bash
git clone https://github.com/jcrowan3/saint-quest-mini.git
cd saint-quest-mini
open docs/index.html
# or use a local server:
python3 -m http.server 8000 --directory docs
```

## Contributing

Contributions are welcome! Some ideas:

- **New saints** — add entries to `saints.json` and corresponding quests to `quests.json`
- **New challenge types** — extend the rendering and scoring logic in `docs/index.html`
- **Translations** — help bring Saint Quest to other languages
- **Accessibility** — improve screen reader support, color contrast, or keyboard navigation

Fork the repo, create a branch, and open a PR. Please keep content respectful and theologically accurate.

## License

MIT
