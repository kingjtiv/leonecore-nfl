# LeoneCore — The Sunday Read

A responsive NFL research publication in black, warm ivory and muted gold. Built as a lightweight static website for GitHub Pages, with no build dependencies or API keys.

## Content

- Separate 1 PM and 4 PM windows, including exact late kickoff times.
- Touchdown watchlists, qualitative read labels and dated price context.
- Safer (5 legs), original balanced (7 legs) and aggressive (8 legs) research cards.
- Injury and weather notes, source links and responsible wagering disclaimer.
- Edition archive, supporting stat disclosures and copyable cards.

The launch edition is September 20, 2026. Original rankings, prices and statistics come from the user-supplied “NFL Parlay Analysis” conversation. They are displayed as a research snapshot, not live markets. The schedule and cited Flowers absence were checked against linked primary sources. Other notes require current verification. The safer cards and late aggressive card are editorial variations on the source's legs. Same-game correlations are not modeled and no combined odds are calculated.

## Update the daily slate

1. Duplicate `data/slates/2026-09-20.json` to `data/slates/YYYY-MM-DD.json`.
2. Edit the date, label, week, edition number, snapshot timestamp, source note, both kickoff windows, games, players, parlays and field notes. All published strings are rendered as text, with HTTPS-only external note links.
3. Add `{ "date": "YYYY-MM-DD", "label": "Sep 27, 2026 · Week 03" }` to `editions` in `data/index.json` and set `latest` to that date. Keep older files to preserve the archive.
4. Update the schedule source link in `index.html` when the week changes. Replace original/unverified labels only after checking their sources. Never label stale prices as live.
5. Commit to `main`; GitHub Pages republishes automatically.

Keep the slate identifiers `early` and `late` and the parlay identifiers `safer`, `balanced`, `aggressive`. Each leg is `["Player name", "Market description"]`. Standard cards have 5–11 legs. Sunday specials intentionally include a 12-leg anytime TD card, a 10-leg mixed card and a two-leg 2+ TD card. Labels are qualitative editorial reads, not probabilities.

## Local preview

Run `python3 -m http.server 8000` in this directory and visit http://localhost:8000. Opening `index.html` directly as a file will not load the JSON archive in most browsers.

## Publish with GitHub Pages

Create a new public repository, upload this directory's contents to its root, and select **Settings → Pages → Deploy from a branch → main → / (root)**. The included `.nojekyll` keeps the files as plain static assets. No paid services are required.

## Technical notes

Semantic HTML, keyboard-operable controls, reduced-motion support, responsive layouts and no application tracking. Optional fonts load from Google Fonts; system fonts provide fallbacks. Content is local JSON and no betting or account integrations are present. Clipboard support needs HTTPS; a selectable text fallback handles unavailable clipboard access.

## Sunday specials

Edit the optional `specials` object within each edition to update the 12-TD longshot, mixed-market card and Two the Hard Way pairing. Each structured leg includes `name`, `market`, `matchup`, `time` and `reason`. `watchlist` holds the 2+ TD candidates; `sources`, `updated` and `availability` preserve research provenance separately from the original slate snapshot. Editions without `specials` hide the section.

The mixed card uses editorial alternative thresholds, not confirmed sportsbook offers. Two the Hard Way means two scored touchdowns per player, not one per player and not passing touchdowns. Prices and availability must be verified before wagering.
