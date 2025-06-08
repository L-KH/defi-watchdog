// API Key Test Script for DeFi Watchdog
// Run with: node test-api-key.js

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

async function testApiKey() {
    console.log("🔑 Testing OpenRouter API Key...");
    
    if (!API_KEY) {
        console.error("❌ No API key found in environment variables");
        console.error("💡 Check your .env.local file for NEXT_PUBLIC_OPENROUTER_API_KEY");
        return false;
    }
    
    if (!API_KEY.startsWith('sk-')) {
        console.error("❌ Invalid API key format. Should start with 'sk-'");
        return false;
    }
    
    console.log(`📋 API Key: ${API_KEY.substring(0, 20)}...${API_KEY.substring(API_KEY.length - 5)}`);
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const models = await response.json();
            console.log(`✅ API Key is valid! Found ${models.data?.length || 0} models available.`);
            
            // Test specific models used in DeFi Watchdog
            const testModels = [
                'openai/gpt-4o-mini',
                'google/gemini-2.0-flash-exp:free',
                'deepseek/deepseek-chat-v3-0324:free',
                'deepseek/deepseek-r1-0528:free'
            ];
            
            console.log("\n🧪 Testing specific models used by DeFi Watchdog:");
            
            for (const modelId of testModels) {
                const found = models.data?.find(model => model.id === modelId);
                if (found) {
                    console.log(`✅ ${modelId} - Available`);
                } else {
                    console.log(`❌ ${modelId} - Not found`);
                }
            }
            
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ API Key test failed: ${response.status} - ${errorText}`);
            
            if (response.status === 401) {
                console.error("🔑 Authentication failed. Your API key may be invalid or expired.");
                console.error("💡 Get a new API key at: https://openrouter.ai/keys");
            } else if (response.status === 429) {
                console.error("⏰ Rate limit exceeded. Try again in a few minutes.");
            } else if (response.status === 402) {
                console.error("💳 Payment required. Check your OpenRouter account balance.");
            }
            
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Network error testing API key: ${error.message}`);
        return false;
    }
}

async function testSimpleCompletion() {
    console.log("\n🔬 Testing a simple completion with GPT-4o-mini...");
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'DeFi Watchdog Test'
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: 'Return JSON: {"test": "success", "message": "API working"}'
                    }
                ],
                max_tokens: 100,
                temperature: 0.1
            })
        });
        
        console.log(`📡 Completion Response: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Simple completion test successful!");
            console.log(`📝 Response: ${data.choices[0].message.content}`);
            return true;
        } else {
            const errorText = await response.text();
            console.error(`❌ Completion test failed: ${response.status} - ${errorText}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error during completion test: ${error.message}`);
        return false;
    }
}

async function runFullTest() {
    console.log("🚀 Starting OpenRouter API Test for DeFi Watchdog\n");
    
    const modelTest = await testApiKey();
    
    if (modelTest) {
        const completionTest = await testSimpleCompletion();
        
        if (completionTest) {
            console.log("\n🎉 All tests passed! Your API key is working correctly.");
            console.log("💡 If DeFi Watchdog is still failing, the issue may be rate limiting or model-specific problems.");
        } else {
            console.log("\n⚠️ API key is valid but completions are failing.");
        }
    } else {
        console.log("\n❌ API key test failed. Please check your key and try again.");
        console.log("🔗 Get a new API key at: https://openrouter.ai/keys");
    }
}

// Run the test
runFullTest().catch(console.error);
