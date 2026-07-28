# Yusuf Eren Koçak — Portfolio Website

GitHub Pages üzerinde çalışan kişisel portfolyo ve teknik blog sitesi.

## İçerik

- Ana sayfa ve kişisel tanıtım
- Hakkımda ve çalışma alanları
- Proje kartları
- Aranabilir ve filtrelenebilir teknik yazılar
- Modal yazı okuyucu
- Mobil uyumlu tasarım
- GitHub Pages ile uyumlu statik yapı

## Yayınlama

1. Bu klasördeki tüm dosyaları `erenkocak1.github.io` reposunun ana dizinine yükleyin.
2. GitHub üzerinde **Settings → Pages** bölümüne gidin.
3. Kaynak olarak `Deploy from a branch`, dal olarak `main`, klasör olarak `/ (root)` seçin.
4. Değişikliklerin yayınlanması birkaç dakika sürebilir.

## Dosya Yapısı

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
└── Content/
```

## Yazı Ekleme

1. `Content/` klasörüne yeni HTML dosyasını ekleyin.
2. `script.js` içindeki `articles` listesine başlık, kategori, açıklama ve dosya adını ekleyin.
3. `slug` değeri dosya adıyla aynı olmalıdır.

Örnek:

```js
{
  slug: "ornek-yazi",
  title: "Örnek Yazı",
  category: "network",
  categoryLabel: "Ağ Güvenliği",
  description: "Kısa açıklama."
}
```

Dosya yolu: `Content/ornek-yazi.html`
