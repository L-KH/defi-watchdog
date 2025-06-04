// Test OpenRouter API Key - Debug Script
const OPENROUTER_API_KEY = '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';

async function testOpenRouterAPI() {
  console.log('🔍 Testing OpenRouter API Key...');
  console.log('Key details:', {
    hasKey: !!OPENROUTER_API_KEY,
    keyLength: OPENROUTER_API_KEY.length,
    keyPrefix: OPENROUTER_API_KEY.substring(0, 15) + '...',
    keyFormat: OPENROUTER_API_KEY.startsWith('sk-or-v1-')
  });

  try {
    // Test with a simple free model first
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'DeFi Watchdog Test'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'user',
            content: 'Hello, can you respond with a simple "Hello World" message?'
          }
        ],
        max_tokens: 50
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ API Success:', data);
    return true;
  } catch (error) {
    console.error('💥 Request failed:', error);
    return false;
  }
}

// Export for use in browser console if needed
if (typeof window !== 'undefined') {
  window.testOpenRouterAPI = testOpenRouterAPI;
}

export default testOpenRouterAPI;
