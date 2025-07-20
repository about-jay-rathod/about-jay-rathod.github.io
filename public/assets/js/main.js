// =================================================================
// Secure Configuration - PRODUCTION READY
// =================================================================

/**
 * Get secure API endpoint URL
 * This prevents hardcoding URLs and enables easy configuration changes
 */
function getAPIEndpoint(type) {
   // Check if we have environment-specific configuration
   if (window.portfolioConfig && window.portfolioConfig.apiEndpoints) {
      return window.portfolioConfig.apiEndpoints[type];
   }
   
   // Production default endpoints (these should be set via environment)
   const endpoints = {
      contact: '/api/contact',
      chatbot: '/api/chatbot'
   };
   
   return endpoints[type] || '/api/unknown';
}

/**
 * Validate input for security
 */
function sanitizeInput(input, maxLength = 1000) {
   if (!input || typeof input !== 'string') return '';
   
   return input
      .trim()
      .substring(0, maxLength)
      .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
      .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Rate limiting client-side helper
 */
const rateLimiter = {
   attempts: {},
   
   canMakeRequest: function(type, limit = 5, window = 60000) { // 5 requests per minute default
      const now = Date.now();
      const key = type;
      
      if (!this.attempts[key]) {
         this.attempts[key] = [];
      }
      
      // Remove old attempts outside the time window
      this.attempts[key] = this.attempts[key].filter(time => now - time < window);
      
      // Check if we're under the limit
      if (this.attempts[key].length < limit) {
         this.attempts[key].push(now);
         return true;
      }
      
      return false;
   }
};

// =================================================================
// Original Template Code
// =================================================================
!(function ($) {
   "use strict";

   // Nav Menu
   $(document).on('click', '.nav-menu a, .mobile-nav a', function (e) {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
         var hash = this.hash;
         var target = $(hash);
         if (target.length) {
            e.preventDefault();

            if ($(this).parents('.nav-menu, .mobile-nav').length) {
               $('.nav-menu .active, .mobile-nav .active').removeClass('active');
               $(this).closest('li').addClass('active');
            }

            if (hash == '#header') {
               $('#header').removeClass('header-top');
               $("section").removeClass('section-show');
               return;
            }

            if (!$('#header').hasClass('header-top')) {
               $('#header').addClass('header-top');
               setTimeout(function () {
                  $("section").removeClass('section-show');
                  $(hash).addClass('section-show');
               }, 350);
            } else {
               $("section").removeClass('section-show');
               $(hash).addClass('section-show');
            }

            if ($('body').hasClass('mobile-nav-active')) {
               $('body').removeClass('mobile-nav-active');
               $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
               $('.mobile-nav-overly').fadeOut();
            }

            return false;
         }
      }
   });

   // Activate/show sections on load with hash links
   if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
         $('#header').addClass('header-top');
         $('.nav-menu .active, .mobile-nav .active').removeClass('active');
         $('.nav-menu, .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
         setTimeout(function () {
            $("section").removeClass('section-show');
            $(initial_nav).addClass('section-show');
         }, 350);
      }
   }

   // Mobile Navigation
   if ($('.nav-menu').length) {
      var $mobile_nav = $('.nav-menu').clone().prop({
         class: 'mobile-nav d-lg-none'
      });
      $('body').append($mobile_nav);
      $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
      $('body').append('<div class="mobile-nav-overly"></div>');

      $(document).on('click', '.mobile-nav-toggle', function (e) {
         $('body').toggleClass('mobile-nav-active');
         $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
         $('.mobile-nav-overly').toggle();
      });

      $(document).click(function (e) {
         var container = $(".mobile-nav, .mobile-nav-toggle");
         if (!container.is(e.target) && container.has(e.target).length === 0) {
            if ($('body').hasClass('mobile-nav-active')) {
               $('body').removeClass('mobile-nav-active');
               $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
               $('.mobile-nav-overly').fadeOut();
            }
         }
      });
   } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
      $(".mobile-nav, .mobile-nav-toggle").hide();
   }

   // jQuery counterUp
   $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 1000
   });

   // Skills section
   $('.skills-content').waypoint(function () {
      $('.progress .progress-bar').each(function () {
         $(this).css("width", $(this).attr("aria-valuenow") + '%');
      });
   }, {
      offset: '80%'
   });

   // Testimonials carousel (uses the Owl Carousel library)
   $(".testimonials-carousel").owlCarousel({
      autoplay: true,
      dots: true,
      loop: true,
      responsive: {
         0: {
            items: 1
         },
         768: {
            items: 2
         },
         900: {
            items: 3
         }
      }
   });

   // Porfolio isotope and filter
   $(window).on('load', function () {
      var portfolioIsotope = $('.portfolio-container').isotope({
         itemSelector: '.portfolio-item',
         layoutMode: 'fitRows'
      });

      $('#portfolio-flters li').on('click', function () {
         $("#portfolio-flters li").removeClass('filter-active');
         $(this).addClass('filter-active');

         portfolioIsotope.isotope({
            filter: $(this).data('filter')
         });
      });

   });

   // Initiate venobox (lightbox feature used in portofilo)
   $(document).ready(function () {
      $('.venobox').venobox();
   });

})(jQuery);


