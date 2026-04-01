/**
 * Vanilla behaviors from the original script.js (reveal, nav, hero parallax, work modal).
 */
export function initSiteEffects(): () => void {
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  const revealTimeout = window.setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      el.classList.add('visible');
    });
  }, 3000);

  const heroSection = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.hero-bg .orb');

  const onHeroMove = (e: MouseEvent) => {
    if (!heroSection || !orbs.length) return;
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 15;
      const ox = x * speed;
      const oy = y * speed;
      (orb as HTMLElement).style.translate = `${ox}px ${oy}px`;
    });
  };

  heroSection?.addEventListener('mousemove', onHeroMove, { passive: true });

  const nav = document.getElementById('nav');

  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // —— Lightbox modal ——
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal-card';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

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

  const modalImg = modal.querySelector('.modal-img') as HTMLImageElement;
  const modalTitle = modal.querySelector('.modal-title') as HTMLElement;
  const modalDesc = modal.querySelector('.modal-desc') as HTMLElement;
  const modalMeta = modal.querySelector('.modal-meta') as HTMLElement;

  let isOpen = false;
  let sourceCard: HTMLElement | null = null;

  function openModal(card: HTMLElement) {
    if (isOpen) return;
    isOpen = true;
    sourceCard = card;

    const img = card.querySelector('img');
    const titleEl = card.querySelector('h3');
    const metaEl = card.querySelector('.work-meta');
    if (!img || !titleEl || !metaEl) return;

    const title = titleEl.textContent ?? '';
    const meta = metaEl.textContent ?? '';

    const descP = card.querySelector('.work-card-info p');
    const desc = card.dataset.desc || (descP ? descP.textContent : '') || '';

    modalImg.src = card.dataset.fullImg || img.src;
    modalImg.alt = img.alt;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalMeta.textContent = meta;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const viewCenterX = window.innerWidth / 2;
    const viewCenterY = window.innerHeight / 2;

    const dx = centerX - viewCenterX;
    const dy = centerY - viewCenterY;
    const scaleStart = rect.width / Math.min(window.innerWidth * 0.8, 720);

    modal.style.transition = 'none';
    modal.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleStart})`;
    modal.style.opacity = '0';

    card.style.opacity = '0.3';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

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

    window.setTimeout(() => {
      isOpen = false;
      sourceCard = null;
    }, 450);
  }

  const onDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.work-card');
    if (card && !isOpen) {
      e.preventDefault();
      openModal(card as HTMLElement);
      return;
    }

    if (isOpen && e.target === overlay) {
      closeModal();
    }
  };

  const onCloseClick = (e: MouseEvent) => {
    e.stopPropagation();
    closeModal();
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      closeModal();
    }
  };

  document.addEventListener('click', onDocumentClick);
  closeBtn.addEventListener('click', onCloseClick);
  document.addEventListener('keydown', onKeydown);

  return () => {
    clearTimeout(revealTimeout);
    revealObserver.disconnect();
    heroSection?.removeEventListener('mousemove', onHeroMove);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('click', onDocumentClick);
    closeBtn.removeEventListener('click', onCloseClick);
    document.removeEventListener('keydown', onKeydown);
    overlay.remove();
  };
}
