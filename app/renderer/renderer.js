const markdownIt = require('markdown-it');
const hljs = require('highlight.js');

// ── Markdown parser ─────────────────────────────────────────────────────────

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try { return hljs.highlight(str, { language: lang }).value; }
      catch (_) { /* ignore */ }
    }
    return '';
  }
});

// ── State ───────────────────────────────────────────────────────────────────

let currentFile = null;
let isEditMode = false;
let hasUnsavedChanges = false;

// ── DOM refs ────────────────────────────────────────────────────────────────

const welcomeScreen = document.getElementById('welcome-screen');
const readerScreen = document.getElementById('reader-screen');
const openFileBtn = document.getElementById('open-file-btn');
const newFileBtn = document.getElementById('new-file-btn');
const welcomeOpenBtn = document.getElementById('welcome-open-btn');
const recentSection = document.getElementById('recent-section');
const recentList = document.getElementById('recent-list');
const clearRecentBtn = document.getElementById('clear-recent-btn');
const markdownBody = document.getElementById('markdown-body');
const fileNameEl = document.getElementById('file-name');
const filePathEl = document.getElementById('file-path-display');
const dropOverlay = document.getElementById('drop-overlay');
const editBtn = document.getElementById('edit-btn');
const editorContainer = document.getElementById('editor-container');
const editor = document.getElementById('editor');
const editorPreview = document.getElementById('editor-preview');
const saveIndicator = document.getElementById('save-indicator');

// ── Navigation ──────────────────────────────────────────────────────────────

function showWelcome() {
  if (isEditMode) toggleEditMode();
  welcomeScreen.style.display = 'flex';
  readerScreen.style.display = 'none';
  currentFile = null;
  highlightActiveFile(null);
}

function showReader(data) {
  currentFile = data;
  hasUnsavedChanges = false;

  welcomeScreen.style.display = 'none';
  readerScreen.style.display = 'flex';

  renderMarkdown(data.content);
  fileNameEl.textContent = data.name;
  filePathEl.textContent = data.path;

  if (isEditMode) toggleEditMode();
  readerScreen.querySelector('.markdown-body')?.scrollTo(0, 0);

  loadRecentFiles();
  highlightActiveFile(data.path);
}

function renderMarkdown(content) {
  const rendered = md.render(content);
  markdownBody.innerHTML = rendered;

  // External links
  markdownBody.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(href, '_blank');
      });
    }
  });

  // Interactive checkboxes
  markdownBody.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => {
    cb.disabled = false;
    cb.addEventListener('change', () => {
      if (!currentFile) return;
      let count = 0;
      currentFile.content = currentFile.content.replace(/- \[([ xX])\]/g, (match, check) => {
        if (count++ === i) return cb.checked ? '- [x]' : '- [ ]';
        return match;
      });
      hasUnsavedChanges = true;
      saveFile();
    });
  });
}

// ── Edit Mode ───────────────────────────────────────────────────────────────

function toggleEditMode() {
  isEditMode = !isEditMode;

  if (isEditMode) {
    markdownBody.style.display = 'none';
    editorContainer.style.display = 'flex';
    editor.value = currentFile ? currentFile.content : '';
    updateEditorPreview();
    editBtn.classList.add('active');
    editBtn.querySelector('span').textContent = 'View';
    editor.focus();
  } else {
    editorContainer.style.display = 'none';
    markdownBody.style.display = 'block';
    editBtn.classList.remove('active');
    editBtn.querySelector('span').textContent = 'Edit';
    if (currentFile) renderMarkdown(currentFile.content);
  }
}

function updateEditorPreview() {
  if (!editorPreview) return;
  editorPreview.innerHTML = md.render(editor.value);
}

let saveTimeout = null;

function scheduleSave() {
  hasUnsavedChanges = true;
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    if (currentFile) {
      currentFile.content = editor.value;
      saveFile();
    }
  }, 800);
}

