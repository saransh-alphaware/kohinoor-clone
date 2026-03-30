// ============================================================
// contact-modal.js — Reusable Contact Form Modal
// Usage: Include this script on any page, then call
//        ContactModal.init() after the DOM is ready.
// Requires: EmailJS already initialised on the page.
// ============================================================

const ContactModal = (() => {

  // ── 1. Inject modal HTML into <body> ──────────────────────
  function injectModal() {
    if (document.getElementById('contact-modal-overlay')) return; // already injected

    const html = `
      <!-- Overlay -->
      <div id="contact-modal-overlay"
           class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] hidden items-center justify-center p-4">

        <!-- Modal box -->
        <div id="contact-modal-box"
             class="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8
                    transform transition-all duration-300 scale-95 opacity-0">

          <!-- Close button -->
          <button id="contact-modal-close"
                  class="absolute top-4 right-4 text-gray-400 hover:text-gray-700
                         transition text-2xl leading-none"
                  aria-label="Close">
            &times;
          </button>

          <!-- Heading -->
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-gray-800">Contact Us</h2>
            <p class="text-gray-500 mt-1 text-sm">
              We'd love to hear from you! Send us a message below.
            </p>
          </div>

          <!-- Form -->
          <form id="contact-modal-form" class="space-y-4" novalidate>

            <div>
              <label class="block text-gray-700 font-medium mb-1">Name</label>
              <input type="text" name="name" placeholder="Your Name" required
                class="w-full p-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-300 focus:outline-none transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">Mobile No.</label>
              <input type="tel" name="mobile" placeholder="Your Mobile No." required
                class="w-full p-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-300 focus:outline-none transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">Email</label>
              <input type="email" name="email" placeholder="Your Email" required
                class="w-full p-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-300 focus:outline-none transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-1">Message</label>
              <textarea name="message" rows="4" placeholder="Your Message" required
                class="w-full p-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-300 focus:outline-none transition resize-none"></textarea>
            </div>

            <!-- Status message -->
            <p id="contact-modal-status" class="text-sm text-center hidden"></p>

            <button type="submit" id="contact-modal-submit"
              class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg
                     hover:bg-blue-700 active:scale-95 transition-all duration-150">
              Send Message
            </button>

          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ── 2. Open / close helpers ────────────────────────────────
  function openModal() {
    const overlay = document.getElementById('contact-modal-overlay');
    const box     = document.getElementById('contact-modal-box');

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    // Trigger entrance animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        box.classList.remove('scale-95', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');
      });
    });

    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeModal() {
    const overlay = document.getElementById('contact-modal-overlay');
    const box     = document.getElementById('contact-modal-box');

    box.classList.remove('scale-100', 'opacity-100');
    box.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
      document.body.style.overflow = '';
      // Reset form & status
      document.getElementById('contact-modal-form').reset();
      const status = document.getElementById('contact-modal-status');
      status.textContent = '';
      status.className = 'text-sm text-center hidden';
    }, 200);
  }

  // ── 3. Form submission ─────────────────────────────────────
  function bindFormSubmit() {
    const form   = document.getElementById('contact-modal-form');
    const status = document.getElementById('contact-modal-status');
    const btn    = document.getElementById('contact-modal-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic HTML5 validity check
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Loading state
      btn.disabled    = true;
      btn.textContent = 'Sending…';
      status.className = 'text-sm text-center hidden';

      emailjs.sendForm('service_bxbuf7y', 'template_vwzak4e', form)
        .then(() => {
          status.textContent = '✅ Message sent successfully! We\'ll be in touch soon.';
          status.className   = 'text-sm text-center text-green-600 block';
          form.reset();
          // Auto-close after 2.5 s
          setTimeout(closeModal, 2500);
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          status.textContent = '❌ Failed to send. Please try again or call us directly.';
          status.className   = 'text-sm text-center text-red-600 block';
        })
        .finally(() => {
          btn.disabled    = false;
          btn.textContent = 'Send Message';
        });
    });
  }

  // ── 4. Wire overlay / close-button / Escape key ───────────
  function bindClose() {
    // Close button inside modal
    document.getElementById('contact-modal-close')
      .addEventListener('click', closeModal);

    // Click on dark overlay (outside the box)
    document.getElementById('contact-modal-overlay')
      .addEventListener('click', function (e) {
        if (e.target === this) closeModal();
      });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ── 5. Wire every trigger element ─────────────────────────
  //  Add  data-contact-modal="open"  to ANY button / link
  //  OR pass a CSS selector string to init().
  function bindTriggers(selector) {
    const triggers = document.querySelectorAll(
      '[data-contact-modal="open"]' +
      (selector ? `, ${selector}` : '')
    );
    triggers.forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });
  }

  // ── 6. Public init ─────────────────────────────────────────
  function init(triggerSelector) {
    injectModal();
    bindClose();
    bindFormSubmit();
    bindTriggers(triggerSelector);
  }

  return { init, open: openModal, close: closeModal };

})();