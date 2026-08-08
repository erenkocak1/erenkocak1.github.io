# erenkocak1.github.io — sade yeniden tasarım

Bu paket mevcut GitHub Pages reposu için hazırlanmıştır.

## Kurulum

1. Mevcut reponuzdaki `Content/` klasörünü **silme**. Yazılar orada kalacak.
2. Bu paketteki `index.html`, `styles.css`, `script.js` ve `favicon.svg` dosyalarını repo köküne kopyala.
3. Eski aynı isimli dosyaların üzerine yaz.
4. Commit + push yap.
5. GitHub Pages birkaç dakika içinde yeni sürümü yayınlar.

## Yazı ekleme

Yeni yazı için `Content/yazi-adi.html` dosyasını ekle ve `script.js` içindeki `articles` dizisine yeni satır ekle.

Örnek:

```js
{ slug: "yazi-adi", title: "Yazı Başlığı", category: "web", label: "Web Güvenliği" }
```

## Tasarım yaklaşımı

- Terminal/JSON/neon efektlerinden uzak
- Tipografi ve içerik odaklı
- Açık, nötr renk paleti
- Responsive mobil menü
- Mevcut Content HTML yazılarını modal içinde açmaya devam eder
- Harici framework veya font bağımlılığı yok
