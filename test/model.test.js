const assert = require('node:assert/strict');
const test = require('node:test');
const { calculate, decisionEnvelope, exposurePath } = require('../model.js');
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('proposed commitment changes immediate gate and only new calls', () => {
  const approved = calculate({}, 'approve');
  const deferred = calculate({}, 'defer');
  close(approved.initialTotal, 335);
  close(approved.currentGateRatio, 210 / 335);
  close(approved.initialGateRatio, 230 / 335);
  close(deferred.initialGateRatio, 210 / 335);
  assert.equal(approved.approvalRequired, true);
  assert.equal(deferred.approvalRequired, false);
  close(approved.annualExistingCalls, 45);
  close(deferred.annualExistingCalls, 45);
  close(approved.annualNewCalls, 4);
  close(deferred.annualNewCalls, 0);
  close(approved.ending.existingUnfunded, 45);
  close(deferred.ending.existingUnfunded, 45);
  close(approved.ending.newUnfunded, 16);
});

test('calls transfer value and do not alone change NAV plus unfunded', () => {
  const r = calculate({ annualSpending: 0, annualDistributions: 0 }, 'approve');
  close(r.ending.total, r.initialTotal);
  close(r.ending.privateNav + r.ending.existingUnfunded + r.ending.newUnfunded,
    r.initialNumerator);
});

test('zero net outflow never requires marketable sales', () => {
  const r = calculate({ callMultiplier: 0, distributionMultiplier: 0, annualSpending: 0 }, 'defer');
  assert.equal(r.firstCashDrawMonth, null);
  close(r.marketableSales, 0);
});

test('exhausting all liquid assets exposes funding shortfall', () => {
  const r = calculate({ shock: 0.6, callMultiplier: 2,
    distributionMultiplier: 0, newCallRate: 1 }, 'approve');
  assert.equal(r.firstFundingShortfallMonth, 12);
  close(r.totalFundingShortfall, 6);
  close(r.marketableSales, 104);
  assert.equal(r.ending, null);
  assert.equal(r.months[11].privateNav, null);
  assert.equal(r.months[11].existingUnfunded, null);
  assert.equal(r.months[11].total, null);
});

test('zero proposal requests no approval and schedules no new calls', () => {
  const r = calculate({ proposedCommitment: 0 }, 'approve');
  assert.equal(r.committed, false);
  assert.equal(r.approvalRequired, false);
  close(r.currentGateRatio, r.initialGateRatio);
  close(r.annualNewCalls, 0);
});

test('crossing pro forma gate is distinct from current-position approval rule', () => {
  const r = calculate({ shock: 0.1 }, 'approve');
  assert.equal(r.approvalRequired, false);
  assert.equal(r.proFormaExceedsGate, true);
});

test('sale cost and gate effect are explicit', () => {
  const r = calculate({}, 'sell');
  close(r.proceeds, 31.5);
  close(r.loss, 3.5);
  close(r.initialTotal, 331.5);
  close(r.initialGateRatio, 180 / 331.5);
  close(r.transferredUnfunded, 15);
  close(r.annualExistingCalls, 37.5);
  close(r.callRelief, 7.5);
  close(r.annualDistributions, 4.25);
  close(r.lostDistributions, 1.75);
});

test('sale above private NAV is rejected', () => {
  assert.throws(() => calculate({ saleNav: 121 }, 'sell'), RangeError);
});

test('breakpoint handles an already triggered gate', () => {
  close(calculate({ shock: 0, proposedCommitment: 40 }, 'approve').breakpoint, 0);
});

test('full-year envelope captures spending and distribution effects', () => {
  const e = decisionEnvelope({ shock: 0.1, annualSpending: 15 });
  close(e.startingCapacity, 14.4);
  assert.ok(Math.abs(e.maxCommitment - 11.4) < 1e-6);
  const noDistributions = decisionEnvelope({ shock: 0.1, annualSpending: 15, distributionMultiplier: 0 });
  assert.ok(Math.abs(noDistributions.maxCommitment - 5.4) < 1e-6);
  const p = exposurePath(calculate({ shock: 0.1, proposedCommitment: 14, annualSpending: 15 }, 'approve'));
  assert.equal(p.firstOverMonth, 2);
  close(p.peakRatio, 218 / 359);
});

test('zero capacity does not imply existing portfolio fits', () => {
  const e = decisionEnvelope({});
  assert.equal(e.baselineFits, false);
  close(e.maxCommitment, 0);
});

