# ideaBrowser-tracker

Lightweight automated monitor that captures IdeaBrowser.com content daily, extracts and cleans text with AI, analyzes readability and vocabulary, and stores historical snapshots for trend analysis.

Built with Playwright, TypeScript, Supabase (storage), and OpenAI (text cleaning).

## Features

- Headless browser capture of target page (`[`TARGET_URL`](src/utils/constants.ts)`).
- Direct page text extraction and fallback to full-body scrape ([`extractPageText`](src/index.ts)).
- AI-driven text cleaning using OpenAI ([`cleanTextWithAI`](src/utils/textCleaning.ts)).
- Text quality metrics: readability score, unique words, counts ([`analyzeTextQuality`](src/utils/textAnalysis.ts)).
- Persistent snapshot storage in Supabase ([`storeSnapshot`](src/db/index.ts)), with a connection test helper ([`testSupabaseConnection`](src/db/index.ts)).
- Optional daily scheduling via GitHub Actions ([`.github/workflows/daily-capture.yml`](.github/workflows/daily-capture.yml)).

## Quick Start

1. Clone and install dependencies
```bash
npm install
```

2. Environment variables

Create a `.env` file at the repo root with:

- OPENAI_API_KEY — OpenAI API key used by [`cleanTextWithAI`](src/utils/textCleaning.ts)
- SUPABASE_URL — Supabase project URL used by [`storeSnapshot`](src/db/index.ts)
- SUPABASE_KEY — Supabase service role / anon key
- TARGET_URL — optional, defaults to `https://ideabrowser.com` (see [`TARGET_URL`](src/utils/constants.ts))

3. Run locally (development)
- Quick run with ts-node:
```bash
npx ts-node src/index.ts
```
- Or build and run (if you have a build script):
```bash
npm run build
node dist/index.js
```

The main capture flow runs in [`captureIdeaBrowser`](src/index.ts) — it extracts text, cleans it, analyzes it, and calls [`storeSnapshot`](src/db/index.ts).

## Scheduling

A GitHub Actions workflow is included to run the capture daily: [`.github/workflows/daily-capture.yml`](.github/workflows/daily-capture.yml). Adjust the schedule or secrets in the repository settings to use Supabase and OpenAI credentials.

## Troubleshooting

- No snapshots saved: confirm SUPABASE_URL and SUPABASE_KEY are set. Use [`testSupabaseConnection`](src/db/index.ts) to validate connectivity.
- Empty or malformed text: check extraction selector logic in [`extractPageText`](src/index.ts) and AI cleaning logs from [`cleanTextWithAI`](src/utils/textCleaning.ts).
- Check runtime logs printed by the main script for errors and browser lifecycle messages.

## Project layout

- [src/index.ts](src/index.ts) — main capture flow and Playwright integration
- [src/db/index.ts](src/db/index.ts) — Supabase helpers: [`storeSnapshot`](src/db/index.ts), [`testSupabaseConnection`](src/db/index.ts)
- [src/utils/textCleaning.ts](src/utils/textCleaning.ts) — AI cleaning: [`cleanTextWithAI`](src/utils/textCleaning.ts)
- [src/utils/textAnalysis.ts](src/utils/textAnalysis.ts) — quality metrics: [`analyzeTextQuality`](src/utils/textAnalysis.ts)
- [src/utils/constants.ts](src/utils/constants.ts) — constants like [`TARGET_URL`](src/utils/constants.ts)
- [.github/workflows/daily-capture.yml](.github/workflows/daily-capture.yml) — scheduled run

## Contributing

- Open issues for bugs or feature requests.
- For changes, fork, create a branch, and submit a PR.

## License

Add your license file or choose one for the
