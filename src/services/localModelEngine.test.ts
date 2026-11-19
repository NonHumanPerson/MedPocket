import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveModelDownloadPlan } from './localModelEngine';

describe('resolveModelDownloadPlan', () => {
  it('returns a real downloadable file bundle for a model tier', () => {
    const plan = resolveModelDownloadPlan('tier1_2b');

    assert.ok(plan.files.length > 0);
    assert.ok(plan.files.every((file) => file.url.startsWith('/models/')));
    assert.ok(plan.totalBytes > 0);
  });
});