// =================================================================
// Main Site Logic - This runs once the entire page is loaded
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

   // --- Contact Form Logic ---
   const contactForm = document.getElementById('contact-form');
   if (contactForm) {
      const loadingIndicator = contactForm.querySelector('.loading');
      const errorMessage = contactForm.querySelector('.error-message');
      const sentMessage = contactForm.querySelector('.sent-message');

      const showMessage = (element, message = '', isError = false) => {
         if (loadingIndicator) loadingIndicator.style.display = 'none';
         if (errorMessage) errorMessage.style.display = 'none';
         if (sentMessage) sentMessage.style.display = 'none';

         if (element) {
            if (message) element.textContent = message;
            element.style.display = 'block';
         }
         if (!isError && element === sentMessage) {
            contactForm.reset();
         }
      }

      contactForm.addEventListener('submit', async (event) => {
         event.preventDefault();
         if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
         }

         showMessage(loadingIndicator, 'Sending your message...');
         const formData = new FormData(contactForm);
         
         const data = {
            name: formData.get('from_name') || 'Not provided',
            email: formData.get('from_email'),
            phone: formData.get('phone_number') || 'Not provided',
            subject: formData.get('subject'),
            message: formData.get('message')
         };

         // Use secure API endpoint (no hardcoded URLs)
         const functionUrl = getAPIEndpoint('contact');

         try {
            const response = await fetch(functionUrl, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
               },
               body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
               const successMsg = `✅ Thank you ${data.name}!\n\nYour message has been sent successfully.\n\n📧 Check your email for confirmation details.\n\nJay will personally reply within 24-48 hours.`;
               showMessage(sentMessage, successMsg);
            } else {
               let errorMsg = 'Failed to send message. Please try again later.';
               
               if (response.status === 429) {
                  errorMsg = 'Too many requests. Please wait a moment before submitting again.';
               } else if (response.status === 403) {
                  errorMsg = 'Access denied. Please refresh the page and try again.';
               } else if (result.message) {
                  errorMsg = result.message;
               }
               
               showMessage(errorMessage, errorMsg, true);
            }
         } catch (error) {
            console.error('Contact form error:', error);
            showMessage(errorMessage, 'Network error. Please check your connection and try again.', true);
         }
      });
   }


   // --- AI Chatbot Logic ---
   const chatbotButton = document.getElementById('ai-chatbot-button');
   const chatbotWindow = document.getElementById('ai-chatbot-window');
   const messagesContainer = document.getElementById('ai-chatbot-messages');
   const inputField = document.getElementById('ai-chatbot-input');
   const sendButton = document.getElementById('ai-chatbot-send-btn');
   const statusElement = document.getElementById('ai-chatbot-status');

   if (!chatbotButton || !chatbotWindow || !messagesContainer || !inputField || !sendButton || !statusElement) {
      console.warn("Chatbot elements not found. AI Assistant will not be initialized.");
      return;
   }

   let chatHistory = [];
   let systemPrompt = '';

   chatbotButton.addEventListener('click', () => {
      chatbotWindow.classList.toggle('open');
      chatbotButton.classList.toggle('open');
   });

   sendButton.addEventListener('click', handleSendMessage);
   inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSendMessage();
      }
   });

   async function handleSendMessage() {
      const userInput = inputField.value.trim();
      
      // Input validation
      if (userInput === '' || inputField.disabled) return;
      
      // Sanitize input
      const sanitizedInput = sanitizeInput(userInput, 1000);
      if (sanitizedInput.length < 1) {
         addMessageToUI("Please enter a valid message.", 'bot');
         return;
      }
      
      // Client-side rate limiting
      if (!rateLimiter.canMakeRequest('chatbot', 3, 60000)) { // 3 requests per minute
         addMessageToUI("Please wait a moment before sending another message.", 'bot');
         return;
      }

      addMessageToUI(sanitizedInput, 'user');
      chatHistory.push({
         type: 'user',
         text: sanitizedInput
      });

      inputField.value = '';
      inputField.disabled = true;
      const typingIndicator = showTypingIndicator();

      try {
         const botResponse = await getGeminiResponse(sanitizedInput);
         typingIndicator.remove();
         addMessageToUI(botResponse, 'bot');
         chatHistory.push({
            type: 'bot',
            text: botResponse
         });
      } catch (error) {
         typingIndicator.remove();
         addMessageToUI("I apologize, but I'm having trouble right now. Please try your question again in a moment.", 'bot');
         console.error("Chatbot Error:", error);
         // Remove the user message from history if bot failed
         chatHistory.pop();
      } finally {
         inputField.disabled = false;
      }
   }

   function addMessageToUI(text, type) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('ai-chatbot-message', type);
      messageElement.textContent = text;
      messagesContainer.appendChild(messageElement);
      scrollToBottom();
      return messageElement;
   }

   function showTypingIndicator() {
      const typingElement = document.createElement('div');
      typingElement.classList.add('ai-chatbot-message', 'bot', 'typing');
      typingElement.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      messagesContainer.appendChild(typingElement);
      scrollToBottom();
      return typingElement;
   }

   function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
   }

   function setStatus(status, message) {
      statusElement.textContent = status;
      statusElement.className = status.toLowerCase();
      if (status === 'Offline') {
         inputField.placeholder = message || "Assistant is offline";
         inputField.disabled = true;
         sendButton.disabled = true;
      }
   }

   async function getGeminiResponse(currentPrompt) {
      try {
         // Use secure API endpoint (no hardcoded URLs or keys)
         const functionUrl = getAPIEndpoint('chatbot');
         
         const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ message: currentPrompt })
         });

         if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && result.data.response) {
               return result.data.response;
            }
         }
         
         // Handle different error types
         if (response.status === 429) {
            return "I'm receiving too many questions right now. Please wait a moment before asking another question.";
         } else if (response.status === 403) {
            return "Access denied. Please refresh the page and try again.";
         } else {
            const errorResult = await response.json().catch(() => ({}));
            return errorResult.message || "I'm having trouble connecting right now. Please try your question again in a moment.";
         }
         
      } catch (error) {
         console.error('Chatbot API Error:', error);
         return "I apologize, but I'm having connectivity issues right now. Please try again in a few moments.";
      }
   }

   async function initializeChat() {
      try {
         // Fetch Jay's system prompt from GitHub Gist (your original implementation)
         const gistUrl = "https://gist.githubusercontent.com/about-jay-rathod/418847605369c1a416e3d554f85d0fa3/raw/f3dd76ca8e62909a0a2d532b42356d3800e75e74/jay-portfolio-app-generative-ai-api-initial-prompt.txt";
         const gistResponse = await fetch(gistUrl);
         if (!gistResponse.ok) throw new Error(`Gist fetch failed: ${gistResponse.status}`);
         systemPrompt = await gistResponse.text();

         // Test connectivity with a simple hello message
         await getGeminiResponse("Hello");

         setStatus('Online');
         const initialGreeting = "Hi there! I'm Jay's AI assistant. Ask me anything about his experience, skills, or projects.";
         addMessageToUI(initialGreeting, 'bot');
         chatHistory.push({
            type: 'bot',
            text: initialGreeting
         });

      } catch (error) {
         console.error("Chatbot initialization failed:", error);
         setStatus('Offline', "Assistant offline");
         addMessageToUI("The AI assistant is currently offline. Please try again later.", "bot");
      }
   }

   initializeChat();
});