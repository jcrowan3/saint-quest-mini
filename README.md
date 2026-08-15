Saint Quest is an installable Next.js game about the lives and virtues of the
saints. The canonical application lives in `app/`, `lib/`, and `data/`; see
[ARCHITECTURE.md](./ARCHITECTURE.md) for its state model, deployment path, and
the status of the legacy browser and Streamlit versions.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Before sharing a change, run the complete local quality gate:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## GitHub Pages

The canonical application is statically exportable. A Pages-targeted build and
artifact verification can be run locally with:

```bash
npm run build:pages
npm run verify:pages
```

The workflow in `.github/workflows/deploy-pages.yml` publishes the verified
`out/` artifact after GitHub Pages is switched from the legacy `docs/` source
to GitHub Actions. Until that cutover is deliberately completed and smoke
tested, `docs/index.html` remains the rollback copy of the existing live game.

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

It verifies required saint metadata, at least three quest slots per saint, challenge answer indexes, matching/timeline data, and reward values.

Content changes should update the JSON catalog and pass the authoring validator;
gameplay changes should update the canonical Next.js components and add focused
tests for any state transition they introduce.
