async function fetchAdminContent() {
  const response = await fetch('/api/content');
  if (!response.ok) throw new Error('Unable to fetch content');
  return response.json();
}
async function saveAdminContent(data) {
  const response = await fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Unable to save content');
}
function setValue(id, value) {
  const input = document.getElementById(id);
  if (input) input.value = value || '';
}
function getValue(id) {
  const input = document.getElementById(id);
  return input ? input.value : '';
}
async function loadAdmin() {
  try {
    const data = await fetchAdminContent();
    setValue('site-title', data.site.title);
    setValue('site-description', data.site.description);
    setValue('hero-eyebrow', data.hero.eyebrow);
    setValue('hero-title', data.hero.title);
    setValue('hero-text', data.hero.text);
    setValue('hero-primary-label', data.hero.primaryButton.label);
    setValue('hero-primary-href', data.hero.primaryButton.href);
    setValue('hero-secondary-label', data.hero.secondaryButton.label);
    setValue('hero-secondary-href', data.hero.secondaryButton.href);
    data.features.forEach((feature, index) => {
      setValue(`feature-title-${index+1}`, feature.title);
      setValue(`feature-text-${index+1}`, feature.text);
    });
    setValue('footer-address', data.footer.address);
    setValue('footer-phone', data.footer.phone);
    setValue('footer-email', data.footer.email);
    setValue('footer-service', data.footer.serviceText);
    setValue('footer-study', data.footer.studyText);
  } catch (error) {
    alert(error.message);
  }
}
async function submitAdmin(event) {
  event.preventDefault();
  try {
    const data = await fetchAdminContent();
    data.site.title = getValue('site-title');
    data.site.description = getValue('site-description');
    data.hero.eyebrow = getValue('hero-eyebrow');
    data.hero.title = getValue('hero-title');
    data.hero.text = getValue('hero-text');
    data.hero.primaryButton.label = getValue('hero-primary-label');
    data.hero.primaryButton.href = getValue('hero-primary-href');
    data.hero.secondaryButton.label = getValue('hero-secondary-label');
    data.hero.secondaryButton.href = getValue('hero-secondary-href');
    data.features = [
      { title: getValue('feature-title-1'), text: getValue('feature-text-1') },
      { title: getValue('feature-title-2'), text: getValue('feature-text-2') },
      { title: getValue('feature-title-3'), text: getValue('feature-text-3') }
    ];
    data.footer.address = getValue('footer-address');
    data.footer.phone = getValue('footer-phone');
    data.footer.email = getValue('footer-email');
    data.footer.serviceText = getValue('footer-service');
    data.footer.studyText = getValue('footer-study');
    await saveAdminContent(data);
    alert('Content saved successfully. Refresh the site to see updates.');
  } catch (error) {
    alert(error.message);
  }
}
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admin-form');
  if (form) {
    form.addEventListener('submit', submitAdmin);
  }
  loadAdmin();
});
