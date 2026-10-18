/**
 * A1 GRAND THE CONVENTION - Interactive Luxury Engine
 * White theme · multi-page
 * Featuring vivid colorful original photography and Italian typography
 */

function initA1App() {
  // The site is split across several pages, each module runs independently
  [
    initIntroAnimation, initHeroShowcase, initNavbar, initGallery, initLightbox, initHomeGalleryFlow, initPhotoUploader,
    initSpaceTabs, initFloorplanVisualizer, initFloorplanExploreSlider, initHallWiseFloorplans, initCateringBuilder, initMuhurthamCalendar,
    initDecorThemes, initBrochureModal, initCalculator, initInquiryForm
  ].forEach((fn) => {
    try { if (typeof fn === 'function') fn(); } catch (err) { console.warn((fn.name || 'module') + ' skipped:', err.message); }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initA1App);
} else {
  initA1App();
}

/* ==========================================================================
   1. Interactive Real Venue Showcase Carousel (Hero Section)
   Featuring authentic photographs: Royal Mandap, Gourmet Spread,
   Enchanted Outdoor Lawn, and Grand Ballroom. Zero particles.
   ========================================================================== */
const heroVenueSlides = [
  {
    idx: 0,
    pill: "Royal Wedding Mandap",
    title: "Royal Mandap & Grand Stage",
    subtitle: "Authentic A1 Grand Floral Kalyana Mandapam Setup",
    imgSrc: "assets/images/real_wedding_mandap_authentic.jpg?v=3",
    galleryIdx: 3,
    specs: [
      { label: "Stage Dimensions", val: "60 Ft Wide" },
      { label: "Ambiance", val: "Fresh Floral Canopy" },
      { label: "Guest View", val: "Pillar-Free 360°" }
    ]
  },
  {
    idx: 1,
    pill: "Gourmet Live Spread",
    title: "Gourmet Live Spread & Banqueting",
    subtitle: "Authentic AC Banquet Dining Hall with Round Table Setups",
    imgSrc: "assets/images/banquet_dining_authentic.jpg",
    galleryIdx: 4,
    specs: [
      { label: "Dining Capacity", val: "800+ Seated" },
      { label: "Layout", val: "Round Tables" },
      { label: "Kitchens", val: "Dedicated Dual" }
    ]
  },
  {
    idx: 2,
    pill: "VIP Bridal Suite",
    title: "Luxury Presidential Bridal Suite",
    subtitle: "Authentic AC Bedroom Suite with Double Bed & Dressing Comfort",
    imgSrc: "assets/images/bridal_suite_authentic.jpg",
    galleryIdx: 6,
    specs: [
      { label: "Suites", val: "4 Private AC Rooms" },
      { label: "Bed Setup", val: "Double Bed & Linens" },
      { label: "Amenities", val: "Attached Bath & TV" }
    ]
  },
  {
    idx: 3,
    pill: "Main Hall · Indoor Space",
    title: "Main Hall (Indoor Space)",
    subtitle: "Suitable for you · 300 to 2,500 Capacity · Central AC (Yes)",
    imgSrc: "assets/images/real_convention_hall_hd.jpg",
    galleryIdx: 1,
    specs: [
      { label: "Capacity", val: "300 – 2,500" },
      { label: "Seating", val: "1,500 Seated" },
      { label: "Per Plate", val: "from ₹1,200/veg" }
    ]
  }
];

let currentHeroSlideIdx = 0;
let heroSlideTimer = null;
let heroProgressAnim = null;

function initHeroShowcase() {
  const tabs = document.querySelectorAll('.hero-tab-pill');
  const mediaContainer = document.getElementById('heroMediaContainer');
  const showcaseImg = document.getElementById('heroShowcaseImg');
  const venuePill = document.getElementById('heroVenuePill');
  const title = document.getElementById('heroShowcaseTitle');
  const subtitle = document.getElementById('heroShowcaseSubtitle');
  const progressBar = document.getElementById('heroProgressBar');

  if (!mediaContainer || !showcaseImg) return;

  function setSlide(idx) {
    currentHeroSlideIdx = idx;
    const slide = heroVenueSlides[idx];
    if (!slide) return;

    // Update Tab states
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === idx);
    });

    // Fade transition on image
    showcaseImg.classList.add('fade-out');
    setTimeout(() => {
      showcaseImg.src = slide.imgSrc;
      showcaseImg.alt = slide.title;
      showcaseImg.classList.remove('fade-out');
    }, 200);

    // Update labels and text
    if (venuePill) venuePill.textContent = slide.pill;
    if (title) title.textContent = slide.title;
    if (subtitle) subtitle.textContent = slide.subtitle;

    // Update specs
    slide.specs.forEach((spec, i) => {
      const lbl = document.getElementById(`heroDetailLabel${i + 1}`);
      const val = document.getElementById(`heroDetailVal${i + 1}`);
      if (lbl) lbl.textContent = spec.label;
      if (val) val.textContent = spec.val;
    });

    startProgress();
  }

  function startProgress() {
    if (heroProgressAnim) clearInterval(heroProgressAnim);
    if (heroSlideTimer) clearTimeout(heroSlideTimer);

    if (progressBar) progressBar.style.width = '0%';
    const duration = 5000;
    const interval = 50;
    let elapsed = 0;

    heroProgressAnim = setInterval(() => {
      elapsed += interval;
      const pct = Math.min(100, (elapsed / duration) * 100);
      if (progressBar) progressBar.style.width = pct + '%';
    }, interval);

    heroSlideTimer = setTimeout(() => {
      const nextIdx = (currentHeroSlideIdx + 1) % heroVenueSlides.length;
      setSlide(nextIdx);
    }, duration);
  }

  // Click on tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(tab.getAttribute('data-idx') || '0', 10);
      setSlide(idx);
    });
  });

  // Clicking showcase image opens corresponding photo in lightbox
  mediaContainer.addEventListener('click', () => {
    const slide = heroVenueSlides[currentHeroSlideIdx];
    if (slide && window.openLightboxByIndex) {
      window.openLightboxByIndex(slide.galleryIdx);
    }
  });

  // Pause on hover
  mediaContainer.addEventListener('mouseenter', () => {
    if (heroSlideTimer) clearTimeout(heroSlideTimer);
    if (heroProgressAnim) clearInterval(heroProgressAnim);
  });

  mediaContainer.addEventListener('mouseleave', () => {
    startProgress();
  });

  // Start initial slide
  setSlide(0);
}

/* ==========================================================================
   2. Navigation
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  let isScrolled = false;
  let ticking = false;

  const updateScroll = () => {
    if (!navbar) return;
    const sy = window.scrollY || window.pageYOffset;
    if (!isScrolled && sy > 50) {
      isScrolled = true;
      navbar.classList.add('scrolled');
    } else if (isScrolled && sy < 20) {
      isScrolled = false;
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateScroll();

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }
}

/* ==========================================================================
   3. Gallery & Lightbox (Photos in Rich Colorful Splendor)
   ========================================================================== */
const defaultGalleryData = [
  {
    "id": 1,
    "title": "Main Convention Hall Interior",
    "category": "original",
    "categoryLabel": "Convention Hall",
    "isAuthentic": true,
    "imgSrc": "assets/images/real_convention_hall_hd.jpg",
    "caption": "Authentic view featuring coffered acoustic ceiling, reflective Italian flooring, and banquet seating setup.",
    "specs": "Capacity: 1,800+ | Pillar-Free | Central AC"
  },
  {
    "id": 2,
    "title": "Grand Entrance Portico & Facade",
    "category": "ballroom",
    "categoryLabel": "Portico & Driveway",
    "isAuthentic": true,
    "imgSrc": "assets/images/grand_entrance_portico_authentic.jpg",
    "caption": "Towering wood-paneled pillars, covered arrival canopy, red carpet walkway, and modern glass facade.",
    "specs": "Rushikonda Beach Road | 400+ Car Valet Concourse"
  },
  {
    "id": 3,
    "title": "Royal Wedding Mandap & Stage",
    "category": "decor",
    "categoryLabel": "Wedding Mandap",
    "isAuthentic": true,
    "imgSrc": "assets/images/real_wedding_mandap_authentic.jpg?v=3",
    "caption": "Authentic floral canopy pillars, crystal chandeliers, red velvet bridal seating, and stage illumination.",
    "specs": "Verified A1 Grand Mandap | 60ft Wide Stage | Central AC"
  },
  {
    "id": 4,
    "title": "Gourmet Live Spread & Banqueting",
    "category": "dining",
    "categoryLabel": "Dining Pavilion",
    "isAuthentic": true,
    "imgSrc": "assets/images/banquet_dining_authentic.jpg",
    "caption": "Authentic AC banquet dining pavilion with round table setups, crisp linens, and 800+ dining capacity.",
    "specs": "800+ Seated Dining | Central AC | Dedicated Kitchens"
  },
  {
    "id": 6,
    "title": "Luxury Presidential Bridal Suite",
    "category": "suites",
    "categoryLabel": "VIP Bridal Suite",
    "isAuthentic": true,
    "imgSrc": "assets/images/bridal_suite_authentic.jpg",
    "caption": "Authentic air-conditioned bridal bedroom suite with double bed, attached private bath, and dressing amenities.",
    "specs": "Verified A1 Grand Suite | Private AC Suite | Attached Restroom"
  },
  {
    "id": 8,
    "title": "Main Hall Theater Seating Layout",
    "category": "ballroom",
    "categoryLabel": "Seating Layout",
    "isAuthentic": true,
    "imgSrc": "assets/images/floorplan_theater_seating_layout.jpg",
    "caption": "1,500 seated banquet layout with wide central procession aisle and pillar-free sightlines.",
    "specs": "Capacity: 1,500 Seated | Pillar-Free Sightlines"
  },
  {
    "id": 9,
    "title": "Grand Stage & Hall Perspective",
    "category": "ballroom",
    "categoryLabel": "Stage & Architecture",
    "isAuthentic": true,
    "imgSrc": "assets/images/floorplan_wide_perspective_hall.jpg",
    "caption": "Wide-angle perspective of the 60ft elevated stage and unobstructed 2,500-capacity convention hall.",
    "specs": "60ft × 25ft Elevated Stage | Dual Side Ramps"
  },
  {
    "id": 10,
    "title": "Authentic Kalyana Mandapam Stage",
    "category": "decor",
    "categoryLabel": "Stage Decor",
    "isAuthentic": true,
    "imgSrc": "assets/images/floorplan_stage_mandap_authentic.jpg",
    "caption": "Real wedding mandapam with tiered floral stage steps, royal settee, and traditional rangoli carpet.",
    "specs": "60ft Decorated Stage | Fresh Floral Accents"
  },
  {
    "id": 11,
    "title": "Glass Elevator & Modern Marble Staircase",
    "category": "original",
    "categoryLabel": "Interior Architecture",
    "isAuthentic": true,
    "imgSrc": "assets/images/glass_elevator_staircase_authentic.jpg",
    "caption": "Modern glass passenger elevator, stainless steel railings, and polished granite staircase connecting hall levels.",
    "specs": "High-Capacity Glass Elevator | Granite Staircase"
  },
  {
    "id": 12,
    "title": "Traditional Floral Entrance Portal & Festive Decor",
    "category": "decor",
    "categoryLabel": "Welcome Entrance",
    "isAuthentic": true,
    "imgSrc": "assets/images/floral_entrance_portal_authentic.jpg",
    "caption": "Festive welcome arch with fresh flower garland headers, yellow marigold cascades, festive umbrellas, and traditional rangoli.",
    "specs": "Grand Entrance Foyer | Floral Welcoming Arch"
  },
  {
    "id": 13,
    "title": "A1 Grand The Convention - Night Illumination",
    "category": "original",
    "categoryLabel": "Exterior Night View",
    "isAuthentic": true,
    "imgSrc": "assets/images/building_exterior_night_authentic.jpg",
    "caption": "Stunning night view of the illuminated A1 Grand facade with warm wood-panel textures and glowing signage.",
    "specs": "Night Illumination | Landmark Rushikonda Architecture"
  },
  {
    "id": 14,
    "title": "A1 Grand Landmark Convention Complex & Boulevard",
    "category": "original",
    "categoryLabel": "Venue Campus",
    "isAuthentic": true,
    "imgSrc": "assets/images/complex_wide_facade_authentic.jpg",
    "caption": "Panoramic daytime view of the multi-acre A1 Grand convention complex along the Rushikonda scenic corridor.",
    "specs": "Expansive Campus | Sprawling Frontage"
  },
  {
    "id": 15,
    "title": "Presidential Guest Wing & Private Entrance",
    "category": "suites",
    "categoryLabel": "VIP Guest Wing",
    "isAuthentic": true,
    "imgSrc": "assets/images/suite_wing_exterior_authentic.jpg",
    "caption": "Dedicated presidential VIP guest wing with private parking portico, gated courtyard, and lush palm landscape.",
    "specs": "Private VIP Wing | Dedicated Gated Access"
  }
];

