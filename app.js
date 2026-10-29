(function () {
  const $ = id => document.getElementById(id);
  const ids = ['shock','calls','distributions','commitment','callRate','gate','sale','discount'];
  const defaults = Object.fromEntries(ids.map(id => [id, $(id).value]));
  const money = n => '$' + n.toFixed(1) + 'M';
  const pct = n => (n * 100).toFixed(1) + '%';
  function read() {
    return { shock: +$('shock').value / 100, callMultiplier: +$('calls').value / 100,
      distributionMultiplier: +$('distributions').value / 100,
      proposedCommitment: +$('commitment').value, newCallRate: +$('callRate').value / 100,
      gate: +$('gate').value / 100, saleNav: +$('sale').value,
      saleDiscount: +$('discount').value / 100 };
  }
  function gateStatus(r) {
    if (!r.committed) return { label: 'No new approval requested', tone: 'neutral' };
    if (r.approvalRequired) return { label: 'New commitment requires approval', tone: 'warn' };
    if (r.proFormaExceedsGate) return { label: 'Proposal crosses gate; review', tone: 'warn' };
    if (LiquidityModel.exposurePath(r).firstOverMonth !== null)
      return { label: 'Exposure crosses threshold during year 1', tone: 'warn' };
    return { label: 'Within threshold through modeled year 1', tone: 'ok' };
  }
  function actionCard(title, subtitle, r, hypothetical) {
    const status = hypothetical
      ? { label: 'Hypothetical only · execution unverified', tone: 'neutral' }
      : gateStatus(r);
    const endingLiquid = r.ending ? money(r.ending.cash + r.ending.marketable)
      : `Not projected · ${money(r.totalFundingShortfall)} unmet in month ${r.firstFundingShortfallMonth}`;
    return `<article class="action"><h3>${title}</h3><p>${subtitle}</p><dl>
      <dt>Current exposure</dt><dd>${pct(r.currentGateRatio)}</dd>
      <dt>With proposal</dt><dd>${pct(r.initialGateRatio)}</dd>
      <dt>Maximum modeled exposure</dt><dd>${pct(LiquidityModel.exposurePath(r).peakRatio)}${r.ending ? '' : ' (partial path)'}</dd>
      <dt>Existing calls scheduled</dt><dd>${money(r.annualExistingCalls)}</dd>
      <dt>New calls scheduled</dt><dd>${money(r.annualNewCalls)}</dd>
      <dt>Marketable assets drawn</dt><dd>${money(r.marketableSales)}</dd>
      <dt>End liquid assets</dt><dd>${endingLiquid}</dd>
      <dt>Unfunded after year 1</dt><dd>${r.ending ? money(r.ending.existingUnfunded + r.ending.newUnfunded) : 'Not projected'}</dd>
      <dt>Sale cost to NAV</dt><dd>${money(r.loss)}</dd></dl>
      <div class="flag ${status.tone}">${status.label}</div></article>`;
  }
  function render() {
    const s = read();
    const approved = LiquidityModel.calculate(s, 'approve');
    const deferred = LiquidityModel.calculate(s, 'defer');
    const sold = LiquidityModel.calculate(s, 'sell');
    const path = LiquidityModel.exposurePath(approved);
    const envelope = LiquidityModel.decisionEnvelope(s);
    const noDistributions = LiquidityModel.decisionEnvelope({ ...s, distributionMultiplier: 0 });
    const crossing = path.firstOverMonth === null ? 'None through month 12'
      : path.firstOverMonth === 0 ? 'At scenario start' : 'Month ' + path.firstOverMonth;
    $('envelopeMetrics').innerHTML = `<div><span>Maximum modeled exposure</span><strong>${pct(path.peakRatio)}</strong><small>${path.peakMonth === 0 ? 'At scenario start' : 'Month ' + path.peakMonth}${path.complete ? '' : ' · partial path only'}</small></div>
      <div><span>First exposure above threshold</span><strong>${crossing}</strong><small>${path.complete ? 'Month 0 through month 12 checked' : 'Projection stops at the unmet cash need'}</small></div>
      <div><span>New commitment capacity · full year</span><strong>${envelope.baselineFits ? money(envelope.maxCommitment) : 'No capacity'}</strong><small>Starting-snapshot capacity: ${money(envelope.startingCapacity)}</small></div>
      <div><span>Capacity with no distributions</span><strong>${noDistributions.baselineFits ? money(noDistributions.maxCommitment) : 'No capacity'}</strong><small>All other selected assumptions unchanged</small></div>`;
    $('envelopeNote').textContent = envelope.baselineFits
      ? 'Capacity is the largest new commitment that keeps exposure at or below the selected threshold at scenario start and every month-end, while funding all scheduled cash needs. This planning limit does not grant approval or model obligations beyond year 1. Later threshold crossings flag pacing pressure; they do not retroactively require approval.'
      : envelope.reason + ' A zero new commitment does not restore the portfolio to the planning threshold. An exception or revised assumptions require committee discussion.';
    const usableCapacity = Math.min(40, Math.max(0, Math.floor(envelope.maxCommitment + 1e-7)));
    $('useCapacity').disabled = !envelope.baselineFits || usableCapacity === 0;
    $('useCapacity').textContent = `Test a ${money(usableCapacity)} proposal (rounded down to whole millions)`;
    $('useCapacity').dataset.amount = usableCapacity;
    $('committeeQuestion').textContent = s.proposedCommitment > 0
      ? `Can we approve a new ${money(s.proposedCommitment)} private commitment after a market drawdown?`
      : 'How does the existing portfolio hold up after a market drawdown?';
    $('pathContext').textContent = approved.committed
      ? 'Twelve-month path · if proposed commitment is approved'
      : 'Twelve-month path · no new commitment';
    $('shockValue').textContent = '−' + $('shock').value + '%';
    $('callsValue').textContent = $('calls').value + '% · ' + money(approved.annualExistingCalls);
    $('distributionsValue').textContent = $('distributions').value + '% · ' + money(approved.annualDistributions);
    $('commitmentValue').textContent = money(s.proposedCommitment);
    $('callRateValue').textContent = $('callRate').value + '% · ' + money(approved.annualNewCalls);
    $('gateValue').textContent = $('gate').value + '%';
    $('saleValue').textContent = money(s.saleNav);
    $('discountValue').textContent = $('discount').value + '%';
    const status = gateStatus(approved);
    $('status').className = 'status ' + status.tone;
    $('status').textContent = status.label.toUpperCase();
    $('ratio').textContent = pct(approved.currentGateRatio);
    $('ratioDetail').textContent = `${money(approved.currentNumerator)} ÷ ${money(approved.initialTotal)}; gate ${pct(s.gate)}`;
    $('postRatio').textContent = s.proposedCommitment > 0 ? pct(approved.initialGateRatio) : 'No proposal';
    $('postRatioDetail').textContent = s.proposedCommitment > 0
      ? `${money(approved.initialNumerator)} ÷ ${money(approved.initialTotal)}`
      : 'Current exposure shown at left';
    $('breakpoint').textContent = s.proposedCommitment === 0 ? 'No proposal' :
      approved.breakpoint === null ? 'Not within range' :
      approved.breakpoint === 0 ? 'Already above gate' : '−' + pct(approved.breakpoint);
    $('cashMonth').textContent = approved.firstCashDrawMonth === null ? 'None in year 1' : 'Month ' + approved.firstCashDrawMonth;
    $('cashDetail').textContent = approved.firstFundingShortfallMonth !== null
      ? `${money(approved.totalFundingShortfall)} first unmet need in month ${approved.firstFundingShortfallMonth}`
      : approved.firstCashDrawMonth === null ? 'Cash covers projected net needs'
      : `${money(approved.marketableSales)} marketable assets drawn by month 12`;
    $('snapshotNote').textContent = s.proposedCommitment > 0
      ? `Current exposure is checked before the new commitment, following the FIU-style approval rule. Approval would add ${money(s.proposedCommitment)} to unfunded now; ${money(approved.annualNewCalls)} of new calls is scheduled in year 1. Deferral leaves ${money(deferred.annualExistingCalls)} of existing calls unchanged.`
      : `No new commitment is proposed, so no new approval is requested. Existing calls remain ${money(deferred.annualExistingCalls)} in year 1.`;
    $('actions').innerHTML = actionCard(approved.committed ? 'Approve' : 'No new commitment', 'Add new unfunded only if a positive proposal is approved.', approved) +
      actionCard('Defer', 'No new unfunded or new calls; existing calls continue.', deferred);
    $('saleAction').innerHTML = actionCard('Sale sensitivity', `Hypothetical sale of ${money(s.saleNav)} private NAV at ${pct(s.saleDiscount)} discount${approved.committed ? ', then new commitment' : '; no new commitment'}.`, sold, true);
    const max = Math.max(1, ...approved.months.map(m => m.cash + m.marketable));
    $('bars').innerHTML = approved.months.map(m => `<div class="barcol" title="Month ${m.month}: cash ${money(m.cash)}, marketable ${money(m.marketable)}"><div class="barstack" style="height:${Math.max(2,(m.cash+m.marketable)/max*140)}px"><div class="marketbar" style="flex:${m.marketable}"></div><div class="cashbar" style="flex:${m.cash}"></div></div><label>${m.month}</label></div>`).join('');
    $('flowNote').textContent = `Scheduled: existing calls ${money(approved.annualExistingCalls)} + new calls ${money(approved.annualNewCalls)} + spending ${money(approved.annualSpending)} − distributions ${money(approved.annualDistributions)}. ` +
      (approved.firstFundingShortfallMonth !== null
        ? `Month ${approved.firstFundingShortfallMonth} has ${money(approved.totalFundingShortfall)} of unmet cash need. No portfolio balances are projected for that month or later.`
        : 'Marketable assets cover any cash reserve draw in this 12-month case.');
    const choiceText = !approved.committed ? 'No new commitment is proposed.'
      : approved.approvalRequired ? `Consider an exception for ${money(s.proposedCommitment)}, or defer. Current exposure already exceeds the approval gate.`
      : !envelope.baselineFits ? `Discuss the existing exposure or funding constraint before adding ${money(s.proposedCommitment)}.`
      : s.proposedCommitment > envelope.maxCommitment + 1e-6
        ? `Consider reducing ${money(s.proposedCommitment)} to within the ${money(envelope.maxCommitment)} planning envelope, or defer.`
        : `Consider ${money(s.proposedCommitment)} within the selected planning envelope; validate the assumptions before authorization.`;
    const remaining = approved.ending
      ? `${money(approved.ending.existingUnfunded + approved.ending.newUnfunded)} remains unfunded after year 1, including ${money(approved.ending.newUnfunded)} from the new proposal. Deferral leaves ${deferred.ending ? money(deferred.ending.existingUnfunded) : 'an unprojected amount'} unfunded.`
      : 'Year-end obligations and balances are not projected because a scheduled cash need cannot be funded.';
    $('committeeBrief').innerHTML = `<p class="briefDecision"><b>Decision for discussion:</b> ${choiceText}</p>
      <p><b>Scenario:</b> public shock −${pct(s.shock)}; existing calls ${money(approved.annualExistingCalls)}; distributions ${money(approved.annualDistributions)}; spending ${money(approved.annualSpending)}; new first-year call rate ${pct(s.newCallRate)}; exposure threshold ${pct(s.gate)}. All amounts are fictional USD millions.</p>
      <p><b>Exposure:</b> current ${pct(approved.currentGateRatio)}; with proposal ${pct(approved.initialGateRatio)}; maximum modeled ${pct(path.peakRatio)}${path.complete ? '' : ' on the partial path'}. First threshold crossing: ${crossing}. This horizon warning is separate from the current-position approval rule.</p>
      <p><b>Approve versus defer:</b> existing calls stay ${money(deferred.annualExistingCalls)}. Approval adds ${money(approved.annualNewCalls)} of scheduled first-year calls. ${approved.ending && deferred.ending ? `Year-end liquid assets are ${money(approved.ending.cash + approved.ending.marketable)} versus ${money(deferred.ending.cash + deferred.ending.marketable)}, a ${money(approved.annualNewCalls)} reduction.` : `First unmet need under approval: ${approved.firstFundingShortfallMonth === null ? 'none' : money(approved.totalFundingShortfall) + ' in month ' + approved.firstFundingShortfallMonth}.`}</p>
      <p><b>Continuing obligation:</b> ${remaining} No later-year call schedule is modeled.</p>
      <p><b>What could change the decision:</b> with no distributions, full-year commitment capacity is ${noDistributions.baselineFits ? money(noDistributions.maxCommitment) : 'unavailable because the existing portfolio fails the planning envelope'}. Calls and spending occur evenly; all marketable assets are assumed saleable when needed at shocked value; private NAV has no markdown and later returns are zero. Actual timing, restrictions, and valuations must be validated.</p>
      <p class="small">Policy example: FIU Foundation IPS, Appendix A: https://give.fiu.edu/about/fiu-foundation/policies-procedures/foundation-ips-for-bod-approved-2.6.26_final.pdf. Fictional scenario and editable policy threshold.</p>`;
    $('ledger').innerHTML = `<ul><li>Fictional opening balances: $20M cash, $260M marketable assets, $120M private NAV, $90M existing unfunded.</li>
      <li>Annual base assumptions: $45M existing calls, $12M distributions, $15M spending. Controls scale calls and distributions. Cash flows are spread evenly over 12 months.</li>
      <li>Public shock is immediate. Private NAV has no immediate markdown; no later market returns, gifts, interest, fees, or tax effects are modeled.</li>
      <li>Approving adds the full new commitment to unfunded immediately. New calls equal commitment × first-year call rate. Calls transfer cash to private NAV and reduce unfunded dollar for dollar. Distributions transfer private NAV to cash. Spending leaves the portfolio.</li>
      <li>Negative cash draws on marketable assets at displayed value. If liquid assets cannot meet a month's scheduled needs, the model reports the first unmet amount and stops projecting portfolio balances; it cannot assign the shortfall between calls and spending.</li>
      <li>Secondary sale assumes no associated unfunded or forecast distributions. Proceeds = sale NAV × (1 − discount); the discount is a portfolio loss. Actual bids, restrictions, and timing are unknown.</li>
      <li>The editable approval gate is inspired by <a href="https://give.fiu.edu/about/fiu-foundation/policies-procedures/foundation-ips-for-bod-approved-2.6.26_final.pdf" target="_blank" rel="noopener">FIU Foundation’s IPS</a>; it is a fictional policy here. Approval status tests current private NAV plus existing unfunded divided by portfolio NAV before the proposed commitment. Pro forma exposure is displayed separately.</li></ul>`;
  }
  ids.forEach(id => $(id).addEventListener('input', render));
  $('reset').addEventListener('click', () => { ids.forEach(id => { $(id).value = defaults[id]; }); render(); });
  $('useCapacity').addEventListener('click', () => { $('commitment').value = $('useCapacity').dataset.amount; render(); });
  $('printBrief').addEventListener('click', () => window.print());
  render();
})();
