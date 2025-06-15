// Ethers wrapper to handle MetaMask SES conflicts
let ethers;

if (typeof window !== 'undefined') {
  // Browser environment - use dynamic import to avoid SES conflicts
  ethers = {};
  
  // Lazy load ethers when needed
  const getEthers = async () => {
    if (!ethers.providers) {
      const ethersModule = await import('ethers');
      Object.assign(ethers, ethersModule);
    }
    return ethers;
  };
  
  // Create proxy for common ethers properties
  ethers.providers = new Proxy({}, {
    get: (target, prop) => {
      return async (...args) => {
        const e = await getEthers();
        return new e.providers[prop](...args);
      };
    }
  });
  
  ethers.Contract = new Proxy(function() {}, {
    construct: async (target, args) => {
      const e = await getEthers();
      return new e.Contract(...args);
    }
  });
  
  ethers.utils = new Proxy({}, {
    get: (target, prop) => {
      return async (...args) => {
        const e = await getEthers();
        return e.utils[prop](...args);
      };
    }
  });
  
  ethers.constants = new Proxy({}, {
    get: (target, prop) => {
      return async () => {
        const e = await getEthers();
        return e.constants[prop];
      };
    }
  });
} else {
  // Node.js environment
  ethers = require('ethers');
}

export { ethers };
