# Recording script — about four minutes

Open https://sinbinyazz.github.io/Endowment-Liquidity/ and click **Reset**. Defaults: 25% public shock, 100% existing call pace, 50% distributions, $20M spending, $20M proposal, 20% new first-year call rate, 60% exposure gate, 3.0× liquidity coverage floor. Sale inputs are optional and unused in these two stories.

## Opening — 20 seconds

“This is a fictional $400M university endowment. We’re deciding whether to add a private commitment while protecting both policy headroom and liquidity. Every input is illustrative, and the brief makes the assumptions visible.”

## Scenario 1: a commitment that fits today can exceed the threshold later — 90 seconds

From Reset, change exactly:

1. **Public asset shock: 25% → 10%.**
2. **Proposed commitment: $20M → $14M.**

Keep spending at $20M and all other defaults. Expected results:

- Current exposure **56.1%**; with proposal **59.9%**.
- Maximum modeled exposure **61.6%**, first crossing in **month 1**.
- Further public decline to the starting gate: about **0.3%** from the already-shocked sleeve.
- Starting exposure-only headroom **$14.4M**; full-year capacity **$8.4M**; no-distributions capacity **$2.4M**.

“A $14M proposal appears to fit at the starting date. But spending and private cash flows change the position through the year: it crosses the exposure threshold in month one. The full-year envelope is $8.4M, and it falls to $2.4M if distributions stop.”

Click **Test a $8.0M proposal…**. Expected results:

- Starting exposure **58.3%**; maximum **59.9%**, with no crossing in year one.
- Net-needs coverage **4.19×**, above the **3.0×** floor.
- Year-end liquid assets **$193.4M** versus **$195M** if deferred.
- **$6.4M** of the new commitment remains uncalled after year one.

“The rounded-down $8M proposal fits the selected exposure and liquidity constraints. That gives the committee a concrete alternative to approving the full amount or deferring. It still creates obligations beyond this year.”

## Scenario 2: call acceleration makes liquidity the binding constraint — 90 seconds

Continue with the $8M proposal and 10% shock. Change exactly:

1. **Existing call pace: 100% → 150%.**
2. **New commitment called in year 1: 20% → 100%.**

Expected results with spending still $20M:

- Existing calls **$67.5M** and new calls **$8M**.
- Year-one net needs **$89.5M** against **$254M** starting liquid assets.
- Approval coverage **2.84×**, below the **3.0×** floor; deferral coverage **3.12×**.
- Exposure remains within its threshold, but full-year commitment capacity falls to about **$3.2M** because liquidity now binds.

“The exposure ratio barely reacts to call timing because calls move cash into private NAV. But our liquidity cushion does react. We can still pay the modeled bills, yet approval falls below the committee’s selected coverage floor. One option is to reduce the proposal to roughly $3M or defer.”

Now change **Annual spending budget: $20M → $15M**. Expected results:

- Approval coverage rises to **3.01×**, just above the floor.
- Full-year commitment capacity rises to about **$8.2M**.
- Year-end liquid assets **$169.5M** versus **$177.5M** if deferred.

“A proposed $5M spending reduction restores enough coverage for the $8M commitment, but it has an institutional cost. This isn’t an automatic spending cut: it makes the trade-off visible for the people who can authorize that budget change.”

## Brief and limitation — 30–45 seconds

Show **Committee brief**, then **Print brief**. Show the preview and cancel.

“The brief captures the decision, cash requirements, and obligations that remain. One limitation is the twelve-month horizon: we show remaining unfunded, but don’t forecast the later call schedule. I’d validate that longer-term pacing picture before an actual authorization.”

## Optional sale check, outside the main recording

At Reset, the default sale sensitivity sells $35M NAV and transfers $15M unfunded at a 10% discount. Expected cash proceeds are $31.5M, year-one call relief $7.5M, and distributions relinquished $1.75M (displayed rounded to $1.8M). Transferred unfunded adds no cash. Cash-flow changes use labeled proportional assumptions.
