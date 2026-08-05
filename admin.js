const imageExtensions = /\.(jpe?g|png|webp)$/i;
const state = { project: null, galleryDir: null, upcomingDir: null, albums: [], eventImages: [], activeAlbum: null, objectUrls: [] };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const statusNode = $('[data-admin-status]');

const setStatus = (message, detail = '', type = '') => {
  statusNode.className = `admin-status${type ? ` is-${type}` : ''}`;
  $('strong', statusNode).textContent = message;
  $('small', statusNode).textContent = detail;
};
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const displayName = (slug) => slug.split('-').map((part) => part ? part[0].toUpperCase() + part.slice(1) : '').join(' ');
const encodePath = (...segments) => segments.map((segment) => encodeURIComponent(segment).replace(/%2F/gi, '/')).join('/');
const imageEntries = async (directory) => {
  const entries = [];
  for await (const entry of directory.values()) if (entry.kind === 'file' && imageExtensions.test(entry.name)) entries.push(entry);
  return entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
};
const applySavedOrder = (images, paths = []) => {
  const names = paths.map((path) => decodeURIComponent(path).split('/').pop());
  const rank = (image) => { const index = names.indexOf(image.name); return index < 0 ? Number.MAX_SAFE_INTEGER : index; };
  images.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, undefined, { numeric: true }));
};
const readJson = async (directory, name) => {
  try { const handle = await directory.getFileHandle(name); return JSON.parse(await (await handle.getFile()).text()); } catch { return null; }
};
const writeJson = async (directory, name, data) => {
  const handle = await directory.getFileHandle(name, { create: true });
  const writer = await handle.createWritable();
  await writer.write(`${JSON.stringify(data, null, 2)}\n`);
  await writer.close();
};
const uniqueName = async (directory, original) => {
  const clean = original.replace(/[^a-zA-Z0-9._() -]/g, '-').replace(/\s+/g, ' ').trim() || `church-photo-${Date.now()}.jpg`;
  const dot = clean.lastIndexOf('.');
  const base = dot > 0 ? clean.slice(0, dot) : clean;
  const extension = dot > 0 ? clean.slice(dot) : '';
  let candidate = clean;
  let counter = 2;
  while (true) { try { await directory.getFileHandle(candidate); candidate = `${base}-${counter}${extension}`; counter += 1; } catch { return candidate; } }
};
const copyFiles = async (directory, files) => {
  for (const file of files) {
    if (!imageExtensions.test(file.name)) continue;
    const name = await uniqueName(directory, file.name);
    const target = await directory.getFileHandle(name, { create: true });
    const writer = await target.createWritable();
    await writer.write(file);
    await writer.close();
  }
};
const clearObjectUrls = () => { state.objectUrls.forEach(URL.revokeObjectURL); state.objectUrls = []; };
const previewUrl = async (handle) => { const url = URL.createObjectURL(await handle.getFile()); state.objectUrls.push(url); return url; };
const formatBytes = (bytes) => bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

const saveGalleryManifest = async () => {
  const manifest = state.albums.map((album) => ({ slug: album.slug, name: album.name, images: album.images.map((image) => encodePath('assets', 'gallery', album.slug, image.name)) }));
  await writeJson(state.galleryDir, 'manifest.json', manifest);
};
const saveEventManifest = async () => {
  await writeJson(state.upcomingDir, 'manifest.json', state.eventImages.map((image) => encodePath('assets', 'upcoming', image.name)));
};
const loadMedia = async () => {
  clearObjectUrls();
  const assets = await state.project.getDirectoryHandle('assets');
  state.galleryDir = await assets.getDirectoryHandle('gallery', { create: true });
  state.upcomingDir = await assets.getDirectoryHandle('upcoming', { create: true });
  const savedGallery = await readJson(state.galleryDir, 'manifest.json');
  const names = new Map(Array.isArray(savedGallery) ? savedGallery.map((album) => [album.slug, album]) : []);
  state.albums = [];
  for await (const entry of state.galleryDir.values()) {
    if (entry.kind !== 'directory') continue;
    const images = await imageEntries(entry);
    const saved = names.get(entry.name);
    if (saved?.images?.length) applySavedOrder(images, saved.images);
    state.albums.push({ slug: entry.name, name: saved?.name || displayName(entry.name), handle: entry, images });
  }
  state.albums.sort((a, b) => a.name.localeCompare(b.name));
  state.eventImages = await imageEntries(state.upcomingDir);
  const savedEvents = await readJson(state.upcomingDir, 'manifest.json');
  if (Array.isArray(savedEvents)) applySavedOrder(state.eventImages, savedEvents);
  if (state.activeAlbum) state.activeAlbum = state.albums.find((album) => album.slug === state.activeAlbum.slug) || null;
  await Promise.all([saveGalleryManifest(), saveEventManifest()]);
  renderAlbums(); renderGallery(); renderEvents();
};

