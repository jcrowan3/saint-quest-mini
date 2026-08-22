# Saint Quest architecture

## Canonical application

The actively maintained game is the Next.js application:

- `app/` contains routes and UI.
- `lib/` contains game state, data selection, and play helpers (`lib/shuffle.ts`).
- `data/` is the canonical saint, quest, and reflection catalog.
- `tests/` validates the catalog and pure game behavior.
- `public/` contains installable-app assets and the service worker.

New gameplay, content, and fixes should target this application and its JSON data.

Play is local and unsigned: progress lives in `localStorage` as
`saintQuestProgress:v2`. Sign-in is not required.

## Challenge contract

Every quest has a `story` and one `challenge` of type `dilemma`, `trivia`,
`matching`, or `timeline`. All four types require a `hint` and an
`explanation`. Trivia and dilemma store the correct choice as `answer_index`
against the catalog array; play shuffles those options so the first button is
not the answer. Matching shuffles the right-hand column. Timeline shuffles the
starting event order.

On a miss, the player gets one retry and sees the hint. After the final
attempt, feedback shows the explanation. `QuestResult` may keep the quest
`title` and `usedRetry` so the completion recap is titled rather than numbered.

`scripts/saint-authoring.ts` rejects drafts and catalog entries that omit hint
or explanation.

## Deployment

`next.config.ts` statically exports the canonical application to ignored `out/`.

- `.github/workflows/ci.yml` runs test, lint, typecheck, `build:pages`, and
  `verify:pages` on every pull request. It does not upload or deploy.
- `.github/workflows/deploy-pages.yml` runs the same gates on `main`, then
  uploads the Pages artifact. The deploy job is main-only.

GitHub Pages must be switched from its legacy branch source to GitHub Actions
before the deploy workflow becomes the production publisher.

The application uses `NEXT_PUBLIC_BASE_PATH` so routes, metadata, the manifest,
icons, and the service worker work under the repository path on GitHub Pages.
`NEXT_PUBLIC_BUILD_SHA` is embedded in the HTML so a deployed artifact can be
traced to its source commit.

`docs/index.html` is the current legacy Pages game and remains a rollback copy
until the workflow-built application has been deployed and smoke-tested. Do not
edit generated Next output into `docs/`.

## Legacy implementations

- `docs/index.html`: legacy standalone browser game and current rollback.
- `app.py` and `style.css`: legacy Streamlit prototype.

These implementations have different saint catalogs and progression systems.
Do not add features to them in parallel with the canonical app. Archive them in
a separate cleanup only after the workflow deployment is verified.

## Quality gates

Before proposing a deployment or opening a pull request:

```bash
npm test
npm run lint
npm run typecheck
npm run build:pages
npm run verify:pages
```

Browser checks should cover selecting a saint, entering a challenge, a wrong
answer that shows the hint and allows one retry, the explanation on feedback,
quest advancement, reload/resume, a completion recap that names each quest,
lifetime totals, and a mobile viewport. Visually inspect the generated
screenshots and review browser console errors.
