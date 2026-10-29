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
    if (r.approvalRequired) return { label: 'Current exposure requires approval', tone: 'warn' };
    if (r.proFormaExceedsGate) return { label: 'Proposal crosses gate; review', tone: 'warn' };
    return { label: 'Current and pro forma within gate', tone: 'ok' };
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
      <dt>Existing calls scheduled</dt><dd>${money(r.annualExistingCalls)}</dd>
      <dt>New calls scheduled</dt><dd>${money(r.annualNewCalls)}</dd>
      <dt>Marketable assets drawn</dt><dd>${money(r.marketableSales)}</dd>
      <dt>End liquid assets</dt><dd>${endingLiquid}</dd>
      <dt>Sale cost to NAV</dt><dd>${money(r.loss)}</dd></dl>
      <div class="flag ${status.tone}">${status.label}</div></article>`;
  }
  function render() {
    const s = read();
    const approved = LiquidityModel.calculate(s, 'approve');
    const deferred = LiquidityModel.calculate(s, 'defer');
    const sold = LiquidityModel.calculate(s, 'sell');
    $('committeeQuestion').textContent = s.proposedCommitment > 0
      ? `Can we approve a new ${money(s.proposedCommitment)} private commitment after a market drawdown?`
      : 'How does the existing portfolio hold up after a market drawdown?';
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
    $('actions').innerHTML = actionCard('Approve', 'Add new unfunded now; fund its assumed first-year calls.', approved) +
      actionCard('Defer', 'No new unfunded or new calls; existing calls continue.', deferred) +
      actionCard('Sale sensitivity', `Hypothetical sale of ${money(s.saleNav)} private NAV at ${pct(s.saleDiscount)} discount, then approval.`, sold, true);
    const max = Math.max(1, ...approved.months.map(m => m.cash + m.marketable));
    $('bars').innerHTML = approved.months.map(m => `<div class="barcol" title="Month ${m.month}: cash ${money(m.cash)}, marketable ${money(m.marketable)}"><div class="barstack" style="height:${Math.max(2,(m.cash+m.marketable)/max*140)}px"><div class="marketbar" style="flex:${m.marketable}"></div><div class="cashbar" style="flex:${m.cash}"></div></div><label>${m.month}</label></div>`).join('');
    $('flowNote').textContent = `Scheduled: existing calls ${money(approved.annualExistingCalls)} + new calls ${money(approved.annualNewCalls)} + spending ${money(approved.annualSpending)} − distributions ${money(approved.annualDistributions)}. ` +
      (approved.firstFundingShortfallMonth !== null
        ? `Month ${approved.firstFundingShortfallMonth} has ${money(approved.totalFundingShortfall)} of unmet cash need. No portfolio balances are projected for that month or later.`
        : 'Marketable assets cover any cash reserve draw in this 12-month case.');
    const policyText = !approved.committed ? 'No new approval is requested.'
      : approved.approvalRequired ? 'Current exposure exceeds the illustrative gate, so the new commitment requires approval.'
      : approved.proFormaExceedsGate ? 'Current exposure is below the gate, but the proposal would cross it; the committee should review this pro forma result.'
      : 'Current and pro forma exposure are within the illustrative gate.';
    $('narrative').innerHTML = `<p>A ${pct(s.shock)} public-asset decline reduces marketable assets from $260.0M to ${money(260*(1-s.shock))}. ` +
      `Current private NAV plus unfunded is ${money(approved.currentNumerator)}, or ${pct(approved.currentGateRatio)} of stressed portfolio NAV. ` +
      (approved.committed ? `The proposed commitment would raise that exposure to ${pct(approved.initialGateRatio)}. ` : '') +
      `${policyText}</p>` +
      `<p>Deferring leaves the ${money(deferred.annualExistingCalls)} existing-call schedule intact. ` +
      `The hypothetical sale would raise ${money(sold.proceeds)} and realize ${money(sold.loss)} below NAV, subject to the displayed execution assumptions. ` +
      `It does not establish that a sale is available or advisable.</p>`;
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
  render();
})();