test('envelope respects the cash-funding boundary', () => {
  const input = { shock: 0, cash: 0, marketable: 10, privateNav: 0,
    existingUnfunded: 0, annualExistingCalls: 0, annualSpending: 9,
    annualDistributions: 0, newCallRate: 1, gate: 1, saleNav: 0, saleUnfunded: 0, liquidityFloor: 0 };
  const e = decisionEnvelope(input);
  assert.equal(e.baselineFits, true);
  assert.ok(Math.abs(e.maxCommitment - 1) < 1e-6);
  assert.equal(calculate({ ...input, proposedCommitment: e.maxCommitment + 0.01 }, 'approve').ending, null);
});

test('additional downside uses the selected shocked sleeve', () => {
  const r = calculate({ shock: 0.1, proposedCommitment: 11 }, 'approve');
  close(r.breakpoint, (374 - 221 / 0.6) / 234);
  assert.equal(r.thresholdState, 'below');
  const afterFurtherLoss = calculate({ shock: 1 - 0.9 * (1 - r.breakpoint), proposedCommitment: 11 }, 'approve');
  close(afterFurtherLoss.initialGateRatio, 0.6);
  assert.equal(calculate({ shock: 0.2, proposedCommitment: 11 }, 'approve').thresholdState, 'above');
  assert.equal(calculate({ shock: 0.1, proposedCommitment: 14.4 }, 'approve').thresholdState, 'at');
});

test('no remaining public assets gives no further-decline threshold when below gate', () => {
  const r = calculate({ shock: 1, gate: 1, privateNav: 20, existingUnfunded: 0,
    saleNav: 0, saleUnfunded: 0, proposedCommitment: 0, annualDistributions: 0 }, 'approve');
  assert.equal(r.thresholdState, 'below');
  assert.equal(r.breakpoint, null);
});

test('call levers change coverage and can breach a floor before cash exhaustion', () => {
  const base = calculate({}, 'approve');
  close(base.liquidityCoverage, 215 / 63);
  assert.equal(base.coveragePass, true);
  const accelerated = calculate({ callMultiplier: 1.5 }, 'approve');
  close(accelerated.liquidityCoverage, 215 / 85.5);
  assert.equal(accelerated.coveragePass, false);
  assert.ok(accelerated.ending);
  const called = calculate({ newCallRate: 1 }, 'approve');
  close(called.liquidityCoverage, 215 / 79);
  assert.equal(called.coveragePass, false);
});

test('liquidity floor binds capacity and spending reduction restores headroom', () => {
  const input = { shock: 0, gate: 1, liquidityFloor: 4 };
  const e = decisionEnvelope(input);
  assert.ok(Math.abs(e.maxCommitment - 55) < 1e-6);
  const reducedSpending = decisionEnvelope({ ...input, annualSpending: 15 });
  assert.ok(Math.abs(reducedSpending.maxCommitment - 80) < 1e-6);
  const failingBaseline = decisionEnvelope({ ...input, liquidityFloor: 5 });
  assert.equal(failingBaseline.baselineFits, false);
  assert.match(failingBaseline.reason, /coverage/);
});

test('zero and negative net needs do not produce infinite or negative coverage', () => {
  const zero = calculate({ callMultiplier: 0, distributionMultiplier: 0, annualSpending: 0 }, 'defer');
  assert.equal(zero.liquidityCoverage, null);
  assert.equal(zero.coveragePass, true);
  const inflow = calculate({ callMultiplier: 0, annualSpending: 0 }, 'defer');
  assert.equal(inflow.liquidityCoverage, null);
  assert.equal(inflow.noDistributionCoverage, null);
});

test('transferred unfunded adds no proceeds and does not affect unsold actions', () => {
  const sold = calculate({ saleUnfunded: 15 }, 'sell');
  const navOnly = calculate({ saleUnfunded: 0 }, 'sell');
  close(sold.proceeds, navOnly.proceeds);
  close(sold.initialTotal, navOnly.initialTotal);
  close(calculate({ saleUnfunded: 15 }, 'approve').annualExistingCalls, 45);
  assert.throws(() => calculate({ saleUnfunded: 91 }, 'sell'), RangeError);
});

test('selling all private NAV and unfunded removes associated cash flows', () => {
  const r = calculate({ saleNav: 120, saleUnfunded: 90 }, 'sell');
  close(r.annualExistingCalls, 0);
  close(r.annualDistributions, 0);
  close(r.ending.existingUnfunded, 0);
  close(r.ending.total, r.initialTotal - r.annualSpending);
});

test('updated default spending produces the revised full-year envelope', () => {
  assert.ok(Math.abs(decisionEnvelope({ shock: 0.1 }).maxCommitment - 8.4) < 1e-6);
  assert.ok(Math.abs(decisionEnvelope({ shock: 0.1, distributionMultiplier: 0 }).maxCommitment - 2.4) < 1e-6);
});
