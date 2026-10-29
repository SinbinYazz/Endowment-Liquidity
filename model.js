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
    const commit = choice !== 'defer' && s.commitment;
    const sale = choice === 'sell' ? s.saleNav : 0;
    const proceeds = sale * (1 - s.saleDiscount);
    const loss = sale - proceeds;
    let cash = s.cash + proceeds;
    let marketable = s.marketable * (1 - s.shock);
    let privateNav = s.privateNav - sale;
    let existingUnfunded = s.existingUnfunded;
    let newUnfunded = commit ? s.proposedCommitment : 0;
    const initialTotal = cash + marketable + privateNav;
    const initialNumerator = privateNav + existingUnfunded + newUnfunded;
    const initialGateRatio = initialNumerator / initialTotal;
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
      if (cash < 0) {
        if (firstFundingShortfallMonth === null) firstFundingShortfallMonth = month;
        totalFundingShortfall += -cash;
        cash = 0;
      }
      const total = cash + marketable + privateNav;
      months.push({ month, cash, marketable, privateNav, existingUnfunded,
        newUnfunded, total, gateRatio: (privateNav + existingUnfunded + newUnfunded) / total });
    }
    return { action: choice, committed: commit, sale, proceeds, loss, initialTotal,
      initialNumerator, initialGateRatio, breakpoint, annualExistingCalls,
      annualNewCalls, annualDistributions, annualSpending: s.annualSpending,
      monthlyNetNeed: (annualExistingCalls + annualNewCalls + s.annualSpending - annualDistributions) / 12,
      firstCashDrawMonth, firstFundingShortfallMonth, totalFundingShortfall,
      marketableSales, months, ending: months[11], gate: s.gate };
  }

  return { BASE, calculate, validate };
});
