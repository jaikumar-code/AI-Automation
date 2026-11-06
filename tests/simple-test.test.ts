/**
 * Simple Playwright Test - CommonJS
 * Verifies the testing framework is set up correctly
 */
const { test, expect } = require('@playwright/test');

test('Playwright is working', async () => {
  expect(true).toBe(true);
});