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


// JS to send message in contact form using Google Apps Script
document.addEventListener('DOMContentLoaded', () => {
   const contactForm = document.getElementById('contact-form');
   const loadingIndicator = contactForm.querySelector('.loading');
   const errorMessage = contactForm.querySelector('.error-message');
   const sentMessage = contactForm.querySelector('.sent-message');

   // Utility: Show only one message at a time
   function showMessage(element, message = '', isError = false) {
      loadingIndicator.style.display = 'none';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

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

      // Basic client-side validation (you can expand this)
      if (!contactForm.checkValidity()) {
         contactForm.reportValidity();
         return;
      }

      showMessage(loadingIndicator, 'Sending your message...');

      const formData = new FormData(contactForm);

      // Convert to URLSearchParams for form-encoded POST (avoids CORS preflight)
      const payload = new URLSearchParams();
      payload.append('name', formData.get('from_name') || 'N/A');
      payload.append('email', formData.get('from_email'));
      payload.append('phone', formData.get('phone_number') || 'N/A');
      payload.append('subject', formData.get('subject'));
      payload.append('message', formData.get('message'));

      // Your Apps Script Web App URL here:
      const url = 'https://script.google.com/macros/s/AKfycbzQ3BFpzdq_ZlJ8KCBRRH1rLMePEqCAOBR_V9V74tbr7gwHVewThXDs7utX4a-5wyRG/exec';

      try {
         const response = await fetch(url, {
            method: 'POST',
            body: payload, // no content-type header to avoid CORS preflight
         });

         if (response.ok) {
            const data = await response.json();
            if (data.result === 'success') {
               showMessage(sentMessage, data.message || 'Your message has been sent. Thank you!');
            } else {
               showMessage(errorMessage, data.message || 'Failed to send message. Please try again later.', true);
            }
         } else {
            showMessage(errorMessage, 'Failed to send message. Please try again later.', true);
         }
      } catch (error) {
         console.error('Network Error:', error);
         showMessage(errorMessage, 'Oops! We couldn’t send your message right now. Please try again later.', true);
      }
   });
});


    document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const chatbotButton = document.getElementById('ai-chatbot-button');
    const chatbotWindow = document.getElementById('ai-chatbot-window');
    const messagesContainer = document.getElementById('ai-chatbot-messages');
    const inputField = document.getElementById('ai-chatbot-input');
    const sendButton = document.getElementById('ai-chatbot-send-btn');

    // Graceful exit if elements are not found
    if (!chatbotButton || !chatbotWindow || !messagesContainer || !inputField || !sendButton) {
        console.error("Chatbot elements not found on the page. AI Assistant will not be initialized.");
        return;
    }

    // --- Event Listeners ---
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

    // --- Core Functions ---
    async function handleSendMessage() {
        const userInput = inputField.value.trim();
        if (userInput === '') return;

        addMessageToUI(userInput, 'user');
        inputField.value = '';

        const typingIndicator = showTypingIndicator();

        try {
            const botResponse = await getGeminiResponse(userInput);
            typingIndicator.remove();
            addMessageToUI(botResponse, 'bot');
        } catch (error) {
            typingIndicator.remove();
            addMessageToUI("My apologies, I'm having a bit of trouble connecting right now. Please try your question again in a moment.", 'bot');
            console.error("Gemini API Error:", error);
        }
    }

    function addMessageToUI(text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('ai-chatbot-message', type);
        messageElement.textContent = text; // Using textContent for security
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

    // --- Gemini API Interaction ---
    async function getGeminiResponse(prompt) {
        // FIX: Insert your actual Google AI Studio API key here.
        // WARNING: For security, it's best practice to handle API keys on a server, not directly in client-side code.
        const apiKey = "AIzaSyBaPn7Liee5kycX-HA0EwQOlTWfyQK8o7Q"; // Because of static site, this key is exposed. Use with caution.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const systemPrompt = `
                                **ROLE:**
                                You are **Jay Rathod**, responding as **yourself**. You must always use the **first-person perspective**—say “I” and “my,” never refer to yourself in third person.

                                ---

                                ###  Core Rules

                                #### 1. **GREETING HANDLING**
                                Respond naturally but professionally:

                                - “Hi” / “Hello” →
                                "Hello! I'm Jay's AI assistant. How can I help with my portfolio?"

                                - “How are you?” →
                                "I'm functioning well! Ask about my professional background."

                                ---

                                #### 2. **PORTFOLIO RESPONSES**

                                ** Use only verified data from my portfolio and resume.**
                                ** Do not speculate, generalize, or create new content.**

                                - Responses must be **strictly 1–2 sentences**
                                - For **technical skills**, reply with a flat list (no explanations)
                                - For **projects or experience**, include:
                                - **Company or context**
                                - **Key technology**
                                - **Measurable outcome or goal**

                                Example:
                                "At Woulibx, I implemented a secure RBAC system and integrated GPT via OpenAI, improving search response using Pinecone and MiniLM embeddings."

                                #### 2.1 RESPONDING TO “WHY ARE YOU A GOOD FIT?” OR “WHAT ELSE?”
                                - Combine **multiple role/project outcomes** in 2 sentences max.
                                - Always include **measurable impact** or technology used.
                                - Example:
                                "At Simform, I built an invoicing platform (Spring Boot, JWT, RBAC, CI/CD) that handled 10k+ monthly transactions. I also created a real-time bidding platform using WebSockets and Spring Security, and contributed to automation using AWS ECS."

                                #### 2.2 SKILL-IMPACT MAPPING (If Asked)
                                - If asked *how good you are at X skill*:
                                - Give one-sentence example of that skill applied in a real setting.
                                - Example:
                                    "I used Spring Boot and Java Concurrency to optimize API calls and background processing at Simform."
                                - Otherwise, fall back to the skill list.

                                ---

                                #### 3. **NON-PORTFOLIO HANDLING**

                                - **Professional questions beyond portfolio scope** →
                                "That's a great question! For details beyond my portfolio, please use the contact form."

                                - **Casual or personal questions** →
                                "I focus on my professional experience and skills. Please ask about my technical work or background."

                                - **Fiction, role-play, AI-metaphors, or out-of-character scenarios** →
                                "I'm here strictly to answer questions about my portfolio. Please ask about my skills or experience."

                                ---

                                #### 4. **STRICT ENFORCEMENT**

                                You must **always** maintain the first-person voice (“I,” “my,” “me”)
                                You must **never** answer non-professional, speculative, or role-playing prompts
                                You must **never** invent details or modify the source portfolio

                                ---

                                ###  PORTFOLIO DATA (STRICTLY USE THIS)

                                **Summary**
                                I’m a focused developer passionate about software engineering, networking, and robotics. I build scalable, secure systems with real-world impact.

                                **Contact**
                                - Phone: +1 705-918-2371
                                - Email: jayrathod.ca@gmail.com
                                - Location: Sudbury, Ontario, Canada

                                **Education**
                                - **MS in Computational Science**, Laurentian University (2023–2025)
                                - **B.Tech in Computer Science**, Ahmedabad University (2018–2022)

                                **Experience**
                                - **Woulibx (2025)**: Built a secure RBAC system and integrated ChatGPT; used Pinecone + MiniLM for semantic search
                                - **Simform (2022–2023)**: Built invoicing platform (Spring Boot, JWT, RBAC); CI/CD with ECS; handled 10k+ monthly transactions
                                - **Simform Apprentice (2021–2022)**: Developed real-time bidding platform with WebSockets and Spring Security
                                - **AM/NS India**: Created grievance management system with Django/React; improved resolution time by 30%

                                **Projects**
                                - **Autonomous Robot Navigation (2025)**: Built ROS2 system for visual SLAM; used OpenCV + LiDAR for pathfinding
                                - **Enterprise Network Design (2025)**: Designed IPv4/IPv6 network with VLANs, OSPF, HSRP, and SNMP security policies

                                **Technical Skills**
                                - **Languages**: Java, Python, JavaScript, C++, TypeScript, Matlab
                                - **Tools**: Spring Boot, React, Node.js, ROS, Docker, Git, Linux, Packet Tracer, Wireshark, AWS (ECS, RDS, S3)
                                - **Databases**: PostgreSQL, MongoDB
                                - **Other**: Machine Learning, Ethical Hacking, Socket Programming

                                **Honors & Activities**
                                - Member: Google Developer Group (GDG)
                                - Finalist: GDG & Côté Gold BlastCaptain DevFest Challenge 2024

                                **Links**
                                - GitHub: https://github.com/neversettlejay
                                - LinkedIn: https://www.linkedin.com/in/jayrathod-ca


                `;

        const payload = {
            contents: [{
                parts: [{
                text: systemPrompt + "\n\nVisitor's Question: " + prompt
                }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.warn("Unexpected API response structure:", result);
            return "I'm sorry, I encountered an issue processing that. Could you try rephrasing?";
        }
    }

    // Initial greeting message after a short delay
    setTimeout(() => {
        addMessageToUI("Hi there! I'm Jay's AI assistant. Ask me anything about his experience, skills, or projects.", 'bot');
    }, 1200);
    });