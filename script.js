const yearElement = document.getElementById('year');
const langButtons = document.querySelectorAll('.lang-btn');

const setLanguage = (language) => {
  document.querySelectorAll('.lang').forEach((element) => {
    const isActive = element.dataset.lang === language;
    element.style.display = isActive ? 'inline' : 'none';
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  updateDocumentLanguage(language);
  localStorage.setItem('siteLanguage', language);
};

const pageTranslations = {
  en: {
    titles: {
      'index.html': 'Denver Tamil Church',
      'ministry.html': 'Ministry | Denver Tamil Church',
      'events.html': 'Upcoming Events | Denver Tamil Church',
      'event-details.html': 'Event Details | Denver Tamil Church',
      'missions.html': 'Missions & Ministries | Denver Tamil Church',
      'gallery.html': 'Gallery | Denver Tamil Church',
      'give.html': 'Give | Denver Tamil Church',
      'contact.html': 'Contact | Denver Tamil Church'
    },
    descriptions: {
      'index.html': 'Denver Tamil Church is a welcoming Tamil church in Denver for worship, prayer, and community.',
      'ministry.html': 'Explore Kids, Teen and Young Adult, Men’s, and Women’s ministry at Denver Tamil Church.',
      'events.html': 'View upcoming worship services, outreach, fellowship, and family events at Denver Tamil Church.',
      'event-details.html': 'Find dates, locations, and details for Denver Tamil Church events.',
      'missions.html': 'See how Denver Tamil Church serves families, faith, and community with practical ministries.',
      'gallery.html': 'View photos from worship services, ministries, and events at Denver Tamil Church.',
      'give.html': 'Support the church through generous giving and prayer partnership.',
      'contact.html': 'Reach out to Denver Tamil Church for worship details, prayer support, and community connection.'
    },
    alt: {
      logo: 'Denver Tamil Church logo',
      video: 'Latest Denver Tamil Church YouTube video'
    }
  },
  ta: {
    titles: {
      'index.html': 'டென்வர் தமிழ் சமயம்',
      'missions.html': 'மிஷன்கள் & அமைச்சுகள் | டென்வர் தமிழ் சமயம்',
      'gallery.html': 'புகைப்படத் தொகுப்பு | டென்வர் தமிழ் சமயம்',
      'give.html': 'தானம் செய்ய | டென்வர் தமிழ் சமயம்',
      'contact.html': 'தொடர்பு | டென்வர் தமிழ் சமயம்'
    },
    descriptions: {
      'index.html': 'வழிபாடு, பிரார்த்தனை மற்றும் சமூகத்திற்கான டென்வர் தமிழ் சமயம்.',
      'missions.html': 'டென்வர் தமிழ் சமயம் குடும்பங்கள், விசுவாசம் மற்றும் சமூகத்திற்கு செயல்திறன் ministries மூலம் சேவை செய்கிறது.',
      'gallery.html': 'டென்வர் தமிழ் சபையின் ஆராதனைகள், ஊழியங்கள் மற்றும் நிகழ்வுகளின் புகைப்படங்களைக் காணுங்கள்.',
      'give.html': 'தாராள தானம் மற்றும் பிரார்த்தனை ஒத்துழைப்பின் மூலம் சமயத்திற்கு ஆதரவு அளிக்கவும்.',
      'contact.html': 'வழிபாடு விவரங்கள், பிரார்த்தனை ஆதரவு மற்றும் சமூக இணைப்புக்கு டென்வர் தமிழ் சமயத்தை அணுகுங்கள்.'
    },
    alt: {
      logo: 'டென்வர் தமிழ் சமயத்தின் லோகோ',
      video: 'சமீபத்திய டென்வர் தமிழ் சமய YouTube வீடியோ'
    }
  }
};

const getPageKey = () => {
  const path = location.pathname.split('/').pop();
  return path === '' ? 'index.html' : path;
};

const updateDocumentLanguage = (language) => {
  document.documentElement.lang = language;
  const pageKey = getPageKey();
  const translations = pageTranslations[language];

  if (translations?.titles?.[pageKey]) {
    document.title = translations.titles[pageKey];
  }

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && translations?.descriptions?.[pageKey]) {
    descriptionMeta.content = translations.descriptions[pageKey];
  }

  const logo = document.querySelector('.brand img');
  if (logo && translations?.alt?.logo) {
    logo.alt = translations.alt.logo;
  }

  const liveThumbnail = document.querySelector('.live-thumbnail');
  if (liveThumbnail && translations?.alt?.video) {
    liveThumbnail.alt = translations.alt.video;
  }
};

const initLanguage = () => {
  const savedLanguage = localStorage.getItem('siteLanguage') || 'en';
  setLanguage(savedLanguage);
};

langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
  });
});

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const featuredHeroImages = {
  home: [
    'assets/WhatsApp Image 2024-12-25 at 20.59.50_7dd35547.jpg'
  ],
  who: [
    'assets/images/church-sanctuary-hero.jpg',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=85'
  ],
  give: ['assets/images/church-giving-hero.jpg'],
  missions: ['assets/images/church-missions-hero.jpg'],
  contact: ['assets/images/church-location-banner.jpg']
};