let activeGalleryCategory = 'all';

function initGallery() {
  renderGallery();

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGalleryCategory = btn.getAttribute('data-filter');
      renderGallery();
    });
  });

  initLightbox();
}

function renderGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  const savedUserPhotos = JSON.parse(localStorage.getItem('a1_grand_custom_photos') || '[]');
  const allPhotos = [...savedUserPhotos, ...defaultGalleryData];
  const filtered = activeGalleryCategory === 'all'
    ? allPhotos
    : allPhotos.filter(item => item.category === activeGalleryCategory);

  container.innerHTML = filtered.map(item => {
    const isFeatured = item.isAuthentic ? 'featured-real' : '';
    return `
      <div class="gallery-card ${isFeatured}" onclick="openLightboxByIndex(${item.id})">
        <div class="gallery-img-box">
          <img src="${item.imgSrc}" alt="${item.title}" loading="lazy" />
          <div class="badge-overlay">
            ${item.isAuthentic ? '<span class="photo-badge badge-authentic"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Original Venue Photo</span>' : ''}
            <span class="photo-badge badge-category">${item.categoryLabel}</span>
          </div>
          <div class="gallery-overlay-btn">
            <div class="zoom-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </div>
          </div>
        </div>
        <div class="gallery-card-content">
          <div class="gallery-card-header">
            <h4 class="gallery-title">${item.title}</h4>
            <p class="gallery-caption">${item.caption}</p>
          </div>
          <div class="gallery-specs">
            <span>${item.specs}</span>
            <span style="color: #ffffff; font-weight: 600;">View HD &rarr;</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initLightbox() {
  if (window.__lbInit) return;
  window.__lbInit = true;
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxClose');
  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

window.openLightboxByIndex = function (id) {
  const savedUserPhotos = JSON.parse(localStorage.getItem('a1_grand_custom_photos') || '[]');
  const allPhotos = [...savedUserPhotos, ...defaultGalleryData];
  const item = allPhotos.find(p => p.id === id) || allPhotos[0];

  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalCaption = document.getElementById('lightboxCaption');
  const modalBadge = document.getElementById('lightboxBadge');

  if (modal && modalImg) {
    modalImg.src = item.imgSrc;
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalCaption) modalCaption.textContent = item.caption;
    if (modalBadge) {
      modalBadge.innerHTML = item.isAuthentic
        ? '<span class="photo-badge badge-authentic">Verified Original Venue Photo</span>'
        : `<span class="photo-badge badge-category">${item.categoryLabel}</span>`;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeLightbox = function () {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   Home Page Flowing Slideshow Gallery Engine
   - Left-to-Right Continuous Animation
   - Cursor Hover Pauses Flow
   - Click to Pop Up Photo in HD Lightbox
   ========================================================================== */
function initHomeGalleryFlow() {
  const container = document.getElementById('homeGalleryContainer');
  const track = document.getElementById('homeGalleryTrack');
  if (!container || !track) return;

  // Ensure Lightbox handlers are wired up
  initLightbox();

  const pauseFlow = () => track.classList.add('is-paused');
  const resumeFlow = () => track.classList.remove('is-paused');

  container.addEventListener('mouseenter', pauseFlow);
  container.addEventListener('mouseleave', resumeFlow);
  container.addEventListener('pointerenter', pauseFlow);
  container.addEventListener('pointerleave', resumeFlow);

  container.addEventListener('touchstart', pauseFlow, { passive: true });
  container.addEventListener('touchend', resumeFlow, { passive: true });
}

/* ==========================================================================
   4. User Photo Uploader (Drag & Drop + Persistence)
   ========================================================================== */
function initPhotoUploader() {
  const uploadInput = document.getElementById('photoUploadInput');
  const uploadBtn = document.getElementById('triggerUploadBtn');

  if (!uploadInput || !uploadBtn) return;

  uploadBtn.addEventListener('click', () => uploadInput.click());

  uploadInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let loadedCount = 0;
    const newItems = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const customPhoto = {
          id: Date.now() + Math.random(),
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
          category: 'original',
          categoryLabel: 'Original Photo',
          isAuthentic: true,
          imgSrc: event.target.result,
          caption: "Authentic photograph of A1 Grand The Convention uploaded for gallery review.",
          specs: "Venue Photography | High Resolution"
        };
        newItems.push(customPhoto);
        loadedCount++;

        if (loadedCount === files.length) {
          const existing = JSON.parse(localStorage.getItem('a1_grand_custom_photos') || '[]');
          const updated = [...newItems, ...existing];
          localStorage.setItem('a1_grand_custom_photos', JSON.stringify(updated));
          renderGallery();
          showToast(`Successfully added ${newItems.length} original photo(s) to the gallery!`);
        }
      };
      reader.readAsDataURL(file);
    });
  });
}

/* ==========================================================================
   5. Space Explorer Tabs
   ========================================================================== */
function initSpaceTabs() {
  const tabBtns = document.querySelectorAll('.space-tab-btn');
  const cards = document.querySelectorAll('.space-detail-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSpace = btn.getAttribute('data-space');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        if (card.getAttribute('id') === `space-${targetSpace}`) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Interactive Seating & Floorplan Planner - Monochrome & Navy
   ========================================================================== */
const zoneDetails = {
  stage: {
    title: "Grand Mandap & Main Stage",
    badge: "60ft × 25ft High-Truss Stage",
    desc: "Elevated 4 feet with dual side ramps and red carpet steps. Accommodates expansive floral mandapams, orchestra, or corporate keynote podiums with clear visibility from all angles.",
    metrics: { "Max Load": "5,000 kg", "Power": "63A 3-Phase", "Backdrop": "4K P3.9 LED", "Sightline": "100% Unobstructed" }
  },
  hall: {
    title: "Main Hall (Indoor Space)",
    badge: "Suitable for you · 300 to 2,500 People",
    desc: "100% Indoor Space with central air conditioning. Special features include provision of LCD display screens throughout the Centre, in-floor service pits with power/data/telephone lines, and dynamic corporate or conference theming capabilities.",
    metrics: { "Capacity": "300 – 2,500", "Seating": "1,500 Seated", "AC": "Yes (Central HVAC)", "Per Plate": "from ₹1,200" }
  },
  seating: {
    title: "Guest Banquet & Seating Zone",
    badge: "1,500 Seating Capacity",
    desc: "Comfortably accommodates up to 1,500 guests in theater style, or 900 guests across 90 round banquet tables with wide central aisle for grand wedding processions and corporate delegations.",
    metrics: { "Seating Capacity": "1,500 People", "Floating": "2,500 Max", "Chairs": "Chiavari / Executive", "Flooring": "Polished Marble" }
  },
  dining: {
    title: "Dining Pavilion Concourse",
    badge: "Double Access Portals",
    desc: "Three oversized sound-insulated acoustic doors open directly into the separate Imperial Dining Pavilion, facilitating concurrent multi-course catering without aroma bleed.",
    metrics: { "Door Width": "16 Feet (Each)", "Guest Flow": "400/min", "Dining Capacity": "800 Seated", "Kitchens": "Dual Separate" }
  },
  av: {
    title: "Concert AV & Lighting Control Desk",
    badge: "Central Audio-Visual Deck",
    desc: "Elevated control station for audio mixing, intelligent moving head beams, haze machines, and master HDMI switcher for the stage LED wall.",
    metrics: { "Audio Channels": "32 Digital", "DMX Lighting": "512 Channels", "Power Feed": "Dedicated UPS", "Live Stream": "Fibre Internet" }
  },
  suites: {
    title: "VIP Executive & Bridal Green Rooms",
    badge: "4 Private AC Suites",
    desc: "Direct private backstage access for bride and groom with illuminated vanity mirrors, private attached bathrooms, and lockable security cabinets.",
    metrics: { "Suites": "4 Dedicated", "AC Units": "Independent 2TR", "Bathrooms": "Attached Western", "Access": "Keycard Backstage" }
  }
};

function initFloorplanVisualizer() {
  const pills = document.querySelectorAll('.layout-pill-btn');
  const wrapper = document.getElementById('floorplanSvgWrapper');
  if (!wrapper || pills.length === 0) return;
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const layout = pill.getAttribute('data-layout');
      renderFloorplanSvg(layout);
    });
  });
  renderFloorplanSvg('banquet');
}

function renderFloorplanSvg(layout) {
  const wrapper = document.getElementById('floorplanSvgWrapper');
  if (!wrapper) return;
}

window.selectZone = function (zoneKey) {
  const data = (typeof zoneDetails !== 'undefined' && zoneDetails[zoneKey]) || {};
  const card = document.getElementById('selectedZoneCard');
  if (!card) return;
  card.innerHTML = `
    <span class="zone-badge">${data.badge || ''}</span>
    <h4 class="zone-title">${data.title || ''}</h4>
    <p class="zone-desc">${data.desc || ''}</p>
  `;
};

/* ==========================================================================
   6. Hall-Wise Venue Architecture & Interactive Information Modal
   ========================================================================== */
const venueHallsData = {
  'main-hall': {
    id: 'main-hall',
    name: 'Main Hall (Indoor Convention Space)',
    badge: 'Premier Hall · Pillar-Free',
    subtitle: 'Suitable for you · 300 to 2,500 Capacity · Central AC (Yes)',
    gallery: [
      { src: 'assets/images/floorplan_theater_seating_layout.jpg', caption: 'Theater Seating Layout (1,500 Seated Banquet Rows)' },
      { src: 'assets/images/floorplan_wide_perspective_hall.jpg', caption: '60ft Elevated Stage & Pillar-Free Unobstructed Sightlines' },
      { src: 'assets/images/floorplan_stage_mandap_authentic.jpg', caption: 'Authentic Kalyana Mandapam Stage with Floral Canopy' },
      { src: 'assets/images/real_convention_hall_hd.jpg', caption: 'Italian Marble Flooring & Acoustic Coffered Ceiling' }
    ],
    overview: 'The Main Hall is Visakhapatnam\'s grandest indoor convention venue, designed with zero pillars to guarantee 100% unobstructed visibility from every seat. Equipped with high-output central air conditioning, custom acoustic drop ceilings, a colossal 60-foot wide elevated stage, and a 4K backdrop LED wall, it effortlessly accommodates grand Telugu weddings, royal receptions, muhurtham ceremonies, and international delegations.',
    specs: [
      { label: 'Seating Capacity', val: '1,500 Seated (Theater/Banquet)' },
      { label: 'Floating Capacity', val: '2,500 Guests Max' },
      { label: 'Stage Dimensions', val: '60 Ft Wide × 25 Ft Deep (4ft Elevated)' },
      { label: 'Ceiling Height', val: '24 Ft Clear Height (High Truss)' },
      { label: 'Air Conditioning', val: '100% Central AC with Multi-Zone Control' },
      { label: 'Sightlines', val: '100% Pillar-Free (Zero Obstruction)' },
      { label: 'AV & Tech', val: '60ft 4K LED Screen + Line-Array Concert Audio' },
      { label: 'Dining Access', val: '3 Direct Concourse Portals to Dining Pavilion' },
      { label: 'Per Plate Rate', val: 'Veg from ₹1,200 · Non-Veg from ₹1,300' },
      { label: 'Power Backup', val: '100% Dual DG Sync Backup (Zero Delay)' }
    ],
    amenities: [
      'Colossal 60ft stage with dual wheelchair/bridal ramps & red carpet stairs',
      'Panoramic 4K Ultra-HD stage LED video wall for live telecasts',
      'Italian coffered acoustic ceiling with ambient warm-dim LED chandeliers',
      'Direct backstage keycard access to 4 private bridal and groom dressing suites',
      'Concealed in-floor electrical service pits for decor and media wiring',
      'Separate sound-dampened concourses leading to the dining pavilion'
    ],
    whatsappMsg: 'Hi A1 Grand, I am interested in booking the Main Hall (Indoor Convention Space). Please share availability and packages.'
  },
  'coastal-lawn': {
    id: 'coastal-lawn',
    name: 'Royal Coastal Lawn (Open-Air)',
    badge: '18,000 Sq.Ft · Oceanfront',
    subtitle: 'Suitable for 800 to 1,500+ Guests · Rushikonda Sea Breeze',
    gallery: [
      { src: 'assets/images/outdoor_lawn_evening_1792227047846.jpg', caption: 'Fairy-Lit Coastal Lawn at Dusk with Rushikonda Sea Breeze' }
    ],
    overview: 'Spanning 18,000 square feet beside the Rushikonda coastline, the Royal Coastal Lawn offers a magical open-air setting under starry skies. Cooled by gentle evening ocean breezes and illuminated with canopy fairy lighting, this venue is ideal for twilight receptions, vibrant sangeets, cocktail dinners, and mehendi carnivals.',
    specs: [
      { label: 'Lawn Area', val: '18,000 Sq.Ft Manicured Grass' },
      { label: 'Guest Capacity', val: '800 to 1,500+ Guests' },
      { label: 'Setting', val: 'Open-Air Coastal Lawn with Sea View' },
      { label: 'Lighting', val: 'Canopy Warm Fairy Lights & Perimeter Focus Beams' },
      { label: 'Food Counters', val: 'Dedicated Live Barbecue, Tawa & Chaat Islands' },
      { label: 'Bridal Pathway', val: 'Paved Stone Procession Aisle with Floral Bollards' },
      { label: 'Sound Zoning', val: 'Independent Open-Air Sound & DJ System' },
      { label: 'Restrooms', val: 'Dedicated Exterior Luxury Restroom Blocks' },
      { label: 'Power Feed', val: 'Heavy Duty 3-Phase Outdoor Distribution' },
      { label: 'Weather Prep', val: 'Weatherproof Canopy & Monsoon Tarpaulin Ready' }
    ],
    amenities: [
      'Manicured Bermuda grass lawn with paved pathways for high heels and bridal gowns',
      'Enchanting canopy of golden fairy lighting creating a romantic dusk glow',
      'Gentle Bay of Bengal coastal sea breeze from Rushikonda Beach Road',
      'Spacious perimeter zoning for live tawa, kebab, and dessert interactive stalls',
      'Open dance floor space with heavy-duty acoustic sound zoning',
      'Direct paved vehicle and VIP drop-off connection to the lawn entrance'
    ],
    whatsappMsg: 'Hi A1 Grand, I am interested in booking the Royal Coastal Lawn for an open-air wedding/reception. Please share availability.'
  },
  'dining-pavilion': {
    id: 'dining-pavilion',
    name: 'Imperial Dining Pavilion',
    badge: '800+ Seated Concurrent Dining',
    subtitle: 'Dual Pure-Veg & Non-Veg Commercial Kitchens · Central AC',
    gallery: [
      { src: 'assets/images/banquet_dining_authentic.jpg', caption: 'Authentic AC Banquet Dining Hall with Round Table Setups' }
    ],
    overview: 'A dedicated, fully air-conditioned banquet dining pavilion designed for fast, hygienic, and dignified guest service. Engineered with three oversized 16-foot acoustic portal doors connecting to the main hall, it completely segregates culinary aromas while maintaining a lightning-fast flow rate of 400 guests per minute.',
    specs: [
      { label: 'Dining Capacity', val: '800+ Guests Simultaneously Seated' },
      { label: 'Guest Flow Rate', val: '400 Guests per Minute' },
      { label: 'Air Conditioning', val: 'Central AC with High-Exchange Air Ventilation' },
      { label: 'Kitchen Setup', val: 'Dual Segregated Pure-Veg & Non-Veg Kitchens' },
      { label: 'Dining Styles', val: 'Traditional Banana Leaf Seated or Live Buffet' },
      { label: 'Buffet Stations', val: 'Twin Parallel Multi-Tier Chafing Tracks' },
      { label: 'Aroma Isolation', val: '3 Acoustic Insulated 16ft Concourse Doors' },
      { label: 'Plate Rates', val: 'Veg from ₹1,200 · Non-Veg from ₹1,300' },
      { label: 'Handwash Area', val: '24 Ceramic Touchless Sensor Wash Basins' },
      { label: 'Water Filtration', val: 'Commercial Grade RO Purified Drinking Water' }
    ],
    amenities: [
      'Twin parallel buffet layouts eliminating guest queues during peak dining hours',
      'Strictly segregated vegetarian and non-vegetarian cooking facilities',
      'Acoustic sound and smell barrier doors preventing aroma bleed into the hall',
      'High-velocity commercial kitchen exhaust hoods and clean stainless steel worktops',
      'Expansive handwash zone with automated sensor faucets and hygienic amenities',
      'Full facility for traditional seated Andhra wedding banana leaf feasts'
    ],
    whatsappMsg: 'Hi A1 Grand, I am inquiring about the Imperial Dining Pavilion and catering packages. Please provide information.'
  },
  'vip-suites': {
    id: 'vip-suites',
    name: 'VIP Executive & Bridal Suites',
    badge: '4 Private Luxury AC Suites',
    subtitle: 'Direct Backstage Access · Dedicated Bride & Groom Green Rooms',
    gallery: [
      { src: 'assets/images/bridal_suite_authentic.jpg', caption: 'Authentic VIP Presidential Bridal Bedroom Suite with Double Bed & Split AC' }
    ],
    overview: 'Four luxurious, fully air-conditioned green rooms located directly behind the main stage. Offering absolute privacy for the bride, groom, and immediate families, each suite features illuminated theatrical makeup vanity mirrors, plush seating, attached western bathrooms, and lockable security cabinets for jewelry and attire.',
    specs: [
      { label: 'Number of Suites', val: '4 Dedicated Executive Suites' },
      { label: 'Stage Access', val: 'Direct Private Backstage Keycard Access' },
      { label: 'Air Conditioning', val: 'Independent 2TR Inverter Split AC per Suite' },
      { label: 'Vanity Station', val: 'Full-Length Hollywood Illuminated Makeup Mirrors' },
      { label: 'Restrooms', val: 'Private Attached Western Ceramic Restrooms' },
      { label: 'Furnishing', val: 'Plush Leather Couches & Dressing Wardrobes' },
      { label: 'Security', val: 'Digital Keycard Door Locks & Lockable Safe' },
      { label: 'Power Outlets', val: 'Multiple 16A Sockets for Hair Stylists & Steamers' },
      { label: 'Room Service', val: 'Dedicated Attendant Bell & Beverage Service' },
      { label: 'Inclusions', val: 'Complimentary with Wedding Hall Bookings' }
    ],
    amenities: [
      'Direct secure backstage corridor allowing bridal entry without crossing public areas',
      'Professional daylight-balanced illumination tailored for makeup artists and photographers',
      'Private sparkling clean attached bathrooms with continuous hot and cold water',
      'Full-height lockable teak wardrobes for wedding silk sarees and jewelry storage',
      'Comfortable seating lounges for close family members and bridal entourage',
      'High-speed WiFi and emergency power backup for steamers and styling gear'
    ],
    whatsappMsg: 'Hi A1 Grand, I want to know more about the VIP Bridal and Groom Suites included with venue booking.'
  },
  'grand-portico': {
    id: 'grand-portico',
    name: 'Grand Entrance Portico & Facade',
    badge: 'Arrival Concourse & Valet',
    subtitle: '400+ Car Paved Parking · Covered Valet Concourse',
    gallery: [
      { src: 'assets/images/grand_entrance_portico_authentic.jpg', caption: 'Authentic Grand Entrance Portico & Decorated Welcome Walkway' }
    ],
    overview: 'A grand statement of luxury the moment guests arrive at A1 Grand The Convention. Featuring towering wood-finished pillars, coffered canopy ceiling, festive floral entrance decor with rangoli runner, covered drive-through portico for seamless drop-offs, and a 400+ vehicle paved parking concourse staffed by professional valet personnel.',
    specs: [
      { label: 'Parking Capacity', val: '400+ Four-Wheelers & 300+ Two-Wheelers' },
      { label: 'Valet Service', val: 'Covered Portico with Uniformed Valet Drivers' },
      { label: 'Architecture', val: 'Wood-Paneled Pillars & Coffered Canopy Portico' },
      { label: 'Decor Setup', val: 'Festive Parasols, Marigold Garlands & Floral Rangoli' },
      { label: 'Accessibility', val: 'Full Ramp Access for Wheelchairs & Elderly' },
      { label: 'Security', val: '24/7 CCTV Surveillance & Uniformed Guards' },
      { label: 'Location', val: 'Beach Road, Beside Saipriya Resorts, Rushikonda' },
      { label: 'Entry Width', val: '40ft Wide Grand Gates for VIP Convoys' }
    ],
    amenities: [
      'Covered drop-off portico keeping guests shielded from sun or seasonal rain',
      'Paved and marked parking slots with dedicated traffic marshals',
      'Wheelchair and elderly friendly gentle ramp pathways into the lobby',
      'Striking architectural photo-backdrop for wedding party arrivals',
      '24/7 security booth with continuous CCTV monitoring',
      'Easy approach on the main 4-lane Rushikonda - Bheemili Beach Road'
    ],
    whatsappMsg: 'Hi A1 Grand, I would like to inquire about parking and arrival concourse capacity for our large event.'
  }
};

let currentModalHall = null;

function initHallWiseFloorplans() {
  const tabs = document.querySelectorAll('.hall-tab-btn');
  const cards = document.querySelectorAll('.hall-card');
  const modal = document.getElementById('hallInfoModal');

  // Filter tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-hall-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-hall') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Close modal when clicking on backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeHallInfoModal();
      }
    });
  }

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHallInfoModal();
    }
  });
}

window.openHallInfoModal = function (hallId, initialImgIndex = 0) {
  const data = venueHallsData[hallId] || venueHallsData['main-hall'];
  currentModalHall = data;

  const modal = document.getElementById('hallInfoModal');
  if (!modal) return;

  // Header
  const badgeEl = document.getElementById('modalHallBadge');
  const titleEl = document.getElementById('modalHallTitle');
  const subtitleEl = document.getElementById('modalHallSubtitle');
  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.name;
  if (subtitleEl) subtitleEl.textContent = data.subtitle;

  // Gallery
  const heroImg = document.getElementById('modalHeroImg');
  const captionEl = document.getElementById('modalImgCaption');
  const thumbsContainer = document.getElementById('modalThumbsContainer');

  const galleryItems = data.gallery || [];
  const activeImg = galleryItems[initialImgIndex] || galleryItems[0];

  if (heroImg && activeImg) {
    heroImg.src = activeImg.src;
    heroImg.alt = activeImg.caption;
  }
  if (captionEl && activeImg) {
    captionEl.textContent = activeImg.caption;
  }

  // Render thumbnails if multiple images
  if (thumbsContainer) {
    if (galleryItems.length > 1) {
      thumbsContainer.style.display = 'flex';
      thumbsContainer.innerHTML = galleryItems.map((item, idx) => `
        <button type="button" class="hall-modal-thumb-btn ${idx === initialImgIndex ? 'active' : ''}" onclick="selectModalHallImg(${idx})">
          <img src="${item.src}" alt="${item.caption}">
        </button>
      `).join('');
    } else {
      thumbsContainer.style.display = 'none';
      thumbsContainer.innerHTML = '';
    }
  }

  // Specs Matrix
  const specsGrid = document.getElementById('modalSpecsGrid');
  if (specsGrid) {
    specsGrid.innerHTML = data.specs.map(spec => `
      <div class="hall-modal-spec-item">
        <span class="spec-k">${spec.label}</span>
        <span class="spec-v">${spec.val}</span>
      </div>
    `).join('');
  }

  // Overview description
  const descEl = document.getElementById('modalDescText');
  if (descEl) descEl.textContent = data.overview;

  // Amenities list
  const amenitiesList = document.getElementById('modalAmenitiesList');
  if (amenitiesList) {
    amenitiesList.innerHTML = data.amenities.map(a => `<li>${a}</li>`).join('');
  }

  // WhatsApp Link
  const waBtn = document.getElementById('modalWhatsAppBtn');
  if (waBtn) {
    const encoded = encodeURIComponent(data.whatsappMsg);
    waBtn.href = `https://api.whatsapp.com/send?phone=919848123456&text=${encoded}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.selectModalHallImg = function (idx) {
  if (!currentModalHall || !currentModalHall.gallery) return;
  const item = currentModalHall.gallery[idx];
  if (!item) return;

  const heroImg = document.getElementById('modalHeroImg');
  const captionEl = document.getElementById('modalImgCaption');
  const thumbs = document.querySelectorAll('.hall-modal-thumb-btn');

  if (heroImg) {
    heroImg.style.opacity = '0.3';
    setTimeout(() => {
      heroImg.src = item.src;
      heroImg.alt = item.caption;
      heroImg.style.opacity = '1';
    }, 150);
  }
  if (captionEl) captionEl.textContent = item.caption;

  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
};

window.closeHallInfoModal = function () {
  const modal = document.getElementById('hallInfoModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

/* ==========================================================================
   6B. Floor Plans Multi-Photo Auto Slider (Home Page Explore Card)
   ========================================================================== */
function initFloorplanExploreSlider() {
  const box = document.getElementById('floorplanSliderBox');
  if (!box) return;

  const slides = box.querySelectorAll('.explore-slide-img');
  const dots = box.querySelectorAll('.explore-dot');
  if (slides.length <= 1) return;

  let currentIdx = 0;
  let timer = null;

  function setSlide(idx) {
    slides.forEach((s, i) => {
      if (i === idx) s.classList.add('active');
      else s.classList.remove('active');
    });
    dots.forEach((d, i) => {
      if (i === idx) d.classList.add('active');
      else d.classList.remove('active');
    });
    currentIdx = idx;
  }

  function advance() {
    const nextIdx = (currentIdx + 1) % slides.length;
    setSlide(nextIdx);
  }

  timer = setInterval(advance, 3000);

  // Allow clicking dots to jump directly
  dots.forEach((dot, dotIdx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearInterval(timer);
      setSlide(dotIdx);
      timer = setInterval(advance, 3000);
    });
  });

  box.addEventListener('mouseenter', () => {
    clearInterval(timer);
    advance();
    timer = setInterval(advance, 2200);
  });

  box.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(advance, 3000);
  });
}

