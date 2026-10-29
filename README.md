# Endowment liquidity decision room

Interactive interview prototype using **fictional data**. Open `index.html` in a browser; no install, account, backend, or build step is needed. The calculations are in `model.js`, separate from the UI in `app.js`.

## Default scenario

A fictional $400M endowment considers a $20M private commitment after a 25% decline in marketable public assets. Starting balances are $20M cash, $260M marketable assets, $120M private NAV, and $90M existing unfunded commitments. An editable 60% **new-commitment approval gate** is inspired by FIU Foundation's published policy; this is not the fictional endowment's real policy.

Approving adds $20M to unfunded immediately. With a 20% first-year new-call assumption, $4M is called over 12 months. Deferring the proposal leaves the $45M of existing calls intact. Calls transfer cash to private NAV and reduce unfunded; they do not by themselves reduce NAV plus unfunded exposure.

## Review and tests

1. Open `index.html` and move the scenario controls. Use **Reset** for the walkthrough defaults.
2. Run `node --test test/model.test.js` for calculation edge cases.
3. Read [THESIS.md](THESIS.md) and [DECISIONS.md](DECISIONS.md) for evidence, assumptions, and limitations.

The scenario is illustrative, not a forecast or investment recommendation. No real client or employer data is included.

## GitHub Pages

Publish the root of `main` as the Pages source in **Settings → Pages → Build and deployment → Deploy from a branch**. GitHub Pages looks for the root `index.html`. The expected project URL is `https://sinbinyazz.github.io/Endowment-Liquidity/`; verify it after publishing.
