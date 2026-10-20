import { Category, User, VoteRecord } from '../types';

export const DEFAULT_USERS: User[] = [
  {
    id: 'user-enes',
    username: 'enes',
    fullName: 'Enes Öztürk',
    avatarColor: 'from-amber-500 to-orange-600',
    avatarInitial: 'EÖ',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'user-ayse',
    username: 'ayse',
    fullName: 'Ayşe Yılmaz',
    avatarColor: 'from-rose-500 to-pink-600',
    avatarInitial: 'AY',
    createdAt: '2026-01-12T14:30:00.000Z',
  },
  {
    id: 'user-mehmet',
    username: 'mehmet',
    fullName: 'Mehmet Demir',
    avatarColor: 'from-sky-500 to-blue-600',
    avatarInitial: 'MD',
    createdAt: '2026-01-15T11:15:00.000Z',
  },
  {
    id: 'user-zeynep',
    username: 'zeynep',
    fullName: 'Zeynep Kaya',
    avatarColor: 'from-emerald-500 to-teal-600',
    avatarInitial: 'ZK',
    createdAt: '2026-01-18T16:45:00.000Z',
  },
  {
    id: 'user-can',
    username: 'can',
    fullName: 'Can Özkan',
    avatarColor: 'from-purple-500 to-indigo-600',
    avatarInitial: 'CÖ',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-films',
    title: 'Film & Sinema Kategorisi',
    description: 'Son dönemin en etkileyici ve sinema dünyasına damga vuran başyapıtını seçin.',
    icon: 'Film',
    themeColor: 'purple',
    options: [
      {
        id: 'opt-dune2',
        title: 'Dune: Part Two',
        description: 'Denis Villeneuve imzalı görsel ve işitsel çöl destanı.',
        badge: 'Bilim Kurgu',
        iconName: 'Clapperboard',
      },
      {
        id: 'opt-oppenheimer',
        title: 'Oppenheimer',
        description: 'Christopher Nolan yönetiminde atom çağı ve dramatik biyografi.',
        badge: 'Tarih & Biyografi',
        iconName: 'Sparkles',
      },
      {
        id: 'opt-interstellar',
        title: 'Interstellar (Yıldızlararası)',
        description: 'Solucan delikleri, yerçekimi ve zaman bükülmesini anlatan klasik.',
        badge: 'Uzay Klasiği',
        iconName: 'Compass',
      },
      {
        id: 'opt-spiderverse',
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Animasyon sanatında sınırları kaldıran görsel şölen.',
        badge: 'Animasyon',
        iconName: 'Eye',
      },
    ],
  },
  {
    id: 'cat-tech',
    title: 'Tech Stack & Yazılım Kategorisi',
    description: 'Modern dijital ürünler geliştirirken en çok güvendiğiniz ana teknoloji kümesi.',
    icon: 'Cpu',
    themeColor: 'cyan',
    options: [
      {
        id: 'opt-react-next',
        title: 'React & Next.js',
        description: 'Büyük ekosistem desteği, Server Components ve endüstri standardı.',
        badge: 'Web Standardı',
        iconName: 'Code',
      },
      {
        id: 'opt-vue-nuxt',
        title: 'Vue.js & Nuxt',
        description: 'Zarif reaktivite modeli, temiz sözdizimi ve geliştirici ergonomisi.',
        badge: 'Geliştirici Dostu',
        iconName: 'Layers',
      },
      {
        id: 'opt-svelte-kit',
        title: 'Svelte & SvelteKit',
        description: 'Virtual DOM olmadan çalışan, hafif ve yıldırım hızında derleyici.',
        badge: 'Ultra Hafif',
        iconName: 'Zap',
      },
      {
        id: 'opt-rust-wasm',
        title: 'Rust & WebAssembly',
        description: 'Yüksek bellek güvenliği, sıfır maliyetli soyutlama ve ham CPU gücü.',
        badge: 'Maksimum Performans',
        iconName: 'Terminal',
      },
    ],
  },
  {
    id: 'cat-sports',
    title: 'Spor Kategorisi',
    description: 'Dünya çapında en çok tutku uyandıran ve adrenalin yaşatan spor branşı.',
    icon: 'Trophy',
    themeColor: 'emerald',
    options: [
      {
        id: 'opt-football',
        title: 'Futbol & Şampiyonlar Ligi',
        description: 'Milyonların ortak tutkusu, taktik mücadele ve unutulmaz geri dönüşler.',
        badge: 'Küresel Tutku',
        iconName: 'Activity',
      },
      {
        id: 'opt-f1',
        title: 'Formula 1',
        description: '350 km/s hız, pürüzsüz mühendislik, pit stratejisi ve pilot refleksleri.',
        badge: 'Mühendislik & Hız',
        iconName: 'Gauge',
      },
      {
        id: 'opt-basketball',
        title: 'Basketbol & NBA',
        description: 'Son saniye üçlükleri, dinamik smaçlar ve yüksek tempolu hücumlar.',
        badge: 'Yüksek Tempo',
        iconName: 'Flame',
      },
      {
        id: 'opt-tennis',
        title: 'Tenis & Grand Slam',
        description: 'Saatler süren zihinsel dayanıklılık, servisler ve kort zarafeti.',
        badge: 'Mental Güç',
        iconName: 'Target',
      },
    ],
  },
  {
    id: 'cat-ai',
    title: 'Yapay Zeka ve Gelecek Teknolojileri',
    description: 'Önümüzdeki 10 yılda dünyayı en köklü şekilde dönüştürecek teknolojik atılım.',
    icon: 'Brain',
    themeColor: 'amber',
    options: [
      {
        id: 'opt-llm',
        title: 'Multimodal LLM & Otonom Ajanlar',
        description: 'Dili, görüntüyü ve kodu anlayan akıllı çok modlu karar vericiler.',
        badge: 'Zeka Devrimi',
        iconName: 'Bot',
      },
      {
        id: 'opt-robotics',
        title: 'İnsansı Robotik & Fabrika Otomasyonu',
        description: 'Fiziksel dünyada çalışan genel amaçlı mekanik iş gücü.',
        badge: 'Fiziksel AI',
        iconName: 'Cog',
      },
      {
        id: 'opt-quantum',
        title: 'Kuantum Hesaplama & Kriptografi',
        description: 'Klasik bilgisayarların milyon yılda çözemeyeceği karmaşık hesaplamalar.',
        badge: 'Sınır Ötesi Bilim',
        iconName: 'Atom',
      },
      {
        id: 'opt-biotech',
        title: 'Biyoteknoloji & Genom Düzenleme',
        description: 'Hastalıkların genetik düzeyde tedavisi ve uzatılmış sağlıklı yaşam.',
        badge: 'Yaşam Bilimleri',
        iconName: 'HeartPulse',
      },
    ],
  },
];

