"use strict";

const articles = [
  {
    slug: "sosyalmuhendislik",
    title: "Sosyal Mühendislik Nedir?",
    category: "web",
    categoryLabel: "Farkındalık",
    description: "İnsan psikolojisini hedef alan saldırı teknikleri, temel türleri ve korunma yaklaşımı."
  },
  {
    slug: "nmap",
    title: "Nmap Nedir, Nasıl Kullanılır?",
    category: "network",
    categoryLabel: "Ağ Güvenliği",
    description: "Nmap'in temel çalışma mantığı ve sık kullanılan tarama parametreleri üzerine uygulamalı rehber."
  },
  {
    slug: "beef",
    title: "BeEF Nedir, Nasıl Kullanılır?",
    category: "web",
    categoryLabel: "Web Güvenliği",
    description: "Browser Exploitation Framework'ün yetkili testlerde kullanım mantığı ve temel bileşenleri."
  },
  {
    slug: "metasploit",
    title: "Metasploit Framework",
    category: "system",
    categoryLabel: "Pentest Araçları",
    description: "Metasploit modülleri, temel konsol komutları ve laboratuvar ortamında kullanım yaklaşımı."
  },
  {
    slug: "backdoor",
    title: "MSFvenom ile Backdoor Geliştirme",
    category: "system",
    categoryLabel: "Pentest Laboratuvarı",
    description: "MSFvenom payload yapısı ve izole laboratuvar ortamında ters bağlantı kavramı."
  },
  {
    slug: "izin",
    title: "Linux'ta Dosya İzinleri ve Yetkiler",
    category: "system",
    categoryLabel: "Linux",
    description: "Linux dosya izinleri, kullanıcı-grup ilişkisi ve chmod temelleri."
  },
  {
    slug: "powershell",
    title: "PowerShell Yönetim ve Otomasyon Rehberi",
    category: "system",
    categoryLabel: "Windows",
    description: "Kullanıcı ve grup yönetimi, ağ araçları, RSAT ve script tabanlı otomasyon."
  },
  {
    slug: "lfi",
    title: "File Inclusion ve Local File Inclusion",
    category: "web",
    categoryLabel: "Web Güvenliği",
    description: "Dosya dahil etme zafiyetlerinin çalışma mantığı, riskleri ve güvenli geliştirme notları."
  },
  {
    slug: "ffuf",
    title: "Temel Düzeyde ffuf Kullanımı",
    category: "web",
    categoryLabel: "Keşif",
    description: "Web içerik keşfinde ffuf aracının temel parametreleri ve örnek kullanım akışı."
  },
  {
    slug: "buffero",
    title: "Buffer Overflow Zafiyeti",
    category: "system",
    categoryLabel: "Binary Security",
    description: "Bellek taşması zafiyetlerinin temel mantığı ve laboratuvar ortamında tespit yaklaşımı."
  },
  {
    slug: "ad",
    title: "Active Directory Sızma Testi ve BloodHound",
    category: "network",
    categoryLabel: "Active Directory",
    description: "AD ilişkilerinin BloodHound ve SharpHound ile yetkili ortamda analiz edilmesi."
  },
  {
    slug: "cyborg",
    title: "TryHackMe Cyborg Odası Çözümü",
    category: "ctf",
    categoryLabel: "CTF Çözümü",
    description: "TryHackMe Cyborg odasının keşif, analiz ve çözüm adımlarını içeren uygulamalı notlar."
  }
];

const state = {
  filter: "all",
  search: ""
};

const articleGrid = document.querySelector("#article-grid");
const emptyState = document.querySelector("#empty-state");
const articleDialog = document.querySelector("#article-dialog");
const articleTitle = document.querySelector("#article-title");
const articleCategory = document.querySelector("#article-category");
const articleContent = document.querySelector("#article-content");
const closeDialogButton = document.querySelector(".dialog-close");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;"
  })[character]);
}