async function saveFile() {
  if (!currentFile || !currentFile.path) return;
  await window.api.saveFile(currentFile.path, currentFile.content);
  hasUnsavedChanges = false;

  saveIndicator.style.display = 'inline-flex';
  saveIndicator.classList.add('flash');
  setTimeout(() => {
    saveIndicator.classList.remove('flash');
    setTimeout(() => { saveIndicator.style.display = 'none'; }, 300);
  }, 1500);
}

// ── Editor events ───────────────────────────────────────────────────────────

editor.addEventListener('input', () => {
  updateEditorPreview();
  scheduleSave();
});

editor.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 2;
    updateEditorPreview();
    scheduleSave();
  }
});

// ── Recent files ────────────────────────────────────────────────────────────

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function highlightActiveFile(filePath) {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.path === filePath);
  });
}

async function loadRecentFiles() {
  const files = await window.api.getRecentFiles();

  if (files.length === 0) {
    recentSection.style.display = 'none';
    return;
  }

  recentSection.style.display = 'flex';
  recentList.innerHTML = '';

  files.forEach(file => {
    const li = document.createElement('li');
    li.className = 'sidebar-item';
    li.dataset.path = file.path;
    if (currentFile && currentFile.path === file.path) {
      li.classList.add('active');
    }

    li.innerHTML = `
      <div class="sidebar-item-icon">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 14V2h6l3 3v9H3z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" fill="none"/>
          <path d="M9 2v3h3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>
      <div class="sidebar-item-info">
        <div class="sidebar-item-name">${escapeHtml(file.name)}</div>
        <div class="sidebar-item-path">${escapeHtml(shortenPath(file.dir))}</div>
      </div>
      <button class="sidebar-item-remove" title="Remove">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    li.addEventListener('click', (e) => {
      if (e.target.closest('.sidebar-item-remove')) return;
      window.api.openFile(file.path);
    });

    li.querySelector('.sidebar-item-remove').addEventListener('click', async (e) => {
      e.stopPropagation();
      await window.api.removeRecentFile(file.path);
      loadRecentFiles();
    });

    recentList.appendChild(li);
  });
}

function shortenPath(dir) {
  const home = dir.replace(/^\/Users\/[^/]+/, '~');
  if (home.length > 30) {
    const parts = home.split('/');
    if (parts.length > 3) return parts[0] + '/.../' + parts.slice(-1).join('/');
  }
  return home;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Event listeners ─────────────────────────────────────────────────────────

openFileBtn.addEventListener('click', () => window.api.openFileDialog());
welcomeOpenBtn.addEventListener('click', () => window.api.openFileDialog());
newFileBtn.addEventListener('click', () => window.api.createFile());
editBtn.addEventListener('click', () => { if (currentFile) toggleEditMode(); });

clearRecentBtn.addEventListener('click', async () => {
  await window.api.clearRecentFiles();
  loadRecentFiles();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
    e.preventDefault();
    if (currentFile) toggleEditMode();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    if (currentFile && isEditMode) {
      currentFile.content = editor.value;
      saveFile();
    }
  }
});

// ── IPC from main ───────────────────────────────────────────────────────────

window.api.onFileOpened((data) => showReader(data));
window.api.onShowHome(() => showWelcome());
window.api.onToggleEdit(() => { if (currentFile) toggleEditMode(); });
window.api.onSaveCurrent(() => {
  if (currentFile && isEditMode) {
    currentFile.content = editor.value;
    saveFile();
  }
});
window.api.onCreateNew(async () => { await window.api.createFile(); });

// ── Drag & Drop ─────────────────────────────────────────────────────────────

let dragCounter = 0;

document.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragCounter++;
  dropOverlay.classList.add('visible');
});

document.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragCounter--;
  if (dragCounter === 0) dropOverlay.classList.remove('visible');
});

document.addEventListener('dragover', (e) => e.preventDefault());

document.addEventListener('drop', (e) => {
  e.preventDefault();
  dragCounter = 0;
  dropOverlay.classList.remove('visible');

  const files = Array.from(e.dataTransfer.files);
  const mdFile = files.find(f => f.name.endsWith('.md') || f.name.endsWith('.markdown'));
  if (mdFile) window.api.openFile(mdFile.path);
});

// ── Init ────────────────────────────────────────────────────────────────────

loadRecentFiles();