const renderAlbums = () => {
  $('[data-album-total]').textContent = state.albums.length;
  const list = $('[data-album-list]');
  if (!state.albums.length) { list.innerHTML = '<p class="admin-empty">No albums yet. Create your first album above.</p>'; return; }
  list.innerHTML = state.albums.map((album) => `<button class="admin-album-button${state.activeAlbum?.slug === album.slug ? ' is-active' : ''}" type="button" data-album="${album.slug}"><strong>${album.name}</strong><span>${album.images.length} photo${album.images.length === 1 ? '' : 's'}</span></button>`).join('');
  $$('[data-album]', list).forEach((button) => button.addEventListener('click', () => { state.activeAlbum = state.albums.find((album) => album.slug === button.dataset.album); renderAlbums(); renderGallery(); }));
};
const emptyState = (title, copy, icon = '▧') => `<div class="admin-empty-state"><span aria-hidden="true">${icon}</span><h3>${title}</h3><p>${copy}</p></div>`;
const createPhotoCard = async (image, index, total, context) => {
  const template = $('#admin-photo-template').content.cloneNode(true);
  const card = $('.admin-photo', template);
  const file = await image.getFile();
  $('img', card).src = await previewUrl(image);
  $('img', card).alt = `${context === 'gallery' ? 'Gallery photo' : 'Event poster'} preview: ${image.name}`;
  $('.admin-photo-info strong', card).textContent = image.name;
  $('.admin-photo-info small', card).textContent = `${formatBytes(file.size)} · ${index + 1} of ${total}`;
  if (index === 0) card.classList.add('is-cover');
  $('[data-action="cover"]', card).hidden = index === 0;
  $('[data-action="up"]', card).disabled = index === 0;
  $('[data-action="down"]', card).disabled = index === total - 1;
  $$('[data-action]', card).forEach((button) => button.addEventListener('click', () => handlePhotoAction(context, image, button.dataset.action)));
  return card;
};
const renderGallery = async () => {
  const grid = $('[data-gallery-grid]');
  const upload = $('[data-gallery-upload]');
  upload.disabled = !state.activeAlbum;
  upload.closest('.admin-upload').classList.toggle('is-disabled', !state.activeAlbum);
  $('[data-selected-album]').textContent = state.activeAlbum?.name || 'No album selected';
  $('[data-selected-summary]').textContent = state.activeAlbum ? `${state.activeAlbum.images.length} photo${state.activeAlbum.images.length === 1 ? '' : 's'} · first image is the cover` : 'Choose an album from the left.';
  if (!state.activeAlbum) { grid.innerHTML = emptyState('Your album photos will appear here.', 'Choose or create an album, then add JPG, PNG, or WebP photos.'); return; }
  if (!state.activeAlbum.images.length) { grid.innerHTML = emptyState('This album is ready for photos.', 'Select “Add Photos” to publish the first images.'); return; }
  grid.innerHTML = '';
  for (let index = 0; index < state.activeAlbum.images.length; index += 1) grid.append(await createPhotoCard(state.activeAlbum.images[index], index, state.activeAlbum.images.length, 'gallery'));
};
const renderEvents = async () => {
  const grid = $('[data-event-grid]');
  const upload = $('[data-event-upload]');
  upload.disabled = !state.project;
  upload.closest('.admin-upload').classList.toggle('is-disabled', !state.project);
  if (!state.eventImages.length) { grid.innerHTML = emptyState('No event posters are published.', 'Add posters to build the Upcoming Events carousel.', '◇'); return; }
  grid.innerHTML = '';
  for (let index = 0; index < state.eventImages.length; index += 1) grid.append(await createPhotoCard(state.eventImages[index], index, state.eventImages.length, 'events'));
};
const handlePhotoAction = async (context, image, action) => {
  const collection = context === 'gallery' ? state.activeAlbum.images : state.eventImages;
  const directory = context === 'gallery' ? state.activeAlbum.handle : state.upcomingDir;
  const index = collection.findIndex((entry) => entry.name === image.name);
  if (action === 'delete') {
    if (!confirm(`Delete “${image.name}” from this website? This cannot be undone.`)) return;
    await directory.removeEntry(image.name);
    collection.splice(index, 1);
  } else {
    const target = action === 'cover' ? 0 : action === 'up' ? Math.max(0, index - 1) : Math.min(collection.length - 1, index + 1);
    collection.splice(index, 1); collection.splice(target, 0, image);
  }
  await (context === 'gallery' ? saveGalleryManifest() : saveEventManifest());
  clearObjectUrls(); await (context === 'gallery' ? renderGallery() : renderEvents()); renderAlbums();
  setStatus('Changes saved locally', 'Review the public page before committing and pushing.', 'ready');
};

