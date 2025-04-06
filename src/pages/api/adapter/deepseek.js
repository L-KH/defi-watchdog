// pages/api/adapter/deepseek.js
import fetch from 'node-fetch';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-00cdc9ed60f040b29f0719c993b651fa';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const config = {
  maxDuration: 8,
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, source, model, temperature = 0.1, max_tokens = 4000 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const isVercelEnv = process.env.VERCEL || process.env.VERCEL_URL;
    console.log(`DeepSeek API request: ${source || 'Unknown source'} (${isVercelEnv ? 'Vercel' : 'Local'})`);
    
    if (isVercelEnv) {
      const apiPromise = fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: model || "deepseek-coder",
          messages: [
            { role: "user", content: prompt }
          ],
          temperature,
          max_tokens: Math.min(max_tokens, 2500),
          response_format: { type: "json_object" }
        })
      }).then(resp => resp.json());
      
      const timeoutPromise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            choices: [{
              message: {
                content: JSON.stringify({
                  status: "partial",
                  message: "Analysis in progress, but timed out on server. Consider using client-side analysis.",
                  partial_results: {
                    overview: "Analysis started but not completed on server.",
                    contractType: "Smart Contract",
                    keyFeatures: [],
                    risks: [],
                    securityScore: 50,
                    riskLevel: "Unknown - Partial Analysis",
                    explanation: "The analysis timed out on the server. For comprehensive analysis, consider using the client-side analyzer option."
                  }
                })
              }
            }]
          });
        }, 5000);
      });
      
      const data = await Promise.race([apiPromise, timeoutPromise]);
      
      return res.status(200).json({
        content: data.choices[0].message.content,
        model: model || "deepseek-coder",
        usage: data.usage || { total_tokens: 0 }
      });
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: model || "deepseek-coder",
          messages: [
            { role: "user", content: prompt }
          ],
          temperature,
          max_tokens,
          response_format: { type: "json_object" }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      return res.status(200).json({
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      });
    }
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    
    return res.status(200).json({
      content: JSON.stringify({
        status: "error",
        message: error.message || 'Failed to call DeepSeek API',
        timestamp: new Date().toISOString(),
        partial_results: {
          overview: "Analysis failed due to an error.",
          contractType: "Smart Contract",
          keyFeatures: [],
          risks: [],
          securityScore: 0,
          riskLevel: "Unknown - Analysis Failed",
          explanation: "The analysis failed due to an error. Consider using the client-side analyzer option."
        }
      }),
      error: error.message || 'Failed to call DeepSeek API'
    });
  }
}