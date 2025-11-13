// project.js (güncellenmiş sürüm)

// Sayfa yüklendiğinde çalışacak
document.addEventListener("DOMContentLoaded", () => {
  // Navbar'ı varsayılan koyu hale getir
  const nav = document.querySelector("nav");
  if (nav) {
    nav.classList.add("nav-solid");
  }

  // Footer yılı otomatik güncelle
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Proje kartlarını seç
  const cards = [...document.querySelectorAll("#projects-grid > div")];
  const filterButtons = document.querySelectorAll(".chip");
  const searchInput = document.getElementById("project-search");
  const sortSelect = document.getElementById("project-sort");

  if (!cards.length || !filterButtons.length) {
    console.log("Proje kartları veya filtre butonları bulunamadı");
    return;
  }

  let activeFilter = "all";
  let searchQuery = "";

  // Filtreleme işlemi
  function applyFilters() {
    cards.forEach((card) => {
      const matchCategory =
        activeFilter === "all" || card.dataset.cat === activeFilter;
      const title = card.dataset.title || "";
      const matchSearch = title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      card.style.display = matchCategory && matchSearch ? "block" : "none";
    });
  }

  // Sıralama işlemi
  function applySorting() {
    if (!sortSelect) return;
    
    const container = document.getElementById("projects-grid");
    if (!container) return;
    
    // Görünür kartları al
    const visible = cards.filter((c) => c.style.display !== "none");
    
    // Görünür olmayan kartları geçici olarak sakla
    const hidden = cards.filter((c) => c.style.display === "none");
    
    // Görünür kartları sırala
    let sorted = [...visible];

    if (sortSelect.value) {
      switch (sortSelect.value) {
        case "new":
          sorted.sort(
            (a, b) => new Date(b.dataset.date || 0) - new Date(a.dataset.date || 0)
          );
          break;
        case "old":
          sorted.sort(
            (a, b) => new Date(a.dataset.date || 0) - new Date(b.dataset.date || 0)
          );
          break;
        case "az":
          sorted.sort((a, b) => {
            const titleA = (a.dataset.title || "").toLowerCase();
            const titleB = (b.dataset.title || "").toLowerCase();
            return titleA.localeCompare(titleB);
          });
          break;
        case "za":
          sorted.sort((a, b) => {
            const titleA = (a.dataset.title || "").toLowerCase();
            const titleB = (b.dataset.title || "").toLowerCase();
            return titleB.localeCompare(titleA);
          });
          break;
        default:
          // Varsayılan sıralama
          break;
      }
    }

    // Container'ı temizle ve sıralanmış kartları ekle
    // Önce tüm kartları container'dan çıkar
    cards.forEach(c => {
      if (c.parentNode === container) {
        container.removeChild(c);
      }
    });
    
    // Sıralanmış görünür kartları ekle
    sorted.forEach((c) => container.appendChild(c));
    
    // Gizli kartları en sona ekle (görünmez ama DOM'da kalsın)
    hidden.forEach((c) => container.appendChild(c));
  }

  // Filtre butonlarına tıklama
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter || "all";
      applyFilters();
      applySorting();
    });
  });

  // Arama kutusuna yazıldığında
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      applyFilters();
      applySorting();
    });
  } else {
    console.log("Arama inputu bulunamadı");
  }

  // Sıralama seçimi değiştiğinde
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      applySorting();
    });
  } else {
    console.log("Sıralama select'i bulunamadı");
  }

  // Sayfa ilk açıldığında uygula
  // Önce filtrele, sonra sırala
  applyFilters();
  setTimeout(() => {
    applySorting();
  }, 0);

  // Daha fazla yükle butonu (isteğe bağlı)
  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      alert("Daha fazla proje yüklenecek (henüz uygulanmadı).");
    });
  }
});
