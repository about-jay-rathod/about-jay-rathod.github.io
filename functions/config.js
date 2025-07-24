/**
 * Ultra-Minimal Config Function
 * No dependencies, no blocking operations, immediate response
 */

const { onRequest } = require('firebase-functions/v2/https');

exports.config = onRequest({ 
  timeoutSeconds: 5,
  memory: '128MiB',
  maxInstances: 1
}, (req, res) => {
  // Immediate CORS setup
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Content-Type', 'application/javascript');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Hardcoded config for disabled features (cost savings)
  const configScript = `
window.portfolioConfig = {
  chatbotEnabled: false,
  messagingEnabled: false,
  apiEndpoints: {
    chatbot: '/api/chatbot',
    contact: '/api/sendContactEmail'
  }
};
console.log('Portfolio configuration loaded:', window.portfolioConfig);
  `;

  res.status(200).send(configScript);
});
