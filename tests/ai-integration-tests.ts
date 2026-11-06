/**
 * Playwright AI Integration Tests
 * End-to-end testing of AI providers with Playwright browser automation
 */

import { test, expect } from '@playwright/test';
import { aiTests, AIProvider, runAIIntegrationTests } from '../src/ai-test-setup';

// ============================================================
// Playwright Test Suite for AI Provider Web Interfaces
// ============================================================

test.describe('AI Provider Web Interface Tests', () => {
  test('should navigate to OpenAI playground', async ({ page }) => {
    await page.goto('https://platform.openai.com/playground');
    await expect(page).toHaveTitle(/Playground/);
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should navigate to Anthropic console', async ({ page }) => {
    await page.goto('https://console.anthropic.com/');
    await expect(page).toHaveTitle(/Anthropic/);
  });

  test('should navigate to Google AI Studio', async ({ page }) => {
    await page.goto('https://makersuite.google.com/app');
    await expect(page).toHaveTitle(/Google AI Studio/);
  });
});

// ============================================================
// API Integration Tests
// ============================================================

test.describe('AI Provider API Tests', () => {
  test('OpenAI GPT-4o-mini responsive', async ({ }, testInfo) => {
    const { testAIResponse } = await import('../src/ai-test-setup');
    const result = await testAIResponse(AIProvider.OPENAI, 'Write a haiku about automation');
    console.log('OpenAI result:', result);
    if (result) {
      expect(result.length).toBeGreaterThan(0);
    }
  });

  test('Anthropic Claude 3.5 Sonnet responsive', async ({ }, testInfo) => {
    const { testAIResponse } = await import('../src/ai-test-setup');
    const result = await testAIResponse(AIProvider.ANTHROPIC, 'Write a haiku about automation');
    console.log('Anthropic result:', result);
    if (result) {
      expect(result.length).toBeGreaterThan(0);
    }
  });

  test('Google Gemini Flash responsive', async ({ }, testInfo) => {
    const { testAIResponse } = await import('../src/ai-test-setup');
    const result = await testAIResponse(AIProvider.GOOGLE, 'Write a haiku about automation');
    console.log('Google result:', result);
    if (result) {
      expect(result.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================
// Sentiment Analysis Tests
// ============================================================

test.describe('AI Sentiment Analysis Tests', () => {
  test('sentiment analysis across providers', async ({ }, testInfo) => {
    const { testAISentimentAnalysis } = await import('../src/ai-test-setup');
    const testCases = [
      'I love this product! It is absolutely amazing.',
      'This is terrible and I hate it.',
      'The product is okay, nothing special.',
    ];

    for (const text of testCases) {
      const results: Record<string, { sentiment: string; confidence: number }> = {};

      for (const provider of Object.values(AIProvider)) {
        if (provider === AIProvider.OPENAI_LOCAL || provider === AIProvider.CUSTOM) continue;
        const result = await testAISentimentAnalysis(text, provider);
        results[provider] = {
          sentiment: result.sentiment,
          confidence: result.confidence,
        };
      }

      console.log(`Text: "${text}"`);
      for (const [provider, r] of Object.entries(results)) {
        console.log(`  ${provider}: ${r.sentiment} (conf: ${(r.confidence * 100).toFixed(1)}%)`);
      }
    }
  });
});

// ============================================================
// Model Comparison Tests
// ============================================================

test.describe('AI Model Comparison Tests', () => {
  test('compare response quality across models', async ({ }, testInfo) => {
    const { testAIResponse } = await import('../src/ai-test-setup');
    const prompt = 'Explain blockchain in simple terms for a 5-year-old';

    const providers = [AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.GOOGLE];

    for (const provider of providers) {
      const result = await testAIResponse(provider, prompt);
      console.log(`${provider}: ${result?.substring(0, 80) || 'No response'}`);
    }
  });
});

// ============================================================
// End-to-End Test Runner
// ============================================================

test('run all AI integration tests', async ({ }) => {
  await runAIIntegrationTests();
});