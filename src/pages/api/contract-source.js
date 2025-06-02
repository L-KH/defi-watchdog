// pages/api/contract-source.js
import { getContractSource } from '../../lib/etherscan';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, network = 'mainnet' } = req.body;
    
    // Validate inputs
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid contract address' });
    }
    
    // Check if required API keys are available
    const requiredKeys = {
      'linea': process.env.LINEASCAN_API_KEY || process.env.ETHERSCAN_API_KEY,
      'sonic': process.env.SONICSCAN_API_KEY,
      'mainnet': process.env.ETHERSCAN_API_KEY
    };
    
    const apiKey = requiredKeys[network.toLowerCase()];
    if (!apiKey) {
      // For testing/demo purposes, provide a sample contract
      console.warn(`No API key found for ${network} network, returning sample contract`);
      return res.status(200).json({
        success: true,
        address,
        network,
        sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private _value;
    mapping(address => uint256) private _balances;
    
    function store(uint256 value) public {
        _value = value;
    }
    
    function retrieve() public view returns (uint256) {
        return _value;
    }
    
    function deposit() public payable {
        _balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint256 amount = _balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        _balances[msg.sender] = 0;
    }
    
    function getBalance(address account) public view returns (uint256) {
        return _balances[account];
    }
}`,
        contractName: 'SimpleStorage (Demo)',
        compiler: '0.8.19+commit.7dd6d404',
        isDemo: true,
        message: 'This is a demo contract. Add blockchain explorer API keys to .env.local for real contract analysis.'
      });
    }
    
    // Fetch contract source code
    const contractData = await getContractSource(address, network);
    
    if (!contractData.sourceCode || contractData.sourceCode === '') {
      return res.status(404).json({ 
        error: 'Contract source code not available',
        details: 'The contract may not be verified on the blockchain explorer',
        suggestions: [
          'Verify the contract address is correct',
          `Check if the contract is verified on ${network === 'linea' ? 'LineaScan' : network === 'sonic' ? 'SonicScan' : 'Etherscan'}`,
          'Try a different network if uncertain'
        ]
      });
    }
    
    return res.status(200).json({
      success: true,
      address,
      network,
      sourceCode: contractData.sourceCode,
      contractName: contractData.contractName,
      compiler: contractData.compiler
    });
  } catch (error) {
    console.error('Error fetching contract source:', error);
    
    // Provide specific error messages for common issues
    if (error.message.includes('API key')) {
      return res.status(404).json({ 
        error: 'API key configuration issue',
        details: error.message 
      });
    }
    
    if (error.message.includes('not found') || error.message.includes('404')) {
      return res.status(404).json({ 
        error: 'Contract not found or not verified',
        details: 'The contract may not exist or may not be verified on the blockchain explorer'
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to fetch contract source',
      details: error.message 
    });
  }
}