$('[data-select-project]').addEventListener('click', async () => {
  if (!window.showDirectoryPicker) { setStatus('Browser not supported', 'Open this page in Microsoft Edge or Google Chrome.', 'error'); return; }
  try {
    const project = await window.showDirectoryPicker({ id: 'dtc-project', mode: 'readwrite' });
    await project.getFileHandle('index.html'); await project.getDirectoryHandle('assets');
    state.project = project;
    await loadMedia();
    setStatus('Project connected', `${project.name} · manifests synchronized`, 'ready');
  } catch (error) { if (error.name !== 'AbortError') setStatus('Could not open that folder', 'Choose the DTC App project folder containing index.html.', 'error'); }
});
$('[data-create-album]').addEventListener('submit', async (event) => {
  event.preventDefault(); if (!state.galleryDir) { setStatus('Select the project first', 'The album cannot be created yet.', 'error'); return; }
  const name = new FormData(event.currentTarget).get('albumName').trim(); const slug = slugify(name);
  if (!slug) return;
  if (state.albums.some((album) => album.slug === slug)) { setStatus('Album already exists', 'Choose a different album name.', 'error'); return; }
  const handle = await state.galleryDir.getDirectoryHandle(slug, { create: true });
  state.activeAlbum = { slug, name, handle, images: [] }; state.albums.push(state.activeAlbum); state.albums.sort((a,b) => a.name.localeCompare(b.name));
  await saveGalleryManifest(); event.currentTarget.reset(); renderAlbums(); renderGallery(); setStatus('Album created', `${name} is ready for photos.`, 'ready');
});
$('[data-gallery-upload]').addEventListener('change', async (event) => { if (!state.activeAlbum || !event.target.files.length) return; setStatus('Adding photos…', 'Please keep this page open.'); await copyFiles(state.activeAlbum.handle, event.target.files); event.target.value=''; await loadMedia(); setStatus('Photos added', 'Gallery manifest updated automatically.', 'ready'); });
$('[data-event-upload]').addEventListener('change', async (event) => { if (!state.upcomingDir || !event.target.files.length) return; setStatus('Adding posters…', 'Please keep this page open.'); await copyFiles(state.upcomingDir, event.target.files); event.target.value=''; await loadMedia(); setStatus('Posters added', 'Upcoming Events manifest updated automatically.', 'ready'); });
$$('[data-admin-tab]').forEach((tab) => tab.addEventListener('click', () => { $$('[data-admin-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === tab))); $$('[data-admin-panel]').forEach((panel) => { panel.hidden = panel.dataset.adminPanel !== tab.dataset.adminTab; }); }));
window.addEventListener('beforeunload', clearObjectUrls);
