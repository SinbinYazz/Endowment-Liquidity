# Product demonstration — target 4 minutes 30 seconds

This is the reviewer-facing product demo. [RECORDING_SCRIPT.md](RECORDING_SCRIPT.md) remains the detailed scenario rehearsal and calculation reference.

## Before recording

- Open https://sinbinyazz.github.io/Endowment-Liquidity/ and click **Reset**. Confirm **Public asset shock is 5%**, the current UI default, and begin at the top of the page. This milder case creates a less obvious decision than the 25% stress rehearsal.
- Begin with the **$20M proposed commitment**. During Liquidity Coverage, temporarily change **Existing call pace: 100% → 160% → 100%**. In Decision Envelope, click the shortcut to test a **$16M proposal**, then keep $16M for the rest of the video.
- Keep the other defaults: $20M spending, 50% distributions, 20% first-year new calls, 60% exposure gate, 3.0× coverage floor. All are fictional assumptions. Do not click Reset again during the recording.
- Speak the quoted text. Screen directions and expected readouts are rehearsal notes. Avoid reading every number on a panel.

## 0:00–0:30 — Customer, problem, and moment

**Screen:** Title, committee question, and starting portfolio.

“This prototype is designed for a small university endowment investment team preparing for an investment committee meeting after a market drawdown.

“The CIO needs to decide whether a new private-fund commitment still fits alongside spending and existing funding obligations. Liquidity Decision Room brings those questions into one explainable scenario and a brief the team can take to the committee.”

## 0:30–0:50 — Establish the base case

**Screen:** Starting portfolio and inputs. Confirm the prepared 5% shock and $20M proposal.

“We’re reviewing a $20M commitment for a fictional $400M endowment, after a 5% decline in its public assets. The inputs describe assumptions about calls, distributions, spending, and policy limits. Staff can change those assumptions as the committee discussion develops.”

## 0:50–1:20 — Decision Snapshot: what needs attention now?

**Screen:** Scroll to Decision Snapshot.

“The snapshot separates our existing position from the proposal. Private asset value plus unfunded commitments—capital promised but not yet called—stays below the illustrative exposure gate, even with the full $20M proposal.

“So it appears to fit today. But the remaining headroom is small: another 1.5% decline in the already-shocked public assets reaches the gate. That prompts a look at the full-year picture before authorization.”

**Expected:** Current exposure **54.3%**; with proposal **59.4%**; further decline **1.5%**; cash draw **Month 4**. Both starting exposure ratios are below 60%. Leave cash timing for the later chart.

## 1:20–1:55 — Liquidity Coverage: how much funding cushion remains?

**Screen:** Scroll to Liquidity Coverage. Set **Existing call pace to 160%**, pause, then return it to **100%**.

“Liquidity coverage asks how comfortably liquid assets cover the next year’s calls and spending, after assumed distributions. The base case meets our selected three-times floor.

“If the committee asks about faster calls, I can test that here. Approval falls below the floor while deferral still meets it, making the incremental funding pressure visible. Returning to our base assumptions restores the cushion. The no-distributions view shows dependence on incoming cash.”

**Expected:** Base approval **4.24×**, deferral **4.53×**, approval without distributions **3.87×**. At 160% existing calls, approval coverage is **2.97×**, below **3.0×**, while deferral is **3.10×**. Restore **100%** and verify **4.24×** before continuing.

## 1:55–2:25 — Decision Envelope: connect today's position to the full year

**Screen:** Scroll to Decision Envelope. Show the $20M result, then click **Test a $16.0M proposal…**. Leave the proposal at $16M afterward.

“The envelope checks the full modeled year. Our $20M proposal crosses the exposure threshold in month five, despite fitting at the start. The selected assumptions support $16.2M, falling to $10.2M if distributions stop.

“I can test a rounded-down $16M proposal here. It stays within the modeled constraints. The CIO now has a smaller authorization to discuss alongside deferral, with the sensitivity to distributions clearly visible.”

**Expected before shortcut:** Peak exposure **61.0%** in month 12; first crossing **Month 5**; full-year capacity **$16.2M**, no-distributions capacity **$10.2M**. These are conditional planning limits, not an investment recommendation.

**Expected after shortcut:** Proposed commitment **$16M**; starting exposure **58.4%**; peak **59.9%**; no crossing through month 12; coverage **4.29×**. All following panels now refer to this smaller proposal.

## 2:25–3:00 — Committee Brief: turn analysis into a discussion

**Screen:** Scroll to Committee Brief. Click **Print brief**, show the one-page preview briefly, then **Cancel**.

“The brief captures that smaller proposal, its cash consequences, and the obligations that remain afterward.

“It carries the assumptions alongside the output, including spending and the liquidity floor. Staff can validate that record and bring the printable page to the meeting. It supports the committee’s judgment rather than granting approval automatically.”

**Cue:** Cancel the preview without sending a print job. Inputs stay unchanged.

## 3:00–3:25 — Approve versus Defer: isolate the incremental trade-off

**Screen:** Scroll to Approve versus Defer.

“The comparison isolates what the revised $16M proposal changes. Existing calls continue either way. Approval adds $3.2M of calls this year, leaving $204.8M of liquid assets versus $208M if deferred.

“It also leaves $12.8M of this new commitment uncalled after year one, so the committee can see the continuing obligation alongside the immediate cash impact.”

**Expected:** Existing calls **$45M** in both options; total year-end unfunded **$57.8M** versus **$45M**. The proposed commitment remains $16M; do not return it to $20M here.

## 3:25–3:45 — Where Cash Comes From: explain the path behind the totals

**Screen:** Scroll to the monthly chart.

“The cash path explains how we reach those totals. The reserve starts drawing on marketable assets in month four. That is a planned funding source in this scenario, while the note makes the assumed asset availability and even monthly cash flows explicit.”

**Expected:** **$42.2M** of marketable assets drawn by month 12. The chart is for approval of the revised $16M proposal. The cash reserve is being replenished from marketable assets; total liquid assets are not exhausted. The model has already applied the market shock and assumes these sales at that shocked value.

## 3:45–4:10 — Sale Sensitivity: another lever and its cost

**Screen:** Expand Optional: hypothetical secondary-sale sensitivity. Keep default sale inputs.

“A secondary sale is another sensitivity the committee can examine. This example raises cash and transfers unfunded obligations, improving liquidity and exposure.

“The panel also makes the costs visible: a discount loss and distributions relinquished. Call relief is proportional to the unfunded transferred. Those are transparent modeling assumptions; an executable sale would need its own evidence.”

**Reference; don't read every value:** $35M NAV sold, $15M unfunded transferred, 10% discount; **$31.5M** proceeds, **$7.5M** call relief, **$3.5M** discount loss, **$1.8M** displayed distributions relinquished. This sensitivity does not change the main approval scenario or its brief.

## 4:10–4:30 — Assumptions, limitation, and intended value

**Screen:** Expand Assumptions and calculation rules; finish at the source link.

“The ledger lets staff trace outputs back to their inputs. The main limitation is the twelve-month horizon: later calls and actual liquidity restrictions still need validation.

“The intended value is a faster, traceable path from changed assumptions to a committee discussion, with a concise record of the choices and trade-offs.”

## Timing guardrail

The narration is approximately **550 words**: about four minutes at 140 words per minute, plus scrolling and the preview. Target **4:15–4:45** in rehearsal; stop by **5:00**. If needed, shorten the sale segment to one sentence about cash raised, obligations transferred, and the discount cost. Keep the customer introduction, core decision panels, and limitation. Use the original script for slider-by-slider rehearsal.
