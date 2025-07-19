/**
 * Email Service Module
 *
 * Handles all email-related functionality including:
 * - SMTP transporter configuration
 * - Email template rendering
 * - Email sending with error handling
 * - Professional HTML email formatting
 *
 * @author Jay Rathod
 * @version 2.1.0
 */

const nodemailer = require('nodemailer');

/**
 * Email Service Class
 * Manages email operations and configurations
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  /**
   * Initialize the email transporter with SMTP configuration
   * @private
   */
  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // Use STARTTLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      console.log('✅ Email transporter initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error);
      throw error;
    }
  }

  /**
   * Verify email transporter configuration
   * @returns {Promise<boolean>} - Whether the configuration is valid
   */
  async verifyConfiguration() {
    try {
      await this.transporter.verify();
      console.log('✅ Email configuration verified');
      return true;
    } catch (error) {
      console.error('❌ Email configuration verification failed:', error);
      return false;
    }
  }

  /**
   * Send an email with the specified options
   * @param {Object} mailOptions - Email options
   * @param {string} mailOptions.from - Sender email address
   * @param {string} mailOptions.to - Recipient email address
   * @param {string} mailOptions.subject - Email subject
   * @param {string} mailOptions.html - HTML email content
   * @param {string} [mailOptions.replyTo] - Reply-to email address
   * @returns {Promise<Object>} - Email sending result
   */
  async sendEmail(mailOptions) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      // Validate required fields
      const requiredFields = ['from', 'to', 'subject', 'html'];
      for (const field of requiredFields) {
        if (!mailOptions[field]) {
          throw new Error(`Missing required email field: ${field}`);
        }
      }

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${mailOptions.to}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send email to ${mailOptions.to}:`, error);
      throw error;
    }
  }

  /**
   * Send notification email to Jay (from contact form)
   * @param {Object} contactData - Contact form data
   * @param {string} contactData.name - Sender name
   * @param {string} contactData.email - Sender email
   * @param {string} contactData.subject - Email subject
   * @param {string} contactData.message - Email message
   * @returns {Promise<Object>} - Email sending result
   */
  async sendNotificationEmail(contactData) {
    const { name, email, subject, message } = contactData;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 15px;">
        <div style="background: #ffffff; padding: 40px; border-radius: 13px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 700;">📨 New Contact Form Submission</h1>
            <div style="height: 3px; background: linear-gradient(to right, #667eea, #764ba2); margin: 15px auto; width: 100px; border-radius: 2px;"></div>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 5px solid #667eea; margin-bottom: 25px;">
            <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 20px;">Contact Details</h2>
            <p style="margin: 8px 0; color: #34495e; line-height: 1.6;"><strong>👤 Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #34495e; line-height: 1.6;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
            <p style="margin: 8px 0; color: #34495e; line-height: 1.6;"><strong>📝 Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 25px; border-radius: 10px; border: 2px dashed #e1e8ed;">
            <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">💬 Message</h3>
            <p style="color: #34495e; line-height: 1.8; margin: 0; white-space: pre-wrap; font-size: 15px;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e8ed;">
            <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
              📅 Received on ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    `;

    return await this.sendEmail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      html: htmlContent,
      replyTo: email,
    });
  }

  /**
   * Send auto-reply email to contact form submitter
   * @param {Object} contactData - Contact form data
   * @param {string} aiResponse - AI-generated response message
   * @returns {Promise<Object>} - Email sending result
   */
  async sendAutoReplyEmail(contactData, aiResponse) {
    const { name, email } = contactData;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 2px; border-radius: 15px;">
        <div style="background: #ffffff; padding: 40px; border-radius: 13px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 700;">🚀 Thank You for Contacting Jay!</h1>
            <div style="height: 3px; background: linear-gradient(to right, #4facfe, #00f2fe); margin: 15px auto; width: 120px; border-radius: 2px;"></div>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 5px solid #4facfe; margin-bottom: 25px;">
            <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 20px;">Hi ${name}! 👋</h2>
            <p style="color: #34495e; line-height: 1.8; margin: 0 0 15px 0; font-size: 16px;">
              Thank you for reaching out through my portfolio website. I've received your message and appreciate your interest in connecting with me.
            </p>
          </div>
          
          <div style="background: #fff; padding: 25px; border-radius: 10px; border: 2px dashed #e1e8ed;">
            <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">💭 Quick Response</h3>
            <p style="color: #34495e; line-height: 1.8; margin: 0; white-space: pre-wrap; font-size: 15px;">${aiResponse}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">🔗 Connect with me</h3>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">
              📧 <a href="mailto:jayrathod.ca@gmail.com" style="color: #fff; text-decoration: none;">jayrathod.ca@gmail.com</a> | 
              🌐 <a href="https://about-jay-rathod.web.app" style="color: #fff; text-decoration: none;">Portfolio</a>
            </p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e1e8ed;">
            <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
              This is an automated response. I'll get back to you personally within 24-48 hours.<br>
              📅 Sent on ${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    `;

    return await this.sendEmail({
      from: `"Jay Rathod" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting me! - Jay Rathod',
      html: htmlContent,
      replyTo: process.env.EMAIL_USER,
    });
  }
}

module.exports = EmailService;
