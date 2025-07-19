/**
 * Template Name: Personal - v2.1.0
 * Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
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

         // Use Firebase Function (secure API key and email sending)
         const firebaseProjectId = 'about-jay-rathod';
         const functionUrl = `https://us-central1-${firebaseProjectId}.cloudfunctions.net/sendContactEmail`;

         try {
            const response = await fetch(functionUrl, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.result === 'success') {
               showMessage(sentMessage, result.message || 'Your message has been sent. Thank you!');
            } else {
               showMessage(errorMessage, result.message || 'Failed to send message. Please try again later.', true);
            }
         } catch (error) {
            console.error('Contact form error:', error);
            showMessage(errorMessage, 'Failed to send message. Please try again later.', true);
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
      if (userInput === '' || inputField.disabled) return;

      addMessageToUI(userInput, 'user');
      chatHistory.push({
         type: 'user',
         text: userInput
      });

      inputField.value = '';
      const typingIndicator = showTypingIndicator();

      try {
         const botResponse = await getGeminiResponse(userInput);
         typingIndicator.remove();
         addMessageToUI(botResponse, 'bot');
         chatHistory.push({
            type: 'bot',
            text: botResponse
         });
      } catch (error) {
         typingIndicator.remove();
         addMessageToUI("My apologies, I'm having a bit of trouble connecting right now. Please try your question again in a moment.", 'bot');
         console.error("Gemini API Error:", error);
         chatHistory.pop();
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
      // Try Firebase Function first (secure API key)
      const firebaseProjectId = 'about-jay-rathod';
      const functionUrl = `https://us-central1-${firebaseProjectId}.cloudfunctions.net/chatbot`;

      try {
         const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: currentPrompt })
         });

         if (response.ok) {
            const result = await response.json();
            if (result.success) {
               return result.response;
            }
         }
         
         // If Firebase function fails, fall back to direct API with Gist data
         throw new Error('Firebase function unavailable');
         
      } catch (error) {
         console.log('Firebase function failed, falling back to direct API:', error.message);
         
         // Fallback to direct Gemini API with your Gist data (single source of truth)
         // NOTE: This exposes API key - only use as fallback when Firebase Functions are unavailable
         console.warn('Using fallback API - this exposes API keys. Please upgrade to Blaze plan and deploy Functions.');
         const apiKey = "YOUR_API_KEY_REMOVED_FOR_SECURITY";
         const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

         // Include conversation history in the prompt
         const historyString = chatHistory
            .slice(0, currentPrompt ? -1 : undefined)
            .map(message => message.type === 'user' ? `Previous Question: ${message.text}` : `My Previous Answer: ${message.text}`)
            .join('\n\n');

         // Use ONLY your Gist data - no hardcoded fallbacks
         if (!systemPrompt) {
            throw new Error('Professional data not available. Please try again in a moment.');
         }

         const finalPrompt = `${systemPrompt}\n\n--- CONVERSATION HISTORY ---\n${historyString}\n\nCURRENT QUESTION: ${currentPrompt}`;

         const payload = {
            contents: [{
               parts: [{
                  text: finalPrompt
               }]
            }]
         };

         const directResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
         });

         if (!directResponse.ok) {
            const errorBody = await directResponse.text();
            throw new Error(`API request failed with status ${directResponse.status}: ${errorBody}`);
         }

         const result = await directResponse.json();

         if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content || !result.candidates[0].content.parts) {
            if (result.promptFeedback && result.promptFeedback.blockReason) {
               return `I am unable to provide a response. Reason: ${result.promptFeedback.blockReason}`;
            }
            throw new Error("Invalid API response structure.");
         }

         return result.candidates[0].content.parts[0].text;
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