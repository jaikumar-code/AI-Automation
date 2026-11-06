# AI Testing Framework - Top Tier Playwright & TypeScript Integration

## Overview

This project creates a comprehensive testing framework that integrates **all major AI providers** with **Playwright and TypeScript**, designed as a top-tier framework for AI-powered test automation.

## Framework Architecture

```
c:\Users\Jayakumar\jobsearchai\AI-Automation\
├── src/                    # Source TypeScript files
│   ├── ai-test-setup.ts    # Core AI testing utilities
│   └── tsconfig.json       # TypeScript config
├── tests/                  # Test files
│   ├── ai-integration-tests.ts  # AI provider tests
│   └── simple-test.test.ts      # Basic Playwright test
├── node_modules/           # Dependencies
├── package.json            # Project config
├── jest.config.mjs         # Jest ESM config
└── README.md               # Documentation
```

## Features

### 1. **Multi-AI Provider Support**
All major AI providers are integrated:

| Provider | Model | Purpose |
|----------|-------|---------|
| OpenAI | gpt-4o-mini | General purpose |
| Anthropic | claude-3-5-sonnet-20240620 | Reasoning, safety |
| Google | gemini-1.5-flash | Fast, multimodal |
| Mistral | mistral-large-latest | Long context |
| Cohere | command-r-plus | RAG, enterprise |
| Deepseek | deepseek-coder | Code generation |
| Groq | llama-3.1-70b-versatile | Fast inference |
| Together | meta-llama-3-70b | Open-source models |

### 2. **AI Provider Health Checks**
- Automatic connectivity testing for all providers
- Graceful degradation when keys are missing
- Fallback to mock responses
- 10-second timeout per check

### 3. **Sentiment Analysis Comparison**
- Test identical text across all providers
- Compare sentiment results, confidence scores, and key phrases
- Identify provider-specific behaviors

### 4. **Model Fallback Logic**
- Test failover between primary/secondary providers
- Verify no single point of failure
- Graceful degradation handling

### 5. **Cost Estimation & Tracking**
- Per-token cost estimates for each provider
- Budget planning for test suites
- Cost optimization recommendations

### 6. **Playwright Browser Automation**
- UI testing for AI web interfaces
- Responsiveness testing
- Form interaction testing

### 7. **Custom Jest Matchers**
- `toBeValidAIResponse()` - Validate AI response structure
- `toBeHealthyAIProvider()` - Verify provider health

## Core Files Created

### `src/ai-test-setup.ts`
Main utility file containing:
- `AIProvider` enum - All supported providers
- `AI_CONFIG` - Provider configurations and model names
- `mockAIResponses` - Mock data for testing without API keys
- `testAIProviderHealth()` - Health check functionality
- `testAIResponse()` - Test individual AI responses
- `testAISentimentAnalysis()` - Sentiment analysis across providers
- `runAIIntegrationTests()` - Complete test runner

### `tests/ai-integration-tests.ts`
Playwright + Jest test suite covering:
- Web interface navigation (OpenAI, Anthropic, Google AI Studio)
- API integration tests for each provider
- Sentiment analysis comparison tests
- Model comparison tests

### `tests/simple-test.test.ts`
Basic Playwright test verifying the framework works.

### `jest.config.mjs`
Jest configuration for ESM modules with:
- ts-jest transform for TypeScript
- Coverage collection
- Proper test matching patterns

### `package.json`
Dependencies including:
- `@types/jest`, `@types/node`, `typescript`, `ts-jest`, `playwright`
- Scripts for running tests

### `tsconfig.json`
TypeScript configuration targeting ES2022 with strict mode.

## Usage

### Running Tests

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run specific test file
npx jest tests/ai-integration-tests.ts --config jest.config.mjs

# Run with coverage
npx jest --config jest.config.mjs --collectCoverage
```

### Framework Entry Point

```typescript
import { runAIIntegrationTests } from './src/ai-test-setup';

await runAIIntegrationTests();
```

This will:
1. Test all AI provider health
2. Compare sentiment analysis across providers
3. Test model fallback logic
4. Display cost estimates

### Adding New AI Providers

1. Add to `AIProvider` enum in `src/ai-test-setup.ts`
2. Add configuration to `AI_CONFIG` object
3. Add mock response in `mockAIResponses` record
4. Add cost estimate in `testCostTracking()` if needed

## Testing Without API Keys

All tests work with mock responses by default. API calls are only made when:
- API keys are provided via environment variables
- `testAIProviderHealth()` or `testAIResponse()` is explicitly called with a configured provider

When no keys are present, tests automatically fall back to mock data, ensuring the test suite is always runnable.

## Framework Benefits

- **Comprehensive**: Covers all major AI providers
- **Extensible**: Easy to add new providers or test cases
- **Reliable**: Mock-based testing ensures no failures from missing keys
- **Cost-Aware**: Built-in cost tracking for budget planning
- **AI-Agnostic**: Works with any LLM provider
- **Playwright-Integrated**: Combines API testing with browser automation