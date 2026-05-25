// main.js - Entry point for frontend logic (plain JS for browser)
import { renderIntro } from '../components/intro.js';

// Attach start button behavior and initialize app
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('start-funnel-index');
    if (btn) {
        btn.addEventListener('click', () => {
            renderIntro();
            // Scroll to the funnel container instead of the very top.
            // Allow a brief tick for async renderWithProgress to update the DOM.
            setTimeout(() => {
                const app = document.getElementById('app');
                if (app) app.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        });
    }
    const resetBtn = document.getElementById('reset-funnel-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Remove all keys that belong to this app (prefix funil:)
            try {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith('funil:')) keysToRemove.push(k);
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));
            } catch (e) {
                console.warn('Reset Funil falhou:', e);
            }
            // reload to ensure clean UI
            location.reload();
        });
    }
    // Optionally render intro on load
    // renderIntro();
});
