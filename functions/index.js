/**
 * Jay Rathod Portfolio - Firebase Functions
 * 
 * This file contains secure server-side functions for:
 * 1. AI Chatbot - Handles secure AI API calls using Gemini 2.0 Flash
 * 2. Contact Email - Processes contact forms and sends emails with AI responses
 * 
 * Security Features:
 * - All API keys stored in environment variables (.env file)
 * - CORS enabled for cross-origin requests
 * - Input validation and error handling
 * - Professional email formatting with AI-generated responses
 * 
 * Author: Jay Rathod
 * Last Updated: July 18, 2025
 */

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter setup
const transporter = nodemailer.createTransport({
   service: process.env.EMAIL_SERVICE || 'gmail',
   host: process.env.EMAIL_HOST || 'smtp.gmail.com',
   port: parseInt(process.env.EMAIL_PORT) || 587,
   secure: false,
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
   }
});

// Chatbot function
exports.chatbot = functions.https.onRequest(async (req, res) => {
   // Set CORS headers
   res.set('Access-Control-Allow-Origin', '*');
   res.set('Access-Control-Allow-Methods', 'GET, POST');
   res.set('Access-Control-Allow-Headers', 'Content-Type');

   if (req.method === 'OPTIONS') {
      res.status(200).send('');
      return;
   }

   if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
   }

   try {
      const { message } = req.body;
      
      if (!message) {
         res.status(400).json({ error: 'Message is required' });
         return;
      }

      // Fetch professional data from Gist (single source of truth)
      const gistUrl = "https://gist.githubusercontent.com/about-jay-rathod/418847605369c1a416e3d554f85d0fa3/raw/f3dd76ca8e62909a0a2d532b42356d3800e75e74/jay-portfolio-app-generative-ai-api-initial-prompt.txt";
      const gistResponse = await fetch(gistUrl);
      
      if (!gistResponse.ok) {
         throw new Error('Unable to fetch professional data');
      }
      
      const professionalData = await gistResponse.text();

      // Use API key from environment variable
      const apiKey = process.env.GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const prompt = `${professionalData}\n\nUser Question: ${message}`;

      const payload = {
         contents: [{
            parts: [{
               text: prompt
            }]
         }]
      };

      const response = await fetch(apiUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });

      if (!response.ok) {
         throw new Error(`Gemini API failed: ${response.status}`);
      }

      const result = await response.json();
      const aiResponse = result.candidates[0].content.parts[0].text;

      res.json({
         success: true,
         response: aiResponse
      });

   } catch (error) {
      console.error('Chatbot error:', error);
      res.status(500).json({
         success: false,
         error: 'Internal server error'
      });
   }
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📧 SEND CONTACT EMAIL - Enhanced Two-Way Email System
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE: Process contact form submissions with dual email system:
 * 1. Send notification TO Jay FROM user (for Jay to receive inquiries)
 * 2. Send auto-reply TO user FROM Jay (professional acknowledgment)
 * 
 * FEATURES:
 * - Beautiful HTML templates for both emails
 * - Professional email formatting with CSS
 * - AI-generated personalized responses
 * - Proper email headers and delivery tracking
 * - Error handling and validation
 * 
 * SECURITY: Uses server-side environment variables for SMTP credentials
 * ═══════════════════════════════════════════════════════════════════════════
 */
