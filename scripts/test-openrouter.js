#!/usr/bin/env node

/**
 * OpenRouter API Test Script
 * This script tests the OpenRouter API key and connectivity
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env.local' });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

async function testOpenRouterAPI() {
  console.log('🔍 Testing OpenRouter API...');
  console.log('🔑 API Key:', OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 20)}...` : 'NOT FOUND');
  
  if (!OPENROUTER_API_KEY || !OPENROUTER_API_KEY.startsWith('sk-or-v1-')) {
    console.error('❌ Invalid API key format');
    return;
  }
  
  // Test 1: Simple completion
  try {
    console.log('\n🚀 Test 1: Simple completion...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'DeFi Watchdog Test'
      },
      body: JSON.stringify({
        model: 'microsoft/phi-3-mini-128k-instruct:free',
        messages: [
          {
            role: 'user',
            content: 'Hello! Please respond with a simple JSON object: {"status": "working", "message": "API is functional"}'
          }
        ],
        max_tokens: 100,
        temperature: 0.1
      })
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Response received:', data);
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('💬 AI Response:', data.choices[0].message.content);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  // Test 2: List available models
  try {
    console.log('\n🚀 Test 2: Checking available models...');
    
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Models API Error:', errorText);
      return;
    }
    
    const modelsData = await response.json();
    const freeModels = modelsData.data?.filter(model => 
      model.id.includes(':free') || 
      model.pricing?.prompt === "0" || 
      model.pricing?.prompt === 0
    ) || [];
    
    console.log('📋 Available free models:', freeModels.length);
    freeModels.slice(0, 5).forEach(model => {
      console.log(`  - ${model.id} (${model.name})`);
    });
    
  } catch (error) {
    console.error('❌ Models test failed:', error.message);
  }
  
  console.log('\n✅ OpenRouter API test completed!');
}

// Run the test
testOpenRouterAPI().catch(console.error);
