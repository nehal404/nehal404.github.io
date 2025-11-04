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
        const handleTap = (e) => {
            const anchor = e.target.closest('a');
            const isPaused = carousel.classList.contains('paused');

            if (anchor && !isPaused) {
                // First tap: pause and prevent navigation
                e.preventDefault();
                carousel.classList.add('paused');
                return;
            }

            if (!anchor) {
                carousel.classList.toggle('paused');
            }
            // If anchor and paused: allow navigation
        };

        carousel.addEventListener('click', handleTap, { capture: true });
        carousel.addEventListener('touchstart', handleTap, { passive: false, capture: true });
    }
});