exports.sendContactEmail = functions.https.onRequest(async (req, res) => {
   // Set CORS headers
   res.set('Access-Control-Allow-Origin', '*');
   res.set('Access-Control-Allow-Methods', 'GET, POST');
   res.set('Access-Control-Allow-Headers', 'Content-Type');

   if (req.method === 'OPTIONS') {
      res.status(200).send('');
      return;
   }

   if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
   }

   try {
      const { name, email, phone, subject, message } = req.body;

      // Input validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          error: "Missing required fields",
          details: "Name, email, subject, and message are required"
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Fetch professional data from Gist (single source of truth)
      const gistUrl = "https://gist.githubusercontent.com/about-jay-rathod/418847605369c1a416e3d554f85d0fa3/raw/f3dd76ca8e62909a0a2d532b42356d3800e75e74/jay-portfolio-app-generative-ai-api-initial-prompt.txt";
      const gistResponse = await fetch(gistUrl);
      
      if (!gistResponse.ok) {
         throw new Error('Unable to fetch professional data');
      }
      
      const professionalData = await gistResponse.text();

      // Generate current timestamp
      const now = new Date();
      const timestamp = now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      // ═══════════════════════════════════════════════════════════════════════
      // 🤖 Generate AI Response for Auto-Reply
      // ═══════════════════════════════════════════════════════════════════════
      
      let aiResponse = "Thank you for your message! I'll get back to you within 24-48 hours.";
      
      try {
        const aiPrompt = `${professionalData}

Someone named ${name} sent you a contact form message about "${subject}". Their message: "${message}"

Generate a warm, professional, and personalized auto-reply email response (2-3 sentences) that:
1. Thanks them by name for reaching out
2. Briefly acknowledges their specific inquiry topic
3. Sets expectations for response time (24-48 hours for complex queries, sooner for simple ones)
4. Sounds genuine and professional like Jay Rathod would respond

Keep it concise but personal. Don't be overly formal. Use the professional data context to make it relevant.`;

        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const payload = {
           contents: [{
              parts: [{
                 text: aiPrompt
              }]
           }]
        };

        const aiResult = await fetch(apiUrl, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(payload)
        });

        if (aiResult.ok) {
          const aiData = await aiResult.json();
          if (aiData.candidates && aiData.candidates[0] && aiData.candidates[0].content) {
            aiResponse = aiData.candidates[0].content.parts[0].text.trim();
          }
        }
      } catch (error) {
        console.error("AI response generation failed:", error);
        // Keep default response
      }

      // ═══════════════════════════════════════════════════════════════════════
      // 📨 EMAIL 1: Notification to Jay (Contact Form Submission)
      // ═══════════════════════════════════════════════════════════════════════
      
      const jayEmailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
                .content { padding: 30px; }
                .field-group { margin-bottom: 25px; }
                .field-label { font-weight: 600; color: #495057; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
                .field-value { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; font-size: 16px; color: #212529; }
                .message-content { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; color: #856404; }
                .ai-preview { background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px; color: #1565c0; margin-top: 25px; }
                .footer { background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef; }
                .footer p { margin: 0; color: #6c757d; font-size: 14px; }
                .timestamp { background: #e8f5e8; padding: 12px; border-radius: 6px; color: #2e7d32; font-size: 13px; text-align: center; margin-top: 20px; }
                .priority-badge { display: inline-block; background: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
                .quick-actions { background: #f1f3f4; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .action-btn { display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; margin-right: 10px; margin-bottom: 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 New Contact Form Submission</h1>
                    <p>Someone wants to connect with you!</p>
                    <span class="priority-badge">High Priority</span>
                </div>
                <div class="content">
                    <div class="field-group">
                        <span class="field-label">👤 Full Name</span>
                        <div class="field-value">${name}</div>
                    </div>
                    <div class="field-group">
                        <span class="field-label">📧 Email Address</span>
                        <div class="field-value">
                            <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                        </div>
                    </div>
                    ${phone ? `
                    <div class="field-group">
                        <span class="field-label">📱 Phone Number</span>
                        <div class="field-value">
                            <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                        </div>
                    </div>
                    ` : ''}
                    <div class="field-group">
                        <span class="field-label">📋 Subject</span>
                        <div class="field-value">${subject}</div>
                    </div>
                    <div class="field-group">
                        <span class="field-label">💬 Message</span>
                        <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
                    </div>

                    <div class="ai-preview">
                        <strong>🤖 Auto-Reply Sent to User:</strong><br>
                        <em style="margin-top: 10px; display: block;">"${aiResponse}"</em>
                    </div>

                    <div class="quick-actions">
                        <strong>⚡ Quick Actions:</strong><br>
                        <a href="mailto:${email}?subject=Re: ${subject}" class="action-btn">📧 Reply</a>
                        <a href="tel:${phone || ''}" class="action-btn">📞 Call</a>
                        <a href="https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}" class="action-btn">🔍 LinkedIn</a>
                    </div>

                    <div class="timestamp">
                        📅 Received on ${timestamp}
                    </div>
                </div>
                <div class="footer">
                    <p><strong>Note:</strong> User automatically received a professional acknowledgment</p>
                    <p style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
                        Sent via Jay Rathod Portfolio Contact System • Firebase Functions • AI-Powered
                    </p>
                </div>
            </div>
        </body>
        </html>
      `;

      // ═══════════════════════════════════════════════════════════════════════
      // 📨 EMAIL 2: Auto-Reply to User (Professional Acknowledgment)
      // ═══════════════════════════════════════════════════════════════════════
      
      const userEmailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You for Contacting Jay Rathod</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
                .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                .header p { margin: 15px 0 0 0; opacity: 0.9; font-size: 16px; }
                .content { padding: 40px 30px; }
                .greeting { font-size: 18px; color: #495057; margin-bottom: 25px; }
                .ai-response { background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 25px; border-radius: 10px; border-left: 5px solid #2196F3; margin: 25px 0; }
                .ai-response p { margin: 0; font-size: 16px; line-height: 1.7; color: #37474f; }
                .contact-info { background: #f8f9fa; padding: 25px; border-radius: 8px; margin-top: 30px; }
                .contact-info h3 { margin: 0 0 15px 0; color: #495057; font-size: 18px; }
                .contact-item { display: flex; align-items: center; margin-bottom: 12px; }
                .contact-item span { margin-right: 10px; font-size: 16px; }
                .social-links { text-align: center; margin-top: 30px; }
                .social-links a { display: inline-block; margin: 0 10px; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 500; transition: all 0.3s ease; }
                .social-links a:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
                .footer { background: #2c3e50; color: white; padding: 25px; text-align: center; }
                .footer p { margin: 0; opacity: 0.9; font-size: 14px; }
                .signature { background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin-top: 25px; text-align: center; }
                .signature-name { font-size: 20px; font-weight: 600; color: #2c3e50; margin-bottom: 5px; }
                .signature-title { color: #6c757d; font-size: 14px; }
                .message-summary { background: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 0 6px 6px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✉️ Message Received!</h1>
                    <p>Thank you for reaching out</p>
                </div>
                <div class="content">
                    <div class="greeting">
                        Hi <strong>${name}</strong>,
                    </div>
                    
                    <div class="ai-response">
                        <p>${aiResponse}</p>
                    </div>

                    <div class="message-summary">
                        <strong>📋 Your Message Summary:</strong><br>
                        <strong>Subject:</strong> ${subject}<br>
                        <strong>Sent:</strong> ${timestamp}
                    </div>

                    <p>Your message has been delivered successfully and I've received all the details you provided. I truly appreciate you taking the time to reach out through my portfolio website.</p>

                    <div class="contact-info">
                        <h3>📞 How to Reach Me</h3>
                        <div class="contact-item">
                            <span>📧</span>
                            <span>Email: <a href="mailto:jayrathod.ca@gmail.com" style="color: #667eea;">jayrathod.ca@gmail.com</a></span>
                        </div>
                        <div class="contact-item">
                            <span>🌐</span>
                            <span>Portfolio: <a href="https://about-jay-rathod.web.app" style="color: #667eea;">about-jay-rathod.web.app</a></span>
                        </div>
                        <div class="contact-item">
                            <span>💼</span>
                            <span>LinkedIn: <a href="https://linkedin.com/in/jayrathod" style="color: #667eea;">linkedin.com/in/jayrathod</a></span>
                        </div>
                        <div class="contact-item">
                            <span>🐙</span>
                            <span>GitHub: <a href="https://github.com/jayrathod" style="color: #667eea;">github.com/jayrathod</a></span>
                        </div>
                    </div>

                    <div class="social-links">
                        <a href="https://about-jay-rathod.web.app">🌐 View Portfolio</a>
                        <a href="https://github.com/jayrathod">💻 GitHub</a>
                        <a href="https://linkedin.com/in/jayrathod">💼 LinkedIn</a>
                    </div>

                    <div class="signature">
                        <div class="signature-name">Jay Rathod</div>
                        <div class="signature-title">Software Engineer | AI/ML Professional</div>
                        <div style="margin-top: 8px; font-size: 12px; color: #6c757d;">
                            Passionate about AI, Machine Learning & Full-Stack Development
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <p><strong>🤖 This is an automated acknowledgment.</strong> I'll reply personally soon!</p>
                    <p style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
                        Sent from Jay Rathod's Portfolio System • Powered by Firebase & AI
                    </p>
                </div>
            </div>
        </body>
        </html>
      `;

      // ═══════════════════════════════════════════════════════════════════════
      // 📤 Send Both Emails Simultaneously
      // ═══════════════════════════════════════════════════════════════════════

      const emailPromises = [
        // Email 1: Notification to Jay
        transporter.sendMail({
          from: `"${name}" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `🔔 Portfolio Contact: ${subject} | From ${name}`,
          html: jayEmailTemplate,
          text: `New contact form submission from ${name} (${email})\n\nSubject: ${subject}\n\nMessage: ${message}\n\nPhone: ${phone || 'Not provided'}\n\nAI Auto-Reply Sent: ${aiResponse}\n\nReceived: ${timestamp}`,
        }),

        // Email 2: Auto-reply to User
        transporter.sendMail({
          from: `"Jay Rathod" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Re: ${subject}`,
          html: userEmailTemplate,
          text: `Hi ${name},\n\n${aiResponse}\n\nYour message regarding "${subject}" has been received and I appreciate you reaching out through my portfolio website.\n\nBest regards,\nJay Rathod\nSoftware Engineer | AI/ML Professional\n\nEmail: jayrathod.ca@gmail.com\nPortfolio: https://about-jay-rathod.web.app\nLinkedIn: https://linkedin.com/in/jayrathod\nGitHub: https://github.com/jayrathod`,
        }),
      ];

      // Execute both emails simultaneously
      const results = await Promise.allSettled(emailPromises);
      
      // Check results
      const jayEmailSuccess = results[0].status === 'fulfilled';
      const userEmailSuccess = results[1].status === 'fulfilled';

      if (jayEmailSuccess && userEmailSuccess) {
        console.log(`✅ Dual email success: Contact from ${name} (${email}), Subject: ${subject}`);
        res.json({
          result: 'success',
          message: `Thank you ${name}! Your message has been sent successfully.\n\n${aiResponse}`,
          details: {
            notificationSent: true,
            autoReplySent: true,
            aiResponseGenerated: aiResponse !== "Thank you for your message! I'll get back to you within 24-48 hours.",
          },
        });
      } else {
        // Log errors for debugging
        if (!jayEmailSuccess) {
          console.error("❌ Jay notification email failed:", results[0].reason);
        }
        if (!userEmailSuccess) {
          console.error("❌ User auto-reply email failed:", results[1].reason);
        }

        res.status(207).json({
          result: 'partial_success',
          message: `Thank you ${name}! Your message has been processed.`,
          details: {
            notificationSent: jayEmailSuccess,
            autoReplySent: userEmailSuccess,
            errors: {
              jayEmail: jayEmailSuccess ? null : results[0].reason?.message,
              userEmail: userEmailSuccess ? null : results[1].reason?.message,
            },
          },
        });
      }

   } catch (error) {
      console.error('❌ Contact form processing error:', error);
      res.status(500).json({
         result: 'error',
         message: 'Sorry, there was an issue processing your message. Please try again or email me directly at jayrathod.ca@gmail.com',
         details: error.message,
      });
   }
});
