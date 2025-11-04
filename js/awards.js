// Awards script no longer needed: awards now uses a pure CSS auto-scrolling carousel.
// Keep a minimal notifier for consistency and future hooks.
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.parent.postMessage({ type: 'FRAME_READY', frame: 'awards' }, '*');
    } catch (e) {}

    // Mobile tap to pause/resume the awards carousel
    const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
    const carousel = document.querySelector('.awards-carousel');
    if (isTouch && carousel) {
        const togglePause = (e) => {
            const interactive = e.target.closest('a, button');
            if (interactive) return;
            carousel.classList.toggle('paused');
        };
        carousel.addEventListener('click', togglePause);
        carousel.addEventListener('touchend', togglePause, { passive: true });
    }
});