/* ==========================================================================
   7. Interactive Authentic Catering & Feast Builder
   ========================================================================== */
const cateringCatalog = [
  { id: 'c1', cat: 'andhra', name: 'Ghee Pulihora', type: 'veg', tag: 'Traditional Andhra', desc: 'Temple-style fragrant tamarind rice tempered in pure desi ghee with crunchy roasted cashews and green chillies.' },
  { id: 'c2', cat: 'andhra', name: 'Gutti Vankaya Pulao', type: 'veg', tag: 'Royal Telugu Feast', desc: 'Stuffed spicy baby brinjals simmered with fragrant basmati rice and roasted peanut-sesame masala.' },
  { id: 'c3', cat: 'andhra', name: 'Hot Poori with Aloo Kurma', type: 'veg', tag: 'Live Tawa Counter', desc: 'Puffy golden wheat pooris served directly from hot pans with spiced potato-coconut stew.' },
  { id: 'c4', cat: 'andhra', name: 'Pappu Charu & Bendakaya Fry', type: 'veg', tag: 'Homestyle Classic', desc: 'Traditional Telugu lentil rasam paired with crisp okra tossed in crushed peanuts and curry leaves.' },
  { id: 'c5', cat: 'andhra', name: 'Atreyapuram Pootharekulu', type: 'veg', tag: 'Heritage Sweet', desc: 'Delicate edible rice paper rolls layered with organic jaggery powder, roasted dry fruits, and pure cow ghee.' },
  { id: 'c6', cat: 'andhra', name: 'Bobbatlu with Melted Ghee', type: 'veg', tag: 'Muhurtham Sweet', desc: 'Fresh hot sweet flatbreads stuffed with sweetened chana dal paste and served with drizzled warm ghee.' },

  { id: 'c7', cat: 'mughlai', name: 'Hyderabadi Dum Biryani', type: 'non-veg', tag: 'Chef Signature', desc: 'Sealed handi cooked kachi dum biryani with long grain basmati rice, saffron milk, and fried onions.' },
  { id: 'c8', cat: 'mughlai', name: 'Paneer Tikka Angaari', type: 'veg', tag: 'Clay Oven Tandoor', desc: 'Fresh malai paneer cubes marinated in mustard oil, Kashmiri red chilli, and chargrilled over charcoal.' },
  { id: 'c9', cat: 'mughlai', name: 'Dal Makhani Bukhara', type: 'veg', tag: 'Slow Cooked', desc: 'Black urad lentils slow simmered overnight for 18 hours with ripe tomatoes, white butter, and fresh cream.' },
  { id: 'c10', cat: 'mughlai', name: 'Butter Garlic Naan & Kulcha', type: 'veg', tag: 'Live Tandoor', desc: 'Freshly baked tandoori breads sprinkled with garlic flakes, nigella seeds, and brushed with butter.' },
  { id: 'c11', cat: 'mughlai', name: 'Shahi Angoori Rasmalai', type: 'veg', tag: 'Royal Dessert', desc: 'Mini cottage cheese dumplings submerged in chilled saffron infused milk with slivered pistachios.' },

  { id: 'c12', cat: 'live', name: 'Artisanal Live Dosa Station', type: 'veg', tag: 'Interactive Counter', desc: 'Chef prepared live 70mm dosas with Ghee Karam, Cheese, Paneer, and four fresh coastal chutneys.' },
  { id: 'c13', cat: 'live', name: 'Tuscan Pasta Station', type: 'veg', tag: 'Italian Specialty', desc: 'Penne and fusilli cooked to order in rich San Marzano arrabiata or creamy parmesan alfredo sauce.' },
  { id: 'c14', cat: 'live', name: 'Delhi Chaat Chowk', type: 'veg', tag: 'Street Food Live', desc: 'Crispy Pani Puri with 3 waters, Dahi Papdi Chaat, and sizzling hot Aloo Tikki with saunth chutney.' },
  { id: 'c15', cat: 'live', name: 'Coastal Tender Coconut Pudding', type: 'veg', tag: 'Vizag Beach Special', desc: 'Refreshing dessert made with tender coconut malai, condensed milk, and fresh mint.' },

  { id: 'c16', cat: 'desserts', name: 'Traditional Filter Coffee & Tea', type: 'veg', tag: 'Brass Davarah', desc: 'Freshly brewed Kumbakonam degree filter coffee and masala chai served in gleaming brass tumblers.' },
  { id: 'c17', cat: 'desserts', name: 'Apricot Delight with Vanilla', type: 'veg', tag: 'Celebration Favorite', desc: 'Stewed sweet apricots topped with velvety fresh custard cream and roasted almond slivers.' },
  { id: 'c18', cat: 'desserts', name: 'Royal Nannari & Panakam Welcome Bar', type: 'veg', tag: 'Welcome Drink', desc: 'Traditional herbal root sherbet and sacred pepper-jaggery cooling drinks served upon guest arrival.' }
];

