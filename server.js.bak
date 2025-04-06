const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: '*' // Allow any origin for testing
}));

// Simple test endpoint
app.get('/ping', (req, res) => {
  console.log('Ping request received');
  return res.json({ status: 'alive', message: 'API server is running' });
});

// Slither version check endpoint
app.get('/version', (req, res) => {
  console.log('Version check requested');
  exec('slither --version', (error, stdout, stderr) => {
    if (error) {
      console.error('Slither not found:', error);
      return res.status(500).json({
        success: false,
        error: `Slither not installed: ${error.message}`,
        stderr
      });
    }
    
    console.log('Slither version:', stdout);
    return res.json({
      success: true,
      version: stdout.trim(),
      message: 'Slither is installed and working'
    });
  });
});

app.post('/api/analyze', async (req, res) => {
  console.log('Analysis request received');
  
  const { sourceCode, tool = 'slither' } = req.body;
  
  if (!sourceCode) {
    console.error('No source code provided');
    return res.status(400).json({ 
      success: false, 
      error: 'Source code is required' 
    });
  }
  
  console.log(`Analyzing contract with ${tool}...`);
  console.log(`Source code length: ${sourceCode.length} characters`);
  
  // Create temp directory with unique ID
  const analysisId = Date.now().toString();
  const tempDir = path.join('/tmp', `analysis-${analysisId}`);
  
  console.log(`Creating temporary directory: ${tempDir}`);
  fs.mkdirSync(tempDir, { recursive: true });
  
  try {
    // Write contract to file
    const contractPath = path.join(tempDir, 'Contract.sol');
    console.log(`Writing source code to: ${contractPath}`);
    fs.writeFileSync(contractPath, sourceCode);
    
    // Run Slither
    const cmd = `cd ${tempDir} && slither Contract.sol --json slither-output.json`;
    console.log(`Executing command: ${cmd}`);
    
    exec(cmd, (error, stdout, stderr) => {
      console.log('Slither execution completed');
      
      if (error) {
        console.error('Slither analysis failed:', error);
        console.error('Stderr:', stderr);
        console.log('Stdout:', stdout);
        
        // Clean up
        console.log(`Cleaning up directory: ${tempDir}`);
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.warn('Cleanup failed:', cleanupError);
        }
        
        return res.status(500).json({
          success: false,
          error: `Slither analysis failed: ${error.message}`,
          stderr,
          stdout
        });
      }
      
      console.log('Slither output generated, processing results');
      
      try {
        // Read and parse the output
        const outputPath = path.join(tempDir, 'slither-output.json');
        console.log(`Reading output from: ${outputPath}`);
        
        if (!fs.existsSync(outputPath)) {
          console.error('Output file not found');
          return res.status(500).json({
            success: false,
            error: 'Slither output file not found',
            stdout,
            stderr
          });
        }
        
        const slitherOutput = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        console.log('Successfully parsed Slither output');
        
        // Process the findings
        const findings = processSlitherOutput(slitherOutput);
        console.log(`Processed ${findings.length} findings`);
        
        // Clean up
        console.log(`Cleaning up directory: ${tempDir}`);
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.warn('Cleanup failed:', cleanupError);
        }
        
        // Return results
        return res.json({
          success: true,
          findings,
          tool: 'slither',
          message: 'Analysis completed successfully'
        });
      } catch (parsingError) {
        console.error('Error parsing Slither output:', parsingError);
        return res.status(500).json({
          success: false,
          error: `Error parsing Slither output: ${parsingError.message}`,
          stdout,
          stderr
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    
    // Clean up
    console.log(`Cleaning up directory: ${tempDir}`);
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn('Cleanup failed:', cleanupError);
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function processSlitherOutput(output) {
  console.log('Processing Slither output');
  
  try {
    const findings = [];
    
    // Check if we have detectors results
    if (output.results && output.results.detectors) {
      console.log(`Found ${output.results.detectors.length} detector results`);
      
      output.results.detectors.forEach((finding, index) => {
        console.log(`Processing finding ${index+1}: ${finding.check}`);
        
        // Map Slither severity to our format
        const severityMap = {
          'High': 'HIGH',
          'Medium': 'MEDIUM',
          'Low': 'LOW',
          'Informational': 'INFO'
        };
        
        findings.push({
          severity: severityMap[finding.impact] || 'MEDIUM',
          title: finding.check,
          description: finding.description,
          codeReference: finding.elements ? finding.elements.map(e => e.name).join(', ') : 'Not specified',
          recommendation: finding.recommendation || 'Review and fix the issue.',
          tool: 'Slither'
        });
      });
    } else {
      console.log('No detector results found in Slither output');
    }
    
    return findings;
  } catch (error) {
    console.error('Error processing output:', error);
    return [];
  }
}

app.listen(port, () => {
  console.log(`Analysis server running on port ${port}`);
  console.log(`Test the server with: curl http://localhost:${port}/ping`);
  console.log(`Check Slither with: curl http://localhost:${port}/version`);
});
