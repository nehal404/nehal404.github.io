// Awards script no longer needed: awards now uses a pure CSS auto-scrolling carousel.
// Keep a minimal notifier for consistency and future hooks.
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.parent.postMessage({ type: 'FRAME_READY', frame: 'awards' }, '*');
    } catch (e) {}
});