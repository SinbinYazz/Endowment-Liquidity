const assert = require('node:assert/strict');
const test = require('node:test');
const { calculate } = require('../model.js');
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('proposed commitment changes immediate gate and only new calls', () => {
  const approved = calculate({}, 'approve');
  const deferred = calculate({}, 'defer');
  close(approved.initialTotal, 335);
  close(approved.initialGateRatio, 230 / 335);
  close(deferred.initialGateRatio, 210 / 335);
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
  const r = calculate({ shock: 1, callMultiplier: 2, distributionMultiplier: 0,
    annualSpending: 200 }, 'approve');
  assert.ok(r.firstFundingShortfallMonth !== null);
  assert.ok(r.totalFundingShortfall > 0);
});

test('sale cost and gate effect are explicit', () => {
  const r = calculate({}, 'sell');
  close(r.proceeds, 31.5);
  close(r.loss, 3.5);
  close(r.initialTotal, 331.5);
  close(r.initialGateRatio, 195 / 331.5);
});

test('sale above private NAV is rejected', () => {
  assert.throws(() => calculate({ saleNav: 121 }, 'sell'), RangeError);
});

test('breakpoint handles an already triggered gate', () => {
  close(calculate({ shock: 0, proposedCommitment: 40 }, 'approve').breakpoint, 0);
});