function renderArticles() {
  const search = state.search.trim().toLocaleLowerCase("tr-TR");
  const filtered = articles.filter((article) => {
    const matchesFilter = state.filter === "all" || article.category === state.filter;
    const searchable = `${article.title} ${article.categoryLabel} ${article.description}`.toLocaleLowerCase("tr-TR");
    return matchesFilter && searchable.includes(search);
  });

  articleGrid.innerHTML = filtered.map((article) => {
    const index = String(articles.indexOf(article) + 1).padStart(2, "0");
    return `
      <article class="article-card">
        <div class="article-top">
          <span class="article-category">${escapeHtml(article.categoryLabel)}</span>
          <span class="article-index">${index}</span>
        </div>
        <h3>${escapeHtml(article.title)}</h3>
        <p>${escapeHtml(article.description)}</p>
        <button type="button" data-article="${escapeHtml(article.slug)}">Yazıyı oku →</button>
      </article>
    `;
  }).join("");

  emptyState.hidden = filtered.length !== 0;
}

async function openArticle(slug, updateHistory = true) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return;

  articleTitle.textContent = article.title;
  articleCategory.textContent = article.categoryLabel;
  articleContent.innerHTML = '<div class="loader" aria-label="Yükleniyor"></div>';

  if (!articleDialog.open) {
    articleDialog.showModal();
  }
  document.body.classList.add("dialog-open");

  try {
    const response = await fetch(`Content/${encodeURIComponent(slug)}.html`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawHtml = await response.text();
    const parsed = new DOMParser().parseFromString(rawHtml, "text/html");

    parsed.querySelectorAll("script").forEach((node) => node.remove());
    parsed.querySelectorAll("a[target='_blank']").forEach((link) => {
      link.setAttribute("rel", "noopener noreferrer");
    });

    articleContent.innerHTML = parsed.body.innerHTML || rawHtml;

    articleContent.querySelectorAll("img").forEach((image) => {
      image.loading = "lazy";
      image.removeAttribute("width");
      image.removeAttribute("height");
    });
  } catch (error) {
    articleContent.innerHTML = `
      <div class="empty-state">
        <strong>Yazı yüklenemedi.</strong><br>
        GitHub Pages üzerinden açtığından ve dosyanın <code>Content/${escapeHtml(slug)}.html</code> yolunda bulunduğundan emin ol.
      </div>
    `;
    console.error("Yazı yüklenirken hata oluştu:", error);
  }

  if (updateHistory) {
    history.pushState({ article: slug }, "", `#article/${slug}`);
  }
}

function closeArticle(updateHistory = true) {
  if (articleDialog.open) articleDialog.close();
  document.body.classList.remove("dialog-open");

  if (updateHistory && location.hash.startsWith("#article/")) {
    history.pushState({}, "", "#yazilar");
    document.querySelector("#yazilar")?.scrollIntoView({ behavior: "smooth" });
  }
}

function handleRoute() {
  const hash = decodeURIComponent(location.hash);
  if (hash.startsWith("#article/")) {
    const slug = hash.split("/")[1];
    openArticle(slug, false);
    return;
  }

  if (articleDialog.open) {
    closeArticle(false);
  }
}

articleGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-article]");
  if (button) openArticle(button.dataset.article);
});

closeDialogButton.addEventListener("click", () => closeArticle());

articleDialog.addEventListener("click", (event) => {
  const rect = articleDialog.getBoundingClientRect();
  const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (clickedOutside) closeArticle();
});

articleDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeArticle();
});

document.querySelector("#article-search").addEventListener("input", (event) => {
  state.search = event.target.value;
  renderArticles();
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderArticles();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  primaryNav.classList.toggle("open", !isOpen);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const header = document.querySelector(".site-header");
const sections = [...document.querySelectorAll("main > section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);

  let currentId = sections[0]?.id;
  const position = window.scrollY + 150;
  sections.forEach((section) => {
    if (section.offsetTop <= position) currentId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("popstate", handleRoute);
window.addEventListener("hashchange", handleRoute);

document.querySelector("#current-year").textContent = new Date().getFullYear();

renderArticles();
updateHeader();
handleRoute();
