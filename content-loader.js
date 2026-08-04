async function loadSiteContent() {
  let response;
  try {
    response = await fetch('/api/content');
    if (!response.ok) throw new Error('API unavailable');
  } catch (error) {
    response = await fetch('content.json');
  }
  const data = await response.json();
  window.siteContent = data;
  if (data.site) {
    if (data.site.title) document.title = data.site.title;
  }
  renderNav(data.site.nav || []);
  const page = document.body.dataset.page;
  if (page) renderPage(page, data);
  const yearElem = document.getElementById('year');
  if (yearElem) yearElem.textContent = new Date().getFullYear();
}
function renderNav(navItems) {
  const nav = document.getElementById('nav-links');
  if (!nav || !navItems.length) return;
  nav.innerHTML = navItems
    .map(item => `<a href="${item.href}">${item.label}</a>`)
    .join('');
}
function renderPage(page, data) {
  if (page === 'home') renderHome(data);
  if (page === 'whoWeAre') renderTextPage(data.pages.whoWeAre);
  if (page === 'missions') renderTextPage(data.pages.missions);
  if (page === 'live') renderLivePage(data.pages.live, data.live);
  if (page === 'services') renderServicePage(data.pages.services, data.services);
  if (page === 'events') renderEventPage(data.pages.events, data.events);
  if (page === 'give') renderTextPage(data.pages.give);
  if (page === 'contact') renderContactPage(data.pages.contact);
}
function renderHome(data) {
  setText('hero-eyebrow', data.hero.eyebrow);
  setText('hero-title', data.hero.title);
  setText('hero-text', data.hero.text);
  setHref('hero-primary', data.hero.primaryButton.href);
  setText('hero-primary', data.hero.primaryButton.label);
  setHref('hero-secondary', data.hero.secondaryButton.href);
  setText('hero-secondary', data.hero.secondaryButton.label);
  renderList('features-list', data.features, feature => `
      <article class="feature-card">
        <h3>${feature.title}</h3>
        <p>${feature.text}</p>
      </article>`);
  setText('about-eyebrow', data.about.eyebrow);
  setText('about-title', data.about.headline);
  setText('about-p1', data.about.paragraphs[0]);
  setText('about-p2', data.about.paragraphs[1]);
  renderList('about-focus', data.about.focus, item => `<li>${item}</li>`);
  setText('live-eyebrow', data.live.eyebrow);
  setText('live-title', data.live.title);
  setText('live-text', data.live.text);
  setHref('live-button', data.live.button.href);
  setText('live-button', data.live.button.label);
  setText('live-detail', data.live.detail);
  setHref('live-detail-link', data.live.detailLink.href);
  setText('live-detail-link', data.live.detailLink.label);
  setText('services-headline', data.servicesHeadline || 'Service Times');
  renderList('services-list', data.services, service => `
        <article class="service-card">
          <h3>${service.title}</h3>
          <p>${service.time}</p>
          <span>${service.text}</span>
        </article>`);
  renderList('events-list', data.events, ev => `
        <article class="event-card">
          <h3>${ev.title}</h3>
          <p>${ev.when}</p>
          <span>${ev.text}</span>
          <a class="link-btn" href="${ev.linkHref}">${ev.linkLabel}</a>
        </article>`);
  setText('cta-title', data.cta.title);
  setText('cta-text', data.cta.text);
  setHref('cta-button', data.cta.button.href);
  setText('cta-button', data.cta.button.label);
  setText('footer-address', data.footer.address);
  setText('footer-phone', data.footer.phone);
  setText('footer-email', data.footer.email);
  setText('footer-service', data.footer.serviceText);
  setText('footer-study', data.footer.studyText);
}
function renderTextPage(pageData) {
  if (!pageData) return;
  setText('page-title', pageData.title);
  setText('page-subtitle', pageData.subtitle);
  renderList('page-sections', pageData.sections, section => `
        <section>
          <h2>${section.heading}</h2>
          <p>${section.text}</p>
        </section>`);
}
function renderLivePage(pageData, liveData) {
  renderTextPage(pageData);
  setHref('page-button', pageData.button.href);
  setText('page-button', pageData.button.label);
  if (liveData) {
    setText('live-section-title', liveData.title);
    setText('live-section-text', liveData.text);
  }
}
function renderServicePage(pageData, services) {
  renderTextPage(pageData);
  renderList('page-items', pageData.items, item => `
      <article class="service-card">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>`);
}
function renderEventPage(pageData, events) {
  renderTextPage(pageData);
  renderList('page-items', pageData.items, item => `
      <article class="event-card">
        <h3>${item.title}</h3>
        <p>${item.meta}</p>
        <span>${item.text}</span>
        <a class="link-btn" href="${item.linkHref}">${item.linkLabel}</a>
      </article>`);
}
function renderContactPage(pageData) {
  renderTextPage(pageData);
  setText('contact-address', pageData.address);
  setText('contact-phone', pageData.phone);
  setText('contact-email', pageData.email);
  setText('contact-service', pageData.serviceTimes);
  setText('contact-study', pageData.studyTimes);
}
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || '';
}
function setHref(id, href) {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = href || '#';
}
function renderList(id, items, template) {
  const container = document.getElementById(id);
  if (!container || !items) return;
  container.innerHTML = items.map(template).join('');
}
window.addEventListener('DOMContentLoaded', loadSiteContent);
