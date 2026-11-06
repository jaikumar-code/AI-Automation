# Tests Directory Documentation

## Overview
This directory contains all test files for the AI Testing Framework.

## Test Files

### `ai-integration-tests.ts`
**Purpose**: Comprehensive AI provider integration tests using Playwright and Jest.

**Test Suites**:
- `AI Provider Web Interface Tests`: Navigates to and validates AI provider web UIs
- `AI Provider API Tests`: Tests API connectivity and response generation
- `AI Sentiment Analysis Tests`: Compares sentiment results across providers
- `AI Model Comparison Tests`: Compares response quality across models
- `run all AI integration tests`: Runs the complete test suite

**Dependencies**:
- `import { aiTests, AIProvider, runAIIntegrationTests } from '../src/ai-test-setup'`
- Uses mock responses when API keys are unavailable

### `simple-test.test.ts`
**Purpose**: Basic Playwright test to verify the testing framework is working.

**Test**:
- `'Playwright is working'`: Simple assertion that Playwright is properly configured

**Format**: CommonJS (uses `require('@playwright/test')`)

## Running Tests

```bash
# Run all tests in this directory
npx jest tests/ --config jest.config.mjs

# Run specific test file
npx jest tests/ai-integration-tests.ts --config jest.config.mjs

# Run simple test only
npx jest tests/simple-test.test.ts --config jest.config.mjs
```

## Adding New Tests

1. Create a new `.test.ts` or `.spec.ts` file in this directory
2. Import utilities from `../src/ai-test-setup` as needed
3. Follow the existing patterns for test descriptions and structure
4. Run with `npx jest` to verify