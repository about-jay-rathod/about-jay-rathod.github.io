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