let selectedMenuItems = ['c1', 'c2', 'c5', 'c7', 'c9', 'c12', 'c17'];
let activeCateringCategory = 'all';

function initCateringBuilder() {
  renderCateringCards();
  renderSelectedTray();

  const tabs = document.querySelectorAll('.menu-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCateringCategory = tab.getAttribute('data-cat');
      renderCateringCards();
    });
  });
}

function renderCateringCards() {
  const container = document.getElementById('menuCardsGrid');
  if (!container) return;

  const filtered = activeCateringCategory === 'all'
    ? cateringCatalog
    : cateringCatalog.filter(d => d.cat === activeCateringCategory);

  container.innerHTML = filtered.map(dish => {
    const isSelected = selectedMenuItems.includes(dish.id);
    return `
      <div class="dish-card ${isSelected ? 'selected' : ''}" onclick="toggleMenuItem('${dish.id}')">
        <div class="dish-header">
          <h5 class="dish-name">${dish.name}</h5>
          <span class="dish-type-dot ${dish.type}"></span>
        </div>
        <p class="dish-desc">${dish.desc}</p>
        <div class="dish-footer">
          <span class="dish-tag">${dish.tag}</span>
          <span class="dish-add-check">
            ${isSelected ? '✓ Added' : '+ Add to Feast'}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleMenuItem = function (dishId) {
  if (selectedMenuItems.includes(dishId)) {
    selectedMenuItems = selectedMenuItems.filter(id => id !== dishId);
  } else {
    selectedMenuItems.push(dishId);
  }
  renderCateringCards();
  renderSelectedTray();
};

function renderSelectedTray() {
  const list = document.getElementById('traySelectedList');
  const countBadge = document.getElementById('trayItemCount');
  if (!list) return;

  const selectedDishes = cateringCatalog.filter(d => selectedMenuItems.includes(d.id));
  if (countBadge) countBadge.textContent = selectedDishes.length;

  if (selectedDishes.length === 0) {
    list.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-dim); text-align: center; padding: 20px 0;">No dishes selected yet. Click any dish to build your custom banquet menu!</p>`;
    return;
  }

  list.innerHTML = selectedDishes.map(d => `
    <div class="tray-selected-item">
      <span>${d.name} <small style="color: #cbd5e1;">(${d.type === 'veg' ? 'Veg' : 'Non-Veg'})</small></span>
      <span class="tray-item-remove" onclick="event.stopPropagation(); toggleMenuItem('${d.id}')" title="Remove">&times;</span>
    </div>
  `).join('');
}

window.inquireWithMenu = function () {
  const selectedDishes = cateringCatalog.filter(d => selectedMenuItems.includes(d.id)).map(d => d.name);
  if (selectedDishes.length === 0) {
    alert('Please select at least 3 dishes to create your customized menu.');
    return;
  }

  const menuText = encodeURIComponent(
    `Hello A1 Grand The Convention Management,\n\nI have customized a banquet feast for my event:\n` +
    `• Selected Dishes (${selectedDishes.length}):\n${selectedDishes.map(d => `  - ${d}`).join('\n')}\n\n` +
    `Please share pricing per plate and chef tasting availability. Thank you!`
  );

  window.open(`https://api.whatsapp.com/send?phone=919848123456&text=${menuText}`, '_blank');
};

/* ==========================================================================
   8. Auspicious Muhurtham Dates Calendar & Interactive WhatsApp Booking
   ========================================================================== */
const muhurthamMonths = [
  {
    name: "November 2026",
    shortName: "NOV",
    year: 2026,
    monthIndex: 10,
    days: 30,
    startDayOfWeek: 0,
    dates: {
      4: { 
        type: 'muhurtham', 
        label: 'Karthika Pournami', 
        status: 'Fast Filling', 
        lagna: 'Morning Dhanur Lagna (05:45 AM – 08:15 AM) · Twilight Kumbha Lagna (06:45 PM – 09:15 PM)', 
        notes: 'Prime Karthika Pournami vivaha muhurtham. Supreme auspicious alignment for weddings.' 
      },
      8: { 
        type: 'muhurtham', 
        label: 'Vivaha Muhurtham', 
        status: 'Limited Slots', 
        lagna: 'Morning Mesha Lagna (09:15 AM – 11:30 AM) · Evening Vrishabha Lagna (07:00 PM – 09:00 PM)', 
        notes: 'Auspicious marriage lagna with favorable astral alignment.' 
      },
      14: { 
        type: 'available', 
        label: 'Prime Weekend', 
        status: 'Available', 
        lagna: 'Morning & Evening Slots Open (06:00 AM – 11:00 PM)', 
        notes: 'Prime Saturday slot available for wedding receptions, sangeet, or engagement gala.' 
      },
      19: { 
        type: 'muhurtham', 
        label: 'Grand Vivaha Lagna', 
        status: 'Fast Filling', 
        lagna: 'Morning Vrischika Lagna (07:15 AM – 09:30 AM) · Godhuli Twilight Lagna (05:45 PM – 07:30 PM)', 
        notes: 'Highly auspicious vivaha muhurtham with high reservation demand.' 
      },
      22: { 
        type: 'available', 
        label: 'Sunday Reception', 
        status: 'Available', 
        lagna: 'Full Day / Evening Slot Options Available', 
        notes: 'Sunday banquet slot open. Ideal for royal coastal lawn cocktail or wedding reception.' 
      },
      27: { 
        type: 'muhurtham', 
        label: 'Shubha Vivaha', 
        status: 'Limited Slots', 
        lagna: 'Mithuna Lagna (08:30 AM – 10:45 AM) · Simha Lagna (06:15 PM – 08:30 PM)', 
        notes: 'Auspicious pre-winter marriage muhurtham. 1 indoor convention slot remaining.' 
      },
      29: { 
        type: 'available', 
        label: 'Sangeet & Party Slot', 
        status: 'Available', 
        lagna: 'Evening / Twilight Slot (04:00 PM – 11:30 PM)', 
        notes: 'Perfect Sunday for grand sangeet, mehendi or reception celebration.' 
      }
    }
  },
  {
    name: "December 2026",
    shortName: "DEC",
    year: 2026,
    monthIndex: 11,
    days: 31,
    startDayOfWeek: 2,
    dates: {
      3: { 
        type: 'muhurtham', 
        label: 'Margashira Muhurtham', 
        status: 'Fast Filling', 
        lagna: 'Makara Lagna (07:30 AM – 09:45 AM) · Kumbha Lagna (06:00 PM – 08:15 PM)', 
        notes: 'Sacred Margashira wedding date. Coastal winter favorite.' 
      },
      6: { 
        type: 'muhurtham', 
        label: 'Auspicious Lagna', 
        status: 'Limited Slots', 
        lagna: 'Kumbha Lagna (08:15 AM – 10:30 AM) · Mesha Lagna (07:00 PM – 09:15 PM)', 
        notes: 'Sacred wedding alignment. Ideal for traditional mandapam celebrations.' 
      },
      12: { 
        type: 'available', 
        label: 'Saturday Prime Slot', 
        status: 'Available', 
        lagna: 'Morning & Evening Slots Available', 
        notes: 'Prime coastal winter weekend date for wedding receptions and banquets.' 
      },
      18: { 
        type: 'muhurtham', 
        label: 'Winter Wedding Lagna', 
        status: 'Fast Filling', 
        lagna: 'Dhanur Lagna (06:30 AM – 08:45 AM) · Meena Lagna (05:45 PM – 08:00 PM)', 
        notes: 'Peak coastal winter wedding season. Reserve early to lock your hall.' 
      },
      24: { 
        type: 'available', 
        label: 'Holiday Gala Slot', 
        status: 'Available', 
        lagna: 'Full Day Exclusive Availability', 
        notes: 'Holiday celebration slot ideal for destination weddings & banquets.' 
      },
      31: { 
        type: 'filling', 
        label: 'New Year Eve Gala', 
        status: 'Limited Slots', 
        lagna: 'Evening Coastal Gala (05:00 PM onwards)', 
        notes: 'Special New Year Eve celebration slot with seaside lawn & live counters.' 
      }
    }
  },
  {
    name: "January 2027",
    shortName: "JAN",
    year: 2027,
    monthIndex: 0,
    days: 31,
    startDayOfWeek: 5,
    dates: {
      14: { 
        type: 'muhurtham', 
        label: 'Sankranti Muhurtham', 
        status: 'Fast Filling', 
        lagna: 'Makara Sankranti Lagna (08:00 AM – 10:30 AM) · Vrishabha Lagna (06:30 PM – 08:45 PM)', 
        notes: 'Makara Sankranti sacred harvest wedding muhurtham with immense traditional significance.' 
      },
      17: { 
        type: 'muhurtham', 
        label: 'Magha Wedding Lagna', 
        status: 'Limited Slots', 
        lagna: 'Meena Lagna (09:15 AM – 11:30 AM) · Mithuna Lagna (07:00 PM – 09:15 PM)', 
        notes: 'Prime post-Sankranti wedding lagna. High booking interest.' 
      },
      23: { 
        type: 'available', 
        label: 'Prime Weekend Slot', 
        status: 'Available', 
        lagna: 'Morning / Evening Availability', 
        notes: 'Available Saturday for grand receptions or sangeet musical nights.' 
      },
      28: { 
        type: 'muhurtham', 
        label: 'Bheeshma Ekadashi', 
        status: 'Fast Filling', 
        lagna: 'Vrishabha Lagna (07:15 AM – 09:45 AM) · Karkataka Lagna (06:15 PM – 08:30 PM)', 
        notes: 'Bheeshma Ekadashi sacred auspicious muhurtham for wedding celebrations.' 
      }
    }
  },
  {
    name: "February 2027",
    shortName: "FEB",
    year: 2027,
    monthIndex: 1,
    days: 28,
    startDayOfWeek: 1,
    dates: {
      5: { 
        type: 'muhurtham', 
        label: 'Magha Vivaha', 
        status: 'Fast Filling', 
        lagna: 'Kumbha Lagna (07:15 AM – 09:30 AM) · Mesha Lagna (06:00 PM – 08:15 PM)', 
        notes: 'Prime Magha masa marriage date with auspicious nakshatram.' 
      },
      12: { 
        type: 'muhurtham', 
        label: 'Ratha Saptami Lagna', 
        status: 'Limited Slots', 
        lagna: 'Meena Lagna (08:45 AM – 11:00 AM) · Vrishabha Lagna (06:30 PM – 08:45 PM)', 
        notes: 'Surya Ratha Saptami auspicious wedding lagna.' 
      },
      14: { 
        type: 'muhurtham', 
        label: 'Royal Wedding Lagna', 
        status: 'Fast Filling', 
        lagna: 'Mesha Lagna (09:30 AM – 12:00 PM) · Simha Lagna (07:15 PM – 09:30 PM)', 
        notes: 'Weekend royal wedding slot with open lawn & grand ballroom combo.' 
      },
      20: { 
        type: 'available', 
        label: 'Saturday Available', 
        status: 'Available', 
        lagna: 'Morning & Evening Slots Open', 
        notes: 'Saturday prime banquet slot for engagements, receptions or parties.' 
      },
      26: { 
        type: 'muhurtham', 
        label: 'Shivaratri Eve Lagna', 
        status: 'Limited Slots', 
        lagna: 'Vrishabha Lagna (07:00 AM – 09:15 AM) · Karkataka Lagna (05:45 PM – 08:00 PM)', 
        notes: 'Sacred muhurtham date preceding Maha Shivaratri.' 
      }
    }
  },
  {
    name: "March 2027",
    shortName: "MAR",
    year: 2027,
    monthIndex: 2,
    days: 31,
    startDayOfWeek: 1,
    dates: {
      7: { 
        type: 'muhurtham', 
        label: 'Phalguna Ekadashi', 
        status: 'Fast Filling', 
        lagna: 'Mithuna Lagna (08:15 AM – 10:45 AM) · Kanya Lagna (06:30 PM – 08:45 PM)', 
        notes: 'Spring Vivaha Muhurtham with favorable astral positioning.' 
      },
      12: { 
        type: 'muhurtham', 
        label: 'Vivaha Muhurtham', 
        status: 'Limited Slots', 
        lagna: 'Karkataka Lagna (09:00 AM – 11:15 AM) · Vrischika Lagna (06:45 PM – 09:00 PM)', 
        notes: 'Auspicious marriage day for traditional South Indian rituals.' 
      },
      18: { 
        type: 'muhurtham', 
        label: 'Ugadi Vivaha Lagna', 
        status: 'Fast Filling', 
        lagna: 'Simha Lagna (06:45 AM – 09:00 AM) · Dhanur Lagna (05:30 PM – 07:45 PM)', 
        notes: 'Telugu New Year season auspicious wedding date.' 
      },
      21: { 
        type: 'available', 
        label: 'Sunday Prime Slot', 
        status: 'Available', 
        lagna: 'Morning & Evening Open', 
        notes: 'Sunday open booking slot for grand receptions.' 
      },
      27: { 
        type: 'muhurtham', 
        label: 'Spring Royal Wedding', 
        status: 'Limited Slots', 
        lagna: 'Kanya Lagna (07:30 AM – 10:00 AM) · Makara Lagna (06:15 PM – 08:30 PM)', 
        notes: 'High season spring wedding slot.' 
      }
    }
  },
  {
    name: "April 2027",
    shortName: "APR",
    year: 2027,
    monthIndex: 3,
    days: 30,
    startDayOfWeek: 4,
    dates: {
      4: { 
        type: 'muhurtham', 
        label: 'Chaitra Vivaha', 
        status: 'Fast Filling', 
        lagna: 'Vrischika Lagna (06:30 AM – 08:45 AM) · Meena Lagna (06:00 PM – 08:15 PM)', 
        notes: 'Auspicious Chaitra masa wedding date.' 
      },
      14: { 
        type: 'muhurtham', 
        label: 'Sita Rama Kalyanam', 
        status: 'Fast Filling', 
        lagna: 'Dhanur Lagna (07:15 AM – 09:30 AM) · Mesha Lagna (06:45 PM – 09:00 PM)', 
        notes: 'Divine wedding day. Inquiries heavily prioritized.' 
      },
      18: { 
        type: 'available', 
        label: 'Prime Weekend Slot', 
        status: 'Available', 
        lagna: 'Full Day / Evening Availability', 
        notes: 'Prime weekend available for wedding banquet or reception.' 
      },
      22: { 
        type: 'muhurtham', 
        label: 'Vaisakha Muhurtham', 
        status: 'Limited Slots', 
        lagna: 'Makara Lagna (08:00 AM – 10:15 AM) · Vrishabha Lagna (07:00 PM – 09:15 PM)', 
        notes: 'Auspicious marriage lagna.' 
      },
      29: { 
        type: 'muhurtham', 
        label: 'Akshaya Tritiya Vivaha', 
        status: 'Fast Filling', 
        lagna: 'Kumbha Lagna (06:00 AM – 08:30 AM) · Simha Lagna (06:30 PM – 08:45 PM)', 
        notes: 'Akshaya Tritiya eternal fortune marriage muhurtham. Fastest filling date.' 
      }
    }
  },
  {
    name: "May 2027",
    shortName: "MAY",
    year: 2027,
    monthIndex: 4,
    days: 31,
    startDayOfWeek: 6,
    dates: {
      2: { 
        type: 'muhurtham', 
        label: 'Vaisakha Shubha Lagna', 
        status: 'Fast Filling', 
        lagna: 'Meena Lagna (07:00 AM – 09:15 AM) · Kanya Lagna (06:00 PM – 08:15 PM)', 
        notes: 'Prime Vaisakha summer marriage muhurtham with central AC comfort.' 
      },
      9: { 
        type: 'available', 
        label: 'Summer Prime Weekend', 
        status: 'Available', 
        lagna: 'Evening Reception Slot Open', 
        notes: 'Ideal for twilight lawn party and banquet dinner.' 
      },
      14: { 
        type: 'muhurtham', 
        label: 'Ganga Saptami Muhurtham', 
        status: 'Fast Filling', 
        lagna: 'Mesha Lagna (08:15 AM – 10:30 AM) · Tula Lagna (06:45 PM – 09:00 PM)', 
        notes: 'Auspicious summer marriage date.' 
      },
      20: { 
        type: 'muhurtham', 
        label: 'Vaisakha Pournami', 
        status: 'Fast Filling', 
        lagna: 'Vrishabha Lagna (06:45 AM – 09:00 AM) · Vrischika Lagna (06:15 PM – 08:30 PM)', 
        notes: 'Full moon auspicious wedding celebration.' 
      },
      28: { 
        type: 'muhurtham', 
        label: 'Vivaha Muhurtham', 
        status: 'Limited Slots', 
        lagna: 'Mithuna Lagna (07:30 AM – 09:45 AM) · Dhanur Lagna (06:00 PM – 08:15 PM)', 
        notes: 'Limited slot remaining for indoor convention.' 
      }
    }
  }
];

let currentMonthIdx = 0;
let selectedDateInfo = { day: 4, monthIdx: 0 };
let selectedHall = "Main Hall (Indoor Convention Space)";
let selectedServices = new Set([
  "Royal Banqueting & Live Catering",
  "Grand Mandapam & Floral Decor",
  "Panoramic 4K Stage LED Screen & Lighting",
  "Luxury Bridal & Groom Dressing Suites (4 Rooms)",
  "Valet Parking & 24/7 Security Concierge"
]);
let selectedSlot = "Morning Muhurtham (05:30 AM – 02:00 PM)";
let selectedGuests = "500 - 1,000";

function initMuhurthamCalendar() {
  const grid = document.getElementById('calendarGridDates');
  if (!grid) return;

  renderMonthPills();
  renderCalendar();
  initCalendarInteractionListeners();
  updateRightInfoPanel(selectedDateInfo.day, selectedDateInfo.monthIdx);

  const prevBtn = document.getElementById('calPrevBtn');
  const nextBtn = document.getElementById('calNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentMonthIdx > 0) {
        currentMonthIdx--;
        renderCalendar();
        updateMonthPillsActive();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentMonthIdx < muhurthamMonths.length - 1) {
        currentMonthIdx++;
        renderCalendar();
        updateMonthPillsActive();
      }
    });
  }
}

