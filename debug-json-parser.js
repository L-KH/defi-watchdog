/**
 * Debug script to identify and fix JSON parsing issues in AI Analysis
 * This script will help trace exactly where the error occurs
 */

// Mock a typical AI response that might cause JSON parsing errors
const problematicResponses = [
    // Response with markdown formatting
    `\`\`\`json
{
  "overview": "Contract analysis complete",
  "securityScore": 75,
  "riskLevel": "Medium Risk",
  "keyFindings": [
    {
      "severity": "HIGH",
      "title": "Reentrancy Vulnerability",
      "description": "The withdraw function is vulnerable to reentrancy attacks.",
      "recommendation": "Use checks-effects-interactions pattern"
    }
  ],
  "summary": "Contract has some security issues that need attention"
}
\`\`\``,

    // Response with extra text around JSON
    `Based on my analysis, here's the security assessment:

{
  "overview": "Security analysis completed",
  "securityScore": 80,
  "riskLevel": "Low Risk",
  "keyFindings": [],
  "summary": "Contract appears secure"
}

This assessment covers the main security patterns.`,

    // Response with incomplete JSON
    `{
  "overview": "Analysis in progress",
  "securityScore": 65,
  "riskLevel": "Medium Risk",
  "keyFindings": [
    {
      "severity": "MEDIUM",
      "title": "Access Control",
      "description": "Some functions lack proper access control"
    `,

    // Response with escaped quotes
    `{
  "overview": "Contract uses \\"modern\\" patterns",
  "securityScore": 85,
  "riskLevel": "Low Risk",
  "keyFindings": [],
  "summary": "Good security practices implemented"
}`,

    // Pure text response (worst case)
    `I have analyzed the smart contract and found several issues. The contract appears to have a reentrancy vulnerability in the withdraw function. The access control mechanisms seem adequate. Overall, I would rate this contract as medium risk.`
];

/**
 * Enhanced JSON parser with comprehensive fallback strategies
 */
function debugParseJSON(content, contractName = 'TestContract') {
    console.log('\n🔍 Debug JSON Parser - Testing content:');
    console.log('Content preview:', content.substring(0, 200) + '...');
    console.log('Content length:', content.length);
    
    // First attempt: Direct JSON parsing
    try {
        const result = JSON.parse(content);
        console.log('✅ SUCCESS: Direct JSON parsing worked');
        return { success: true, result, method: 'direct' };
    } catch (firstError) {
        console.log('❌ FAILED: Direct JSON parsing failed -', firstError.message);
    }
    
    // Second attempt: Extract JSON from markdown code blocks
    console.log('\n🔧 Trying markdown extraction...');
    const jsonPatterns = [
        { name: 'json block', pattern: /```json\s*([\s\S]*?)\s*```/ },
        { name: 'code block', pattern: /```\s*([\s\S]*?)\s*```/ },
        { name: 'json object', pattern: /{[\s\S]*}/ }
    ];
    
    for (const { name, pattern } of jsonPatterns) {
        const match = content.match(pattern);
        if (match) {
            try {
                const extractedJson = match[1] || match[0];
                console.log(`🎯 Found ${name}:`, extractedJson.substring(0, 100) + '...');
                const result = JSON.parse(extractedJson);
                console.log(`✅ SUCCESS: ${name} parsing worked`);
                return { success: true, result, method: name };
            } catch (extractError) {
                console.log(`❌ FAILED: ${name} parsing failed -`, extractError.message);
                continue;
            }
        } else {
            console.log(`🚫 No ${name} found`);
        }
    }
    
    // Third attempt: Clean and parse
    console.log('\n🧹 Trying content cleaning...');
    try {
        // Remove common markdown artifacts and try again
        let cleanedContent = content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .replace(/^\s*[\r\n]+/gm, '')
            .trim();
        
        console.log('Cleaned content preview:', cleanedContent.substring(0, 100) + '...');
        
        // Find the first { and last } to extract JSON object
        const firstBrace = cleanedContent.indexOf('{');
        const lastBrace = cleanedContent.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonSubstring = cleanedContent.substring(firstBrace, lastBrace + 1);
            console.log('Extracted JSON substring:', jsonSubstring.substring(0, 100) + '...');
            const result = JSON.parse(jsonSubstring);
            console.log('✅ SUCCESS: Cleaned JSON parsing worked');
            return { success: true, result, method: 'cleaned' };
        } else {
            console.log('❌ No valid JSON braces found');
        }
    } catch (cleanError) {
        console.log('❌ FAILED: Cleaned JSON parsing failed -', cleanError.message);
    }
    
    // Final fallback: Create structured response from text
    console.log('\n📝 Creating fallback response...');
    
    // Try to extract some meaningful information from the text
    const lines = content.split('\n').filter(line => line.trim());
    const hasVulnerabilities = content.toLowerCase().includes('vulnerability') || 
                              content.toLowerCase().includes('security') ||
                              content.toLowerCase().includes('risk');
    
    const fallbackResult = {
        overview: `Analysis completed for ${contractName}. AI model provided text response instead of JSON.`,
        securityScore: hasVulnerabilities ? 60 : 75,
        riskLevel: hasVulnerabilities ? 'Medium Risk' : 'Low Risk',
        keyFindings: [
            {
                severity: 'INFO',
                title: 'AI Response (Non-JSON Format)',
                description: content.length > 1000 
                    ? content.substring(0, 1000) + '...[truncated - see full response below]'
                    : content,
                recommendation: 'Review the complete AI response manually for detailed findings'
            }
        ],
        summary: hasVulnerabilities 
            ? 'AI detected potential security concerns. Manual review recommended.'
            : 'AI analysis completed. Manual review of response recommended.',
        rawResponse: content,
        parseError: true,
        parseMethod: 'fallback'
    };
    
    console.log('✅ SUCCESS: Fallback response created');
    return { success: true, result: fallbackResult, method: 'fallback' };
}

/**
 * Test all problematic response types
 */
function runDebugTests() {
    console.log('🧪 Running JSON parsing debug tests...\n');
    
    problematicResponses.forEach((response, index) => {
        console.log(`\n=== Test Case ${index + 1} ===`);
        const parseResult = debugParseJSON(response, `TestContract${index + 1}`);
        
        console.log('Final result:');
        console.log('  Success:', parseResult.success);
        console.log('  Method:', parseResult.method);
        console.log('  Overview:', parseResult.result.overview?.substring(0, 100) + '...');
        console.log('  Security Score:', parseResult.result.securityScore);
        console.log('  Risk Level:', parseResult.result.riskLevel);
        console.log('  Findings Count:', parseResult.result.keyFindings?.length || 0);
        
        if (parseResult.result.parseError) {
            console.log('  ⚠️  Used fallback parsing due to invalid JSON');
        }
    });
    
    console.log('\n🎉 All debug tests completed!');
    console.log('\n📋 Summary:');
    console.log('- All response types can now be handled gracefully');
    console.log('- No more "Invalid JSON response from AI model" errors');
    console.log('- Users will always get a meaningful response');
    console.log('- Raw AI output is preserved for manual review when needed');
}

// Export the debug function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debugParseJSON, runDebugTests };
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runDebugTests();
}
