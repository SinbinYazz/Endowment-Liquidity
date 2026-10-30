# Endowment liquidity decision room

An interactive interview prototype for a university endowment investment team reviewing a new private-fund commitment. It shows exposure and liquidity constraints, compares approval with deferral, and produces a printable committee brief. All portfolio data and scenario settings are **fictional**.

**[Open the live demo](https://sinbinyazz.github.io/Endowment-Liquidity/)** or open `index.html` locally. No install, account, backend, or build step is required. Calculations live in `model.js`; presentation and interactions live in `app.js` and `index.html`.

## Current UI defaults

Click **Reset** to restore these values. The public-asset shock default is now **5%**, following the latest UI change; 25% is a separate stress case.

| Input | Reset value |
|---|---:|
| Opening portfolio | $400M: $20M cash, $260M marketable assets, $120M private NAV |
| Existing unfunded commitments | $90M |
| Public-asset shock | −5% |
| Existing call pace | 100% of $45M annual base calls |
| Private distributions | 50% of $12M annual base distributions = $6M |
| Annual spending budget | $20M, or 5% of opening NAV |
| Proposed new commitment | $20M |
| New commitment called in year one | 20%, or $4M |
| New-commitment approval gate | 60% |
| Net-needs liquidity coverage floor | 3.0× |
| Optional sale | $35M NAV, $15M unfunded transferred, 10% NAV discount |

All dollar amounts are USD millions. The 60% approval rule is inspired by FIU Foundation's published policy; its use here and the 3.0× liquidity floor are illustrative. See [THESIS.md](THESIS.md) for the sources and evidence boundaries.

## What the default case demonstrates

| Output at the 5% shock | Approve $20M | Defer |
|---|---:|---:|
| Starting exposure, private NAV + unfunded / portfolio NAV | 59.4% | 54.3% |
| Maximum modeled exposure | 61.0% | 55.6% |
| First exposure above 60% | Month 5 | None through month 12 |
| Initial net-needs liquidity coverage | 4.24× | 4.53× |
| Year-end liquid assets | $204M | $208M |
| Year-end unfunded commitments | $61M | $45M |

The full proposal fits at the starting date but crosses the exposure planning threshold during the year. Conditional commitment capacity is **$16.2M**, falling to **$10.2M** without distributions. The capacity button tests a rounded-down **$16M** proposal, which peaks at **59.9%** and leaves **$12.8M** of that new commitment uncalled after year one.

The cash reserve begins drawing on marketable assets in month 4 under approval and month 5 under deferral. This is scheduled liquidation in the model; neither case exhausts total liquid assets. The shock is applied before the sales, and no additional marketable-asset transaction loss, cost basis, recovery, or expected alpha is modeled.

## Reading the decision outputs

- **Decision Snapshot:** current exposure is shown before the proposal, and pro forma exposure includes the full new commitment. Under the modeled FIU-style rule, a new commitment requires an exception when current exposure already exceeds the gate. Deferral and a zero proposal request no new approval.
- **Further public decline:** additional loss in the already-shocked marketable sleeve that reaches the starting pro forma gate. It responds to the selected shock and shows Already above gate or At gate when appropriate. The full-year path is a separate calculation.
- **Liquidity Coverage:** initial cash plus shocked marketable assets divided by scheduled year-one calls + spending − distributions. The editable floor constrains commitment capacity. A no-distributions sensitivity removes the inflow offset. Nonpositive net needs display as no net funding need. Coverage is an initial funding-cushion ratio, not rolling coverage or years of forecast runway.
- **Decision Envelope:** finds the largest new commitment meeting the initial coverage floor, the exposure threshold at scenario start and every month-end, and all scheduled cash needs. Starting exposure-only headroom does not include every constraint. If the existing portfolio fails, zero new capacity does not mean deferral repairs it. Later exposure crossings are pacing warnings rather than retroactive approval requirements.
- **Committee Brief:** summarizes the decision, approve-versus-defer cash impact, remaining unfunded obligations, spending assumptions, and sensitivities. **Print brief** prints only this section; browser verification confirmed a single-page preview.
- **Approve versus Defer / cash path:** existing calls continue in both cases. Calls transfer cash into private NAV and reduce unfunded dollar for dollar. Distributions transfer private NAV into cash without restoring unfunded. Spending leaves the portfolio. If a scheduled monthly need cannot be met, portfolio balances stop at that month and the first unmet amount is reported.
- **Optional Sale Sensitivity:** sale proceeds equal sold NAV × (1 − discount). Transferred unfunded reduces obligations and adds no cash. Existing calls fall in proportion to unfunded transferred; distributions fall in proportion to NAV sold. Default sale proceeds are $31.5M, first-year call relief $7.5M, and distributions relinquished $1.75M (displayed $1.8M). Sale results do not replace the main proposal or its brief.

## Demo and submission materials

- [PRODUCT_DEMO_SCRIPT.md](PRODUCT_DEMO_SCRIPT.md): recommended reviewer-facing, top-to-bottom demonstration. Start with Reset at 5% / $20M; temporarily test 160% existing calls, restore 100%, then test the $16M proposal. Target about 4½ minutes.
- [RECORDING_SCRIPT.md](RECORDING_SCRIPT.md): detailed scenario rehearsal. It explicitly starts with a 25% stress case and later uses 10%; these differ from the UI default.
- [THESIS.md](THESIS.md): value thesis, client questions, success-metric hypothesis, and sources.
- [SUBMISSION.md](SUBMISSION.md): required deliverables and recording outline.
- [DECISIONS.md](DECISIONS.md): current choices, verification evidence, and limitations.

The user is handling the actual 3–5 minute recording and AI session export. Those files are not included in this repository.

## Tests and developer notes

Run `node --test test/model.test.js`. The current suite has **20 passing tests**, including commitment accounting, coverage-floor constraints, spending changes, sale transfers, relative downside, and infeasible cash paths.

The browser passes its selected inputs explicitly to the model. The direct API call `LiquidityModel.calculate({})` still falls back to a **25% shock** in `model.js`; it does not represent the UI Reset case. Pass `shock: 0.05` explicitly to reproduce the current product demo. Historical 25% and $15M-spending cases remain in the tests intentionally.

GitHub Pages publishes the root of `main`. The reviewed application files were checked against their hosted counterparts. Subsequent documentation updates do not change calculations.

## Limits

The model spans 12 months, uses even monthly cash flows, holds private NAV unchanged at the initial public shock, and assumes marketable assets can be sold when needed at shocked value. It excludes later returns, gifts, fees, taxes, borrowing, notice periods, and marketable-asset transaction costs. Private-sale execution and proportional cash-flow allocations are hypothetical. No later-year call schedule or investment-merit assessment is provided. Client validation is still needed for workflow value, input availability, policy interpretation, and willingness to pay.
