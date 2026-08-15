# Saint Quest architecture

## Canonical application

The actively maintained game is the Next.js application:

- `app/` contains routes and UI.
- `lib/` contains game state and data selection logic.
- `data/` is the canonical saint, quest, and reflection catalog.
- `tests/` validates the catalog and pure game behavior.
- `public/` contains installable-app assets and the service worker.

New gameplay, content, and fixes should target this application and its JSON data.

## Deployment

`next.config.ts` statically exports the canonical application to ignored `out/`.
The Pages workflow tests, lints, type-checks, builds, verifies, and uploads that
directory. GitHub Pages must be switched from its legacy branch source to
GitHub Actions before this workflow becomes the production publisher.

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

Before proposing a deployment:

```bash
npm test
npm run lint
npm run typecheck
npm run build:pages
npm run verify:pages
```

Browser checks should cover selecting a saint, entering and answering a
challenge, feedback, quest advancement, reload/resume, completion totals, and a
mobile viewport. Visually inspect the generated screenshots and review browser
console errors.