function renderMonthPills() {
  const container = document.getElementById('calMonthPills');
  if (!container) return;

  let html = '';
  muhurthamMonths.forEach((m, idx) => {
    const activeClass = idx === currentMonthIdx ? ' active' : '';
    html += `<button type="button" class="cal-month-pill${activeClass}" data-idx="${idx}" onclick="switchMuhurthamMonth(${idx})">${m.shortName} '${String(m.year).slice(2)}</button>`;
  });
  container.innerHTML = html;
}

function updateMonthPillsActive() {
  const pills = document.querySelectorAll('.cal-month-pill');
  pills.forEach((p, idx) => {
    if (idx === currentMonthIdx) p.classList.add('active');
    else p.classList.remove('active');
  });
}

window.switchMuhurthamMonth = function (idx) {
  if (idx >= 0 && idx < muhurthamMonths.length) {
    currentMonthIdx = idx;
    renderCalendar();
    updateMonthPillsActive();
  }
};

function renderCalendar() {
  const title = document.getElementById('calMonthTitle');
  const grid = document.getElementById('calendarGridDates');
  if (!grid || !title) return;

  const current = muhurthamMonths[currentMonthIdx];
  title.textContent = current.name;

  let html = '';

  for (let i = 0; i < current.startDayOfWeek; i++) {
    html += '<div class="cal-date-cell empty"></div>';
  }

  for (let d = 1; d <= current.days; d++) {
    const info = current.dates[d];
    let cellClass = '';
    let dotHtml = '';
    const isSelected = (currentMonthIdx === selectedDateInfo.monthIdx && d === selectedDateInfo.day);

    if (info) {
      cellClass = ' ' + info.type;
      dotHtml = '<span class="cal-status-dot ' + info.type + '"></span>';
    }

    const selectedClass = isSelected ? ' selected' : '';
    const titleAttr = info ? (info.label || info.title || '') : (d + ' ' + current.name);

    html += '<div class="cal-date-cell' + cellClass + selectedClass + '" data-day="' + d + '" onclick="selectCalendarDate(' + d + ')" title="' + titleAttr + '">' +
            '  <span class="cal-num">' + d + '</span>' +
            '  <div class="cal-status-row">' + dotHtml + '</div>' +
            '</div>';
  }

  grid.innerHTML = html;
}