const homeHeroSlides = [
  { src: 'assets/images/church-sanctuary-hero.jpg', tone: 'dark' },
  // Church worship and faith imagery only — no generic landscapes or stock scenes.
  { src: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=2000&q=88', tone: 'bright' },
  { src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=2000&q=88', tone: 'dark' }
];

const spiritualCardImages = [
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1457131760772-7017c6180f05?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=82'
];

const scriptureBubbles = [
  '“Let everything that has breath praise the Lord.” · Psalm 150:6',
  '“For where two or three gather in my name, there am I.” · Matthew 18:20',
  '“Let us not love with words or speech but with actions.” · 1 John 3:18',
  '“Your word is a lamp for my feet.” · Psalm 119:105',
  '“Devote yourselves to prayer.” · Colossians 4:2',
  '“Train up a child in the way he should go.” · Proverbs 22:6',
  '“Let the little children come to me.” · Matthew 19:14',
  '“The prayer of a righteous person is powerful.” · James 5:16',
  '“Encourage one another and build each other up.” · 1 Thessalonians 5:11',
  '“Give, and it will be given to you.” · Luke 6:38',
  '“The Lord is near to all who call on him.” · Psalm 145:18',
  '“Serve one another humbly in love.” · Galatians 5:13',
  '“Be joyful in hope, patient in affliction, faithful in prayer.” · Romans 12:12'
];

const scriptureBubblesTamil = [
  '“சுவாசமுள்ள யாவும் கர்த்தரைத் துதியுங்கள்.” · சங்கீதம் 150:6',
  '“இரண்டு அல்லது மூன்று பேர் என் நாமத்தினாலே கூடினால் நான் இருக்கிறேன்.” · மத்தேயு 18:20',
  '“வார்த்தையினாலும் நாவினாலும் அல்ல, செயலினாலும் அன்புகூருவோம்.” · 1 யோவான் 3:18',
  '“உமது வசனம் என் கால்களுக்கு தீபமும் என் பாதைக்கு வெளிச்சமுமாயிருக்கிறது.” · சங்கீதம் 119:105',
  '“ஜெபத்தில் நிலைத்திருங்கள்.” · கொலோசெயர் 4:2',
  '“பிள்ளையை அவன் நடக்கவேண்டிய வழியிலே நடத்து.” · நீதிமொழிகள் 22:6',
  '“சிறு பிள்ளைகள் என்னிடத்தில் வரட்டும்.” · மத்தேயு 19:14',
  '“நீதிமான் செய்யும் ஜெபம் வல்லமையானது.” · யாக்கோபு 5:16',
  '“ஒருவரையொருவர் தேற்றி கட்டுங்கள்.” · 1 தெசலோனிக்கேயர் 5:11',
  '“கொடுங்கள், அப்பொழுது உங்களுக்கும் கொடுக்கப்படும்.” · லூக்கா 6:38',
  '“தம்மை நோக்கிக் கூப்பிடுகிற அனைவருக்கும் கர்த்தர் சமீபமாயிருக்கிறார்.” · சங்கீதம் 145:18',
  '“அன்பினால் ஒருவருக்கொருவர் பணிவிடை செய்யுங்கள்.” · கலாத்தியர் 5:13',
  '“நம்பிக்கையிலே சந்தோஷமாயிருங்கள்; உபத்திரவத்திலே பொறுமையாயிருங்கள்; ஜெபத்தில் உறுதியாயிருங்கள்.” · ரோமர் 12:12'
];

const addSpiritualCardMedia = () => {
  const cards = document.querySelectorAll('.feature-card, .service-card, .event-card, .detail-card');
  cards.forEach((card, index) => {
    if (card.querySelector('.card-media')) return;
    const media = document.createElement('div');
    media.className = 'card-media';
    media.style.backgroundImage = `url('${spiritualCardImages[index % spiritualCardImages.length]}')`;
    media.setAttribute('role', 'img');
    media.setAttribute('aria-label', 'Faith and community ministry image');
    media.innerHTML = `<span class="scripture-bubble"><span class="lang" data-lang="en">${scriptureBubbles[index % scriptureBubbles.length]}</span><span class="lang" data-lang="ta">${scriptureBubblesTamil[index % scriptureBubblesTamil.length]}</span></span>`;
    card.prepend(media);
  });
};

const updateLatestStreamPreview = () => {
  const badge = document.querySelector('.live-badge');
  const title = document.querySelector('.video-card h3');
  const description = document.querySelector('.video-card-content p');
  const secondaryLink = document.querySelector('.video-card-content .link-btn');
  if (!badge || !title || !description) return;

  badge.querySelector('[data-lang="en"]').textContent = 'Latest Stream';
  badge.querySelector('[data-lang="ta"]').textContent = 'சமீபத்திய நேரலை';
  title.querySelector('[data-lang="en"]').textContent = 'Latest Worship Service';
  title.querySelector('[data-lang="ta"]').textContent = 'சமீபத்திய ஆராதனை சேவை';
  description.querySelector('[data-lang="en"]').textContent = 'Watch the latest worship service from Denver Tamil Church.';
  description.querySelector('[data-lang="ta"]').textContent = 'டென்வர் தமிழ் சர்ச்சின் சமீபத்திய ஆராதனை சேவையைப் பாருங்கள்.';
  description.remove();
  secondaryLink?.remove();
};

const addUpcomingEventSlide = () => {
  if (getPageKey() !== 'index.html') return;
  const events = document.querySelector('.events');
  const eventGrid = events?.querySelector('.event-grid');
  if (!events || !eventGrid || events.querySelector('.event-poster')) return;

  const slideSource = 'assets/ChatGPT%20Image%20Aug%202%2C%202026%2C%2009_30_53%20AM.png';
  eventGrid.remove();
  const poster = document.createElement('button');
  poster.type = 'button';
  poster.className = 'event-poster';
  poster.innerHTML = `<img src="${slideSource}" alt="Denver Tamil Church Power Surge summer events poster" width="1672" height="941" loading="lazy" /><span class="event-poster-caption"><span class="lang" data-lang="en">View upcoming events</span><span class="lang" data-lang="ta">வரவிருக்கும் நிகழ்வுகளைப் பார்க்கவும்</span></span>`;
  events.append(poster);

  const dialog = document.createElement('dialog');
  dialog.className = 'event-slide-dialog';
  dialog.innerHTML = `<button class="event-dialog-close" type="button" aria-label="Close event slide">×</button><img src="${slideSource}" alt="Denver Tamil Church Power Surge summer events poster" />`;
  document.body.append(dialog);
  poster.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.event-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
};

const addUpcomingEventCarousel = async () => {
  if (getPageKey() !== 'index.html') return;
  const events = document.querySelector('.events');
  const eventGrid = events?.querySelector('.event-grid');
  if (!events || !eventGrid || events.querySelector('.event-carousel')) return;

  const fallbackSlide = 'assets/ChatGPT%20Image%20Aug%202%2C%202026%2C%2009_30_53%20AM.png';
  let slides = [];
  try {
    const response = await fetch('/api/upcoming-events', { cache: 'no-store' });
    if (response.ok) slides = await response.json();
  } catch (error) { /* Static hosts use the manifest fallback below. */ }
  if (!Array.isArray(slides) || !slides.length) {
    try {
      const response = await fetch('assets/upcoming/manifest.json', { cache: 'no-store' });
      if (response.ok) slides = await response.json();
    } catch (error) { /* Use the existing poster until new slides are supplied. */ }
  }
  if (!Array.isArray(slides) || !slides.length) slides = [fallbackSlide];

  // One-line summaries transcribed from each event poster.
  const eventSummaries = [
    { match: '01_32_27', en: 'Church Picnic · August 22 · Food, fellowship, fun, and faith', ta: 'சபை சுற்றுலா · ஆகஸ்ட் 22 · உணவு, ஐக்கியம், மகிழ்ச்சி மற்றும் விசுவாசம்' },
    { match: '08_22_15', en: 'Sunday Service · Sundays at 4:30 PM · Everyone is welcome', ta: 'ஞாயிறு ஆராதனை · ஞாயிறு மாலை 4:30 · அனைவரும் வரவேற்கப்படுகிறார்கள்' },
    { match: '09_16_32', en: 'Homeless Outreach · August 8 · Cook, serve, and love', ta: 'வீடற்றோர் சேவை · ஆகஸ்ட் 8 · சமைப்போம், சேவை செய்வோம், அன்பு செலுத்துவோம்' },
    { match: '09_30_53', en: 'Power Surge · Summer services, outreach, school bash, and picnic', ta: 'பவர் சர்ஜ் · கோடை ஆராதனைகள், சமூக சேவை, பள்ளி விழா மற்றும் சுற்றுலா' },
    { match: '10_38_46', en: 'VBS 2026 · Wonder Junction · Bible learning and summer fun', ta: 'VBS 2026 · வொண்டர் ஜங்ஷன் · வேதாகமக் கற்றலும் கோடை மகிழ்ச்சியும்' },
    { match: '05_28_37', en: 'Back to School Bash · August 16 at 4:30 PM', ta: 'பள்ளிக்குத் திரும்பும் விழா · ஆகஸ்ட் 16 மாலை 4:30' },
    { match: '08_29_36', en: 'Homeless Outreach & Food Service · August 8 at Salvation Army Denver', ta: 'வீடற்றோர் உணவு சேவை · ஆகஸ்ட் 8 · சால்வேஷன் ஆர்மி டென்வர்' }
  ];
  const getEventSummary = (slide) => eventSummaries.find((summary) => slide.includes(summary.match)) || {
    en: 'Upcoming Denver Tamil Church event',
    ta: 'வரவிருக்கும் டென்வர் தமிழ் சபை நிகழ்வு'
  };

  eventGrid.remove();
  const carousel = document.createElement('div');
  carousel.className = 'event-carousel upcoming-event-card';
  carousel.innerHTML = `<button class="event-carousel-slide" type="button" aria-label="Open upcoming event slide"><span class="event-carousel-caption"><span class="lang" data-lang="en"></span><span class="lang" data-lang="ta"></span></span><img alt="Denver Tamil Church upcoming event slide" width="1672" height="941" loading="lazy" /></button><div class="event-carousel-dots" aria-label="Event slide navigation"></div>`;
  events.append(carousel);

  const dialog = document.createElement('dialog');
  dialog.className = 'event-slide-dialog';
  dialog.innerHTML = '<button class="event-dialog-close" type="button" aria-label="Close event slide">×</button><button class="event-dialog-nav event-dialog-prev" type="button" aria-label="Show previous event">‹</button><img alt="Denver Tamil Church upcoming event slide" /><button class="event-dialog-nav event-dialog-next" type="button" aria-label="Show next event">›</button><p class="event-dialog-position" aria-live="polite"></p>';
  document.body.append(dialog);
  const image = carousel.querySelector('img');
  const captionEnglish = carousel.querySelector('.event-carousel-caption [data-lang="en"]');
  const captionTamil = carousel.querySelector('.event-carousel-caption [data-lang="ta"]');
  const slideButton = carousel.querySelector('.event-carousel-slide');
  const dots = carousel.querySelector('.event-carousel-dots');
  const dialogImage = dialog.querySelector('img');
  const dialogPosition = dialog.querySelector('.event-dialog-position');
  const previousButton = dialog.querySelector('.event-dialog-prev');
  const nextButton = dialog.querySelector('.event-dialog-next');
  let current = 0;
  let rotation;

  const showSlide = (nextIndex) => {
    current = (nextIndex + slides.length) % slides.length;
    const summary = getEventSummary(slides[current]);
    captionEnglish.textContent = summary.en;
    captionTamil.textContent = summary.ta;
    image.classList.remove('is-visible');
    window.setTimeout(() => {
      image.onload = () => image.classList.add('is-visible');
      image.src = slides[current];
    }, 160);
    [...dots.children].forEach((dot, index) => dot.classList.toggle('is-active', index === current));
  };
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show event slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dots.append(dot);
  });
  const showDialogSlide = (nextIndex) => {
    showSlide(nextIndex);
    dialogImage.src = slides[current];
    dialogImage.alt = `Denver Tamil Church upcoming event ${current + 1} of ${slides.length}`;
    dialogPosition.textContent = `${current + 1} / ${slides.length}`;
  };
  previousButton.hidden = slides.length < 2;
  nextButton.hidden = slides.length < 2;
  slideButton.addEventListener('click', () => {
    window.clearInterval(rotation);
    showDialogSlide(current);
    dialog.showModal();
  });
  previousButton.addEventListener('click', () => showDialogSlide(current - 1));
  nextButton.addEventListener('click', () => showDialogSlide(current + 1));
  dialog.querySelector('.event-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showDialogSlide(current - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showDialogSlide(current + 1);
    }
  });
  const startRotation = () => {
    window.clearInterval(rotation);
    if (slides.length > 1) rotation = window.setInterval(() => showSlide(current + 1), 5500);
  };
  dialog.addEventListener('close', startRotation);
  carousel.addEventListener('mouseenter', () => window.clearInterval(rotation));
  carousel.addEventListener('mouseleave', startRotation);
  showSlide(0);
  startRotation();
  setLanguage(localStorage.getItem('siteLanguage') || 'en');
};

