
/* ---------- Yardımcılar ---------- */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

/* ---------- Elemanlar ---------- */
const nav           = $('.navbar-section nav');
const homeSection   = $('.home');
const menuBtn       = $('.menu-btn');
const menuPanel     = $('.menu');
const navLinks      = $$('.menu ul li a', $('.menu'));
const yearEl        = $('#year');

const navBtns       = $$('.nav-btn');
const slides        = $$('.video-slide');
const contents      = $$('.content');

const NAV_HEIGHT    = 80;     // CSS ile uyumlu
const MOBILE_BP     = 1060;    // CSS media query ile uyumlu

// Responsive navbar height
const getNavHeight = () => {
  if (window.innerWidth <= 576) return 65;
  if (window.innerWidth <= 768) return 70;
  return 80;
};

/*   1) NAVBAR: Scroll'a göre renk değişimi */
(function navbarScrollColor(){
  if (!nav || !homeSection) return;

  // Projects sayfasında navbar her zaman solid
  if (!document.body.classList.contains('home-page')) {
    nav.classList.add('nav-solid');
    return;
  }

  // IntersectionObserver: home görünür -> transparan, değil -> nav-solid
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        nav.classList.remove('nav-solid');
      } else {
        nav.classList.add('nav-solid');
      }
    });
  }, {
    root: null,
    threshold: 0,
    // Navbar yüksekliğini hesaba katarak tam home biterken tetiklet
    rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`
  });

  io.observe(homeSection);

  // Eski tarayıcılar için emniyet kemeri: throttle'lı scroll fallback
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentNavHeight = getNavHeight();
      const trigger = (homeSection.offsetHeight || 600) - currentNavHeight;
      if (window.scrollY > trigger) {
        nav.classList.add('nav-solid');
      } else {
        nav.classList.remove('nav-solid');
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

   //2) MOBİL MENÜ: Aç/Kapat + nav'ı koyu yap (nav-force)
(function mobileMenu(){
  if (!menuBtn || !menuPanel || !nav) return;

  const toggleMenu = (forceState) => {
    const isOpen = (typeof forceState === 'boolean') ? forceState : !menuPanel.classList.contains('active');

    menuPanel.classList.toggle('active', isOpen);
    menuBtn.classList.toggle('active', isOpen);
    nav.classList.toggle('nav-force', isOpen);

    // Erişilebilirlik
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuPanel.setAttribute('aria-hidden', String(!isOpen));
  };

  menuBtn.addEventListener('click', () => toggleMenu());

  // Linke tıklanınca menüyü kapat (mobil)
  navLinks.forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= MOBILE_BP) toggleMenu(false);
  }));

  // ESC ile kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Menü dışına tıklanınca kapat
  menuPanel.addEventListener('click', (e) => {
    if (e.target === menuPanel) {
      toggleMenu(false);
    }
  });

  // Ekran genişlerse sınıfları temizle
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BP && menuPanel.classList.contains('active')) {
      toggleMenu(false);
    }
  });
})();

   //3) VİDEO SLIDER: Nav butonları ile geçiş + Otomatik 5 saniye değişim
(function videoSlider(){
  if (!navBtns.length || !slides.length || !contents.length) return;

  let currentSlide = 0;
  let autoSlideInterval = null;

  const setSlide = (i) => {
    currentSlide = i;
    navBtns.forEach(btn => btn.classList.remove('active'));
    slides.forEach(s => s.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    navBtns[i]?.classList.add('active');
    slides[i]?.classList.add('active');
    contents[i]?.classList.add('active');
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    setSlide(currentSlide);
  };

  const startAutoSlide = () => {
    // Eğer zaten bir interval varsa temizle
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    // Her 5 saniyede bir bir sonraki slayta geç
    autoSlideInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    startAutoSlide();
  };

  // Nav butonlarına tıklandığında manuel geçiş ve timer reset
  navBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      setSlide(i);
      resetAutoSlide();
    });
  });

  // İlk slayt güvenliği
  setSlide(0);
  
  // Otomatik geçişi başlat
  startAutoSlide();
})();

// 4) REVEAL-ON-SCROLL: Görünür olunca .in sınıfı ekle
(function revealOnScroll(){
  const targets = $$('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => io.observe(el));
})();

   // 5) İç linklerde yumuşak kaydırma (örn. #iletisim)
(function smoothAnchors(){
  const anchors = $$('a[href^="#"]');
  anchors.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      // Navbar sabit olduğundan hedefe biraz yukarıdan kay
      const rect = target.getBoundingClientRect();
      const currentNavHeight = getNavHeight();
      const y = window.scrollY + rect.top - currentNavHeight;

      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

  // 6) Footer yılı otomatik
(function fillYear(){
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