let currentGuestCount = 500;

window.setCalendarGuests = function(num) {
  currentGuestCount = num;
  const chips = document.querySelectorAll('#calGuestChips .guest-chip');
  chips.forEach(c => {
    if (parseInt(c.getAttribute('data-guests'), 10) === num) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
  updateRightInfoPanel(selectedDateInfo.day, selectedDateInfo.monthIdx);
};

window.selectCalendarDate = function (day) {
  selectedDateInfo = { day: day, monthIdx: currentMonthIdx };

  // Update active date cell in DOM
  const allCells = document.querySelectorAll('#calendarGridDates .cal-date-cell');
  allCells.forEach(cell => {
    const cellDay = parseInt(cell.getAttribute('data-day'), 10);
    if (cellDay === day) {
      cell.classList.add('selected');
    } else {
      cell.classList.remove('selected');
    }
  });

  updateRightInfoPanel(day, currentMonthIdx);

  // On smaller screens, smoothly scroll right-hand info panel into view
  if (window.innerWidth <= 1024) {
    const infoPanel = document.getElementById('calInfoPanel');
    if (infoPanel) {
      infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
};

function updateRightInfoPanel(day, monthIdx) {
  const current = muhurthamMonths[monthIdx];
  if (!current) return;

  const dateObj = new Date(current.year, current.monthIndex, day);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const isWeekend = weekday === 'Saturday' || weekday === 'Sunday';
  const info = current.dates[day];

  // Date Header Elements
  const dayElem = document.getElementById('selectedDateDay');
  const monthElem = document.getElementById('selectedDateMonth');
  const fullElem = document.getElementById('selectedDateFull');
  const badgeElem = document.getElementById('selectedDateTypeBadge');
  const titleElem = document.getElementById('selectedDateEventTitle');

  if (dayElem) dayElem.textContent = day < 10 ? '0' + day : day;
  if (monthElem) monthElem.textContent = current.shortName;
  if (fullElem) fullElem.textContent = weekday + ', ' + day + ' ' + current.name;

  // Availability Badge & Title (Zero emojis)
  let isMuhurtham = false;
  if (info) {
    isMuhurtham = info.type === 'muhurtham';
    if (badgeElem) {
      badgeElem.className = 'cal-minimal-badge ' + info.type;
      if (info.type === 'muhurtham') {
        badgeElem.textContent = 'Auspicious Muhurtham · High Demand';
      } else if (info.type === 'available') {
        badgeElem.textContent = 'Prime Weekend Slot · Available';
      } else {
        badgeElem.textContent = 'Fast Filling Date';
      }
    }
    if (titleElem) titleElem.textContent = (info.label || info.title || 'Auspicious Occasion') + ' (' + current.name + ')';
  } else {
    if (badgeElem) {
      badgeElem.className = 'cal-minimal-badge available';
      badgeElem.textContent = isWeekend ? 'Prime Weekend · Open Slot' : 'Standard Date · Available';
    }
    if (titleElem) titleElem.textContent = isWeekend ? 'Weekend Celebration Booking' : 'Open Venue Reservation Date';
  }

  // Price Estimation Calculation
  const baseHallRent = isMuhurtham ? 250000 : 200000;
  const plateRate = 1200;
  const cateringCost = currentGuestCount * plateRate;
  const totalEst = baseHallRent + cateringCost;

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  const hallElem = document.getElementById('estHallRent');
  const guestCountLabel = document.getElementById('estGuestCountLabel');
  const cateringElem = document.getElementById('estCateringCost');
  const totalElem = document.getElementById('estTotalPackage');
  const whatsAppBtn = document.getElementById('calWhatsAppBtn');

  if (hallElem) hallElem.textContent = fmt(baseHallRent);
  if (guestCountLabel) guestCountLabel.textContent = currentGuestCount.toLocaleString('en-IN');
  if (cateringElem) cateringElem.textContent = fmt(cateringCost);
  if (totalElem) totalElem.textContent = fmt(totalEst);

  if (whatsAppBtn) {
    const fullDateText = day + ' ' + current.name;
    const msg = encodeURIComponent('Hello A1 Grand, I would like to check availability and reserve for ' + fullDateText + ' (' + currentGuestCount + ' estimated guests).');
    whatsAppBtn.href = 'https://api.whatsapp.com/send?phone=919848123456&text=' + msg;
  }
}

function initCalendarInteractionListeners() {
  // Hall Selection
  const hallCards = document.querySelectorAll('.cal-hall-option');
  hallCards.forEach(card => {
    card.addEventListener('click', () => {
      hallCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedHall = radio.value;
      }
      updateLiveSummaryStrip();
    });
  });

  // Services Selection Checklist
  const serviceCards = document.querySelectorAll('.cal-service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const chk = card.querySelector('input[type="checkbox"]');
      if (e.target !== chk) {
        chk.checked = !chk.checked;
      }
      if (chk.checked) {
        card.classList.add('is-checked');
        selectedServices.add(chk.value);
      } else {
        card.classList.remove('is-checked');
        selectedServices.delete(chk.value);
      }
      updateLiveSummaryStrip();
    });
  });

  // Slot Selection
  const slotButtons = document.querySelectorAll('.cal-slot-btn');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSlot = btn.getAttribute('data-slot') || btn.textContent.trim();
      updateLiveSummaryStrip();
    });
  });

  // Guest Count Selection
  const guestButtons = document.querySelectorAll('.guest-btn');
  guestButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      guestButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGuests = btn.getAttribute('data-guests') || btn.textContent.trim();
      updateLiveSummaryStrip();
    });
  });
}