export const INITIAL_VOTES: VoteRecord[] = [
  // Film votes
  { id: 'v1', categoryId: 'cat-films', optionId: 'opt-dune2', userId: 'user-enes', username: 'enes', timestamp: '2026-02-10T11:00:00.000Z' },
  { id: 'v2', categoryId: 'cat-films', optionId: 'opt-oppenheimer', userId: 'user-ayse', username: 'ayse', timestamp: '2026-02-10T12:00:00.000Z' },
  { id: 'v3', categoryId: 'cat-films', optionId: 'opt-interstellar', userId: 'user-mehmet', username: 'mehmet', timestamp: '2026-02-11T09:30:00.000Z' },
  { id: 'v4', categoryId: 'cat-films', optionId: 'opt-dune2', userId: 'user-zeynep', username: 'zeynep', timestamp: '2026-02-12T15:20:00.000Z' },
  { id: 'v5', categoryId: 'cat-films', optionId: 'opt-spiderverse', userId: 'user-can', username: 'can', timestamp: '2026-02-13T10:45:00.000Z' },

  // Tech votes
  { id: 'v6', categoryId: 'cat-tech', optionId: 'opt-react-next', userId: 'user-enes', username: 'enes', timestamp: '2026-02-10T11:05:00.000Z' },
  { id: 'v7', categoryId: 'cat-tech', optionId: 'opt-vue-nuxt', userId: 'user-ayse', username: 'ayse', timestamp: '2026-02-10T12:10:00.000Z' },
  { id: 'v8', categoryId: 'cat-tech', optionId: 'opt-react-next', userId: 'user-mehmet', username: 'mehmet', timestamp: '2026-02-11T09:35:00.000Z' },
  { id: 'v9', categoryId: 'cat-tech', optionId: 'opt-svelte-kit', userId: 'user-zeynep', username: 'zeynep', timestamp: '2026-02-12T15:25:00.000Z' },
  { id: 'v10', categoryId: 'cat-tech', optionId: 'opt-rust-wasm', userId: 'user-can', username: 'can', timestamp: '2026-02-13T10:50:00.000Z' },

  // Sports votes
  { id: 'v11', categoryId: 'cat-sports', optionId: 'opt-f1', userId: 'user-enes', username: 'enes', timestamp: '2026-02-10T11:10:00.000Z' },
  { id: 'v12', categoryId: 'cat-sports', optionId: 'opt-tennis', userId: 'user-ayse', username: 'ayse', timestamp: '2026-02-10T12:15:00.000Z' },
  { id: 'v13', categoryId: 'cat-sports', optionId: 'opt-football', userId: 'user-mehmet', username: 'mehmet', timestamp: '2026-02-11T09:40:00.000Z' },
  { id: 'v14', categoryId: 'cat-sports', optionId: 'opt-f1', userId: 'user-zeynep', username: 'zeynep', timestamp: '2026-02-12T15:30:00.000Z' },
  { id: 'v15', categoryId: 'cat-sports', optionId: 'opt-basketball', userId: 'user-can', username: 'can', timestamp: '2026-02-13T10:55:00.000Z' },

  // AI votes
  { id: 'v16', categoryId: 'cat-ai', optionId: 'opt-llm', userId: 'user-enes', username: 'enes', timestamp: '2026-02-10T11:15:00.000Z' },
  { id: 'v17', categoryId: 'cat-ai', optionId: 'opt-llm', userId: 'user-mehmet', username: 'mehmet', timestamp: '2026-02-11T09:45:00.000Z' },
  { id: 'v18', categoryId: 'cat-ai', optionId: 'opt-biotech', userId: 'user-ayse', username: 'ayse', timestamp: '2026-02-10T12:20:00.000Z' },
  { id: 'v19', categoryId: 'cat-ai', optionId: 'opt-robotics', userId: 'user-zeynep', username: 'zeynep', timestamp: '2026-02-12T15:35:00.000Z' },
];
