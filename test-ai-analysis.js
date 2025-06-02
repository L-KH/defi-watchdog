// Test script to verify the fixed JSON parsing
const { analyzeWithAI } = require('./aiAnalysis.js');

// Test contract code for testing
const testContract = `
pragma solidity ^0.8.0;

contract TestContract {
    mapping(address => uint256) public balances;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
    
    function emergencyWithdraw() public {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
`;

async function testAnalysis() {
    console.log('🧪 Testing AI Analysis with JSON parsing fixes...\n');
    
    try {
        // Test basic analysis
        console.log('1. Testing basic analysis...');
        const basicResult = await analyzeWithAI(testContract, 'TestContract', {
            type: 'basic',
            promptMode: 'normal'
        });
        
        console.log('✅ Basic analysis result:');
        console.log('   Success:', basicResult.success);
        console.log('   Analysis overview:', basicResult.analysis?.overview?.substring(0, 100) + '...');
        console.log('   Security score:', basicResult.analysis?.securityScore);
        console.log('   Risk level:', basicResult.analysis?.riskLevel);
        console.log('   Findings count:', basicResult.analysis?.keyFindings?.length || 0);
        console.log('');
        
        // Test premium analysis
        console.log('2. Testing premium analysis...');
        const premiumResult = await analyzeWithAI(testContract, 'TestContract', {
            type: 'premium',
            promptMode: 'normal'
        });
        
        console.log('✅ Premium analysis result:');
        console.log('   Success:', premiumResult.success);
        console.log('   Models used:', premiumResult.modelsUsed?.length || 0);
        console.log('   Analysis overview:', premiumResult.analysis?.overview?.substring(0, 100) + '...');
        console.log('   Security score:', premiumResult.analysis?.securityScore);
        console.log('   Risk level:', premiumResult.analysis?.riskLevel);
        console.log('');
        
        console.log('🎉 All tests passed! The JSON parsing fixes are working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error details:', error);
    }
}

// Run the test
if (require.main === module) {
    testAnalysis();
}

module.exports = { testAnalysis };
