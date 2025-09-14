class AwardsTimeline {
            constructor() {
                this.awards = document.querySelectorAll('.award-card');
                this.totalAwards = this.awards.length;
                this.currentIndex = 0;
                this.progressIndicator = document.getElementById('progressIndicator');
                
                this.init();
            }

            init() {
                this.createProgressDots();
                this.createCardParticlesOnce();
                this.updateStack();
                this.bindEvents();
            }

            createCardParticlesOnce() {
                this.awards.forEach((card, index) => {
                    const particleContainer = card.querySelector('.card-particles');
                    if (particleContainer.childElementCount === 0) { // Only if not already generated
                        // Get card dimensions dynamically - wait for layout to be calculated
                        const cardWidth = card.offsetWidth || (window.innerWidth <= 768 ? 320 : 400);
                        const cardHeight = card.offsetHeight || (window.innerWidth <= 768 ? 450 : 500);
                        const particles = this.generateCardEdgeParticles(cardWidth, cardHeight, 12);
                        particles.forEach(particle => {
                            const dot = document.createElement('div');
                            dot.className = 'card-particle';
                            dot.style.left = particle.x + 'px';
                            dot.style.top = particle.y + 'px';
                            dot.style.animationDelay = Math.random() * 3 + 's';
                            dot.style.animationDuration = (2 + Math.random() * 2) + 's';
                            particleContainer.appendChild(dot);
                        });
                    }
                });
            }

            generateCardEdgeParticles(width, height, particleSpacing = 4) {
                const particles = [];
                const cornerRadius = 15;
                
                // Top edge
                for (let x = cornerRadius; x < width - cornerRadius; x += particleSpacing) {
                    if (Math.random() < 0.9) { // More particles
                        particles.push({ x: x + (Math.random() - 0.5) * 2, y: 2 + (Math.random() - 0.5) * 2 });
                    }
                }
                // Bottom edge
                for (let x = cornerRadius; x < width - cornerRadius; x += particleSpacing) {
                    if (Math.random() < 0.9) {
                        particles.push({ x: x + (Math.random() - 0.5) * 2, y: height - 2 + (Math.random() - 0.5) * 2 });
                    }
                }
                // Left edge
                for (let y = cornerRadius; y < height - cornerRadius; y += particleSpacing) {
                    if (Math.random() < 0.9) {
                        particles.push({ x: 2 + (Math.random() - 0.5) * 2, y: y + (Math.random() - 0.5) * 2 });
                    }
                }
                // Right edge
                for (let y = cornerRadius; y < height - cornerRadius; y += particleSpacing) {
                    if (Math.random() < 0.9) {
                        particles.push({ x: width - 2 + (Math.random() - 0.5) * 2, y: y + (Math.random() - 0.5) * 2 });
                    }
                }
                // Corner particles (rounded corners)
                const corners = [
                    { cx: cornerRadius, cy: cornerRadius, startAngle: Math.PI, endAngle: 1.5 * Math.PI },
                    { cx: width - cornerRadius, cy: cornerRadius, startAngle: 1.5 * Math.PI, endAngle: 2 * Math.PI },
                    { cx: width - cornerRadius, cy: height - cornerRadius, startAngle: 0, endAngle: 0.5 * Math.PI },
                    { cx: cornerRadius, cy: height - cornerRadius, startAngle: 0.5 * Math.PI, endAngle: Math.PI }
                ];
                corners.forEach(corner => {
                    const angleStep = 0.1; // More corner particles
                    for (let angle = corner.startAngle; angle < corner.endAngle; angle += angleStep) {
                        if (Math.random() < 0.8) {
                            const x = corner.cx + Math.cos(angle) * cornerRadius;
                            const y = corner.cy + Math.sin(angle) * cornerRadius;
                            particles.push({ 
                                x: x + (Math.random() - 0.5) * 2, 
                                y: y + (Math.random() - 0.5) * 2 
                            });
                        }
                    }
                });
                return particles;
            }

            createProgressDots() {
                for (let i = 0; i < this.totalAwards; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'progress-dot';
                    dot.addEventListener('click', () => this.goToAward(i));
                    this.progressIndicator.appendChild(dot);
                }
            }

            updateStack() {
                this.awards.forEach((card, index) => {
                    card.className = 'award-card';

                    // Calculate positions with looping
                    const total = this.totalAwards;
                    const idx = this.currentIndex;

                    // Get relative position with wrap-around
                    let rel = (index - idx + total) % total;
                    if (rel === 0) {
                        card.classList.add('active', 'visible');
                    } else if (rel === 1) {
                        card.classList.add('next1', 'visible');
                    } else if (rel === 2) {
                        card.classList.add('next2', 'visible');
                    } else if (rel === total - 1) {
                        card.classList.add('prev1', 'visible');
                    } else if (rel === total - 2) {
                        card.classList.add('prev2', 'visible');
                    } else {
                        card.classList.add('stack-far');
                    }
                });

                // Update progress dots
                document.querySelectorAll('.progress-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }

            goToAward(index) {
                this.currentIndex = (index + this.totalAwards) % this.totalAwards;
                this.updateStack();
            }

            next() {
                this.currentIndex = (this.currentIndex + 1) % this.totalAwards;
                this.updateStack();
            }

            prev() {
                this.currentIndex = (this.currentIndex - 1 + this.totalAwards) % this.totalAwards;
                this.updateStack();
            }

            bindEvents() {
                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        this.prev();
                    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        this.next();
                    }
                });

                // Touch/swipe support
                let startY = 0;
                let startX = 0;
                
                document.addEventListener('touchstart', (e) => {
                    startY = e.touches[0].clientY;
                    startX = e.touches[0].clientX;
                });

                document.addEventListener('touchend', (e) => {
                    const endY = e.changedTouches[0].clientY;
                    const endX = e.changedTouches[0].clientX;
                    const diffY = startY - endY;
                    const diffX = startX - endX;

                    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
                        if (diffY > 0) {
                            this.next();
                        } else {
                            this.prev();
                        }
                    }
                });

                // Click on cards
                this.awards.forEach((card, index) => {
                    card.addEventListener('click', () => {
                        if (index !== this.currentIndex) {
                            this.goToAward(index);
                        }
                    });
                });

            }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new AwardsTimeline();
        });