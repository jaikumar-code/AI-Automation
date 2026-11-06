# AI Testing Framework with Playwright & TypeScript

A top-tier testing framework that integrates all major AI providers and concepts for comprehensive testing of AI-powered features.

## Overview

This framework provides:

- **Multi-AI Provider Support**: Test across OpenAI, Anthropic, Google, Mistral, Cohere, Deepseek, Groq, and Together AI
- **Sentiment Analysis Testing**: Compare sentiment results across different AI models
- **Model Fallback Testing**: Test failover and fallback mechanisms between providers
- **Cost Tracking**: Estimate and track AI usage costs
- **Playwright Integration**: Browser automation tests alongside API tests
- **Mock Responses**: Run tests without actual API keys using mock data

## Architecture

```
src/
  ai-test-setup.ts    # Core AI testing utilities and configurations
  setup-tests.ts      # Jest setup and custom matchers
tests/
  ai-integration-tests.ts  # Playwright and Jest test suite
package.json          # Dependencies and scripts
jest.config.ts        # Test configuration
tsconfig.json         # TypeScript configuration
```

## Supported AI Providers

| Provider | Model | Use Case |
|----------|-------|----------|
| OpenAI | gpt-4o-mini | General purpose, chat, analysis |
| Anthropic | claude-3-5-sonnet-20240620 | Reasoning, safety, analysis |
| Google | gemini-1.5-flash | Fast, multimodal, cheap |
| Mistral | mistral-large-latest | Long context, reasoning |
| Cohere | command-r-plus | RAG, enterprise |
| Deepseek | deepseek-coder | Code generation |
| Groq | llama-3.1-70b-versatile | Fast inference |
| Together | meta-llama/Meta-Llama-3-70B-Instruct | Open-source models |

## Getting Started

### Prerequisites

- Node.js 18+
- Playwright browsers installed
- API keys for actual AI calls (optional - tests work with mocks)

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Setup TypeScript
npx tsc --init  # Already configured
```

### Configuration

Create a `.env` file (optional, for actual API calls):

```env
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
GOOGLE_AI_API_KEY=your-google-key
MISTRAL_API_KEY=your-mistral-key
COHERE_API_KEY=your-cohere-key
DEEPSEEK_API_KEY=your-deepseek-key
GROQ_API_KEY=your-groq-key
TOGETHER_API_KEY=your-together-key
```

### Running Tests

```bash
# Run all AI integration tests
npm test

# Run specific test file
npx jest tests/ai-integration-tests.ts

# Run with UI mode
npx jest --ui
```

## Framework Features

### 1. AI Provider Health Checks
- Verifies connectivity to each AI provider
- Graceful degradation when providers are unavailable
- Falls back to mock responses automatically

### 2. Sentiment Analysis Comparison
- Test the same text across multiple AI providers
- Compare sentiment results, confidence scores, and key phrases
- Identify provider-specific behavior differences

### 3. Model Fallback Logic
- Test failover between primary and secondary providers
- Ensure no single point of failure
- Verify graceful degradation

### 4. Cost Estimation
- Per-token cost tracking for each provider
- Budget planning for test suites
- Cost optimization recommendations

### 5. Browser Automation
- Playwright tests for AI web interfaces
- UI responsiveness testing
- Form interaction testing

## Test Suites

### `ai-tests` - AI Provider Health & Performance
- `testAllProvidersHealth()`: Check all provider connectivity
- `testSentimentAnalysisComparison()`: Compare sentiment across providers
- `testModelFallback()`: Test model fallback mechanisms
- `testCostTracking()`: Estimate and display costs

### Playwright Tests
- AI provider web interface navigation
- API endpoint responsiveness
- Sentiment analysis UI testing

### Custom Jest Matchers
- `toBeValidAIResponse()`: Validate AI response structure
- `toBeHealthyAIProvider()`: Verify provider health status

## Extensibility

### Adding New AI Providers

1. Add the provider to `AIProvider` enum in `src/ai-test-setup.ts`
2. Add configuration to `AI_CONFIG` object
3. Add mock response in `mockAIResponses` record
4. Add cost estimate in `testCostTracking()` if needed

### Custom AI Tests

Create new test files in `tests/` directory following the existing patterns. Use the exported utilities from `src/ai-test-setup.ts`.

## Performance Considerations

- Tests use mock responses by default for speed
- Actual API calls are gated by API key presence
- Health checks have 10-second timeouts
- Sentiment analysis batches requests per text

## License

MIT License - feel free to use and extend for your projects.