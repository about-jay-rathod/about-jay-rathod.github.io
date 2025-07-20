/**
 * Portfolio Configuration - PRODUCTION READY
 * 
 * This file contains secure configuration that can be safely
 * included in public repositories. No sensitive data here.
 * 
 * @author Jay Rathod
 * @version 2.1.0
 */

// Global configuration object
window.portfolioConfig = {
   // API endpoints - these are set dynamically based on environment
   apiEndpoints: {
      // In production, these will be set by the server/build process
      // For development, they can be overridden locally
      contact: '/api/contact',
      chatbot: '/api/chatbot'
   },
   
   // Security settings
   security: {
      maxMessageLength: 1000,
      maxNameLength: 50,
      maxSubjectLength: 100,
      maxContactMessageLength: 2000,
      rateLimitWindow: 60000, // 1 minute
      chatbotRateLimit: 3, // 3 messages per minute
      contactRateLimit: 1, // 1 contact form per minute
   },
   
   // UI settings
   ui: {
      typingIndicatorDelay: 500,
      messageAnimationDuration: 300,
      scrollBehavior: 'smooth',
      theme: 'default'
   },
   
   // Feature flags
   features: {
      chatbotEnabled: true,
      contactFormEnabled: true,
      analyticsEnabled: false, // Set via environment
      debugMode: false // Set via environment
   },
   
   // App metadata
   app: {
      name: 'Jay Rathod Portfolio',
      version: '2.1.0',
      environment: 'production' // Override via build process
   }
};

// Environment-specific overrides
if (typeof window !== 'undefined' && window.location) {
   const hostname = window.location.hostname;
   
   // Local development
   if (hostname === 'localhost' || hostname === '127.0.0.1') {
      window.portfolioConfig.app.environment = 'development';
      window.portfolioConfig.features.debugMode = true;
      
      // For local development, we use the same rewrite paths
      // The local Firebase emulator will handle routing
      window.portfolioConfig.apiEndpoints = {
         contact: '/api/sendContactEmail',
         chatbot: '/api/chatbot'
      };
   }
   
   // Firebase hosting
   else if (hostname.includes('firebase')) {
      window.portfolioConfig.app.environment = 'production';
      // Firebase hosting uses URL rewrites - no direct URLs exposed
      window.portfolioConfig.apiEndpoints = {
         contact: '/api/sendContactEmail',
         chatbot: '/api/chatbot'
      };
   }
   
   // GitHub Pages or other hosting
   else {
      window.portfolioConfig.app.environment = 'production';
      // For external hosting, use environment detection to build URLs
      // This approach doesn't expose URLs in source code
      const getCloudFunctionUrl = (functionName) => {
         // This will be replaced by build process for production
         if (typeof window !== 'undefined' && window.__FIREBASE_ENV) {
            return `https://${window.__FIREBASE_ENV.region}-${window.__FIREBASE_ENV.projectId}.cloudfunctions.net/${functionName}`;
         }
         // Fallback - will fail gracefully with helpful error
         return `/api/${functionName}`;
      };
      
      window.portfolioConfig.apiEndpoints = {
         contact: getCloudFunctionUrl('sendContactEmail'),
         chatbot: getCloudFunctionUrl('chatbot')
      };
   }
}

// Debug logging in development
if (window.portfolioConfig.features.debugMode) {
   console.log('Portfolio Config Loaded:', window.portfolioConfig);
}

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
   module.exports = window.portfolioConfig;
}
