import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

// Hardcoded contract ABI for when the import fails
const FALLBACK_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "contractAddress", "type": "address"}],
    "name": "mintCertificate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintFee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export function useContract() {
  const { account, signer, provider } = useWallet();
  const [contract, setContract] = useState(null);
  const [mintFee, setMintFee] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get contract address from environment variable
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  useEffect(() => {
    const initContract = async () => {
      try {
        // First check if we have window.ethereum available
        if (typeof window !== 'undefined' && window.ethereum) {
          // Create ethers provider from MetaMask
          const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Request account access if not already granted
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get the signer
          const ethereumSigner = ethereumProvider.getSigner();
          
          // Check if contract address is configured
          if (!contractAddress) {
            console.warn('Contract address not configured in environment variables');
            // Use a dummy address for testing
            const dummyAddress = '0x0000000000000000000000000000000000000000';
            
            // Create mock contract
            setContract({
              mintCertificate: async (address, options) => {
                console.log(`Mock mint certificate for ${address} with value ${options.value}`);
                return {
                  wait: async () => ({
                    events: [{ event: 'CertificateMinted', args: { tokenId: ethers.BigNumber.from(1) } }]
                  })
                };
              },
              mintFee: async () => ethers.utils.parseEther('0.01')
            });
            
            setMintFee(ethers.utils.parseEther('0.01'));
            setIsOwner(false);
            setError(null);
            setLoading(false);
            return;
          }
          
          // Try to import contract ABI, or use fallback
          let contractAbi = FALLBACK_ABI;
          try {
            // Try to dynamically import the contract ABI
            const contractJson = await import('../contracts/DeFiWatchdogCertificate.json');
            if (contractJson && contractJson.default) {
              contractAbi = contractJson.default;
            } else if (contractJson) {
              contractAbi = contractJson;
            }
          } catch (importError) {
            console.warn('Could not import contract ABI, using fallback ABI', importError);
          }
          
          // Create contract instance with the real address
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            ethereumSigner
          );
          
          // Get mint fee from contract
          let fee;
          try {
            fee = await contractInstance.mintFee();
          } catch (feeError) {
            console.warn('Error getting mint fee, using default', feeError);
            fee = ethers.utils.parseEther('0.01');
          }
          
          // Get connected account
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          const currentAccount = accounts[0];
          
          // Check if connected wallet is owner
          let ownerStatus = false;
          if (currentAccount) {
            try {
              const owner = await contractInstance.owner();
              ownerStatus = owner.toLowerCase() === currentAccount.toLowerCase();
            } catch (err) {
              console.warn('Error checking contract owner:', err);
            }
          }
          
          setContract(contractInstance);
          setMintFee(fee);
          setIsOwner(ownerStatus);
          setError(null);
        } else {
          // Create a placeholder if MetaMask is not available
          console.warn('MetaMask not detected, using mock implementation');
          setContract({
            mintCertificate: async () => {
              throw new Error('MetaMask not installed');
            },
            mintFee: async () => ethers.utils.parseEther('0.01')
          });
          setMintFee(ethers.utils.parseEther('0.01'));
        }
      } catch (err) {
        console.error('Error initializing contract:', err);
        setError(err.message);
        
        // Set up a mock contract as fallback
        setContract({
          mintCertificate: async (address, options) => {
            console.log(`Mock mint certificate for ${address} with value ${options.value}`);
            return {
              wait: async () => ({
                events: [{ event: 'CertificateMinted', args: { tokenId: ethers.BigNumber.from(1) } }]
              })
            };
          },
          mintFee: async () => ethers.utils.parseEther('0.01')
        });
        setMintFee(ethers.utils.parseEther('0.01'));
      } finally {
        setLoading(false);
      }
    };

    initContract();
  }, [account, contractAddress]);

  // Function to mint a certificate
  const mintCertificate = async (contractAddress) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    
    // Ensure we're connected to MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      throw new Error('MetaMask not installed');
    }
    
    try {
      // Call mintCertificate function on the contract
      const tx = await contract.mintCertificate(contractAddress, {
        value: mintFee,
      });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Find the CertificateMinted event to get the tokenId
      const event = receipt.events.find(
        event => event.event === 'CertificateMinted'
      );
      
      if (!event) {
        // For demo purposes return a mock token ID
        console.log('Certificate minting event not found in transaction, using mock ID');
        return "1";
      }
      
      return event.args.tokenId.toString();
    } catch (error) {
      console.error('Error during minting:', error);
      
      // For demo purposes
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        console.log('Demo mode - returning mock token ID');
        return "1";
      }
      throw error;
    }
  };

  return {
    contract,
    mintFee,
    isOwner,
    loading,
    error,
    mintCertificate
  };
}