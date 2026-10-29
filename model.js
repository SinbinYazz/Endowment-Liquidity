/* Pure scenario calculations. All money values are USD millions. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  root.LiquidityModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const BASE = Object.freeze({ cash: 20, marketable: 260, privateNav: 120,
    existingUnfunded: 90, annualExistingCalls: 45, annualDistributions: 12,
    annualSpending: 15, proposedCommitment: 20, newCallRate: 0.20,
    gate: 0.60 });

  function finite(value, name, min, max) {
    if (!Number.isFinite(value) || value < min || value > max)
      throw new RangeError(name + ' must be between ' + min + ' and ' + max);
    return value;
  }

  function validate(input) {
    const s = { ...BASE, shock: 0.25, callMultiplier: 1, distributionMultiplier: 0.5,
      commitment: true, saleNav: 35, saleDiscount: 0.10, ...input };
    finite(s.shock, 'Public shock', 0, 1);
    finite(s.callMultiplier, 'Existing call multiplier', 0, 2);
    finite(s.distributionMultiplier, 'Distribution multiplier', 0, 2);
    finite(s.saleNav, 'Sale NAV', 0, s.privateNav);
    finite(s.saleDiscount, 'Sale discount', 0, 1);
    finite(s.proposedCommitment, 'Proposed commitment', 0, 1000);
    finite(s.newCallRate, 'New commitment call rate', 0, 1);
    finite(s.gate, 'Approval gate', 0.01, 1);
    finite(s.annualSpending, 'Annual spending', 0, 1000);
    return s;
  }

  function breakPoint(s, numerator, total) {
    const shock = (total - numerator / s.gate) / s.marketable;
    if (shock <= 0) return 0;
    if (shock > 1) return null;
    return shock;
  }

  function calculate(input, action) {
    const s = validate(input);
    const choice = action || 'approve';
    if (!['approve', 'defer', 'sell'].includes(choice)) throw new RangeError('Unknown action');
    const commit = choice !== 'defer' && s.commitment && s.proposedCommitment > 0;
    const sale = choice === 'sell' ? s.saleNav : 0;
    const proceeds = sale * (1 - s.saleDiscount);
    const loss = sale - proceeds;
    let cash = s.cash + proceeds;
    let marketable = s.marketable * (1 - s.shock);
    let privateNav = s.privateNav - sale;
    let existingUnfunded = s.existingUnfunded;
    let newUnfunded = commit ? s.proposedCommitment : 0;
    const initialTotal = cash + marketable + privateNav;
    const currentNumerator = privateNav + existingUnfunded;
    const currentGateRatio = currentNumerator / initialTotal;
    const initialNumerator = currentNumerator + newUnfunded;
    const initialGateRatio = initialNumerator / initialTotal;
    const approvalRequired = commit && s.proposedCommitment > 0 && currentGateRatio > s.gate;
    const proFormaExceedsGate = commit && s.proposedCommitment > 0 && initialGateRatio > s.gate;
    const breakpoint = breakPoint(s, initialNumerator,
      s.cash + s.marketable + s.privateNav - loss);
    const annualExistingCalls = Math.min(s.existingUnfunded, s.annualExistingCalls * s.callMultiplier);
    const annualNewCalls = commit ? s.proposedCommitment * s.newCallRate : 0;
    const annualDistributions = s.annualDistributions * s.distributionMultiplier;
    const monthlySpend = s.annualSpending / 12;
    const months = [];
    let firstCashDrawMonth = null;
    let firstFundingShortfallMonth = null;
    let totalFundingShortfall = 0;
    let marketableSales = 0;
    for (let month = 1; month <= 12; month++) {
      const existingCall = Math.min(existingUnfunded, annualExistingCalls / 12);
      const newCall = Math.min(newUnfunded, annualNewCalls / 12);
      const distribution = Math.min(privateNav + existingCall + newCall, annualDistributions / 12);
      const netNeed = existingCall + newCall + monthlySpend - distribution;
      const available = cash + marketable;
      if (netNeed > available + 1e-8) {
        if (firstCashDrawMonth === null) firstCashDrawMonth = month;
        firstFundingShortfallMonth = month;
        totalFundingShortfall = netNeed - available;
        marketableSales += marketable;
        // The scheduled obligations cannot all be paid. No portfolio state is
        // reported for this month because allocating the unpaid amount between
        // calls and spending would require an additional decision assumption.
        months.push({ month, cash: 0, marketable: 0, privateNav: null,
          existingUnfunded: null, newUnfunded: null, total: null,
          gateRatio: null, shortfall: totalFundingShortfall });
        break;
      }
      existingUnfunded -= existingCall;
      newUnfunded -= newCall;
      privateNav += existingCall + newCall - distribution;
      cash += distribution - existingCall - newCall - monthlySpend;
      if (cash < 0) {
        if (firstCashDrawMonth === null) firstCashDrawMonth = month;
        const saleFromMarketable = Math.min(marketable, -cash);
        marketable -= saleFromMarketable;
        marketableSales += saleFromMarketable;
        cash += saleFromMarketable;
      }
      if (Math.abs(cash) < 1e-8) cash = 0;
      const total = cash + marketable + privateNav;
      months.push({ month, cash, marketable, privateNav, existingUnfunded,
        newUnfunded, total, gateRatio: (privateNav + existingUnfunded + newUnfunded) / total });
    }
    return { action: choice, committed: commit, sale, proceeds, loss, initialTotal,
      currentNumerator, currentGateRatio, initialNumerator, initialGateRatio,
      approvalRequired, proFormaExceedsGate, breakpoint, annualExistingCalls,
      annualNewCalls, annualDistributions, annualSpending: s.annualSpending,
      monthlyNetNeed: (annualExistingCalls + annualNewCalls + s.annualSpending - annualDistributions) / 12,
      firstCashDrawMonth, firstFundingShortfallMonth, totalFundingShortfall,
      marketableSales, months, ending: firstFundingShortfallMonth === null ? months[11] : null,
      gate: s.gate };
  }

  function exposurePath(result) {
    const points = [{ month: 0, ratio: result.initialGateRatio },
      ...result.months.filter(m => m.gateRatio !== null).map(m => ({ month: m.month, ratio: m.gateRatio }))];
    const peak = points.reduce((a, b) => b.ratio > a.ratio ? b : a);
    const firstOver = points.find(p => p.ratio > result.gate + 1e-10);
    return { peakRatio: peak.ratio, peakMonth: peak.month,
      firstOverMonth: firstOver ? firstOver.month : null, complete: result.ending !== null };
  }

  // Largest new commitment satisfying both the exposure threshold at every
  // modeled point (including month 0) and the scheduled cash needs. This is a
  // conditional planning envelope, separate from the current-position rule.
  function decisionEnvelope(input) {
    const s = validate(input);
    const baseline = calculate(s, 'defer');
    const baselinePath = exposurePath(baseline);
    const startingCapacity = Math.max(0, s.gate * baseline.initialTotal - baseline.currentNumerator);
    const baselineFits = baselinePath.complete && baselinePath.firstOverMonth === null;
    if (!baselineFits) return { startingCapacity, maxCommitment: 0, baselineFits: false,
      reason: baseline.ending === null ? 'Existing cash needs cannot be fully funded.'
        : 'Existing exposure exceeds the threshold within the horizon.' };
    let low = 0;
    let high = startingCapacity;
    for (let i = 0; i < 45; i++) {
      const candidate = (low + high) / 2;
      const r = calculate({ ...s, proposedCommitment: candidate, commitment: true }, 'approve');
      const p = exposurePath(r);
      if (p.complete && p.firstOverMonth === null) low = candidate;
      else high = candidate;
    }
    return { startingCapacity, maxCommitment: low, baselineFits: true,
      reason: 'Conditional on all displayed assumptions and the 12-month horizon.' };
  }

  return { BASE, calculate, validate, exposurePath, decisionEnvelope };
});