function updateLiveSummaryStrip() {
  const current = muhurthamMonths[selectedDateInfo.monthIdx];
  const dateVal = document.getElementById('liveDateVal');
  const hallVal = document.getElementById('liveHallVal');
  const srvVal = document.getElementById('liveServicesCount');
  const slotVal = document.getElementById('liveSlotVal');

  if (dateVal && current) {
    dateVal.textContent = `${selectedDateInfo.day} ${current.shortName} '${String(current.year).slice(2)}`;
  }
  if (hallVal) {
    let shortHall = selectedHall.split('(')[0].trim();
    hallVal.textContent = shortHall || "Main Hall";
  }
  if (srvVal) {
    srvVal.textContent = `${selectedServices.size} Included`;
  }
  if (slotVal) {
    let slotShort = selectedSlot.includes('Morning') ? 'Morning Slot' : (selectedSlot.includes('Evening') ? 'Evening Slot' : '24-Hr Full Day');
    slotVal.textContent = slotShort;
  }
}

window.bookMuhurthamOnWhatsApp = function () {
  const current = muhurthamMonths[selectedDateInfo.monthIdx];
  if (!current) return;

  const dateObj = new Date(current.year, current.monthIndex, selectedDateInfo.day);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const fullDateStr = `${weekday}, ${selectedDateInfo.day} ${current.name}`;
  
  const info = current.dates[selectedDateInfo.day];
  const muhurthamTitle = info ? `${info.label} (${info.status || 'Muhurtham'})` : (['Sunday', 'Saturday'].includes(weekday) ? 'Prime Weekend Celebration' : 'Standard Wedding / Event Date');
  const lagnaInfo = (info && info.lagna) ? info.lagna : 'Standard / Custom Muhurtham Timing Schedule';

  const servicesArray = Array.from(selectedServices);
  const servicesListStr = servicesArray.length > 0 
    ? servicesArray.map(s => `  • ${s}`).join('\n')
    : '  • Standard Venue Spaces & AC Facilities';

  const waMessage = 
`Hello A1 Grand The Convention! 🌸
I would like to inquire about booking an auspicious wedding date:

📅 Date: ${fullDateStr}
✨ Muhurtham / Occasion: ${muhurthamTitle}
⏰ Auspicious Lagna & Timings: ${lagnaInfo}
🏛️ Selected Venue / Hall: ${selectedHall}
⏱️ Preferred Time Slot: ${selectedSlot}
👥 Expected Guest Attendance: ${selectedGuests}

🛎️ Selected Services Provided by A1 Grand:
${servicesListStr}

Please check slot availability for this date and send us the detailed tariff and booking quotation. Thank you!`;

  showToast("Opening WhatsApp to book your Muhurtham date...");
  const waUrl = `https://api.whatsapp.com/send?phone=919848123456&text=${encodeURIComponent(waMessage)}`;
  window.open(waUrl, '_blank');
};

