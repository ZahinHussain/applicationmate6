// Run after DOM is ready
document.addEventListener('DOMContentLoaded', loadSavedInputs);

// Load saved values into inputs/selects
function loadSavedInputs() {
    const elems = document.querySelectorAll('input, select, textarea');
    elems.forEach(el => {
        if (!el.id) return;

        // Load saved value
        const saved = localStorage.getItem(el.id);
        if (saved !== null) el.value = saved;

        // Add auto-save on input/change
        el.removeEventListener('input', onAutoSave); // safe in case already added
        el.addEventListener('input', onAutoSave);

        // For select elements, also save on 'change'
        if (el.tagName.toLowerCase() === 'select') {
            el.removeEventListener('change', onAutoSave);
            el.addEventListener('change', onAutoSave);
        }
    });
}

// Auto-save handler
function onAutoSave(e) {
    const el = e.target;
    if (!el.id) return;
    localStorage.setItem(el.id, el.value);
}

// Save a single input manually
function saveInput(id) {
    const el = document.getElementById(id);
    if (!el) return;
    localStorage.setItem(id, el.value);
    showToast('Saved');
}

// Save all inputs manually
function saveAll() {
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id) localStorage.setItem(el.id, el.value);
    });
    showToast('All saved');
}

// Copy input value to clipboard
function copyTextById(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const value = el.value ?? '';

    navigator.clipboard.writeText(value).then(() => {
        const btn = document.querySelector(`[data-copy-for="${id}"]`);
        if (btn) {
            const original = btn.textContent;
            btn.textContent = 'Copied';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 1500);
        }
        saveInput(id); // ensure saved after copy
        showToast('Copied to clipboard');
    }).catch(() => showToast('Copy failed', true));
}

// Simple toast notifications
function showToast(msg, isError = false) {
    const t = document.createElement('div');
    t.className = 'toast' + (isError ? ' error' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => t.remove(), 2000);
}
