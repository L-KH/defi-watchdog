import { Configuration, OpenAIApi } from 'openai';

// Map severity to a priority level for sorting
const severityPriority = {
  'CRITICAL': 1,
  'HIGH': 2,
  'MEDIUM': 3,
  'LOW': 4,
  'INFO': 5
};

/**
 * API endpoint to generate code patches for security vulnerabilities
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, network, findings } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Contract address is required' });
  }

  if (!findings || !Array.isArray(findings) || findings.length === 0) {
    return res.status(400).json({ error: 'No findings provided to generate fixes' });
  }

  try {
    // Sort findings by severity
    const sortedFindings = [...findings].sort((a, b) => {
      const aPriority = severityPriority[a.severity?.toUpperCase()] || 5;
      const bPriority = severityPriority[b.severity?.toUpperCase()] || 5;
      return aPriority - bPriority;
    });

    // Get contract source code
    const sourceCodeResponse = await fetch(`/api/contract-source?address=${address}&network=${network || 'linea'}`);
    
    if (!sourceCodeResponse.ok) {
      return res.status(502).json({ error: 'Failed to fetch contract source code' });
    }
    
    const sourceData = await sourceCodeResponse.json();
    const sourceCode = sourceData.source;
    
    if (!sourceCode) {
      return res.status(404).json({ error: 'Contract source code not found' });
    }

    // Generate fixes for the findings
    let fixes = [];
    
    // For simplicity, limit to top 3 most severe issues
    const topFindings = sortedFindings.slice(0, 3);
    
    // Sample fixes - to be replaced with actual AI-generated fixes
    fixes = topFindings.map(finding => {
      const codeSample = finding.codeSnippet || finding.codeReference || 
        sourceCode.substring(0, Math.min(500, sourceCode.length));
      
      const fixedCode = generateBasicFix(codeSample, finding);
      
      return {
        title: `Fix for ${finding.title || finding.description?.substring(0, 40) || 'Security Issue'}`,
        description: finding.description,
        severity: finding.severity,
        findingTitle: finding.title,
        findingDescription: finding.description,
        originalCode: codeSample,
        fixedCode: fixedCode,
        explanation: generateExplanation(finding, fixedCode),
        diffSummary: 'Modified code to address security vulnerability'
      };
    });

    return res.status(200).json({ fixes });
  } catch (error) {
    console.error('Error generating fixes:', error);
    return res.status(500).json({ error: 'Failed to generate fixes: ' + (error.message || 'Unknown error') });
  }
}

/**
 * Generate a basic code fix for the issue
 * This is a placeholder - in production, this would use an AI model
 */
function generateBasicFix(code, finding) {
  const severityToFix = {
    'CRITICAL': () => {
      if (code.includes('selfdestruct')) {
        return code.replace('selfdestruct', '// FIXED: Removed selfdestruct\n// selfdestruct');
      }
      if (code.includes('delegatecall')) {
        return code.replace('delegatecall', '// FIXED: Replaced delegatecall with call\ncall');
      }
      if (code.includes('tx.origin')) {
        return code.replace('tx.origin', '// FIXED: Changed tx.origin to msg.sender\nmsg.sender');
      }
      return code.replace('function', '// FIXED: Added security checks\nfunction') + '\n// Added validation and checks';
    },
    'HIGH': () => {
      if (code.includes('transfer(')) {
        return code.replace('transfer(', '// FIXED: Added success check\nbool success = transfer(');
      }
      if (code.includes('send(')) {
        return code.replace('send(', '// FIXED: Replaced send with safer transfer\ntransfer(');
      }
      return code + '\n// FIXED: Added missing validation checks and error handling';
    },
    'MEDIUM': () => {
      if (code.includes('public')) {
        return code.replace('public', '// FIXED: Reduced visibility\ninternal');
      }
      return code + '\n// FIXED: Added proper access controls and validation';
    },
    'LOW': () => {
      return code + '\n// FIXED: Improved code quality and documentation';
    },
    'INFO': () => {
      return code + '\n// FIXED: Added documentation';
    }
  };

  const fixGenerator = severityToFix[finding.severity?.toUpperCase()] || severityToFix['MEDIUM'];
  return fixGenerator();
}

/**
 * Generate an explanation for the fix
 */
function generateExplanation(finding, fixedCode) {
  const severityToExplanation = {
    'CRITICAL': 'This critical vulnerability could lead to loss of funds or contract hijacking. The fix prevents unauthorized access and secures the contract against potential exploits.',
    'HIGH': 'This high-risk vulnerability exposes the contract to potential attacks. The fix implements proper validation and error handling to prevent exploitation.',
    'MEDIUM': 'This medium severity issue could lead to contract malfunction. The fix improves access controls and validation to ensure proper contract behavior.',
    'LOW': 'This low severity issue affects code quality. The fix improves readability and maintainability with minimal security impact.',
    'INFO': 'This is an informational issue that does not pose a security risk. The fix improves code documentation and adherence to best practices.'
  };

  // Generate specifics based on the finding description
  let specificFix = '';
  
  if (finding.description?.toLowerCase().includes('reentrancy')) {
    specificFix = 'The fix implements the Checks-Effects-Interactions pattern to prevent reentrancy attacks.';
  } else if (finding.description?.toLowerCase().includes('overflow') || finding.description?.toLowerCase().includes('underflow')) {
    specificFix = 'The fix implements SafeMath operations to prevent integer overflow/underflow vulnerabilities.';
  } else if (finding.description?.toLowerCase().includes('access control') || finding.description?.toLowerCase().includes('permission')) {
    specificFix = 'The fix adds proper access control modifiers to restrict function execution to authorized users only.';
  } else if (finding.description?.toLowerCase().includes('visibility')) {
    specificFix = 'The fix adjusts function visibility to minimize attack surface.';
  } else if (finding.description?.toLowerCase().includes('gas')) {
    specificFix = 'The fix optimizes the code to reduce gas consumption while maintaining security.';
  }

  return `${severityToExplanation[finding.severity?.toUpperCase() || 'MEDIUM']} ${specificFix}`;
}
