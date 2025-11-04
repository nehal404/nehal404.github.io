document.addEventListener('DOMContentLoaded', () => {
    // Notify parent that frame is ready (for consistency with others)
    try {
        window.parent.postMessage({ type: 'FRAME_READY', frame: 'projects' }, '*');
    } catch (e) {}
});


