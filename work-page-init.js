(function () {
  var THEME_KEY = 'portfolio-theme';
  var LOCALE_KEY = 'portfolio-locale';

  var STRINGS = {
    en: {
      navHome: 'home',
      navWork: 'work',
      navAbout: 'about me',
      navSkills: 'skills',
      navContact: 'contact',
      workPageTitle: 'All Work',
      workPageSubtitle: 'Client projects, UI concepts, posters, and everything in between.',
      filterAll: 'All',
      filterUi: 'UI Design',
      filterClient: 'Client Work',
      filterPoster: 'Posters',
      filterBranding: 'Branding',
      filterHackathon: 'Hackathon',
      filterMotion: 'Motion',
      modalViewLive: 'View live project',
      footer: '© 2026 Martin Orav. Built with care.',
      behanceLabel: 'See more work',
      behancePhrase1: 'Want to see more?',
      behancePhrase2: "Check out my Behance",
      behancePhrase3: "There's plenty more...",
      behancePhrase4: 'Click to explore',
      langSwitch: 'Language',
      themeToDark: 'Switch to dark mode',
      themeToLight: 'Switch to light mode',
      docTitle: 'All Work - Martin Orav',
    },
    et: {
      navHome: 'avaleht',
      navWork: 'tööd',
      navAbout: 'minust',
      navSkills: 'oskused',
      navContact: 'kontakt',
      workPageTitle: 'Kõik tööd',
      workPageSubtitle: 'Klientprojektid, UI kontseptsioonid, plakatid ja kõik vahepealne.',
      filterAll: 'Kõik',
      filterUi: 'Kasutajaliides',
      filterClient: 'Klienttöö',
      filterPoster: 'Plakatid',
      filterBranding: 'Bränding',
      filterHackathon: 'Hackathon',
      filterMotion: 'Liikuv graafika',
      modalViewLive: 'Vaata projekti võrgus',
      footer: '© 2026 Martin Orav. Ehitatud hoolega.',
      behanceLabel: 'Vaata rohkem töid',
      behancePhrase1: 'Tahad rohkem näha?',
      behancePhrase2: 'Vaata minu Behance’i',
      behancePhrase3: 'Seal on veel palju…',
      behancePhrase4: 'Klõpsa avastamiseks',
      langSwitch: 'Keel',
      themeToDark: 'Lülitu tumedale režiimile',
      themeToLight: 'Lülitu heledale režiimile',
      docTitle: 'Kõik tööd - Martin Orav',
    },
  };

  function readTheme() {
    try {
      var v = localStorage.getItem(THEME_KEY);
      if (v === 'dark' || v === 'light') return v;
    } catch (e) {}
    return 'light';
  }

  function readLocale() {
    try {
      var v = localStorage.getItem(LOCALE_KEY);
      if (v === 'en' || v === 'et') return v;
    } catch (e) {}
    return 'en';
  }

  function updateThemeIcons() {
    var theme = readTheme();
    var sun = document.querySelector('#work-theme-toggle .theme-icon-sun');
    var moon = document.querySelector('#work-theme-toggle .theme-icon-moon');
    if (sun && moon) {
      if (theme === 'dark') {
        sun.removeAttribute('hidden');
        moon.setAttribute('hidden', '');
      } else {
        moon.removeAttribute('hidden');
        sun.setAttribute('hidden', '');
      }
    }
  }

  function setTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    document.documentElement.dataset.theme = theme;
    updateThemeIcons();
    var toggle = document.getElementById('work-theme-toggle');
    if (toggle) {
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? STRINGS[readLocale()].themeToLight : STRINGS[readLocale()].themeToDark
      );
    }
  }

  function setLocale(locale) {
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch (e) {}
    document.documentElement.lang = locale === 'et' ? 'et' : 'en';
    syncWorkPageStrings();
    applyStaticI18n();
    updateLangButtons();
    updateThemeToggleLabel();
  }

  function syncWorkPageStrings() {
    var loc = readLocale();
    var t = STRINGS[loc] || STRINGS.en;
    window.__portfolioWorkStrings = { modalViewLive: t.modalViewLive };
  }

  function applyStaticI18n() {
    var loc = readLocale();
    var t = STRINGS[loc] || STRINGS.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key && t[key]) el.textContent = t[key];
    });
    document.title = t.docTitle;
  }

  function updateLangButtons() {
    var loc = readLocale();
    document.querySelectorAll('.lang-switch-btn[data-locale]').forEach(function (btn) {
      var l = btn.getAttribute('data-locale');
      btn.classList.toggle('is-active', l === loc);
      btn.setAttribute('aria-pressed', l === loc ? 'true' : 'false');
    });
  }

  function updateThemeToggleLabel() {
    var loc = readLocale();
    var t = STRINGS[loc] || STRINGS.en;
    var theme = readTheme();
    var toggle = document.getElementById('work-theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? t.themeToLight : t.themeToDark);
    }
    var langGroup = document.getElementById('work-lang-switch');
    if (langGroup) langGroup.setAttribute('aria-label', t.langSwitch);
  }

  function initNavControls() {
    document.querySelectorAll('.lang-switch-btn[data-locale]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var l = btn.getAttribute('data-locale');
        if (l === 'en' || l === 'et') setLocale(l);
      });
    });

    var themeBtn = document.getElementById('work-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = readTheme() === 'light' ? 'dark' : 'light';
        setTheme(next);
        updateThemeToggleLabel();
      });
    }
  }

  function initFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.work-grid-full .work-card');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
            card.classList.add('visible');
          } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
          }
        });
      });
    });
  }

  function getBehancePhrases() {
    var loc = readLocale();
    var t = STRINGS[loc] || STRINGS.en;
    return [t.behancePhrase1, t.behancePhrase2, t.behancePhrase3, t.behancePhrase4];
  }

  function initBehanceTyping() {
    var behanceLink = document.querySelector('.behance-link');
    var typingText = document.querySelector('.typing-text');
    if (!behanceLink || !typingText) return;

    var phrases = getBehancePhrases();
    var currentPhrase = 0;
    var charIndex = 0;
    var typeTimer = null;
    var isTyping = false;

    function typeChar() {
      var phrase = phrases[currentPhrase];
      if (charIndex <= phrase.length) {
        typingText.textContent = phrase.slice(0, charIndex);
        charIndex++;
        var speed = 40 + Math.random() * 40;
        typeTimer = setTimeout(typeChar, speed);
      } else {
        typeTimer = setTimeout(eraseChar, 2000);
      }
    }

    function eraseChar() {
      if (!isTyping) return;
      var phrase = phrases[currentPhrase];
      if (charIndex > 0) {
        charIndex--;
        typingText.textContent = phrase.slice(0, charIndex);
        typeTimer = setTimeout(eraseChar, 25);
      } else {
        currentPhrase = (currentPhrase + 1) % phrases.length;
        typeTimer = setTimeout(typeChar, 300);
      }
    }

    function startTyping() {
      phrases = getBehancePhrases();
      if (isTyping) return;
      isTyping = true;
      charIndex = 0;
      currentPhrase = Math.floor(Math.random() * phrases.length);
      typingText.textContent = '';
      typeTimer = setTimeout(typeChar, 200);
    }

    function stopTyping() {
      isTyping = false;
      clearTimeout(typeTimer);
      typingText.textContent = '';
      charIndex = 0;
    }

    behanceLink.addEventListener('mouseenter', startTyping);
    behanceLink.addEventListener('mouseleave', stopTyping);
  }

  syncWorkPageStrings();

  function boot() {
    var th = readTheme();
    try {
      localStorage.setItem(THEME_KEY, th);
    } catch (e) {}
    document.documentElement.dataset.theme = th;
    updateThemeIcons();
    applyStaticI18n();
    updateLangButtons();
    updateThemeToggleLabel();
    initNavControls();
    initFilters();
    initBehanceTyping();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