const siteNavigation = [
  { page: 'index.html', href: 'index.html', en: 'Who We Are', ta: 'நாங்கள் யார்' },
  { page: 'ministry.html', href: 'ministry.html', en: 'Ministries', ta: 'ஊழியங்கள்', children: [
    { page: 'ministry.html', href: 'ministry.html', en: 'Ministry', ta: 'ஊழியம்' },
    { page: 'missions.html', href: 'missions.html', en: 'Mission', ta: 'மிஷன்' }
  ] },
  { page: 'live.html', href: 'live.html', en: 'Live Stream', ta: 'நேரலை' },
  { page: 'give.html', href: 'give.html', en: 'Give', ta: 'கொடுங்கள்' },
  { page: 'contact.html', href: 'contact.html', en: 'Contact', ta: 'தொடர்பு' },
  { page: 'events.html', href: 'events.html', en: 'Upcoming Events', ta: 'வரவிருக்கும் நிகழ்வுகள்', children: [
    { page: 'events.html', href: 'events.html', en: 'Upcoming Events', ta: 'வரவிருக்கும் நிகழ்வுகள்' },
    { page: 'gallery.html', href: 'gallery.html', en: 'Gallery', ta: 'புகைப்படங்கள்' }
  ] }
];

const normalizeNavigation = () => {
  const currentPage = getPageKey();
  document.querySelectorAll('.nav-links').forEach((nav, index) => {
    nav.innerHTML = siteNavigation.map((item, itemIndex) => {
      const isActive = item.page === currentPage || item.children?.some((child) => child.page === currentPage) || (item.page === 'events.html' && currentPage === 'event-details.html');
      if (item.children) {
        const menuId = `navigation-menu-${index}-${itemIndex}`;
        const submenu = item.children.map((child) => {
          const childActive = child.page === currentPage;
          return `<a class="nav-submenu-link${childActive ? ' nav-link--active' : ''}" href="${child.href}"${childActive ? ' aria-current="page"' : ''}><span class="lang" data-lang="en">${child.en}</span><span class="lang" data-lang="ta">${child.ta}</span></a>`;
        }).join('');
        return `<div class="nav-dropdown${isActive ? ' nav-dropdown--active' : ''}"><button class="nav-link nav-dropdown-toggle${isActive ? ' nav-link--active' : ''}" type="button" aria-expanded="false" aria-controls="${menuId}"><span class="lang" data-lang="en">${item.en}</span><span class="lang" data-lang="ta">${item.ta}</span><span class="nav-dropdown-arrow" aria-hidden="true"></span></button><div class="nav-submenu" id="${menuId}">${submenu}</div></div>`;
      }
      return `<a class="nav-link${isActive ? ' nav-link--active' : ''}" href="${item.href}"${isActive ? ' aria-current="page"' : ''}><span class="lang" data-lang="en">${item.en}</span><span class="lang" data-lang="ta">${item.ta}</span></a>`;
    }).join('');

    nav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
      const toggle = dropdown.querySelector('.nav-dropdown-toggle');
      toggle?.addEventListener('click', (event) => {
        event.stopPropagation();
        nav.querySelectorAll('.nav-dropdown.is-open').forEach((openDropdown) => {
          if (openDropdown !== dropdown) {
            openDropdown.classList.remove('is-open');
            openDropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
          }
        });
        const isOpen = dropdown.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      dropdown.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          dropdown.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
      document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target)) {
          dropdown.classList.remove('is-open');
          toggle?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
  setLanguage(localStorage.getItem('siteLanguage') || 'en');
};

const initContactSubject = () => {
  const subjectSelect = document.querySelector('#contact-subject');
  if (!subjectSelect) return;
  const requestedSubject = new URLSearchParams(window.location.search).get('subject');
  if (!requestedSubject) return;
  const hasOption = [...subjectSelect.options].some((option) => option.value === requestedSubject);
  if (hasOption) subjectSelect.value = requestedSubject;
};

const initStickyNavigation = () => {
  const homeNav = document.querySelector('.home-page-header .navbar, .hero .navbar');
  if (!homeNav) return;
  const updateHomeNav = () => homeNav.classList.toggle('is-scrolled', window.scrollY > 110);
  updateHomeNav();
  window.addEventListener('scroll', updateHomeNav, { passive: true });
};

const restoreHomeMenuPosition = () => {
  if (getPageKey() !== 'index.html') return;
  const headerTop = document.querySelector('.home-page-header, .hero > .header-top');
  const menu = headerTop?.querySelector('.navbar') || document.querySelector('.hero > .navbar');
  const languageCard = headerTop?.querySelector('.lang-card');
  if (!headerTop || !menu || !languageCard) return;
  headerTop.insertBefore(menu, languageCard);
  headerTop.classList.add('home-page-header');
  document.body.prepend(headerTop);
};

const initSharedHeaderIdentity = () => {
  const headers = document.querySelectorAll('.home-page-header, .page-nav');
  const socialLinks = [
    { href: 'https://www.facebook.com/denver.tamilchurch01/', label: 'Facebook', icon: '<span aria-hidden="true">f</span>' },
    { href: 'https://www.instagram.com/denver.tamilchurch01/', label: 'Instagram', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.7" r="1.2" fill="currentColor"/></svg>' },
    { href: 'https://www.youtube.com/@TamilChurchDenver', label: 'YouTube', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>' }
  ];

  headers.forEach((header) => {
    const brand = header.querySelector('.brand');
    const languageControl = header.querySelector('.lang-card, .lang-switch');
    brand?.querySelector('.brand-name')?.remove();
    if (brand && !header.querySelector('.header-service-countdown')) {
      let brandCluster = brand.closest('.brand-wrapper, .header-brand-cluster');
      if (!brandCluster) {
        brandCluster = document.createElement('div');
        brandCluster.className = 'header-brand-cluster';
        brand.before(brandCluster);
        brandCluster.append(brand);
      } else {
        brandCluster.classList.add('header-brand-cluster');
      }

      const widget = document.createElement('div');
      const panelId = `service-countdown-${Math.random().toString(36).slice(2, 8)}`;
      widget.className = 'header-service-countdown';
      widget.innerHTML = `<button class="header-service-time" type="button" aria-expanded="false" aria-controls="${panelId}"><span class="service-time-line"><span class="lang" data-lang="en"><strong>Sunday Service</strong><i aria-hidden="true">|</i><small>4:30 PM</small></span><span class="lang" data-lang="ta"><strong>ஞாயிறு ஆராதனை</strong><i aria-hidden="true">|</i><small>மாலை 4:30</small></span><span class="service-countdown-chevron" aria-hidden="true"></span></span><span class="service-countdown-compact" aria-label="Time remaining until Sunday service"><b data-countdown-compact="days">00</b>D <i>:</i> <b data-countdown-compact="hours">00</b>H <i>:</i> <b data-countdown-compact="minutes">00</b>M <i>:</i> <b data-countdown-compact="seconds">00</b>S</span></button><span class="service-address-line"><strong>9052 W Ken Caryl Ave</strong><span>Littleton, CO 80128</span></span><div class="service-countdown-panel" id="${panelId}"><p>COUNTDOWN TO SUNDAY</p><strong class="service-countdown-next-date"></strong><div class="service-countdown-values"><span><strong data-countdown="days">00</strong><small>Day(s)</small></span><span><strong data-countdown="hours">00</strong><small>Hour(s)</small></span><span><strong data-countdown="minutes">00</strong><small>Minute(s)</small></span><span><strong data-countdown="seconds">00</strong><small>Second(s)</small></span></div><div class="service-countdown-details"><span><strong>Worship Service</strong> · Sundays at 4:30 PM</span><span>9052 W Ken Caryl Ave · Littleton, CO</span></div><div class="service-countdown-actions"><a href="live.html">Watch Live →</a><a href="contact.html">Plan Your Visit →</a></div></div>`;
      brandCluster.append(widget);

      const toggle = widget.querySelector('.header-service-time');
      toggle.addEventListener('click', () => {
        const open = widget.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      widget.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          widget.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
      document.addEventListener('click', (event) => {
        if (!widget.contains(event.target)) {
          widget.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
    if (!header.querySelector('.header-social-links')) {
      const socialGroup = document.createElement('div');
      socialGroup.className = 'header-social-links';
      socialLinks.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.setAttribute('aria-label', link.label);
        anchor.innerHTML = link.icon;
        socialGroup.append(anchor);
      });
      header.append(socialGroup);
    }
    if (languageControl) header.append(languageControl);
  });

  const zonedParts = (date) => Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23', weekday: 'short'
  }).formatToParts(date).filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  const getNextService = () => {
    const now = new Date();
    const local = zonedParts(now);
    const weekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(local.weekday);
    let daysUntil = (7 - weekdayIndex) % 7;
    if (daysUntil === 0 && (Number(local.hour) > 16 || (Number(local.hour) === 16 && Number(local.minute) >= 30))) daysUntil = 7;
    const desired = Date.UTC(Number(local.year), Number(local.month) - 1, Number(local.day) + daysUntil, 16, 30, 0);
    let target = desired;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const actual = zonedParts(new Date(target));
      const actualAsUtc = Date.UTC(Number(actual.year), Number(actual.month) - 1, Number(actual.day), Number(actual.hour), Number(actual.minute), Number(actual.second));
      target += desired - actualAsUtc;
    }
    return target;
  };
  let nextService = getNextService();
  document.querySelectorAll('.service-countdown-next-date').forEach((node) => {
    node.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Denver', weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    }).format(new Date(nextService));
  });
  const updateCountdown = () => {
    if (Date.now() >= nextService) {
      nextService = getNextService();
      document.querySelectorAll('.service-countdown-next-date').forEach((node) => {
        node.textContent = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(nextService));
      });
    }
    const remaining = Math.max(0, nextService - Date.now());
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    document.querySelectorAll('[data-countdown]').forEach((node) => {
      node.textContent = String(values[node.dataset.countdown]).padStart(2, '0');
    });
    document.querySelectorAll('[data-countdown-compact]').forEach((node) => {
      node.textContent = String(values[node.dataset.countdownCompact]).padStart(2, '0');
    });
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
};

const removeRepeatedContent = () => {
  // Home is already present in the shared sticky navigation on every page.
  document.querySelectorAll('.page-home-link').forEach((link) => link.remove());

  // The latest-stream thumbnail is clickable, so a second route to the same stream is unnecessary.
  document.querySelector('.live .btn-primary')?.remove();

  // This introduction belongs on the dedicated Who We Are page, not the homepage.
  if (getPageKey() === 'index.html') {
    document.querySelector('.live')?.remove();
    document.querySelector('#about')?.remove();
    document.querySelector('.features')?.remove();
    document.querySelector('.services')?.remove();
  }

};

const arrangeHomeEventsAndInfo = () => {
  if (getPageKey() !== 'index.html') return;
  const featured = document.querySelector('.home-featured');
  const events = document.querySelector('.events');
  const quickInfo = document.querySelector('.quick-info');
  if (!featured || !quickInfo || document.querySelector('.home-featured-events-layout')) return;
  if (!events) {
    quickInfo.classList.add('home-quick-info-bottom');
    document.querySelector('main')?.append(quickInfo);
    return;
  }

  const featureRow = document.createElement('div');
  featureRow.className = 'home-featured-events-layout';
  featured.before(featureRow);
  featureRow.append(featured, events);

  const infoColumn = document.createElement('div');
  infoColumn.className = 'home-quick-info-layout';
  const whoContent = document.querySelector('.home-who-content');
  if (whoContent) {
    featureRow.after(whoContent);
    whoContent.after(infoColumn);
  } else {
    featureRow.after(infoColumn);
  }
  infoColumn.append(quickInfo);
};

const initFeaturedHeroRotation = () => {
  const featuredBlocks = document.querySelectorAll(
    '.page-featured, .give-hero-panel, .missions-hero-panel, .contact-hero-panel'
  );
  if (!featuredBlocks.length) return;

  featuredBlocks.forEach((block) => {
    const images = block.classList.contains('give-hero-panel')
      ? featuredHeroImages.give
      : block.classList.contains('missions-hero-panel')
        ? featuredHeroImages.missions
        : block.classList.contains('contact-hero-panel')
          ? featuredHeroImages.contact
          : block.classList.contains('home-featured')
            ? featuredHeroImages.home
            : featuredHeroImages.who;
    const bg = document.createElement('div');
    bg.className = 'page-featured-bg active';
    bg.style.backgroundImage = `url('${images[0]}')`;
    block.prepend(bg);
    if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let index = 1;

    setInterval(() => {
      const nextBg = document.createElement('div');
      nextBg.className = 'page-featured-bg';
      nextBg.style.backgroundImage = `url('${images[index]}')`;
      block.prepend(nextBg);

      requestAnimationFrame(() => {
        nextBg.classList.add('active');
      });

      setTimeout(() => {
        const previousBg = block.querySelectorAll('.page-featured-bg');
        if (previousBg.length > 1) {
          previousBg[previousBg.length - 1].remove();
        }
      }, 1200);

      index = (index + 1) % images.length;
    }, 6000);
  });
};

const initHomeHeroBackground = () => {
  if (getPageKey() !== 'index.html') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const background = document.createElement('div');
  background.className = 'hero-background';
  background.setAttribute('aria-hidden', 'true');
  const slideElements = homeHeroSlides.map((slide, index) => {
    const element = document.createElement('div');
    element.className = `hero-background-slide${index === 0 ? ' is-active' : ''}`;
    element.style.backgroundImage = `url('${slide.src}')`;
    background.append(element);
    return element;
  });
  hero.prepend(background);

  let current = 0;
  const showSlide = (next) => {
    slideElements[current].classList.remove('is-active');
    hero.classList.remove(`hero-tone-${homeHeroSlides[current].tone}`);
    current = next;
    slideElements[current].classList.add('is-active');
    hero.classList.add(`hero-tone-${homeHeroSlides[current].tone}`);
  };
  hero.classList.add(`hero-tone-${homeHeroSlides[0].tone}`);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => showSlide((current + 1) % homeHeroSlides.length), 7000);
  }
};

const initPreviousServices = async () => {
  if (getPageKey() !== 'live.html') return;
  const track = document.querySelector('.previous-services-track');
  const left = document.querySelector('.previous-services-arrow--left');
  const right = document.querySelector('.previous-services-arrow--right');
  if (!track || !left || !right) return;

  const updateArrows = () => {
    left.disabled = track.scrollLeft <= 4;
    right.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  const move = (direction) => track.scrollBy({ left: direction * Math.max(280, track.clientWidth * .8), behavior: 'smooth' });
  left.addEventListener('click', () => move(-1));
  right.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  try {
    const response = await fetch('/api/youtube-videos', { cache: 'no-store' });
    if (!response.ok) throw new Error('Video feed unavailable');
    const currentVideoId = document.querySelector('.live-embed iframe')?.src.match(/\/embed\/([^?]+)/)?.[1];
    const videos = (await response.json()).filter((video) => video.id !== currentVideoId);
    if (!Array.isArray(videos) || !videos.length) throw new Error('No recent videos');
    const formatter = new Intl.DateTimeFormat(document.documentElement.lang === 'ta' ? 'ta-IN' : 'en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    track.innerHTML = videos.map((video) => `
      <article class="previous-service-card">
        <a href="${video.url}" target="_blank" rel="noopener noreferrer">
          <span class="previous-service-image">
            <img src="${video.thumbnail}" alt="" width="480" height="360" loading="lazy" />
            <span class="previous-service-play" aria-hidden="true">▶</span>
          </span>
          <span class="previous-service-content">
            <time datetime="${video.published}">${formatter.format(new Date(video.published))}</time>
            <strong>${video.title}</strong>
          </span>
        </a>
      </article>`).join('');
  } catch (error) {
    track.innerHTML = '<p class="previous-services-empty"><span class="lang" data-lang="en">Recent services could not be loaded. Please view them on our YouTube channel.</span><span class="lang" data-lang="ta">சமீபத்திய ஆராதனைகளை ஏற்ற முடியவில்லை. எங்கள் YouTube சேனலில் பார்க்கவும்.</span></p>';
    setLanguage(localStorage.getItem('siteLanguage') || 'en');
  }
  updateArrows();
};

const initGallery = async () => {
  if (getPageKey() !== 'gallery.html') return;
  const grid = document.querySelector('.gallery-album-grid');
  const dialog = document.querySelector('.gallery-dialog');
  const dialogTitle = dialog?.querySelector('#gallery-dialog-title');
  const count = dialog?.querySelector('.gallery-dialog-count');
  const viewerImage = dialog?.querySelector('.gallery-viewer-image');
  const thumbnails = dialog?.querySelector('.gallery-thumbnails');
  const previous = dialog?.querySelector('.gallery-viewer-arrow--left');
  const next = dialog?.querySelector('.gallery-viewer-arrow--right');
  if (!grid || !dialog || !dialogTitle || !count || !viewerImage || !thumbnails || !previous || !next) return;

  const albumCovers = {
    'sunday-services': 'assets/images/church-sanctuary-hero.jpg',
    'vbs': 'assets/upcoming/ChatGPT%20Image%20Jul%2011%2C%202026%2C%2010_38_46%20PM.png',
    'prayer-night': 'assets/images/church-sanctuary-hero.jpg',
    'christmas': 'assets/upcoming/ChatGPT%20Image%20Aug%202%2C%202026%2C%2009_16_32%20AM.png',
    'easter': 'assets/upcoming/ChatGPT%20Image%20Jul%2012%2C%202026%2C%2005_28_37%20PM%20%282%29.png',
    'youth': 'assets/upcoming/ChatGPT%20Image%20Aug%202%2C%202026%2C%2001_32_27%20PM.png',
    'womens-ministry': 'assets/upcoming/ChatGPT%20Image%20Aug%202%2C%202026%2C%2008_22_15%20PM.png',
    'community-outreach': 'assets/images/church-missions-hero.jpg'
  };

  let activeImages = [];
  let activeIndex = 0;
  const showImage = (index) => {
    if (!activeImages.length) return;
    activeIndex = (index + activeImages.length) % activeImages.length;
    viewerImage.src = activeImages[activeIndex];
    viewerImage.alt = `${dialogTitle.textContent} photo ${activeIndex + 1}`;
    count.textContent = `${activeIndex + 1} / ${activeImages.length}`;
    thumbnails.querySelectorAll('button').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === activeIndex);
      if (buttonIndex === activeIndex) button.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
  };
  const openAlbum = (album) => {
    if (!album.images.length) return;
    activeImages = album.images;
    dialogTitle.textContent = album.name;
    thumbnails.innerHTML = album.images.map((image, index) => `<button type="button" aria-label="View photo ${index + 1}"><img src="${image}" alt="" loading="lazy" /></button>`).join('');
    thumbnails.querySelectorAll('button').forEach((button, index) => button.addEventListener('click', () => showImage(index)));
    showImage(0);
    dialog.showModal();
  };
  previous.addEventListener('click', () => showImage(activeIndex - 1));
  next.addEventListener('click', () => showImage(activeIndex + 1));
  dialog.querySelector('.gallery-dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
    if (event.key === 'ArrowRight') showImage(activeIndex + 1);
  });

  try {
    let response = await fetch('/api/gallery', { cache: 'no-store' });
    if (!response.ok) response = await fetch('assets/gallery/manifest.json', { cache: 'no-store' });
    const albums = await response.json();
    if (!Array.isArray(albums)) throw new Error('Invalid gallery data');
    grid.innerHTML = albums.map((album, index) => {
      const hasPhotos = album.images.length > 0;
      const cover = album.images[0] || albumCovers[album.slug] || 'assets/images/church-sanctuary-hero.jpg';
      return `<article class="gallery-album-card${hasPhotos ? '' : ' is-empty'}">
        <button type="button" data-album-index="${index}"${hasPhotos ? '' : ' disabled'}>
          <span class="gallery-album-cover"><img src="${cover}" alt="${album.name} album cover" loading="lazy" /></span>
          <span class="gallery-album-content"><strong>${album.name}</strong><span>${album.images.length} photo${album.images.length === 1 ? '' : 's'}</span></span>
        </button>
      </article>`;
    }).join('');
    grid.querySelectorAll('[data-album-index]').forEach((button) => button.addEventListener('click', () => openAlbum(albums[Number(button.dataset.albumIndex)])));
  } catch (error) {
    grid.innerHTML = '<p class="gallery-empty"><span class="lang" data-lang="en">Gallery albums could not be loaded.</span><span class="lang" data-lang="ta">புகைப்படத் தொகுப்புகளை ஏற்ற முடியவில்லை.</span></p>';
    setLanguage(localStorage.getItem('siteLanguage') || 'en');
  }
};

const initSharedContactStrip = () => {
  if (['index.html', 'contact.html'].includes(getPageKey())) return;
  const footer = document.querySelector('.footer, .page-footer');
  if (!footer || document.querySelector('.shared-contact-strip')) return;
  const strip = document.createElement('section');
  strip.className = 'shared-contact-strip';
  strip.setAttribute('aria-label', 'Church contact information');
  strip.innerHTML = `
    <article class="shared-contact-card shared-contact-card--visit">
      <span class="shared-contact-image" aria-hidden="true"></span>
      <div class="shared-contact-content">
        <h2><span class="lang" data-lang="en">Visit Us</span><span class="lang" data-lang="ta">எங்களை சந்திக்கவும்</span></h2>
        <p>9052 W Ken Caryl Ave<br />Littleton, CO 80128</p>
        <a href="https://www.google.com/maps/search/?api=1&amp;query=9052+W+Ken+Caryl+Ave%2C+Littleton%2C+CO+80128" target="_blank" rel="noopener noreferrer"><span class="lang" data-lang="en">Get Directions →</span><span class="lang" data-lang="ta">வழிகாட்டுதல்கள் →</span></a>
      </div>
    </article>
    <article class="shared-contact-card shared-contact-card--call">
      <span class="shared-contact-image" aria-hidden="true"></span>
      <div class="shared-contact-content">
        <h2><span class="lang" data-lang="en">Call Us</span><span class="lang" data-lang="ta">எங்களை அழைக்கவும்</span></h2>
        <a href="tel:+17208195990">(720) 819-5990</a>
      </div>
    </article>
    <article class="shared-contact-card shared-contact-card--email">
      <span class="shared-contact-image" aria-hidden="true"></span>
      <div class="shared-contact-content">
        <h2><span class="lang" data-lang="en">Email Us</span><span class="lang" data-lang="ta">மின்னஞ்சல் அனுப்பவும்</span></h2>
        <a href="mailto:info@denvertamilchurch.com">info@denvertamilchurch.com</a>
      </div>
    </article>`;
  footer.before(strip);
  setLanguage(localStorage.getItem('siteLanguage') || 'en');
};

const initInteractiveContactCards = () => {
  document.querySelectorAll('.shared-contact-card, .contact-details .contact-detail-block').forEach((card) => {
    const action = card.querySelector('a');
    if (!action || card.dataset.interactive === 'true') return;
    card.dataset.interactive = 'true';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', `${card.querySelector('h2')?.textContent.trim() || 'Contact'}: ${action.textContent.trim()}`);
    card.addEventListener('click', (event) => {
      if (!event.target.closest('a')) action.click();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        action.click();
      }
    });
  });
};

const initChurchChat = () => {
  if (!document.querySelector('.church-chat')) {
    const shell = document.createElement('div');
    shell.className = 'church-chat-shell';
    shell.innerHTML = `
      <button class="church-chat-launcher" type="button" aria-controls="church-chat-panel" aria-expanded="false">
        <span class="church-chat-launcher-icon" aria-hidden="true"><img src="assets/lOGO.png" alt="" width="142" height="94" /></span><span>Ask Us</span>
      </button>
      <div class="church-chat-backdrop" aria-hidden="true"></div>
      <section class="church-chat" id="church-chat-panel" aria-labelledby="church-chat-title" aria-hidden="true">
        <button class="church-chat-close" type="button" aria-label="Close website assistant">×</button>
        <div class="church-chat-intro">
          <p class="eyebrow">Website Assistant</p><h2 id="church-chat-title">How can we help?</h2>
          <p>Ask about service times, our beliefs, ministries, events, livestreams, giving, visiting, or contacting the church.</p>
          <div class="church-chat-suggestions" aria-label="Suggested questions">
            <button type="button" data-chat-question="What time is Sunday service?">Service times</button>
            <button type="button" data-chat-question="What do you believe?">Our beliefs</button>
            <button type="button" data-chat-question="Where is the church?">Plan a visit</button>
            <button type="button" data-chat-question="How can I watch online?">Watch online</button>
            <button type="button" data-chat-connect>Connect with us</button>
          </div>
        </div>
        <div class="church-chat-window">
          <div class="church-chat-header"><span class="church-chat-avatar" aria-hidden="true"><img src="assets/lOGO.png" alt="" width="142" height="94" /></span><div><strong>Denver Tamil Church Assistant</strong><span><i aria-hidden="true"></i> Ready to help</span></div></div>
          <div class="church-chat-messages" role="log" aria-live="polite" aria-relevant="additions"><div class="church-chat-message is-bot">Welcome! Ask me a question about Denver Tamil Church or anything published on this website.</div></div>
          <form class="church-chat-form"><label class="sr-only" for="church-chat-input">Ask the church website assistant</label><input id="church-chat-input" type="text" placeholder="Type your question…" autocomplete="off" maxlength="240" required /><button type="submit" aria-label="Send question">Send</button></form>
          <p class="church-chat-disclaimer">Answers come from this website. For personal or urgent requests, please contact the church directly.</p>
        </div>
      </section>`;
    document.body.append(shell);
  }

  const chat = document.querySelector('.church-chat');

  const launcher = document.querySelector('.church-chat-launcher');
  const closeButton = chat.querySelector('.church-chat-close');
  const backdrop = document.querySelector('.church-chat-backdrop');
  const messages = chat.querySelector('.church-chat-messages');
  const form = chat.querySelector('.church-chat-form');
  const input = chat.querySelector('#church-chat-input');
  const setChatOpen = (isOpen) => {
    chat.classList.toggle('is-open', isOpen);
    backdrop?.classList.toggle('is-open', isOpen);
    chat.setAttribute('aria-hidden', String(!isOpen));
    launcher?.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('chat-is-open', isOpen);
    if (isOpen) window.setTimeout(() => input.focus(), 260);
  };
  launcher?.addEventListener('click', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChatOpen(true);
      return;
    }
    launcher.classList.remove('is-launching');
    void launcher.offsetWidth;
    launcher.classList.add('is-launching');
    window.setTimeout(() => {
      launcher.classList.remove('is-launching');
      setChatOpen(true);
    }, 420);
  });
  closeButton?.addEventListener('click', () => setChatOpen(false));
  backdrop?.addEventListener('click', () => setChatOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && chat.classList.contains('is-open')) setChatOpen(false);
  });
  const knowledge = [
    { words: ['time', 'service', 'sunday', 'worship', 'when', 'communion', 'fasting', 'promise', 'women', 'bible', 'zoom', 'நேரம்', 'ஆராதனை'], answer: 'Sunday worship begins at 4:30 PM Mountain Time. Monthly gatherings include Communion on the first Sunday, Teen and Adult Service on the third Sunday, Fasting and Prayer on the first Saturday, Women’s Bible Study via Zoom on the first and third Thursdays, and God’s Promise Service at 6:00 AM on the first day.', link: ['View the event calendar', 'events.html'] },
    { words: ['address', 'location', 'where', 'visit', 'direction', 'parking', 'முகவரி', 'இடம்'], answer: 'Denver Tamil Church meets at 9052 W Ken Caryl Ave, Littleton, CO 80128.', link: ['Get directions', 'https://www.google.com/maps/search/?api=1&query=9052+W+Ken+Caryl+Ave%2C+Littleton%2C+CO+80128'] },
    { words: ['believe', 'belief', 'faith', 'doctrine', 'god', 'jesus', 'gospel', 'நம்பிக்கை', 'இயேசு'], answer: 'We believe in one God and Father, revealed through Jesus Christ in redemption and through the Holy Spirit working in grace. Our teaching is rooted in Scripture, prayer, heartfelt worship, holy living, and faithful discipleship.', link: ['Read about our faith', 'index.html#home-beliefs'] },
    { words: ['pastor', 'jude', 'leader', 'போதகர்'], answer: 'Pastor Jude Francis is a pastor, teacher, and marketplace minister who equips believers to live as authentic disciples of Christ. He is married to Merina Francis, and they have two daughters.', link: ['Meet our pastor', 'index.html'] },
    { words: ['mission', 'outreach', 'homeless', 'discipleship', 'ministry', 'serve', 'ஊழியம்'], answer: 'Our ministries include local Denver outreach, global missions support in India, and discipleship ministries for adults, women, youth, and young adults.', link: ['Explore missions', 'missions.html'] },
    { words: ['live', 'stream', 'youtube', 'online', 'video', 'watch', 'நேரலை'], answer: 'You can watch Sunday worship and browse recent services on the Live Stream page.', link: ['Open Live Stream', 'live.html'] },
    { words: ['event', 'upcoming', 'calendar', 'vbs', 'picnic', 'நிகழ்வு'], answer: 'The Upcoming Events page includes a month calendar, event posters, dates, locations, and complete event details.', link: ['See upcoming events', 'events.html'] },
    { words: ['give', 'giving', 'donate', 'offering', 'tithe', 'கொடை'], answer: 'The Give page explains the available ways to support Denver Tamil Church and its ministries.', link: ['View giving options', 'give.html'] },
    { words: ['gallery', 'photo', 'album', 'picture', 'புகைப்படம்'], answer: 'The Gallery contains church event albums. Select an album to browse all of its available photos.', link: ['Open Gallery', 'gallery.html'] },
    { words: ['prayer', 'request', 'pray', 'ஜெபம்'], answer: 'We would be honored to pray with you. Choose “Prayer Request” in the contact form above, or email the church directly.', link: ['Email a prayer request', 'mailto:info@denvertamilchurch.com'] },
    { words: ['phone', 'call', 'contact', 'email', 'reach', 'தொடர்பு'], answer: 'Call Denver Tamil Church at (720) 819-5990 or email info@denvertamilchurch.com. You can also use the contact form above.', link: ['Email the church', 'mailto:info@denvertamilchurch.com'] },
    { words: ['tamil', 'language', 'english', 'தமிழ்'], answer: 'The primary Sunday gathering is a Tamil service with Kids Sunday School. An English service is held every third Sunday. This website can also be switched between English and Tamil using the language control.' }
  ];
  const websitePages = [
    ['Who We Are', 'index.html'],
    ['Upcoming Events', 'events.html'],
    ['Missions', 'missions.html'],
    ['Live Stream', 'live.html'],
    ['Give', 'give.html'],
    ['Contact', 'contact.html'],
    ['Gallery', 'gallery.html']
  ];
  const stopWords = new Set(['about', 'after', 'also', 'and', 'are', 'can', 'for', 'from', 'have', 'how', 'our', 'that', 'the', 'this', 'what', 'when', 'where', 'which', 'with', 'you', 'your']);
  const tokenize = (value) => [...new Set(value.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [])]
    .filter((word) => word.length > 2 && !stopWords.has(word));
  const websiteIndexPromise = Promise.all(websitePages.map(async ([title, href]) => {
    try {
      const response = await fetch(href, { cache: 'no-store' });
      if (!response.ok) return [];
      const documentCopy = new DOMParser().parseFromString(await response.text(), 'text/html');
      documentCopy.querySelectorAll('script, style, nav, footer, [data-lang="ta"]').forEach((node) => node.remove());
      return [...documentCopy.querySelectorAll('main h1, main h2, main h3, main p, main li, main figcaption')]
        .map((node) => node.textContent.replace(/\s+/g, ' ').trim())
        .filter((text) => text.length >= 18)
        .map((text) => ({ title, href, text, tokens: tokenize(text) }));
    } catch (error) {
      return [];
    }
  })).then((groups) => groups.flat());

  const addMessage = (text, type, link) => {
    const message = document.createElement('div');
    message.className = `church-chat-message is-${type}`;
    const addLink = () => {
      if (!link) return;
      const anchor = document.createElement('a');
      anchor.href = link[1];
      anchor.textContent = `${link[0]} →`;
      if (link[1].startsWith('http')) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
      message.append(anchor);
    };
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    const shouldType = type === 'bot' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!shouldType) {
      message.textContent = text;
      addLink();
      return;
    }
    message.classList.add('is-typing');
    let character = 0;
    const typeNext = () => {
      character = Math.min(character + 2, text.length);
      message.textContent = text.slice(0, character);
      messages.scrollTop = messages.scrollHeight;
      if (character < text.length) window.setTimeout(typeNext, 18);
      else {
        message.classList.remove('is-typing');
        addLink();
        messages.scrollTop = messages.scrollHeight;
      }
    };
    typeNext();
  };

  let connectSession = null;
  const connectSteps = [
    ['name', 'What is your full name?'],
    ['email', 'What is your email address?'],
    ['phone', 'What is your phone number? Type “skip” if you prefer not to share it.'],
    ['subject', 'What would you like to contact the church about?'],
    ['message', 'Please type the message you would like to send.']
  ];
  const startConnect = () => {
    connectSession = { step: 0, data: {} };
    input.placeholder = 'Enter your full name…';
    addMessage(`Let’s connect you with Denver Tamil Church. ${connectSteps[0][1]} You can type “cancel” at any time.`, 'bot');
  };
  const stopConnect = (message) => {
    connectSession = null;
    input.placeholder = 'Type your question…';
    addMessage(message, 'bot');
  };
  const handleConnectAnswer = (answer) => {
    if (answer.toLocaleLowerCase() === 'cancel') {
      stopConnect('The Connect request was cancelled. You can continue asking questions about the website.');
      return;
    }
    const [field] = connectSteps[connectSession.step];
    const looksLikeQuestion = /\?|\b(what|when|where|who|why|how|service|pastor|belief|mission|event|stream|give|gallery)\b/i.test(answer);
    if (looksLikeQuestion) {
      stopConnect('That answer does not match the requested contact detail, so I ended the Connect form and cleared its information. I’ll answer it as a website question instead.');
      answerQuestion(answer);
      return;
    }
    if (field === 'name' && (!/^[\p{L}][\p{L}\p{M} .'’-]{1,79}$/u.test(answer) || /\d/.test(answer))) {
      stopConnect('Sorry, that does not look like a name, so I ended the Connect form and cleared its information. Select “Connect with us” to start again.');
      return;
    }
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer)) {
      if (answer.includes('@')) addMessage('That email format appears incomplete. Please enter a valid address such as name@example.com, or type “cancel”.', 'bot');
      else stopConnect('Sorry, that does not look like an email address, so I ended the Connect form and cleared its information. Select “Connect with us” to start again.');
      return;
    }
    if (field === 'phone' && answer.toLocaleLowerCase() !== 'skip') {
      const phoneDigits = answer.replace(/\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        stopConnect('Sorry, that does not look like a phone number, so I ended the Connect form and cleared its information. Select “Connect with us” to start again.');
        return;
      }
    }
    if (field === 'subject' && (answer.length < 3 || answer.length > 120)) {
      stopConnect('Sorry, that subject is not usable, so I ended the Connect form and cleared its information. Select “Connect with us” to start again.');
      return;
    }
    if (field === 'message' && (answer.length < 5 || answer.length > 1200)) {
      stopConnect('Sorry, that message is not usable, so I ended the Connect form and cleared its information. Select “Connect with us” to start again.');
      return;
    }
    connectSession.data[field] = field === 'phone' && answer.toLocaleLowerCase() === 'skip' ? 'Not provided' : answer;
    connectSession.step += 1;
    if (connectSession.step < connectSteps.length) {
      const [nextField, nextQuestion] = connectSteps[connectSession.step];
      input.placeholder = nextField === 'message' ? 'Type your message…' : 'Type your answer…';
      addMessage(nextQuestion, 'bot');
      return;
    }
    const details = connectSession.data;
    const subject = encodeURIComponent(`Website Connect Request: ${details.subject}`);
    const body = encodeURIComponent(`Name: ${details.name}\nEmail: ${details.email}\nPhone: ${details.phone}\n\nMessage:\n${details.message}`);
    const mailto = `mailto:info@denvertamilchurch.com?subject=${subject}&body=${body}`;
    connectSession = null;
    input.placeholder = 'Type your question…';
    addMessage('Thank you. Your email application will open with all the details addressed to info@denvertamilchurch.com. Please review the message and press Send.', 'bot', ['Open prepared email', mailto]);
    window.location.href = mailto;
  };

  const answerQuestion = async (question) => {
    const normalized = question.toLocaleLowerCase();
    if (/\b(connect|join|message the church|contact the church)\b/.test(normalized)) {
      startConnect();
      return;
    }
    const ranked = knowledge
      .map((item) => ({ item, score: item.words.reduce((score, word) => score + (normalized.includes(word) ? 1 : 0), 0) }))
      .sort((a, b) => b.score - a.score);
    const match = ranked[0];
    if (match && match.score > 0) {
      window.setTimeout(() => addMessage(match.item.answer, 'bot', match.item.link), 280);
      return;
    }
    const queryTokens = tokenize(question);
    const websiteIndex = await websiteIndexPromise;
    const pageMatches = websiteIndex
      .map((entry) => ({ entry, score: queryTokens.reduce((score, token) => score + (entry.tokens.includes(token) ? 2 : entry.text.toLocaleLowerCase().includes(token) ? 1 : 0), 0) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score);
    window.setTimeout(() => {
      if (pageMatches.length) {
        const best = pageMatches[0].entry;
        addMessage(best.text, 'bot', [`Read more on ${best.title}`, best.href]);
      } else {
        addMessage('Sorry, I could not find that information on the Denver Tamil Church website. Please ask another question about the church, its services, beliefs, ministries, events, livestream, giving, gallery, or contact information.', 'bot');
      }
    }, 280);
  };

  const submitQuestion = (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    addMessage(cleanQuestion, 'user');
    input.value = '';
    if (connectSession) handleConnectAnswer(cleanQuestion);
    else answerQuestion(cleanQuestion);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuestion(input.value);
  });
  chat.querySelectorAll('[data-chat-question]').forEach((button) => {
    button.addEventListener('click', () => submitQuestion(button.dataset.chatQuestion));
  });
  chat.querySelectorAll('[data-chat-connect]').forEach((button) => {
    button.addEventListener('click', startConnect);
  });
};

const initHomeLiveLauncher = () => {
  if (getPageKey() === 'live.html' || document.querySelector('.home-live-launcher')) return;
  document.body.classList.add('has-live-launcher');
  const link = document.createElement('a');
  link.className = 'home-live-launcher';
  link.href = 'live.html';
  link.setAttribute('aria-label', 'Open Live Stream page');
  link.innerHTML = '<span class="home-live-launcher-icon" aria-hidden="true">▶</span><span><small>Sunday Service</small>Live Stream</span>';
  link.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.location.href = link.href;
      return;
    }
    link.classList.add('is-launching');
    window.setTimeout(() => { window.location.href = link.href; }, 480);
  });
  document.body.append(link);
};

window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
  document.body.classList.add('is-loaded');
  restoreHomeMenuPosition();
  normalizeNavigation();
  initContactSubject();
  initSharedHeaderIdentity();
  initStickyNavigation();
  removeRepeatedContent();
  arrangeHomeEventsAndInfo();
  addSpiritualCardMedia();
  updateLatestStreamPreview();
  addUpcomingEventCarousel();
  setLanguage(localStorage.getItem('siteLanguage') || 'en');
  initHomeHeroBackground();
  initFeaturedHeroRotation();
  initPreviousServices();
  initGallery();
  initSharedContactStrip();
  initInteractiveContactCards();
  initChurchChat();
  initHomeLiveLauncher();

  document.querySelectorAll('a[href]').forEach((link) => {
    if (link.target || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
      return;
    }
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) {
      return;
    }
    if (url.pathname === location.pathname && url.hash) {
      return;
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = link.href;
      }, 220);
    });
  });
});

initLanguage();
