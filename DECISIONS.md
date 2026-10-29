# Decisions, checks, and limitations

| Milestone | Decision or check | Reason / limitation |
|---|---|---|
| Scope | Focus on a fictional university endowment considering a new private commitment after a public-market decline. | One user and decision fit the three-hour exercise. Foundation payout law and multiple customer types are excluded. |
| Evidence | Use primary sources from Kentucky, FIU Foundation, Rutgers, and NACUBO. | UK shows a real liquidity stress review; FIU gives a specific commitment approval rule. Neither proves annual-only analysis or a universal 60% policy. Rutgers explicitly requires ongoing liquidity reviews. |
| Sizing | Show a range based on 657 survey participants, an assumed 25–40% fit, and assumed $20–40k annual price. | Survey respondents are not the full market or necessarily buyers. |
| Commitment | Approval adds the full proposed amount to unfunded immediately. First-year new calls equal commitment × editable call rate. Deferral changes neither existing calls nor existing unfunded. | Constant monthly call timing is illustrative; actual schedules vary by fund. |
| Gate | Show current exposure before the proposal and pro forma exposure after it. Require approval only for a new commitment when current exposure exceeds the editable threshold; separately flag a proposal that would cross it. | Inspired by FIU's *current-exposure new-commitment approval* rule, not a prohibition on holding the portfolio. Deferral and a zero proposal request no approval. |
| Cash path | Calls transfer cash to private NAV and reduce unfunded; distributions reverse that transfer; spending leaves the portfolio. Negative cash draws on marketable assets. Stop portfolio projection at the first unmet cash need. | No growth, gifts, fees, taxes, borrowing, redemption notice periods, or sale slippage on marketable assets. The model cannot assign an unmet need between calls and spending. |
| Secondary option | Present a hypothetical sensitivity for a seasoned private position with no attached unfunded or forecast distributions; proceeds equal sold NAV less a discount. | Actual terms, timing, and transfer restrictions are unknown. A favorable ratio does not establish an executable sale. |
| Product AI | Use AI to build the prototype; use deterministic, calculation-backed text in the UI. | The assignment does not require in-product AI; deterministic text prevents invented numbers. |
| Delivery | Dependency-free static files, suitable for local opening or GitHub Pages; test the calculation module with Node. | Connected to the user's existing repository. Restricted shell network blocked GitHub, but unrestricted Git fetch and push succeeded. User enabled Pages. The deployment run succeeded and the live page, model script, UI script, and style sheet returned HTTP 200. Interactive browser verification remains. |
| Test | `node --test test/model.test.js` passes nine cases, including zero proposed commitment, pre- versus post-proposal gate logic, and a reachable $1M cash shortfall with no fabricated year-end state. | Browser visual check and published-link check remain separate gates. |

## Work remaining before submission

- Verify the browser experience and default numbers.
- Open the live Pages demo in a browser and verify slider behavior visually.
- Record a 3–5 minute walkthrough and attach an actual AI session export or screenshots. A curated work log is not a substitute for the required transcript.
