/* =========================================================
   Project Detail Page JavaScript
   - Galeri navigasyonu
   - Thumbnail değiştirme
   - Responsive davranışlar
========================================================= */

(function() {
  'use strict';

  // Galeri değişkenleri
  var currentImageIndex = 0;
  var images = [
    'assets/images/proje.jpeg',
    'assets/images/proje.jpeg',
    'assets/images/proje.jpeg',
    'assets/images/proje.jpeg',
    'assets/images/proje.jpeg',
    'assets/images/proje.jpeg',
    'assets/images/proje.jpeg',
    'assets/images/proje.jpeg'
  ];

  // Ana görseli değiştir
  function changeImage(direction) {
    const mainImage = document.getElementById('main-image');
    if (!mainImage) {
      console.log('Main image element not found');
      return;
    }
    
    // images değişkeninin varlığını kontrol et
    if (!images || !Array.isArray(images) || images.length === 0) {
      console.error('Images array is not defined or empty');
      return;
    }
    
    // Animasyon devam ediyorsa çık
    if (mainImage.classList.contains('slide-left') || mainImage.classList.contains('slide-right')) {
      return;
    }
    
    // Yeni index hesapla
    currentImageIndex += direction;
    
    // Sınır kontrolü
    if (currentImageIndex >= images.length) {
      currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
      currentImageIndex = images.length - 1;
    }
    
    // Animasyon yönünü belirle ve animasyon sınıfını ekle
    const animationClass = direction > 0 ? 'slide-left' : 'slide-right';
    mainImage.classList.add(animationClass);
    
    // Görseli animasyonun ortasında (en karanlık noktada) değiştir
    setTimeout(() => {
      // Önce yeni görseli ön yükle
      const newImg = new Image();
      newImg.src = images[currentImageIndex];
      
      newImg.onload = () => {
        // Görsel yüklendikten sonra değiştir (animasyonun ortasında - 250ms)
        mainImage.src = images[currentImageIndex];
        mainImage.alt = `Proje Görseli ${currentImageIndex + 1}`;
      };
    }, 250); // Animasyon süresinin yarısı (0.5s / 2 = 250ms)
    
    // Animasyon bittikten sonra sınıfı kaldır
    setTimeout(() => {
      mainImage.classList.remove('slide-left', 'slide-right');
    }, 500);
    
    // Thumbnail'leri güncelle
    updateThumbnails();
  }

  // Thumbnail'den ana görseli ayarla
  function setMainImage(thumbnail) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const index = Array.from(thumbnails).indexOf(thumbnail);
    
    if (index !== -1) {
      const mainImage = document.getElementById('main-image');
      if (!mainImage) return;
      
      // Eğer aynı görsel seçilirse işlem yapma
      if (index === currentImageIndex) return;
      
      // Animasyon devam ediyorsa çık
      if (mainImage.classList.contains('slide-left') || mainImage.classList.contains('slide-right')) {
        return;
      }
      
      // Animasyon yönünü belirle (ileri mi geri mi)
      const direction = index > currentImageIndex ? 1 : -1;
      currentImageIndex = index;
      
      // Animasyon yönünü belirle ve animasyon sınıfını ekle
      const animationClass = direction > 0 ? 'slide-left' : 'slide-right';
      mainImage.classList.add(animationClass);
      
      // Görseli animasyonun ortasında değiştir
      setTimeout(() => {
        // Önce yeni görseli ön yükle
        const newImg = new Image();
        newImg.src = thumbnail.src;
        
        newImg.onload = () => {
          // Görsel yüklendikten sonra değiştir
          mainImage.src = thumbnail.src;
          mainImage.alt = thumbnail.alt;
        };
      }, 250);
      
      // Animasyon bittikten sonra sınıfı kaldır
      setTimeout(() => {
        mainImage.classList.remove('slide-left', 'slide-right');
      }, 500);
      
      // Thumbnail'leri güncelle
      updateThumbnails();
    }
  }

  // Thumbnail'leri güncelle
  function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
      thumb.classList.remove('active');
      if (index === currentImageIndex) {
        thumb.classList.add('active');
      }
    });
  }

  // Klavye navigasyonu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      changeImage(-1);
    } else if (e.key === 'ArrowRight') {
      changeImage(1);
    }
  });

  // Touch/swipe desteği (mobil)
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Sola kaydırma - sonraki görsel
        changeImage(1);
      } else {
        // Sağa kaydırma - önceki görsel
        changeImage(-1);
      }
    }
  }

  // Sayfa yüklendiğinde başlat
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Project detail page loaded');
    
    // İlk thumbnail'i aktif yap
    updateThumbnails();
    
    // Butonlara event listener ekle (onclick yedek olarak)
    const prevBtn = document.querySelector('.gallery-btn.prev-btn');
    const nextBtn = document.querySelector('.gallery-btn.next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Prev button clicked');
        changeImage(-1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Next button clicked');
        changeImage(1);
      });
    }
    
    // Smooth scroll için navbar yüksekliğini hesapla
    // main.js'deki getNavHeight fonksiyonunu kullan
    const navHeight = typeof getNavHeight !== 'undefined' ? getNavHeight() : 80;
    
    // İç linklerde smooth scroll
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const rect = target.getBoundingClientRect();
        const y = window.scrollY + rect.top - navHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  });

  // Lightbox fonksiyonları
  function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const mainImage = document.getElementById('main-image');
    
    if (lightbox && lightboxImage && mainImage) {
      lightboxImage.src = mainImage.src;
      lightboxImage.alt = mainImage.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Scroll'u engelle
    }
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Scroll'u tekrar etkinleştir
    }
  }

  function changeLightboxImage(direction) {
    // Önce normal galeride görseli değiştir
    changeImage(direction);
    
    // Sonra lightbox'taki görseli güncelle
    setTimeout(() => {
      const lightboxImage = document.getElementById('lightbox-image');
      const mainImage = document.getElementById('main-image');
      if (lightboxImage && mainImage) {
        lightboxImage.src = mainImage.src;
        lightboxImage.alt = mainImage.alt;
      }
    }, 100);
  }

  // ESC tuşu ile lightbox'ı kapat
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // Lightbox dışına tıklayınca kapat
  document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.addEventListener('click', function(e) {
        // Sadece backdrop'a (lightbox kendisine) tıklanırsa kapat
        // lightbox-content veya içindeki elementlere tıklanırsa kapatma
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }
  });

  // Global scope'a fonksiyonları ekle (onclick için)
  if (typeof window !== 'undefined') {
    window.changeImage = changeImage;
    window.setMainImage = setMainImage;
    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;
    window.changeLightboxImage = changeLightboxImage;
  }
})();
