"use strict";

const articles = [
  { slug: "sosyalmuhendislik", title: "Sosyal Mühendislik Nedir?", category: "web", label: "Farkındalık" },
  { slug: "nmap", title: "Nmap Nedir, Nasıl Kullanılır?", category: "network", label: "Ağ Güvenliği" },
  { slug: "beef", title: "BeEF Nedir, Nasıl Kullanılır?", category: "web", label: "Web Güvenliği" },
  { slug: "metasploit", title: "Metasploit Framework", category: "system", label: "Pentest Araçları" },
  { slug: "backdoor", title: "MSFvenom ile Backdoor Geliştirme", category: "system", label: "Pentest Laboratuvarı" },
  { slug: "izin", title: "Linux'ta Dosya İzinleri ve Yetkiler", category: "system", label: "Linux" },
  { slug: "powershell", title: "PowerShell Yönetim ve Otomasyon Rehberi", category: "system", label: "Windows" },
  { slug: "lfi", title: "File Inclusion ve Local File Inclusion", category: "web", label: "Web Güvenliği" },
  { slug: "ffuf", title: "Temel Düzeyde ffuf Kullanımı", category: "web", label: "Keşif" },
  { slug: "buffero", title: "Buffer Overflow Zafiyeti", category: "system", label: "Binary Security" },
  { slug: "ad", title: "Active Directory Sızma Testi ve BloodHound", category: "network", label: "Active Directory" },
  { slug: "cyborg", title: "TryHackMe Cyborg Odası Çözümü", category: "ctf", label: "CTF Çözümü" }
];

const state = { filter: "all", search: "" };
const list = document.querySelector("#article-list");
const empty = document.querySelector("#empty-state");
const dialog = document.querySelector("#article-dialog");
const articleTitle = document.querySelector("#article-title");
const articleCategory = document.querySelector("#article-category");
const articleContent = document.querySelector("#article-content");
const nav = document.querySelector("#site-nav");
const menuButton = document.querySelector(".menu-button");

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}

function renderArticles() {
  const term = state.search.trim().toLocaleLowerCase("tr-TR");
  const filtered = articles.filter(article => {
    const categoryMatch = state.filter === "all" || article.category === state.filter;
    const searchMatch = `${article.title} ${article.label}`.toLocaleLowerCase("tr-TR").includes(term);
    return categoryMatch && searchMatch;
  });

  list.innerHTML = filtered.map(article => {
    const index = String(articles.indexOf(article) + 1).padStart(2, "0");
    return `<button class="article-row" type="button" data-slug="${escapeHtml(article.slug)}">
      <span class="article-number">${index}</span>
      <h3>${escapeHtml(article.title)}</h3>
      <span class="article-meta">${escapeHtml(article.label)}</span>
      <span class="article-arrow">↗</span>
    </button>`;
  }).join("");

  empty.hidden = filtered.length > 0;
}

async function openArticle(slug) {
  const article = articles.find(item => item.slug === slug);
  if (!article) return;

  articleTitle.textContent = article.title;
  articleCategory.textContent = article.label;
  articleContent.innerHTML = '<p class="loading">Yazı yükleniyor…</p>';
  dialog.showModal();

  try {
    const response = await fetch(`Content/${encodeURIComponent(slug)}.html`);
    if (!response.ok) throw new Error(String(response.status));
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("script").forEach(el => el.remove());
    doc.querySelectorAll("a[target='_blank']").forEach(el => el.setAttribute("rel", "noopener noreferrer"));
    articleContent.innerHTML = doc.body.innerHTML || html;
    articleContent.querySelectorAll("img").forEach(img => {
      img.loading = "lazy";
      img.removeAttribute("width");
      img.removeAttribute("height");
    });
  } catch (error) {
    articleContent.innerHTML = `<p>Yazı yüklenemedi. <code>Content/${escapeHtml(slug)}.html</code> dosyasının repoda olduğundan emin ol.</p>`;
  }
}

list.addEventListener("click", event => {
  const row = event.target.closest("[data-slug]");
  if (row) openArticle(row.dataset.slug);
});

document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

document.querySelector("#article-search").addEventListener("input", event => {
  state.search = event.target.value;
  renderArticles();
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderArticles();
  });
});

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});

nav.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderArticles();
