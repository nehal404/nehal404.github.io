document.addEventListener('DOMContentLoaded', () => {
    // Notify parent that frame is ready (for consistency with others)
    try {
        window.parent.postMessage({ type: 'FRAME_READY', frame: 'projects' }, '*');
    } catch (e) {}

    const modal = document.getElementById('videoModal');
    const videoEl = document.getElementById('projectVideo');
    const watchButtons = Array.from(document.querySelectorAll('.btn-watch'));
    const carousel = document.querySelector('.carousel');
    const modalCloseEls = Array.from(document.querySelectorAll('[data-close]'));
    const modalContainer = modal?.querySelector('.video-container');

    function openModal(src) {
        if (!modal || !videoEl) return;
        videoEl.src = src;
        videoEl.currentTime = 0;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        // Attempt autoplay (may be muted requirement on some browsers)
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {/* ignore autoplay block */});
        }
    }

    function closeModal() {
        if (!modal || !videoEl) return;
        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    watchButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const src = btn.getAttribute('data-video');
            if (src) openModal(src);
        });
    });

    // Close handlers
    modal?.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        if (target.hasAttribute('data-close') || target === modal) {
            closeModal();
        }
    });

    // Direct close handlers to be robust across nested elements
    modalCloseEls.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    });

    // Prevent clicks inside container from closing the modal
    modalContainer?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Mobile tap to pause/resume the projects carousel
    const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
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
                // Tap on non-interactive area toggles pause
                carousel.classList.toggle('paused');
            }
            // If anchor and paused: allow navigation (no preventDefault)
        };

        // Use both click and touchstart for broader compatibility
        carousel.addEventListener('click', handleTap, { capture: true });
        carousel.addEventListener('touchstart', handleTap, { passive: false, capture: true });
    }
});


