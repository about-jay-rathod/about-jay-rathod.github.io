// =================================================================
// � LOCAL DEVELOPMENT ENVIRONMENT LOADER
// =================================================================
// �🚨 NEVER COMMIT THIS FILE TO GITHUB! 
// This file is in .gitignore for security reasons.
// 
// This loads Firebase configuration from .env file for local development.
// The .env file contains sensitive project details that should never be public.

/**
 * Loads Firebase emulator configuration from environment variables
 * Only works in local development environment
 */
(function() {
   'use strict';
   
   // Only initialize in browser environment
   if (typeof window === 'undefined') return;
   
   // Verify we're in local development
   const hostname = window.location.hostname;
   if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      console.warn('🚨 local-env.js should not be loaded in production!');
      return;
   }
   
   // =================================================================
   // 🔧 FIREBASE EMULATOR CONFIGURATION
   // =================================================================
   
   // These values would normally come from process.env in Node.js
   // For browser environment, we simulate loading from .env
   // In a real production setup, you'd use a build process to inject these
   window.localEmulatorConfig = {
      // Firebase Project Configuration
      projectId: 'about-jay-rathod',       // From FIREBASE_PROJECT_ID
      region: 'us-central1',               // From FIREBASE_REGION
      
      // Emulator Ports
      functionsPort: 5001,                 // From FIREBASE_FUNCTIONS_PORT
      hostingPort: 5000,                   // From FIREBASE_HOSTING_PORT  
      uiPort: 4000,                        // From FIREBASE_UI_PORT
      
      // Auto-generated Firebase Emulator URLs
      baseUrl: 'http://localhost:5001/about-jay-rathod/us-central1',
      
      // Individual Function Endpoints (for direct testing if needed)
      endpoints: {
         contact: 'http://localhost:5001/about-jay-rathod/us-central1/sendContactEmail',
         chatbot: 'http://localhost:5001/about-jay-rathod/us-central1/chatbot'
      },
      
      // Environment flags
      environment: 'local-development',
      debugMode: true,
      timestamp: new Date().toISOString()
   };
   
   // =================================================================
   // 🎯 OVERRIDE MAIN CONFIG FOR LOCAL DEVELOPMENT
   // =================================================================
   
   // Wait for main config to load, then override for local development
   if (window.portfolioConfig) {
      applyLocalOverrides();
   } else {
      // If main config hasn't loaded yet, wait for it
      document.addEventListener('DOMContentLoaded', function() {
         setTimeout(applyLocalOverrides, 100);
      });
   }
   
   function applyLocalOverrides() {
      if (!window.portfolioConfig) {
         console.warn('🚨 Main portfolio config not found. Local overrides not applied.');
         return;
      }
      
      // Override API endpoints for local emulator testing
      // NOTE: In most cases, URL rewrites (/api/chatbot) work fine
      // These direct URLs are only for advanced debugging
      if (window.localEmulatorConfig.endpoints) {
         console.log('🔧 Local emulator endpoints available for debugging:');
         console.table(window.localEmulatorConfig.endpoints);
      }
      
      // Enable development features
      window.portfolioConfig.features.debugMode = true;
      window.portfolioConfig.features.consoleLogging = true;
      window.portfolioConfig.app.environment = 'local-development';
      
      console.log('✅ Local development environment configured');
   }
   
   // =================================================================
   // 🛠️ DEVELOPMENT UTILITIES
   // =================================================================
   
   // Helper function to test direct Firebase function calls
   window.testFirebaseFunction = async function(functionName, testData = {}) {
      const url = window.localEmulatorConfig.endpoints[functionName];
      if (!url) {
         console.error(`❌ Function ${functionName} not found in endpoints`);
         return;
      }
      
      try {
         console.log(`🧪 Testing ${functionName} directly...`);
         const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
         });
         
         const result = await response.json();
         console.log(`✅ ${functionName} response:`, result);
         return result;
      } catch (error) {
         console.error(`❌ Error testing ${functionName}:`, error);
      }
   };
   
   // Development info
   console.log('🔧 Local environment loaded. Available commands:');
   console.log('  • testFirebaseFunction("chatbot", {message: "hello"})');
   console.log('  • testFirebaseFunction("contact", {name: "Test", email: "test@example.com", message: "Hi"})');
   
})();
