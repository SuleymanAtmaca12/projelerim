window.PROJECTS = [
  {
    id: "derin-ogrenme",
    title: "Derin Öğrenme",
    icon: "🧠",
    category: "Derin Öğrenme",
    badge: "Canlı demo",
    live: "demos/derin-ogrenme/index.html",
    folder: "derin_ogrenme",
    stack: ["HTML", "CSS", "JavaScript"],
    description: "Nöron, katman, ağırlık, bias, forward, backprop ve CNN kavramlarını interaktif anlatan eğitim sitesi.",
    story: "Sınıfta derin öğrenmeyi slaytla değil, oynanabilir sahnelerle anlatmak için yapıldı. 13 bölüm, her biri görsel ve kodla.",
    points: [
      "Nöron matematiği ve veri akışı",
      "Ağırlık, bias, aktivasyon, loss",
      "Forward / backward pass sezgisi",
      "CNN ile görüntüye geçiş"
    ]
  },
  {
    id: "derin-ogrenme-tf",
    title: "Derin Öğrenme + TensorFlow",
    icon: "📐",
    category: "Derin Öğrenme",
    badge: "Canlı demo",
    live: "demos/derin-ogrenme-tf/index.html",
    folder: "derin_ogrenme_tensorflow",
    stack: ["HTML", "CSS", "JavaScript", "TensorFlow kod örnekleri"],
    description: "Aynı eğitim akışı; her bölümde TensorFlow ile nasıl yazıldığını gösteren kod blokları var.",
    story: "Kavramı gördükten sonra kodun nasıl durduğunu göstermek için TensorFlow örnekleri eklendi.",
    points: [
      "Aynı 13 bölümlük anlatım",
      "tf.keras katman ve model örnekleri",
      "Eğitim döngüsü ve loss",
      "CNN kod iskeleti"
    ]
  },
  {
    id: "mnist",
    title: "MNIST Rakam Tanıma",
    icon: "✍️",
    category: "Derin Öğrenme",
    badge: "Canlı arayüz",
    live: "demos/mnist/index.html",
    folder: "mnist_web",
    stack: ["Python", "Flask", "TensorFlow", "CNN", "Canvas API"],
    description: "Tarayıcıya rakam çiziyorsun; CNN 0–9 tahmini, güven skoru ve 10 sınıf olasılığını gösteriyor.",
    story: "MNIST’i sadece notebook’ta bırakmamak için canvas + Flask API + Keras modeli bir web demosuna dönüştürüldü. Çizim, MNIST formatına (28×28, ortalanmış, yumuşatılmış) çevriliyor.",
    points: [
      "Kendi eğitilmiş mnist_cnn.keras modeli",
      "Bounding box, center of mass, Gaussian blur",
      "Olasılık çubukları ve 28×28 önizleme"
    ]
  },
  {
    id: "meyve",
    title: "Akıllı Sebze Kasa",
    icon: "🥕",
    category: "Derin Öğrenme",
    badge: "Canlı arayüz",
    live: "demos/meyve/index.html",
    folder: "ders_meyve",
    stack: ["Python", "Flask", "TensorFlow", "Transfer learning"],
    description: "Sebze görseli yükle veya URL ver; model sınıfı, güveni ve fiyatı döndürür.",
    story: "Görüntü sınıflandırmayı kasa / fiyat senaryosuna bağlayan ders projesi. Düşük güvende ‘model emin değil’ uyarısı verir.",
    points: [
      "Havuç, patates, domates, salatalık, biber",
      "224×224 giriş, Keras .keras model",
      "Dosya yükleme veya görsel URL",
      "Güven eşiği ile kontrollü tahmin"
    ]
  },
  {
    id: "transfer",
    title: "Transfer Learning",
    icon: "🍔",
    category: "Derin Öğrenme",
    badge: "Kaynak kod",
    live: null,
    folder: "transfer_learning",
    stack: ["Python", "Flask", "MobileNetV2", "Keras"],
    description: "Aynı fotoğrafı hazır ImageNet modeli ile fine-tune edilmiş yemek modeli yan yana karşılaştırır.",
    story: "Transfer learning’in ‘önce / sonra’ farkını göstermek için iki kafa aynı görsele bakıyor: genel ImageNet etiketleri ve sizin sınıflarınız.",
    points: [
      "Hazır MobileNetV2 (ImageNet)",
      "Özel eğitilmiş yemek modeli",
      "Top-5 skor karşılaştırması",
      "Yüklenen görsel önizlemesi"
    ]
  },
  {
    id: "kumeleme",
    title: "RFM & Sepet Analizi",
    icon: "🛒",
    category: "Veri Bilimi",
    badge: "Canlı arayüz",
    live: "demos/kumeleme/index.html",
    folder: "fis_kumeleme",
    stack: ["Python", "Flask", "scikit-learn", "K-Means", "Apriori"],
    description: "Perakende verisinde müşteri kümeleri, RFM tahmini ve ‘bunu alanlar şunu da aldı’ kuralları.",
    story: "Denetimsiz öğrenme + birliktelik kurallarını tek dashboard’da birleştiren analitik proje. VIP, riskli ve aktif segmentler insan dilinde anlatılıyor.",
    points: [
      "Recency / Frequency / Monetary",
      "K-Means küme kartları ve grafikler",
      "Yeni müşteri için küme tahmini",
      "Market basket önerileri (lift / confidence)"
    ]
  },
  {
    id: "berber",
    title: "Berber Asistan",
    icon: "💈",
    category: "Agent & LLM",
    badge: "Canlı arayüz",
    live: "demos/berber/index.html",
    extraPages: [
      { label: "Sohbet", url: "demos/berber/index.html" },
      { label: "Admin", url: "demos/berber/admin.html" }
    ],
    folder: "berber_projesi",
    stack: ["Python", "Flask", "SQLite", "LM Studio", "Tool calling"],
    description: "Berber randevusu alan sohbet asistanı ve admin randevu listesi.",
    story: "Doğal dil ile hizmet, berber, saat seçip kaydı veritabanına yazan akış. Sınıfta ‘agent + state + DB’ üçlüsünü göstermek için duruyor.",
    points: [
      "Sohbet arayüzü ve session state",
      "Randevu kaydı SQLite’da",
      "Admin tablosu",
      "Yerel Qwen / LM Studio"
    ]
  },
  {
    id: "disci",
    title: "Dişçi Asistan",
    icon: "🦷",
    category: "Agent & LLM",
    badge: "Canlı arayüz",
    live: "demos/disci/index.html",
    extraPages: [
      { label: "Sohbet", url: "demos/disci/index.html" }
    ],
    folder: "disci_asistan",
    stack: ["Python", "Flask", "SQLite", "OpenAI tools", "LM Studio"],
    description: "Fiyat, müsait slot ve randevu kaydı için tool kullanan klinik asistanı.",
    story: "Model ezbere tarih uydurmasın diye takvim, fiyat ve kayıt işleri tool’lara bırakıldı. Onay gelince kayıt LLM’e güvenilmeden DB’ye yazılıyor.",
    points: [
      "get_price_list / find_available_blocks / save_booking",
      "Doktor ve slot gerçeği veritabanından",
      "Web sohbet + orijinal CLI",
      "LM Studio tool calling"
    ]
  },
  {
    id: "finans",
    title: "Finans Multi-Agent",
    icon: "📈",
    category: "Agent & LLM",
    badge: "Kaynak kod",
    live: null,
    folder: "llm_agent",
    stack: ["Python", "Flask", "Multi-agent", "Gemini", "Qwen"],
    description: "Investing linkinden analiz zinciri; sohbet tarafında yerel Qwen veya Gemini.",
    story: "Tek agent yerine tarayıcı, çıkarım, analiz, SQL/RAG ve rapor ajanları manager üzerinden sırayla çalışıyor. Sonuçlar SQLite’a düşüyor.",
    points: [
      "URL’den şirket / fiyat / teknik veri",
      "Manager agent orkestrasyonu",
      "Kayıt geçmişi ekranda",
      "İki model seçeneği: Qwen ve Gemini"
    ]
  },
  {
    id: "startup",
    title: "Startup Builder",
    icon: "🚀",
    category: "Agent & LLM",
    badge: "Kaynak kod",
    live: null,
    folder: "sirket_agent",
    stack: ["Python", "Streamlit", "Multi-agent", "Tools", "PDF"],
    description: "Trend → CEO → CTO → CFO → Marketing → Investor → Roadmap toplantısı ve PDF rapor.",
    story: "Bir fikir yazıyorsun; her agent kendi tool’uyla (arama, rakip, fiyat, GitHub, finans varsayımları) katkı koyup sonrakine devrediyor.",
    points: [
      "7 agentlik sıra",
      "CFO parametreleri arayüzden",
      "Qwen3 / Gemini seçimi",
      "PDF rapor indirme"
    ]
  },
  {
    id: "rag-local",
    title: "RAG (LangChain'siz)",
    icon: "📚",
    category: "Agent & LLM",
    badge: "Kaynak kod",
    live: null,
    folder: "no_langchain_rag_project",
    stack: ["Python", "Streamlit", "ChromaDB", "Sentence Transformers", "LM Studio"],
    description: "PDF / TXT / DOCX yükle, parçala, göm, ChromaDB’ye yaz; soruya kaynak göstererek cevap ver.",
    story: "RAG’i kara kutu kütüphane olmadan anlatmak için her adım ayrı agent: upload, document, chunk, embedding, vector store, retriever, memory, answer.",
    points: [
      "LangChain yok, sınıflar düz Python",
      "Kaynak parçaları sağ kolonda",
      "Sohbet hafızası",
      "Yerel embedding + yerel LLM"
    ]
  },
  {
    id: "rag-langchain",
    title: "RAG (LangChain)",
    icon: "🔗",
    category: "Agent & LLM",
    badge: "Kaynak kod",
    live: null,
    folder: "rag",
    stack: ["Python", "Streamlit", "LangChain", "Chroma", "HuggingFace"],
    description: "Aynı RAG fikri LangChain loader, splitter, retriever ve Chroma ile.",
    story: "LangChain’siz sürümle yan yana koyunca ‘framework neyi gizler, neyi hızlandırır’ sorusu netleşiyor.",
    points: [
      "PyPDF / Text / Docx loader",
      "RecursiveCharacterTextSplitter",
      "LangChain retriever + Chroma",
      "Karşılaştırma için kardeş proje: no_langchain_rag_project"
    ]
  },
  {
    id: "clinic-saas",
    title: "Smart Clinic SaaS",
    icon: "🏥",
    category: "Agent & LLM",
    badge: "Canlı arayüz",
    live: "demos/clinic/landing.html",
    extraPages: [
      { label: "Landing", url: "demos/clinic/landing.html" },
      { label: "Dashboard", url: "demos/clinic/dashboard.html" },
      { label: "Login", url: "demos/clinic/login.html" }
    ],
    folder: "assistan_Saas",
    stack: ["FastAPI", "HTML/CSS/JS", "WebSocket", "JWT", "LM Studio"],
    description: "Landing, AI randevu widget’ı ve admin paneli olan klinik SaaS arayüzü.",
    story: "Bu sekmede arayüz canlı. Gerçek randevu API’si ve model yerelde çalışır; kaynak kod herkese açık yüklenmez.",
    points: [
      "Hasta landing + floating chat widget",
      "Admin dashboard, takvim, doktorlar",
      "Admin dashboard, takvim, doktorlar"
    ]
  }
];
