Saint Quest is an installable Next.js game about the lives and virtues of the
saints. The canonical application lives in `app/`, `lib/`, and `data/`; see
[ARCHITECTURE.md](./ARCHITECTURE.md) for its state model, deployment path, and
the status of the legacy browser and Streamlit versions.

Play does not require an account. Each saint walk is a short story plus a
challenge: shuffled multiple-choice, matching, or a timeline. A miss gets one
retry with a hint; the explanation always follows. Completion recaps each quest
by title.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

Before opening a pull request, run the same gates GitHub CI runs:

```bash
npm test
npm run lint
npm run typecheck
npm run build:pages
npm run verify:pages
```

Pull requests run those checks in `.github/workflows/ci.yml`. Pushes to `main`
run them again in `.github/workflows/deploy-pages.yml` before any Pages upload.

## GitHub Pages

The canonical application is statically exportable. The Pages workflow publishes
the verified `out/` artifact after GitHub Pages is switched from the legacy
`docs/` source to GitHub Actions. Until that cutover is deliberately completed
and smoke tested, `docs/index.html` remains the rollback copy of the existing
live game.

## Saint Authoring

Use the local authoring CLI before committing new saint data:

```bash
npm run saint:author -- new joan --name "St. Joan of Arc" --out drafts/joan.json
npm run saint:author -- validate drafts/joan.json
npm run saint:author -- preview drafts/joan.json
```

The validator also checks the committed catalog:

```bash
npm run saint:author -- validate
```

It verifies required saint metadata, at least three quest slots per saint,
challenge answer indexes, matching/timeline data, reward values, and a `hint`
plus `explanation` on every challenge. Trivia and dilemma options are shuffled
at play time, so the stored `answer_index` is the catalog index, not the on-screen
order. Write plausible distractors; do not park the correct answer at index 0
as a convention.

Content changes should update the JSON catalog and pass the authoring validator.
Gameplay changes should update the canonical Next.js components and add focused
tests for any state transition they introduce.

Catholic content should stay careful: distinguish teaching tradition from
courtroom history, keep Kolbe age-appropriate, and do not add photoreal portraits
of named saints.
