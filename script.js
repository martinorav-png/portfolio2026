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
      <div class="modal-img-gallery" hidden></div>
      <img class="modal-img" src="" alt="">
      <video class="modal-video" controls playsinline loop preload="metadata" hidden></video>
    </div>
    <div class="modal-info">
      <h3 class="modal-title"></h3>
      <p class="modal-desc"></p>
      <span class="modal-meta"></span>
      <a class="modal-live-link" href="#" target="_blank" rel="noopener noreferrer" hidden>View live project</a>
    </div>
  `;
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const modalImgGallery = modal.querySelector('.modal-img-gallery');
  const modalImg = modal.querySelector('.modal-img');
  const modalVideo = modal.querySelector('.modal-video');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalMeta = modal.querySelector('.modal-meta');
  const modalLiveLink = modal.querySelector('.modal-live-link');

  function getModalViewLive() {
    const w = typeof window !== 'undefined' && window.__portfolioWorkStrings;
    return (w && w.modalViewLive) || 'View live project';
  }

  let isOpen = false;
  let sourceCard = null;

  function openModal(card) {
    if (isOpen) return;

    const cardVideo = card.querySelector('.work-card-img video');
    const img = card.querySelector('.work-card-img img');
    const title = card.querySelector('h3').textContent;
    const meta = card.querySelector('.work-meta').textContent;

    if (!cardVideo && !img) return;

    isOpen = true;
    sourceCard = card;

    const descP = card.querySelector('.work-card-info p');
    const desc = card.dataset.desc || (descP ? descP.textContent : '');

    if (cardVideo && modalVideo) {
      modalImgGallery.hidden = true;
      modalImgGallery.replaceChildren();
      modalVideo.removeAttribute('hidden');
      modalVideo.style.display = 'block';
      modalImg.style.display = 'none';
      const sourceEl = cardVideo.querySelector('source');
      const src =
        card.dataset.modalVideoSrc ||
        (sourceEl && sourceEl.getAttribute('src')) ||
        cardVideo.currentSrc ||
        cardVideo.src ||
        '';
      modalVideo.src = src;
      modalVideo.muted = false;
      modalVideo.play().catch(function () {});
      modalImg.removeAttribute('src');
    } else if (img) {
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.load();
        modalVideo.setAttribute('hidden', '');
        modalVideo.style.display = 'none';
      }
      var cardImgs = card.querySelectorAll('.work-card-img img');
      var fullImg = card.dataset.fullImg;
      if (cardImgs.length > 1) {
        modalImgGallery.replaceChildren();
        cardImgs.forEach(function (node, i) {
          var shot = document.createElement('img');
          shot.className = 'modal-gallery-img';
          shot.src = i === 0 && fullImg ? fullImg : node.src;
          shot.alt = node.alt || '';
          modalImgGallery.appendChild(shot);
        });
        modalImgGallery.hidden = false;
        modalImg.style.display = 'none';
        modalImg.removeAttribute('src');
      } else {
        modalImgGallery.hidden = true;
        modalImgGallery.replaceChildren();
        modalImg.style.display = 'block';
        modalImg.src = fullImg || img.src;
        modalImg.alt = img.alt;
      }
    }
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalMeta.textContent = meta;

    if (modalLiveLink) {
      modalLiveLink.textContent = getModalViewLive();
    }

    const liveUrl = card.dataset.liveUrl;
    if (liveUrl && modalLiveLink) {
      modalLiveLink.href = liveUrl;
      modalLiveLink.hidden = false;
    } else if (modalLiveLink) {
      modalLiveLink.hidden = true;
      modalLiveLink.href = '#';
    }

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

    modalImgGallery.hidden = true;
    modalImgGallery.replaceChildren();
    modalImg.style.display = '';

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load();
    }

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
    if (card && card.classList.contains('work-card--motion-collection')) {
      return;
    }
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

// Catwees motion collection (work page + any static page using .work-card--motion-collection)
(function () {
  var CATWEES_MOTION_ITEMS = [
    {
      kind: 'video',
      src: 'assets/works/catwees/crv-2.mp4',
      title: 'Honda CR-V - Motion loop',
      desc: 'Short motion loops for the Honda CR-V, built for Catwees social and display placements.',
      meta: 'Motion · Catwees · Oct 2023',
    },
    {
      kind: 'video',
      src: 'assets/works/catwees/eny1-2.mp4',
      title: 'Honda e:Ny1 - Motion loop',
      desc: 'Motion clip highlighting the Honda e:Ny1 electric SUV for Catwees marketing.',
      meta: 'Motion · Catwees · Oct 2023',
    },
    {
      kind: 'video',
      src: 'assets/works/catwees/zrv-2.mp4',
      title: 'Honda ZR-V - Motion loop',
      desc: 'Motion piece for the Honda ZR-V crossover, produced for Catwees campaigns.',
      meta: 'Motion · Catwees · Oct 2023',
    },
    {
      kind: 'img',
      src: 'assets/works/catwees/kodulehe-banner-3.gif',
      title: 'Catwees - Homepage banner',
      desc: 'Animated hero banner for the Catwees website - layered car imagery and typography timed for the homepage header.',
      meta: 'Motion · Catwees · Feb 2023',
    },
    {
      kind: 'video',
      src: 'assets/works/catwees/kuubik.mp4',
      title: 'Kuubik - 3D cube motion',
      desc: 'Abstract cube transformation - motion study and social-ready clip for Catwees.',
      meta: 'Motion · Catwees · Dec 2022',
    },
    {
      kind: 'img',
      src: 'assets/works/catwees/comp-1.gif',
      title: 'Catwees - Composite motion',
      desc: 'After Effects composite export - layered graphics, glow, and transitions for a Catwees digital piece.',
      meta: 'Motion · Catwees · Dec 2022',
    },
    {
      kind: 'img',
      src: 'assets/works/catwees/poleerimine.gif',
      title: 'Detailing - Social GIF',
      desc: 'GIF for Catwees detailing / polish services - quick loop for social stories and posts.',
      meta: 'Motion · Catwees · Jun 2022',
    },
    {
      kind: 'img',
      src: 'assets/works/catwees/hrv-kliendimeil-2.gif',
      title: 'HR-V - Email header',
      desc: 'Animated header graphic for a Honda HR-V client email send, branded for Catwees.',
      meta: 'Motion · Catwees · Mar 2022',
    },
    {
      kind: 'video',
      src: 'assets/works/catwees/sinimustvalge-fb.mp4',
      title: 'Sinimustvalge - Facebook clip',
      desc: 'Facebook motion clip using Estonian blue-black-white tones for a Catwees national-day style post.',
      meta: 'Motion · Catwees · Feb 2022',
    },
    {
      kind: 'img',
      src: 'assets/works/catwees/meilipealislogo.gif',
      title: 'Newsletter - Logo animation',
      desc: 'Looping Catwees logo animation sized for newsletter and email mastheads.',
      meta: 'Motion · Catwees · Feb 2022',
    },
    {
      kind: 'img',
      src: 'assets/works/catwees/joulukaart-6.gif',
      title: 'Christmas card - Animation',
      desc: 'Animated Christmas card for Catwees - seasonal greeting for clients and social.',
      meta: 'Motion · Catwees · Dec 2021',
    },
    {
      kind: 'img',
      src: 'assets/works/catwees/sobivlinnamaastur.gif',
      title: 'Urban SUV - Campaign GIF',
      desc: 'GIF promoting a city-friendly SUV line - campaign motion for Catwees feeds.',
      meta: 'Motion · Catwees · Dec 2021',
    },
  ];

  var motionOpen = false;
  var detailIdx = -1;
  var sourceCard = null;
  var rootEl = null;

  function getUi() {
    var w = typeof window !== 'undefined' && window.__portfolioWorkStrings;
    return {
      back: (w && w.motionCollectionBack) || 'Back to grid',
      close: (w && w.motionCollectionClose) || 'Close',
    };
  }

  function ensureRoot() {
    if (rootEl) return rootEl;
    rootEl = document.createElement('div');
    rootEl.className = 'motion-collection-overlay';
    rootEl.setAttribute('role', 'dialog');
    rootEl.setAttribute('aria-modal', 'true');
    rootEl.innerHTML =
      '<div class="motion-collection-panel">' +
      '<button type="button" class="motion-collection-close" aria-label="">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<div class="motion-collection-body"></div>' +
      '</div>';
    document.body.appendChild(rootEl);
    rootEl.querySelector('.motion-collection-close').addEventListener('click', function (e) {
      e.stopPropagation();
      closeMotion();
    });
    rootEl.addEventListener('click', function (e) {
      if (e.target === rootEl) closeMotion();
    });
    rootEl.querySelector('.motion-collection-panel').addEventListener('click', function (e) {
      e.stopPropagation();
    });
    return rootEl;
  }

  function render() {
    var ui = getUi();
    var el = ensureRoot();
    var body = el.querySelector('.motion-collection-body');
    var closeBtn = el.querySelector('.motion-collection-close');
    closeBtn.setAttribute('aria-label', ui.close);

    if (!sourceCard) return;

    var title = sourceCard.querySelector('h3');
    var desc = sourceCard.querySelector('.work-card-info p');
    var meta = sourceCard.querySelector('.work-meta');
    var headTitle = title ? title.textContent : 'Catwees Honda - Motion Collection';
    var headDesc = desc ? desc.textContent : '';
    var headMeta = meta ? meta.textContent : '';

    if (detailIdx < 0) {
      body.innerHTML =
        '<header class="motion-collection-header"><h2 id="motion-collection-dlg-title"></h2>' +
        '<p class="motion-collection-lead"></p><span class="motion-collection-meta"></span></header>' +
        '<div class="motion-collection-grid"></div>';
      body.querySelector('#motion-collection-dlg-title').textContent = headTitle;
      body.querySelector('.motion-collection-lead').textContent = headDesc;
      body.querySelector('.motion-collection-meta').textContent = headMeta;

      var grid = body.querySelector('.motion-collection-grid');
      CATWEES_MOTION_ITEMS.forEach(function (item, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'motion-collection-tile';
        var media = document.createElement('div');
        media.className = 'motion-collection-tile-media';
        if (item.kind === 'video') {
          var v = document.createElement('video');
          v.muted = true;
          v.playsInline = true;
          v.loop = true;
          v.autoplay = true;
          v.preload = 'metadata';
          v.innerHTML = '<source src="' + item.src + '" type="video/mp4">';
          media.appendChild(v);
        } else {
          var im = document.createElement('img');
          im.src = item.src;
          im.alt = '';
          im.loading = 'lazy';
          media.appendChild(im);
        }
        var cap = document.createElement('span');
        cap.className = 'motion-collection-tile-title';
        cap.textContent = item.title;
        btn.appendChild(media);
        btn.appendChild(cap);
        btn.addEventListener('click', function () {
          detailIdx = i;
          render();
        });
        grid.appendChild(btn);
      });
    } else {
      var item = CATWEES_MOTION_ITEMS[detailIdx];
      body.innerHTML =
        '<div class="motion-collection-detail">' +
        '<button type="button" class="motion-collection-back btn btn-secondary"></button>' +
        '<div class="motion-collection-detail-media"></div>' +
        '<div class="motion-collection-detail-info"><h3 class="mcd-title"></h3><p class="mcd-desc"></p><span class="work-meta mcd-meta"></span></div></div>';
      body.querySelector('.motion-collection-back').textContent = ui.back;
      body.querySelector('.motion-collection-back').addEventListener('click', function () {
        detailIdx = -1;
        render();
      });
      var wrap = body.querySelector('.motion-collection-detail-media');
      if (item.kind === 'video') {
        var vid = document.createElement('video');
        vid.className = 'motion-collection-detail-vid';
        vid.controls = true;
        vid.playsInline = true;
        vid.loop = true;
        vid.preload = 'metadata';
        vid.innerHTML = '<source src="' + item.src + '" type="video/mp4">';
        wrap.appendChild(vid);
      } else {
        var img = document.createElement('img');
        img.className = 'motion-collection-detail-img';
        img.src = item.src;
        img.alt = item.title;
        wrap.appendChild(img);
      }
      body.querySelector('.mcd-title').textContent = item.title;
      body.querySelector('.mcd-desc').textContent = item.desc;
      body.querySelector('.mcd-meta').textContent = item.meta;
    }
  }

  function openMotion(card) {
    sourceCard = card;
    detailIdx = -1;
    motionOpen = true;
    document.body.style.overflow = 'hidden';
    var el = ensureRoot();
    el.classList.add('active');
    render();
  }

  function closeMotion() {
    if (!motionOpen) return;
    motionOpen = false;
    detailIdx = -1;
    sourceCard = null;
    if (rootEl) rootEl.classList.remove('active');
    document.body.style.overflow = '';
    var body = rootEl && rootEl.querySelector('.motion-collection-body');
    if (body) body.innerHTML = '';
  }

  document.addEventListener('click', function (e) {
    var card = e.target.closest('.work-card--motion-collection');
    if (!card) return;
    e.preventDefault();
    openMotion(card);
  });

  document.addEventListener(
    'keydown',
    function (e) {
      if (!motionOpen || e.key !== 'Escape') return;
      e.stopPropagation();
      if (detailIdx >= 0) {
        detailIdx = -1;
        render();
      } else {
        closeMotion();
      }
    },
    true
  );

  document.addEventListener('keydown', function (e) {
    var card = document.activeElement && document.activeElement.closest('.work-card--motion-collection');
    if (!card || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    openMotion(card);
  });
})();
