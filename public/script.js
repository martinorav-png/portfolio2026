// Scroll-triggered reveal animations
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Fallback: make everything visible after 3 seconds
// (catches fast scrollers and edge cases)
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 3000);

// Hero orb parallax on mouse move
const heroSection = document.querySelector('.hero');
const orbs = document.querySelectorAll('.hero-bg .orb');

if (heroSection && orbs.length) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 15; // different speed per orb
      const ox = x * speed;
      const oy = y * speed;
      orb.style.translate = `${ox}px ${oy}px`;
    });
  }, { passive: true });
}

// Navbar scroll effect
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });


// ========== Lightbox Modal ==========

(function() {
  // Create overlay + modal elements once
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal-card';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  modal.innerHTML = `
    <div class="modal-img-wrap">
      <img class="modal-img" src="" alt="">
    </div>
    <div class="modal-info">
      <h3 class="modal-title"></h3>
      <p class="modal-desc"></p>
      <span class="modal-meta"></span>
    </div>
  `;
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalMeta = modal.querySelector('.modal-meta');

  let isOpen = false;
  let sourceCard = null;

  function openModal(card) {
    if (isOpen) return;
    isOpen = true;
    sourceCard = card;

    // Get data from the clicked card
    const img = card.querySelector('img');
    const title = card.querySelector('h3').textContent;
    const meta = card.querySelector('.work-meta').textContent;

    // Description: prefer data-desc attribute, fall back to <p> inside card
    const descP = card.querySelector('.work-card-info p');
    const desc = card.dataset.desc || (descP ? descP.textContent : '');

    modalImg.src = card.dataset.fullImg || img.src;
    modalImg.alt = img.alt;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalMeta.textContent = meta;

    // Get the card's position for the fly-in animation
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const viewCenterX = window.innerWidth / 2;
    const viewCenterY = window.innerHeight / 2;

    // Set the starting transform (from card position)
    const dx = centerX - viewCenterX;
    const dy = centerY - viewCenterY;
    const scaleStart = rect.width / Math.min(window.innerWidth * 0.8, 720);

    modal.style.transition = 'none';
    modal.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleStart})`;
    modal.style.opacity = '0';

    // Fade the source card
    card.style.opacity = '0.3';

    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.transition = 'transform 0.45s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease';
        modal.style.transform = 'translate(0, 0) scale(1)';
        modal.style.opacity = '1';
      });
    });
  }

  function closeModal() {
    if (!isOpen) return;

    if (sourceCard) {
      // Fly back to source card position
      const rect = sourceCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const viewCenterX = window.innerWidth / 2;
      const viewCenterY = window.innerHeight / 2;
      const dx = centerX - viewCenterX;
      const dy = centerY - viewCenterY;
      const scaleEnd = rect.width / Math.min(window.innerWidth * 0.8, 720);

      modal.style.transition = 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.25s ease 0.1s';
      modal.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleEnd})`;
      modal.style.opacity = '0';

      sourceCard.style.opacity = '';
    }

    overlay.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
      isOpen = false;
      sourceCard = null;
    }, 450);
  }

  // Click handlers for all work cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.work-card');
    if (card && !isOpen) {
      e.preventDefault();
      openModal(card);
      return;
    }

    // Close when clicking overlay background (not the modal itself)
    if (isOpen && e.target === overlay) {
      closeModal();
    }
  });

  // Close button
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeModal();
    }
  });
})();
