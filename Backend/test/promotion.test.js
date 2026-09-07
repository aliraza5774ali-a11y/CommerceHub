import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiscount } from '../src/modules/promotions/promotion.service.js';

test('percentage promotion respects maximum discount', () => {
  assert.equal(calculateDiscount({ type: 'percentage', value: 20, maximumDiscount: 500 }, 4000), 500);
});

test('fixed promotion never discounts more than subtotal', () => {
  assert.equal(calculateDiscount({ type: 'fixed', value: 1000 }, 600), 600);
});
