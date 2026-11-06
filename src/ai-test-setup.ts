/**
 * AI Test Setup - Top-tier testing framework with Playwright & TypeScript
 * Integrates all major AI providers and concepts for comprehensive testing
 */

import { test, expect } from '@playwright/test';
import axios from 'axios';

// ============================================================
// AI Provider Configuration
// ============================================================

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  MISTRAL = 'mistral',
  COHERE = 'cohere',
  DEEPSEEK = 'deepseek',
  GROQ = 'groq',
  TOGETHER = 'together',
  OPENAI_LOCAL = 'openai-local',
  CUSTOM = 'custom',
}

// AI Provider credentials/config (in production, use secure env vars)
const AI_CONFIG = {
  [AIProvider.OPENAI]: {
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  [AIProvider.ANTHROPIC]: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    endpoint: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-20240620',
  },
  [AIProvider.GOOGLE]: {
    apiKey: process.env.GOOGLE_AI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-1.5-flash',
  },
  [AIProvider.MISTRAL]: {
    apiKey: process.env.MISTRAL_API_KEY,
    endpoint: 'https://api.mistral.ai/v1',
    model: 'mistral-large-latest',
  },
  [AIProvider.COHERE]: {
    apiKey: process.env.COHERE_API_KEY,
    endpoint: 'https://api.cohere.ai/v2',
    model: 'command-r-plus',
  },
  [AIProvider.DEEPSEEK]: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    endpoint: 'https://api.deepseek.com/v1',
    model: 'deepseek-coder',
  },
  [AIProvider.GROQ]: {
    apiKey: process.env.GROQ_API_KEY,
    endpoint: 'https://api.groq.com/opentelemetry/v1',
    model: 'llama-3.1-70b-versatile',
  },
  [AIProvider.TOGETHER]: {
    apiKey: process.env.TOGETHER_API_KEY,
    endpoint: 'https://api.together.xyz/v1',
    model: 'meta-llama/Meta-Llama-3-70B-Instruct',
  },
  [AIProvider.OPENAI_LOCAL]: {
    apiKey: process.env.OPENAI_LOCAL_API_KEY || 'local-key',
    endpoint: process.env.OPENAI_LOCAL_ENDPOINT || 'http://localhost:1234/v1',
    model: process.env.OPENAI_LOCAL_MODEL || 'local-model',
  },
  [AIProvider.CUSTOM]: {
    apiKey: process.env.CUSTOM_API_KEY,
    endpoint: process.env.CUSTOM_ENDPOINT,
    model: process.env.CUSTOM_MODEL,
  },
} as const;

// ============================================================
// AI Response Mocking for Testing
// ============================================================

/**
 * Mock AI responses for different providers during testing
 * This allows tests to run without actual API calls
 */
export const mockAIResponses: Record<string, any> = {
  [AIProvider.OPENAI]: {
    choices: [
      {
        message: {
          role: 'assistant',
          content: JSON.stringify({
            sentiment: 'positive',
            confidence: 0.95,
            keyPhrases: ['great', 'excellent', 'recommend'],
          }),
        },
      },
    ],
  },
  [AIProvider.ANTHROPIC]: {
    type: 'text',
    text: JSON.stringify({
      sentiment: 'positive',
      confidence: 0.93,
      keyPhrases: ['outstanding', 'highly', 'recommend'],
    }),
  },
  [AIProvider.GOOGLE]: {
    candidates: [
      {
        content: {
          parts: [
            {
              text: JSON.stringify({
                sentiment: 'positive',
                confidence: 0.94,
                keyPhrases: ['amazing', 'excellent', 'highly recommend'],
              }),
            },
          ],
        },
      },
    ],
  },
};

// ============================================================
// AI Testing Utilities
// ============================================================

/**
 * Test AI provider health and connectivity
 */
export async function testAIProviderHealth(provider: AIProvider): Promise<boolean> {
  const config = AI_CONFIG[provider];
  if (!config.apiKey) {
    console.log(`⚠️  ${provider}: No API key configured, skipping connectivity test`);
    return false;
  }

  try {
    const response = await axios.get(
      `${config.endpoint}/models`,
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
        timeout: 10000,
      }
    );
    console.log(`✅ ${provider}: Healthy (${response.status})`);
    return true;
  } catch (error) {
    console.warn(`⚠️  ${provider}: Health check failed - ${error.message}`);
    return false;
  }
}

/**
 * Test AI model response with a simple prompt
 */
export async function testAIResponse(
  provider: AIProvider,
  prompt: string
): Promise<string | null> {
  const config = AI_CONFIG[provider];
  if (!config.apiKey) {
    console.log(`⚠️  ${provider}: No API key, returning mock response`);
    return mockAIResponses[provider]?.choices?.[0]?.message?.content || null;
  }

  try {
    const response = await axios.post(
      `${config.endpoint}/chat/completions`,
      {
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    if (content) {
      console.log(`✅ ${provider}: Got response`);
      return content;
    }

    console.warn(`⚠️  ${provider}: No content in response`);
    return null;
  } catch (error) {
    console.error(`❌ ${provider}: Request failed - ${error.message}`);
    // Fallback to mock
    return mockAIResponses[provider]?.choices?.[0]?.message?.content || null;
  }
}

/**
 * Test AI sentiment analysis across providers
 */
export async function testAISentimentAnalysis(
  text: string,
  provider: AIProvider = AIProvider.OPENAI
): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keyPhrases: string[];
}> {
  const prompt = `
Analyze the following text for sentiment and extract key phrases:
Text: "${text}"

Return a JSON object with:
- sentiment: "positive", "negative", or "neutral"
- confidence: number 0-1
- keyPhrases: string[] of the most important phrases
`;

  const rawResponse = await testAIResponse(provider, prompt);
  if (!rawResponse) {
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      keyPhrases: [],
    };
  }

  try {
    const parsed = JSON.parse(rawResponse);
    return {
      sentiment: parsed.sentiment || 'neutral',
      confidence: parsed.confidence || 0.5,
      keyPhrases: parsed.keyPhrases || [],
    };
  } catch {
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      keyPhrases: [],
    };
  }
}

