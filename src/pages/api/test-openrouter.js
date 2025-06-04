// Simple OpenRouter API test for Next.js app
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const OPENROUTER_API_KEY = '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'; // <-- REPLACE THIS WITH YOUR NEW API KEY
  
  console.log('🔍 Testing OpenRouter API...');
  console.log('🔑 API Key length:', OPENROUTER_API_KEY?.length);
  console.log('🔑 API Key prefix:', OPENROUTER_API_KEY?.substring(0, 15) + '...');
  
  if (!OPENROUTER_API_KEY || !OPENROUTER_API_KEY.startsWith('sk-or-v1-')) {
    return res.status(400).json({ 
      error: 'Invalid API key format',
      details: 'API key must start with sk-or-v1-'
    });
  }

  try {
    // Test with a very simple request first
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': req.headers.origin || 'http://localhost:3000',
        'X-Title': 'DeFi Watchdog API Test'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: 'Reply with just: {"test": "success"}'
          }
        ],
        max_tokens: 50,
        temperature: 0
      })
    });

    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { message: errorText };
      }
      
      return res.status(response.status).json({
        error: 'OpenRouter API failed',
        status: response.status,
        statusText: response.statusText,
        details: errorDetails,
        apiKeyValidFormat: OPENROUTER_API_KEY.startsWith('sk-or-v1-'),
        apiKeyLength: OPENROUTER_API_KEY.length
      });
    }

    const data = await response.json();
    console.log('✅ API Test successful!');
    
    return res.status(200).json({
      success: true,
      message: 'OpenRouter API is working',
      modelUsed: 'google/gemini-2.0-flash-exp:free',
      response: data.choices?.[0]?.message?.content || 'No response content',
      usage: data.usage
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return res.status(500).json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
}
