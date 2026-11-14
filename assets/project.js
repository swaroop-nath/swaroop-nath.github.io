// Shared behaviour for the paper project pages: the same light/dark toggle
// and saved preference as the home page, plus BibTeX copy buttons.
// Demos can listen for the 'themechange' event to redraw in the new colours.

(function () {
    // Runs in <head>, before first paint, so the page never flashes the wrong theme
    let saved = null;
    try { saved = localStorage.getItem('color-theme'); } catch (e) {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (saved === null && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
})();

// Read a CSS custom property, for demos drawing in SVG or canvas
window.cssVar = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('theme-toggle-main');
    const icon = document.getElementById('theme-icon-container');

    const paintButton = function () {
        const isDark = document.documentElement.classList.contains('dark');
        if (button) button.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        if (icon) icon.innerHTML = '<i data-lucide="' + (isDark ? 'sun' : 'moon') + '" class="h-5 w-5"></i>';
        if (window.lucide) lucide.createIcons();
    };

    if (button) {
        button.addEventListener('click', function () {
            const isDark = document.documentElement.classList.toggle('dark');
            try { localStorage.setItem('color-theme', isDark ? 'dark' : 'light'); } catch (e) {}
            paintButton();
            document.dispatchEvent(new CustomEvent('themechange', { detail: { dark: isDark } }));
        });
    }
    paintButton();

    document.querySelectorAll('[data-copy-target]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const target = document.getElementById(btn.getAttribute('data-copy-target'));
            if (!target) return;
            navigator.clipboard.writeText(target.textContent.trim()).then(function () {
                const label = btn.textContent;
                btn.textContent = 'Copied';
                setTimeout(function () { btn.textContent = label; }, 1500);
            });
        });
    });
});