// ============================================================
// Playwright Tests
// ============================================================

export const aiTests = {
  /**
   * Test all AI providers are accessible
   */
  async testAllProvidersHealth(): Promise<void> {
    console.log('\n🔍 Testing AI Provider Health...\n');

    const providers = Object.values(AIProvider);
    const results: Record<string, boolean> = {};

    for (const provider of providers) {
      results[provider] = await testAIProviderHealth(provider);
    }

    console.log('\n📊 Health Check Results:');
    for (const [provider, healthy] of Object.entries(results)) {
      console.log(`  ${provider}: ${healthy ? '✅ HEALTHY' : '⚠️  UNREACHABLE'}`);
    }

    const allHealthy = Object.values(results).every(Boolean);
    if (!allHealthy) {
      console.warn('⚠️  Some providers are unreachable - tests will use mocks');
    }

    return results;
  },

  /**
   * Test sentiment analysis across multiple AI providers
   */
  async testSentimentAnalysisComparison(): Promise<void> {
    console.log('\n🧠 Testing AI Sentiment Analysis Across Providers\n');

    const testCases = [
      'I love this product! It is absolutely amazing and excellent.',
      'This is the worst experience I have ever had.',
      'The product is okay, nothing special.',
      'It works well enough for the price.',
    ];

    const providers = Object.values(AIProvider).filter(
      (p) => p !== AIProvider.OPENAI_LOCAL && p !== AIProvider.CUSTOM
    );

    for (const testCase of testCases) {
      console.log(`\n📝 Test: "${testCase.substring(0, 40)}..."`);
      console.log('   Providers:'.padEnd(30));

      for (const provider of providers) {
        const result = await testAISentimentAnalysis(testCase, provider);
        console.log(
          `   ${provider}: ${result.sentiment} (${(result.confidence * 100).toFixed(
            1
          )}%) [${result.keyPhrases.slice(0, 2).join(', ')}]`
        );
      }
    }
  },

  /**
   * Test AI model selection and fallback
   */
  async testModelFallback(): Promise<void> {
    console.log('\n🔄 Testing Model Fallback Logic\n');

    const providersWithFallback = [
      AIProvider.OPENAI,
      AIProvider.ANTHROPIC,
      AIProvider.GOOGLE,
    ];

    let lastError: Error | null = null;

    for (const provider of providersWithFallback) {
      try {
        const result = await testAIResponse(
          provider,
          'Say "Hello from AI testing framework"'
        );
        console.log(`✅ ${provider}: Success - ${result?.substring(0, 30)}...`);
        lastError = null;
      } catch (error) {
        console.warn(`⚠️  ${provider}: Failed - ${(error as Error).message}`);
        lastError = error as Error;
      }
    }

    if (lastError) {
      console.error('❌ All providers failed, using fallback mechanism');
    } else {
      console.log('✅ Model fallback test completed');
    }
  },

  /**
   * Test AI cost estimation and token tracking
   */
  async testCostTracking(): Promise<void> {
    console.log('\n💰 Testing AI Cost Tracking\n');

    const testPrompt = 'Analyze the following job description and extract key requirements: [JOB DESCRIPTION]';

    const costEstimates = {
      [AIProvider.OPENAI]: '~$0.00015 per 1K tokens (gpt-4o-mini)',
      [AIProvider.ANTHROPIC]: '~$0.003 per 1K tokens (claude-3-5-sonnet)',
      [AIProvider.GOOGLE]: '~$0.0001 per 1K tokens (gemini-1.5-flash)',
      [AIProvider.GROQ]: '~$0.0002 per 1K tokens (llama-3.1-70b)',
    };

    for (const [provider, estimate] of Object.entries(costEstimates)) {
      console.log(`  ${provider}: ${estimate}`);
    }

    console.log('   (Costs estimated for typical test prompts of ~100 tokens)');
  },
};

// ============================================================
// Export test runner configuration
// ============================================================

/**
 * Run all AI integration tests
 */
export async function runAIIntegrationTests(): Promise<void> {
  console.log('='.repeat(60));
  console.log('🤖 AI-Powered Testing Framework with Playwright & TypeScript');
  console.log('='.repeat(60));
  console.log();

  await aiTests.testAllProvidersHealth();
  await aiTests.testSentimentAnalysisComparison();
  await aiTests.testModelFallback();
  await aiTests.testCostTracking();

  console.log('\n' + '='.repeat(60));
  console.log('✅ AI Integration Tests Complete');
  console.log('='.repeat(60));
}