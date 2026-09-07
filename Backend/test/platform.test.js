import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsService } from '../src/modules/analytics/analytics.service.js';
import { reportService } from '../src/modules/reports/report.service.js';

test('analytics date range supports period filters', () => {
  const result = analyticsService.range({ period: '30d' });
  assert.ok(result.from < result.to);
  assert.equal(Math.round((result.to - result.from) / 86400000), 30);
});

test('reports export rows as CSV safely', () => {
  assert.equal(reportService.csv([{ name: 'A, B', amount: 10 }]), 'name,amount\n"A, B","10"');
});