/* ==========================================================================
   9. Decor & Stage Themes
   ========================================================================== */
function initDecorThemes() {
  // Themes display handled
}

/* ==========================================================================
   10. Digital Brochure Download Modal
   ========================================================================== */
function initBrochureModal() {
  const modal = document.getElementById('brochureModal');
  const openBtns = document.querySelectorAll('.open-brochure-btn');
  const closeBtn = document.getElementById('brochureClose');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

window.printBrochure = function () {
  window.print();
};

/* ==========================================================================
   11. Interactive Instant Quote Calculator
   ========================================================================== */
function initCalculator() {
  const guestSlider = document.getElementById('guestSlider');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const eventChips = document.querySelectorAll('.event-type-chip');
  const cateringChips = document.querySelectorAll('.catering-chip');
  const avCheckbox = document.getElementById('addonAV');
  const bridalCheckbox = document.getElementById('addonBridal');

  const sumEvent = document.getElementById('calcSummaryEvent');
  const sumGuests = document.getElementById('calcSummaryGuests');
  const sumCatering = document.getElementById('calcSummaryCatering');
  const sumEstimate = document.getElementById('calcSummaryEstimate');

  let selectedEvent = "Grand Wedding";
  let selectedCatering = "Vegetarian Feast";
  let guestCount = 500;
  let cateringPerPlate = 1200;
  let hallBaseRent = 195000;

  function updateEstimate() {
    guestCount = parseInt(guestSlider.value);
    if (guestCountDisplay) guestCountDisplay.textContent = guestCount.toLocaleString('en-IN');
    if (sumGuests) sumGuests.textContent = `${guestCount.toLocaleString('en-IN')} Guests`;
    if (sumEvent) sumEvent.textContent = selectedEvent;
    if (sumCatering) sumCatering.textContent = selectedCatering;

    let cateringTotal = guestCount * cateringPerPlate;
    let addonsTotal = 0;
    if (avCheckbox && avCheckbox.checked) addonsTotal += 35000;
    if (bridalCheckbox && bridalCheckbox.checked) addonsTotal += 20000;

    let totalEstimate = hallBaseRent + cateringTotal + addonsTotal;
    let minRange = Math.round(totalEstimate * 0.95);
    let maxRange = Math.round(totalEstimate * 1.08);

    if (sumEstimate) {
      sumEstimate.textContent = `₹ ${minRange.toLocaleString('en-IN')} - ${maxRange.toLocaleString('en-IN')}`;
    }
  }

  if (guestSlider) guestSlider.addEventListener('input', updateEstimate);

  eventChips.forEach(chip => {
    chip.addEventListener('click', () => {
      eventChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedEvent = chip.getAttribute('data-value');
      hallBaseRent = parseInt(chip.getAttribute('data-base') || '195000');
      updateEstimate();
    });
  });

  cateringChips.forEach(chip => {
    chip.addEventListener('click', () => {
      cateringChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedCatering = chip.getAttribute('data-value');
      cateringPerPlate = parseInt(chip.getAttribute('data-price') || '850');
      updateEstimate();
    });
  });

  if (avCheckbox) avCheckbox.addEventListener('change', updateEstimate);
  if (bridalCheckbox) bridalCheckbox.addEventListener('change', updateEstimate);

  updateEstimate();
}

/* ==========================================================================
   12. Booking & WhatsApp Inquiry Form
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  try {
    const saved = sessionStorage.getItem('a1_prefill_date');
    const dateInput = document.getElementById('inqDate');
    if (saved && dateInput) { dateInput.value = saved; sessionStorage.removeItem('a1_prefill_date'); }
  } catch (e) { }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('inqName')?.value || '';
    const phone = document.getElementById('inqPhone')?.value || '';
    const eventType = document.getElementById('inqEventType')?.value || 'Wedding';
    const date = document.getElementById('inqDate')?.value || '';
    const guests = document.getElementById('inqGuests')?.value || '500';
    const message = document.getElementById('inqMessage')?.value || '';

    if (!name || !phone) {
      alert('Please fill in your full name and contact phone number.');
      return;
    }

    const waText = encodeURIComponent(
      `Hello A1 Grand The Convention Management,\n\nI would like to inquire about booking your venue:\n` +
      `• Name: ${name}\n` +
      `• Phone: ${phone}\n` +
      `• Event Type: ${eventType}\n` +
      `• Preferred Date: ${date || 'Flexible'}\n` +
      `• Expected Guests: ${guests}\n` +
      (message ? `• Requirements: ${message}\n` : '') +
      `\nPlease provide date confirmation and detailed quotation. Thank you!`
    );

    showToast("Opening WhatsApp for instant venue manager contact...");

    setTimeout(() => {
      window.open(`https://api.whatsapp.com/send?phone=919848123456&text=${waText}`, '_blank');
      form.reset();
    }, 1000);
  });
}

/* ==========================================================================
   13. Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   Intro: the arch emblem draws itself on a white screen, the wordmark fades in,
   then the emblem glides to the centered header logo. Plays once per visit on
   the home page; on other pages the header emblem simply draws itself once.
   ========================================================================== */
function initIntroAnimation() {
  const overlay = document.getElementById('siteIntroOverlay');
  const headerEmblem = document.getElementById('navBrandLogoImg');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;
  try { seen = sessionStorage.getItem('a1_intro_seen') === '1'; } catch (e) { }

  const brand = document.getElementById('brandLogo');
  if (brand) {
    brand.addEventListener('click', (e) => {
      if (overlay && window.scrollY < 200) { e.preventDefault(); window.replayIntro(); }
    });
  }

  if (!overlay || reduce || seen) {
    if (overlay) overlay.classList.add('done');
    if (headerEmblem && !reduce && !seen) headerEmblem.classList.add('draw');
    if (headerEmblem && !reduce && !seen) { try { sessionStorage.setItem('a1_intro_seen', '1'); } catch (e) { } }
    return;
  }
  runIntro();
}

let introTimers = [];
function runIntro() {
  const overlay = document.getElementById('siteIntroOverlay');
  const emblem = document.getElementById('introEmblem');
  const headerEmblem = document.getElementById('navBrandLogoImg');
  const skip = document.getElementById('introSkipBtn');
  if (!overlay || !emblem || !headerEmblem) return;

  introTimers.forEach(clearTimeout); introTimers = [];
  try { sessionStorage.setItem('a1_intro_seen', '1'); } catch (e) { }

  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  overlay.classList.remove('done', 'flying');
  headerEmblem.style.opacity = '0';
  headerEmblem.classList.remove('draw');

  emblem.classList.remove('fly', 'draw');
  emblem.style.transform = 'none';
  void emblem.getBoundingClientRect();
  emblem.classList.add('draw');

  const word = document.getElementById('introWord');
  const place = document.getElementById('introPlace');
  [word, place].forEach((el) => { if (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; el.style.opacity = ''; } });

  let flown = false;
  function fly() {
    if (flown) return; flown = true;
    introTimers.forEach(clearTimeout);
    const from = emblem.getBoundingClientRect();
    const to = headerEmblem.getBoundingClientRect();
    emblem.classList.add('fly');
    overlay.classList.add('flying');
    emblem.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})`;
    setTimeout(() => {
      headerEmblem.style.opacity = '1';
      headerEmblem.classList.remove('draw');
      overlay.classList.add('done');
      document.body.style.overflow = '';
    }, 980);
  }
  introTimers.push(setTimeout(fly, 4300));
  if (skip) skip.onclick = (e) => { e.stopPropagation(); fly(); };
  overlay.onclick = fly;
}

window.replayIntro = function () { runIntro(); };