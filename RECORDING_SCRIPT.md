# Recording script — about four and a half minutes

Open https://sinbinyazz.github.io/Endowment-Liquidity/ and click **Reset**. Defaults: 25% public shock, 100% existing call pace, 50% distributions, $20M spending, $20M proposal, 20% new first-year call rate, 60% exposure gate, 3.0× liquidity coverage floor. Sale defaults: $35M NAV, $15M unfunded transferred, 10% discount.

Keep the floor at **3.0×** for the walkthrough. It is editable, but choose it before comparing decisions. Scroll within the input panel to reach its lower controls. The two committee scenarios lead into a short sale sensitivity; all spoken text is in quotation marks.

## Opening — 20 seconds

“This is a fictional $400M university endowment. We’re deciding whether to add a private commitment while protecting both policy headroom and liquidity. I’m using a fictional 60% exposure threshold and a three-times liquidity coverage floor, both editable assumptions.”

## Scenario 1: exposure headroom versus the full-year decision — 75 seconds

From Reset, change exactly:

1. **Public asset shock: 25% → 10%.**
2. **Proposed commitment: $20M → $14M.**

Keep spending at $20M and all other defaults. Expected results:

- Current exposure **56.1%**; with proposal **59.9%**.
- Maximum modeled exposure **61.6%**, first crossing in **month 1**.
- Further public decline to the starting gate: about **0.3%** from the already-shocked sleeve.
- Starting exposure-only headroom **$14.4M**; full-year capacity **$8.4M**; no-distributions capacity **$2.4M**.

“A $14M proposal appears to fit today. The downside figure means another 0.3% fall in the remaining public assets after our selected 10% shock—not a decline measured from the original portfolio.

“But the full-year picture is tighter: exposure crosses the threshold in month one. Commitment capacity is $8.4M, falling to $2.4M if distributions stop.”

Click **Test a $8.0M proposal…**. Expected results:

- Starting exposure **58.3%**; maximum **59.9%**, with no crossing in year one.
- Net-needs coverage **4.19×**, above the **3.0×** floor.
- Year-end liquid assets **$193.4M** versus **$195M** if deferred.
- **$6.4M** of the new commitment remains uncalled after year one.

“The rounded-down $8M proposal fits the selected constraints, with 4.19 times coverage of year-one net needs. It still leaves $6.4M of new obligations after this year.”

## Scenario 2: calls and spending make liquidity binding — 100 seconds

Continue with the $8M proposal and 10% shock. Change exactly:

1. **Existing call pace: 100% → 150%.**
2. **New commitment called in year 1: 20% → 100%.**

Expected results with spending still $20M:

- Existing calls **$67.5M** and new calls **$8M**.
- Year-one net needs **$89.5M** against **$254M** starting liquid assets.
- Approval coverage **2.84×**, below the **3.0×** floor; deferral coverage **3.12×**.
- Exposure remains within its threshold, but full-year commitment capacity falls to about **$3.2M** because liquidity now binds.

“Calls move cash into private NAV, so the exposure ratio barely reacts to their timing. Liquidity does react: $254M of liquid assets covers $89.5M of net needs only 2.84 times, below our three-times floor. We can still pay the modeled bills, but the cushion is inadequate under that assumption. We could reduce the proposal to roughly $3M or defer.”

Now change **Annual spending budget: $20M → $15M**. Expected results:

- Approval coverage rises to **3.01×**, just above the floor.
- Full-year commitment capacity rises to about **$8.2M**.
- Year-end liquid assets **$169.5M** versus **$177.5M** if deferred.

“A proposed $5M spending reduction restores coverage to 3.01 times and makes room for the $8M commitment. That has an institutional cost. The committee can see the trade-off between a smaller commitment and a budget change that needs separate authorization.”

## Committee brief — 20 seconds

Show **Committee brief**, then **Print brief**. Show the preview and cancel.

“The brief captures the proposed decision, coverage, budget change, and obligations left afterward. It gives the committee a concise record of the assumptions behind the choice.”

## Sale sensitivity: transferring obligations as well as NAV — 45 seconds

Click **Reset**, which restores the $20M budget and original scenario. Expand **Optional: hypothetical secondary-sale sensitivity**.

1. Keep **sale NAV $35M** and **discount 10%**.
2. Set **Sold position’s unfunded transferred: $15M → $0M**.
3. Then set it **$0M → $15M** to show the obligation relief.

| Expected sale result | $0M unfunded transferred | $15M transferred |
|---|---:|---:|
| Cash proceeds | $31.5M | $31.5M |
| Year-one existing calls | $45M | $37.5M |
| Year-one call relief | $0M | $7.5M |
| Pro forma exposure | 58.8% | 54.3% |
| Net-needs coverage | 3.81× | 4.31× |

Both cases relinquish **$1.75M** of distributions, displayed as **$1.8M**. The sale discount costs **$3.5M** in portfolio value.

“Transferring unfunded improves the exposure position and relieves future calls. It doesn’t add sale cash: proceeds stay $31.5M. Here, $15M transferred produces $7.5M of first-year call relief. We also lose distributions and realize a $3.5M discount loss. Those cash-flow allocations are proportional assumptions, and execution is unverified.”

## Closing limitation — 10–15 seconds

“The main limitation is the twelve-month horizon. We show remaining unfunded, but an actual authorization needs a longer-term pacing view and validation of the assumed liquidity and cash flows.”

If rehearsal exceeds five minutes, shorten the sale segment by showing only the default $15M-transferred case and stating that proceeds are unchanged by the transfer.
