/**
 * AI Service Module
 *
 * Handles all AI-related functionality including:
 * - Google Gemini API integration
 * - Professional data fetching from GitHub Gist
 * - Response generation with context
 * - Error handling and fallbacks
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

/**
 * AI Service Class
 * Manages AI operations and integrations
 */
class AIService {
  constructor() {
    this.gistUrl =
      'https://gist.githubusercontent.com/about-jay-rathod/418847605369c1a416e3d554f85d0fa3/raw/f3dd76ca8e62909a0a2d532b42356d3800e75e74/jay-portfolio-app-generative-ai-api-initial-prompt.txt';
    this.geminiApiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    this.professionalData = null;
  }

  /**
   * Fetch professional data from GitHub Gist
   * @returns {Promise<string>} - Professional data content
   */
  async fetchProfessionalData() {
    try {
      if (this.professionalData) {
        return this.professionalData;
      }

      console.log('📡 Fetching professional data from GitHub Gist...');
      const response = await fetch(this.gistUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.professionalData = await response.text();
      console.log('✅ Professional data fetched successfully');
      return this.professionalData;
    } catch (error) {
      console.error('❌ Failed to fetch professional data:', error);
      // Return fallback data
      return this.getFallbackProfessionalData();
    }
  }

  /**
   * Get fallback professional data when Gist is unavailable
   * @returns {string} - Fallback professional data
   * @private
   */
  getFallbackProfessionalData() {
    return `
      Jay Rathod is a passionate Full-Stack Developer and AI Enthusiast with expertise in:
      
      Technical Skills:
      - Frontend: React, Vue.js, JavaScript, HTML5, CSS3
      - Backend: Node.js, Python, Express.js
      - Databases: MongoDB, MySQL, PostgreSQL
      - Cloud: Firebase, AWS, Google Cloud
      - AI/ML: Machine Learning, Natural Language Processing
      
      Education:
      - Computer Science background with focus on software development
      - Continuous learning in emerging technologies
      
      Professional Focus:
      - Building scalable web applications
      - Integrating AI solutions into business processes
      - Creating user-centric digital experiences
      
      Contact: jayrathod.ca@gmail.com
      Portfolio: https://about-jay-rathod.web.app
    `;
  }

  /**
   * Generate AI response using Google Gemini
   * @param {string} userMessage - User's message
   * @param {string} context - Additional context (contact form data)
   * @returns {Promise<string>} - AI-generated response
   */
  async generateResponse(userMessage, context = '') {
    try {
      const professionalData = await this.fetchProfessionalData();

      const systemPrompt = this.buildSystemPrompt(professionalData, context);
      const payload = this.buildGeminiPayload(systemPrompt, userMessage);

      console.log('🤖 Generating AI response...');
      const response = await this.callGeminiAPI(payload);

      const aiResponse = this.extractResponseText(response);
      console.log('✅ AI response generated successfully');

      return aiResponse;
    } catch (error) {
      console.error('❌ Failed to generate AI response:', error);
      return this.getFallbackResponse(userMessage, context);
    }
  }

  /**
   * Build system prompt for AI
   * @param {string} professionalData - Professional data
   * @param {string} context - Additional context
   * @returns {string} - System prompt
   * @private
   */
  buildSystemPrompt(professionalData, context) {
    return `
      You are Jay Rathod's professional assistant. Your role is to provide helpful, accurate, and professional responses about Jay's background, skills, and experience.

      PROFESSIONAL DATA:
      ${professionalData}

      GUIDELINES:
      1. Be professional, friendly, and concise
      2. Use first-person perspective when speaking as Jay
      3. Stay focused on professional topics
      4. If asked about personal details not provided, politely redirect to professional matters
      5. Always maintain a positive and engaging tone
      6. Keep responses to 2-3 sentences maximum for contact form replies

      ${context ? `CONTACT CONTEXT: ${context}` : ''}

      Respond professionally and helpfully to the user's inquiry.
    `;
  }

  /**
   * Build payload for Gemini API
   * @param {string} systemPrompt - System prompt
   * @param {string} userMessage - User message
   * @returns {Object} - API payload
   * @private
   */
  buildGeminiPayload(systemPrompt, userMessage) {
    return {
      contents: [
        {
          parts: [{ text: systemPrompt }, { text: `USER MESSAGE: ${userMessage}` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
        stopSequences: [],
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };
  }

  /**
   * Call Gemini API
   * @param {Object} payload - Request payload
   * @returns {Promise<Object>} - API response
   * @private
   */
  async callGeminiAPI(payload) {
    const response = await fetch(`${this.geminiApiUrl}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Extract response text from Gemini API response
   * @param {Object} response - Gemini API response
   * @returns {string} - Extracted text
   * @private
   */
  extractResponseText(response) {
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text.trim();
    }
    throw new Error('Invalid response format from Gemini API');
  }

  /**
   * Get fallback response when AI fails
   * @param {string} userMessage - Original user message
   * @param {string} context - Additional context
   * @returns {string} - Fallback response
   * @private
   */
  getFallbackResponse(userMessage, context) {
    if (context && context.includes('contact form')) {
      return "Thank you for reaching out! I appreciate your interest and will personally review your message. I'll get back to you within 24-48 hours with a detailed response.";
    }

    return "Thank you for your message! I'm currently experiencing high volume, but I'll respond personally as soon as possible. Feel free to check out my portfolio for more information about my work and experience.";
  }

  /**
   * Generate chatbot response (for website chat)
   * @param {string} userMessage - User's chat message
   * @returns {Promise<string>} - Chatbot response
   */
  async generateChatbotResponse(userMessage) {
    const context = "This is a chatbot conversation on Jay's portfolio website.";
    return await this.generateResponse(userMessage, context);
  }

  /**
   * Generate email auto-reply response
   * @param {Object} contactData - Contact form data
   * @returns {Promise<string>} - Email auto-reply response
   */
  async generateEmailResponse(contactData) {
    const { name, subject, message } = contactData;
    const context = `Contact form submission - Name: ${name}, Subject: ${subject}, Message: ${message}`;

    const userMessage = `Generate a professional auto-reply acknowledging this contact form submission. Keep it brief but personalized.`;

    return await this.generateResponse(userMessage, context);
  }
}

module.exports = AIService;
