# VoteHub

VoteHub, farklı başlıklarda topluluk oylamaları oluşturup sonuçları takip etmek için hazırlanmış React tabanlı bir web uygulamasıdır. Film, teknoloji ve spor gibi örnek kategorilerle başlayabilir; oy verebilir, yeni kategoriler ekleyebilir ve sonuçları inceleyebilirsiniz.

## Özellikler

- Kategorilere ve seçeneklere göre oy kullanma
- Kullanıcı profili oluşturma ve kullanıcı değiştirme
- Kategori ekleme, arama ve filtreleme
- Oy sayılarını ve yüzdelerini görüntüleme
- Demo verilerini başlangıç durumuna döndürme
- Verileri tarayıcıda `localStorage` kullanarak saklama

## Teknolojiler

- React 19 ve TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Gereksinimler

- Node.js 20.19+ veya 22.12+
- npm

## Kurulum ve çalıştırma

```bash
npm install
npm run dev
```

Vite geliştirme sunucusu varsayılan olarak `http://localhost:3000` adresinde açılır.

## Denetim ve derleme

```bash
npm run lint
npm run build
npm run preview
```

`npm run lint`, TypeScript denetimini çalıştırır. `npm run preview`, oluşturulan üretim derlemesini yerel olarak sunar.

## Demo ve veri saklama hakkında

Bu sürüm, sunucu veya veritabanı kullanmayan bir arayüz demosudur. Kullanıcı profilleri ve oylar yalnızca aynı tarayıcının yerel depolamasında tutulur; cihazlar veya kullanıcılar arasında paylaşılmaz. Giriş işlemi gerçek kimlik doğrulaması sağlamaz. Bu nedenle VoteHub'ı güvenli, resmi veya gerçek seçimlerde kullanmayın.

Tarayıcı verilerini sıfırlamak için uygulamadaki demo verilerini sıfırlama kontrolünü kullanın veya bu siteye ait yerel depolama verilerini tarayıcı ayarlarından temizleyin.
