# Endowment liquidity decision room

Interactive interview prototype using **fictional data**. Open `index.html` in a browser; no install, account, backend, or build step is needed. The calculations are in `model.js`, separate from the UI in `app.js`.

## Default scenario

A fictional $400M endowment considers a $20M private commitment after a 25% decline in marketable public assets. Starting balances are $20M cash, $260M marketable assets, $120M private NAV, and $90M existing unfunded commitments. An editable 60% **new-commitment approval gate** is inspired by FIU Foundation's published policy; this is not the fictional endowment's real policy.

Approving adds $20M to unfunded immediately. With a 20% first-year new-call assumption, $4M is scheduled over 12 months. Deferring the proposal leaves the $45M of existing calls intact. Calls transfer cash to private NAV and reduce unfunded; they do not by themselves reduce NAV plus unfunded exposure. The app shows current exposure before the proposal and pro forma exposure after it. If liquid assets cannot cover scheduled needs, the portfolio projection stops at the first unmet month.

## Review and tests

1. Open `index.html` and move the scenario controls. Use **Reset** for the walkthrough defaults.
2. Run `node --test test/model.test.js` for calculation edge cases.
3. Read [THESIS.md](THESIS.md) and [DECISIONS.md](DECISIONS.md) for evidence, assumptions, and limitations.

The scenario is illustrative, not a forecast or investment recommendation. No real client or employer data is included.

## Decision envelope and committee brief

The envelope checks exposure at scenario start and every month-end and requires all scheduled cash needs to be funded. It shows the maximum modeled exposure, first threshold crossing, full-year new commitment capacity, and a no-distributions sensitivity. Capacity is a conditional planning limit, separate from the current-position approval rule. When the existing portfolio already fails the envelope, zero new capacity does not imply that deferral repairs it.

At a 10% public shock with default cash-flow assumptions, starting exposure-only headroom is $14.4M but full-year capacity is $8.4M. With no distributions, full-year capacity is $2.4M. A button rounds capacity down to a whole-million proposal within the slider range. The committee brief compares approve versus defer, states remaining unfunded obligations, and prints on its own using **Print brief**. No later-year cash-flow schedule is modeled.

## Liquidity, spending, and sale assumptions

The default annual spending budget is $20M, or 5% of opening NAV, and is editable in dollars. This is a fictional budget; a cut is a proposed institutional budget decision. Coverage is scenario-start cash plus shocked marketable assets divided by calls + spending − scenario distributions for year one. The editable default floor is 3.0× and also constrains capacity. Nonpositive net needs display as no net funding need. This ratio is not a forecast of years of runway; a no-distributions sensitivity shows dependence on inflows.

The further-decline metric uses the remaining shocked public sleeve and includes the proposed commitment. It shows Already above gate or At gate as appropriate, and does not describe full-year exposure headroom.

The default sale sensitivity sells $35M NAV and transfers $15M unfunded. Cash proceeds are $31.5M at a 10% discount; transferred unfunded adds no cash. Existing calls fall by the transferred share of opening unfunded, and distributions fall by the sold share of opening private NAV. These are labeled proportional assumptions, not fund-level forecasts.

## GitHub Pages

Live demo: https://sinbinyazz.github.io/Endowment-Liquidity/. GitHub Pages publishes the root of `main`; the site and its three static assets returned HTTP 200 after the successful deployment run.
