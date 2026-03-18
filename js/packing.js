/**
 * packing.js — Interactive checklist for packing items
 *
 * Wraps each <li> in packing lists with a clickable checkbox label.
 * Persists checked state in localStorage. Shows progress counter
 * and reset link.
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'packing-checked';
  const lists = document.querySelectorAll('.packing-list');
  if (lists.length === 0) return;

  // Load checked items from localStorage
  let checkedItems = [];
  try {
    checkedItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (_) {
    checkedItems = [];
  }

  const allItems = [];

  lists.forEach(ul => {
    const items = ul.querySelectorAll('li');
    items.forEach(li => {
      const text = li.textContent.trim();
      allItems.push({ text, li });

      // Create checkbox + label wrapper
      const label = document.createElement('label');
      label.style.cssText = 'display:flex;align-items:center;gap:0.5rem;cursor:pointer;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'packing-checkbox';
      checkbox.checked = checkedItems.includes(text);

      // Custom visual checkbox
      const indicator = document.createElement('span');
      indicator.className = 'packing-indicator';

      label.appendChild(checkbox);
      label.appendChild(indicator);

      // Move li content into label
      const content = document.createElement('span');
      content.className = 'packing-text';
      content.textContent = text;
      label.appendChild(content);

      li.textContent = '';
      li.appendChild(label);

      // Apply initial checked state
      if (checkbox.checked) {
        li.classList.add('packed');
      }

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          li.classList.add('packed');
          indicator.classList.add('pop');
          setTimeout(() => indicator.classList.remove('pop'), 300);
          if (!checkedItems.includes(text)) {
            checkedItems.push(text);
          }
        } else {
          li.classList.remove('packed');
          checkedItems = checkedItems.filter(t => t !== text);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
        updateCounter();
      });
    });
  });

  // Progress counter
  const counterEl = document.getElementById('packing-counter');
  function updateCounter() {
    if (!counterEl) return;
    const total = allItems.length;
    const checked = allItems.filter(item => item.li.classList.contains('packed')).length;
    counterEl.textContent = checked + '/' + total + ' packed';
  }
  updateCounter();

  // Reset link
  const resetEl = document.getElementById('packing-reset');
  if (resetEl) {
    resetEl.addEventListener('click', (e) => {
      e.preventDefault();
      checkedItems = [];
      localStorage.removeItem(STORAGE_KEY);
      allItems.forEach(item => {
        item.li.classList.remove('packed');
        const cb = item.li.querySelector('.packing-checkbox');
        if (cb) cb.checked = false;
      });
      updateCounter();
    });
  }
});
