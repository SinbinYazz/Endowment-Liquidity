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
  function actionCard(title, subtitle, r) {
    const gateOk = r.initialGateRatio <= r.gate;
    return `<article class="action"><h3>${title}</h3><p>${subtitle}</p><dl>
      <dt>Start exposure</dt><dd>${pct(r.initialGateRatio)}</dd>
      <dt>Existing calls, year 1</dt><dd>${money(r.annualExistingCalls)}</dd>
      <dt>New calls, year 1</dt><dd>${money(r.annualNewCalls)}</dd>
      <dt>Marketable sales to fund needs</dt><dd>${money(r.marketableSales)}</dd>
      <dt>End liquid assets</dt><dd>${money(r.ending.cash+r.ending.marketable)}</dd>
      <dt>Sale cost to NAV</dt><dd>${money(r.loss)}</dd></dl>
      <div class="flag ${gateOk?'ok':'warn'}">${gateOk?'Within illustrative gate':'Approval required under illustrative gate'}</div></article>`;
  }
  function render() {
    const s = read();
    const approved = LiquidityModel.calculate(s, 'approve');
    const deferred = LiquidityModel.calculate(s, 'defer');
    const sold = LiquidityModel.calculate(s, 'sell');
    $('shockValue').textContent = '−' + $('shock').value + '%';
    $('callsValue').textContent = $('calls').value + '% · ' + money(approved.annualExistingCalls);
    $('distributionsValue').textContent = $('distributions').value + '% · ' + money(approved.annualDistributions);
    $('commitmentValue').textContent = money(s.proposedCommitment);
    $('callRateValue').textContent = $('callRate').value + '% · ' + money(approved.annualNewCalls);
    $('gateValue').textContent = $('gate').value + '%';
    $('saleValue').textContent = money(s.saleNav);
    $('discountValue').textContent = $('discount').value + '%';
    const gateOk = approved.initialGateRatio <= s.gate;
    $('status').className = 'status ' + (gateOk ? 'ok' : 'warn');
    $('status').textContent = gateOk ? 'WITHIN GATE' : 'APPROVAL REQUIRED';
    $('ratio').textContent = pct(approved.initialGateRatio);
    $('ratioDetail').textContent = `${money(approved.initialNumerator)} ÷ ${money(approved.initialTotal)}; gate ${pct(s.gate)}`;
    $('breakpoint').textContent = approved.breakpoint === null ? 'Not within range' :
      approved.breakpoint === 0 ? 'Already above gate' : '−' + pct(approved.breakpoint);
    $('cashMonth').textContent = approved.firstCashDrawMonth === null ? 'None in year 1' : 'Month ' + approved.firstCashDrawMonth;
    $('cashDetail').textContent = approved.firstCashDrawMonth === null ? 'Cash covers projected net needs' :
      `${money(approved.marketableSales)} marketable assets sold by month 12`;
    $('snapshotNote').textContent = `${money(s.proposedCommitment)} proposed commitment adds the full amount to unfunded exposure now. ` +
      `${money(approved.annualNewCalls)} is assumed called over year 1 only if approved. ` +
      `Deferral leaves ${money(deferred.annualExistingCalls)} of existing calls unchanged.`;
    $('actions').innerHTML = actionCard('Approve', 'Add new unfunded now; fund its assumed first-year calls.', approved) +
      actionCard('Defer', 'No new unfunded or new calls; existing calls continue.', deferred) +
      actionCard('Sell, then approve', `Sell ${money(s.saleNav)} seasoned private NAV at ${pct(s.saleDiscount)} discount.`, sold);
    const max = Math.max(1, ...approved.months.map(m => m.cash + m.marketable));
    $('bars').innerHTML = approved.months.map(m => `<div class="barcol" title="Month ${m.month}: cash ${money(m.cash)}, marketable ${money(m.marketable)}"><div class="barstack" style="height:${Math.max(2,(m.cash+m.marketable)/max*140)}px"><div class="marketbar" style="flex:${m.marketable}"></div><div class="cashbar" style="flex:${m.cash}"></div></div><label>${m.month}</label></div>`).join('');
    $('flowNote').textContent = `Existing calls ${money(approved.annualExistingCalls)} + new calls ${money(approved.annualNewCalls)} + spending ${money(approved.annualSpending)} − distributions ${money(approved.annualDistributions)}. ` +
      (approved.firstFundingShortfallMonth ? `Even after marketable sales, a funding shortfall starts in month ${approved.firstFundingShortfallMonth}; the path after that month is an unmet-needs illustration, not an executable portfolio projection.` : 'Marketable assets cover any cash reserve draw in this 12-month case.');
    $('narrative').innerHTML = `<p>A ${pct(s.shock)} public-asset decline reduces marketable assets from $260.0M to ${money(260*(1-s.shock))}. ` +
      `With the proposed commitment, private NAV plus unfunded is ${money(approved.initialNumerator)}, or ${pct(approved.initialGateRatio)} of stressed portfolio NAV. ` +
      `${gateOk ? 'The illustrative new-commitment gate is not triggered.' : 'The illustrative policy would require approval before adding the new commitment.'}</p>` +
      `<p>Deferring leaves the ${money(deferred.annualExistingCalls)} existing-call schedule intact and changes start exposure to ${pct(deferred.initialGateRatio)}. ` +
      `The sale option raises ${money(sold.proceeds)} in cash and realizes ${money(sold.loss)} below NAV; start exposure becomes ${pct(sold.initialGateRatio)}. ` +
      `These comparisons show modeled trade-offs, not a recommended action.</p>`;
    $('ledger').innerHTML = `<ul><li>Fictional opening balances: $20M cash, $260M marketable assets, $120M private NAV, $90M existing unfunded.</li>
      <li>Annual base assumptions: $45M existing calls, $12M distributions, $15M spending. Controls scale calls and distributions. Cash flows are spread evenly over 12 months.</li>
      <li>Public shock is immediate. Private NAV has no immediate markdown; no later market returns, gifts, interest, fees, or tax effects are modeled.</li>
      <li>Approving adds the full new commitment to unfunded immediately. New calls equal commitment × first-year call rate. Calls transfer cash to private NAV and reduce unfunded dollar for dollar. Distributions transfer private NAV to cash. Spending leaves the portfolio.</li>
      <li>Negative cash triggers a sale of marketable assets at displayed value. If those assets run out, the model reports an unmet funding amount. “Cash reserve draw” is not a spending shortfall.</li>
      <li>Secondary sale assumes no associated unfunded or forecast distributions. Proceeds = sale NAV × (1 − discount); the discount is a portfolio loss. Actual bids, restrictions, and timing are unknown.</li>
      <li>The editable approval gate is inspired by <a href="https://give.fiu.edu/about/fiu-foundation/policies-procedures/foundation-ips-for-bod-approved-2.6.26_final.pdf" target="_blank" rel="noopener">FIU Foundation’s IPS</a>; it is a fictional policy here. Its test is private NAV plus unfunded divided by portfolio NAV, before first-year flows.</li></ul>`;
  }
  ids.forEach(id => $(id).addEventListener('input', render));
  $('reset').addEventListener('click', () => { ids.forEach(id => { $(id).value = defaults[id]; }); render(); });
  render();
})();
