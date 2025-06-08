// test-deployment.js - Test script for verifying deployment configuration
import { analyzeWithAIClient, isClientSideAnalysisEnabled } from './src/lib/clientAiAnalysis.js';

// Mock browser environment for testing
global.window = {
  location: {
    origin: 'http://localhost:3000'
  }
};

// Test contract
const testContract = `
pragma solidity ^0.8.0;

contract SimpleToken {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
`;

async function runTests() {
  console.log('🧪 DeFi Watchdog Deployment Test Suite\n');
  
  // Test 1: Check configuration
  console.log('1️⃣ Checking configuration...');
  console.log(`   ✓ Client-side AI enabled: ${isClientSideAnalysisEnabled()}`);
  console.log(`   ✓ API Key configured: ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? 'Yes' : 'No'}`);
  console.log(`   ✓ Environment: ${process.env.NODE_ENV || 'development'}\n`);
  
  if (!isClientSideAnalysisEnabled()) {
    console.error('❌ Client-side AI is not enabled. Please set NEXT_PUBLIC_OPENROUTER_API_KEY');
    process.exit(1);
  }
  
  // Test 2: Test basic analysis
  console.log('2️⃣ Testing basic AI analysis...');
  try {
    const result = await analyzeWithAIClient(testContract, 'SimpleToken', {
      type: 'basic',
      timeout: 30000
    });
    
    if (result.success) {
      console.log('   ✅ Basic analysis successful');
      console.log(`   ✓ Security Score: ${result.analysis?.securityScore || 'N/A'}`);
      console.log(`   ✓ Risk Level: ${result.analysis?.riskLevel || 'N/A'}`);
      console.log(`   ✓ Parse Method: ${result.parseMethod || 'N/A'}\n`);
    } else {
      console.error(`   ❌ Basic analysis failed: ${result.error}\n`);
    }
  } catch (error) {
    console.error(`   ❌ Basic analysis error: ${error.message}\n`);
  }
  
  // Test 3: Test response parsing
  console.log('3️⃣ Testing response parsing...');
  const testResponses = [
    '{"securityScore": 85, "riskLevel": "Low Risk"}',
    '```json\n{"securityScore": 75, "riskLevel": "Medium Risk"}\n```',
    'Here is the analysis: {"securityScore": 65, "riskLevel": "High Risk"}'
  ];
  
  for (const response of testResponses) {
    try {
      // Direct test of parsing logic
      const cleanResponse = response.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      const toparse = jsonMatch ? jsonMatch[0] : cleanResponse;
      const parsed = JSON.parse(toparse);
      console.log(`   ✅ Parsed: Score=${parsed.securityScore}, Risk=${parsed.riskLevel}`);
    } catch (error) {
      console.error(`   ❌ Parse failed: ${error.message}`);
    }
  }
  
  console.log('\n✨ Deployment test complete!\n');
  
  // Provide deployment checklist
  console.log('📋 Deployment Checklist:');
  console.log('   □ Set NEXT_PUBLIC_OPENROUTER_API_KEY in Vercel dashboard');
  console.log('   □ Set NEXT_PUBLIC_USE_CLIENT_AI=true in Vercel');
  console.log('   □ Verify jsconfig.json exists with path aliases');
  console.log('   □ Verify vercel.json configuration');
  console.log('   □ Run "npm run build" locally to test');
  console.log('   □ Deploy with "vercel --prod"');
}

// Run tests
runTests().catch(console.error);
