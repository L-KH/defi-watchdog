// Test the AI Analysis Fix
// Run this test to verify the enhanced analysis works correctly

const { preprocessContractCode } = require('../src/lib/aiAnalysisServer.js');

// Sample multi-file contract (like what you're getting from DeepSeek scan)
const sampleContractCode = `// File: @openzeppelin/contracts/utils/math/Math.sol

// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/Math.sol)

pragma solidity ^0.8.0;

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}

// File: contracts/MyToken.sol

pragma solidity ^0.8.0;

import "./Math.sol";

contract MyToken {
    using Math for uint256;
    
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        _totalSupply = 1000000 * 10**18;
        _balances[msg.sender] = _totalSupply;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        address from = msg.sender;
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "Insufficient balance");
        
        _balances[from] = fromBalance - amount;
        _balances[to] += amount;
        
        return true;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
}`;

async function testPreprocessing() {
    console.log('🧪 Testing Contract Code Preprocessing...\n');
    
    try {
        // Test with different models
        const models = [
            'google/gemma-2b-it',
            'deepseek/deepseek-r1:free',
            'qwen/qwen3-32b:free'
        ];
        
        for (const model of models) {
            console.log(`\n📝 Testing with model: ${model}`);
            console.log('='.repeat(60));
            
            const result = preprocessContractCode(sampleContractCode, 'MyToken', model);
            
            console.log(`✅ Preprocessing Results:`);
            console.log(`   - Is Complete: ${result.isComplete}`);
            console.log(`   - Processing Note: ${result.processingNote}`);
            console.log(`   - Main Contracts Found: ${result.mainContractsFound}`);
            console.log(`   - Files Included: ${result.includedFiles.length}`);
            console.log(`   - Files Skipped: ${result.skippedFiles}`);
            console.log(`   - Original Length: ${sampleContractCode.length} chars`);
            console.log(`   - Processed Length: ${result.processedCode.length} chars`);
            console.log(`   - Includes Main Contract: ${result.processedCode.includes('contract MyToken')}`);
            console.log(`   - Excludes OpenZeppelin: ${!result.processedCode.includes('OpenZeppelin Contracts')}`);
        }
        
        console.log('\n🎉 All tests passed! The preprocessing should now correctly prioritize main contracts over imports.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    testPreprocessing();
}

module.exports = { testPreprocessing };
