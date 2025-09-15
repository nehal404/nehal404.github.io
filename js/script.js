        class PortfolioManager {
            constructor() {
                this.currentSection = 'about';
                this.sections = ['about','chatbot', 'skills', 'awards'];
                this.navLinks = document.querySelectorAll('.nav-link');
                this.scrollDots = document.querySelectorAll('.scroll-dot');
                this.navbar = document.getElementById('navbar');
                this.loadingOverlay = document.getElementById('loadingOverlay');
                this.hamburger = document.getElementById('hamburger');
                this.navLinksContainer = document.getElementById('navLinks');
                this.navOverlay = document.getElementById('navOverlay');
                this.navContent = document.getElementById('navContent');
                this.isMenuOpen = false;
                this.frames = {
                    about: document.getElementById('aboutFrame'),
                    chatbot: document.getElementById('chatbotFrame'),
                    skills: document.getElementById('skillsFrame'),
                    awards: document.getElementById('awardsFrame')
                };
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.handleFrameLoading();
                this.hideLoadingWhenReady();
            }

            bindEvents() {
                // Hamburger menu toggle
                this.hamburger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMobileMenu();
                });

                // Close menu when clicking overlay
                this.navOverlay.addEventListener('click', () => {
                    this.closeMobileMenu();
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                        this.closeMobileMenu();
                    }
                });

                // Navigation links
                this.navLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const section = e.target.dataset.section;
                        this.scrollToSection(section);
                        this.closeMobileMenu(); // Close menu on mobile after selection
                    });
                });

                // Scroll dots
                this.scrollDots.forEach(dot => {
                    dot.addEventListener('click', () => {
                        const section = dot.dataset.section;
                        this.scrollToSection(section);
                        this.closeMobileMenu();
                    });
                });

                // Scroll detection
                let scrollTimeout;
                window.addEventListener('scroll', () => {
                    this.updateNavbarOnScroll();
                    
                    // Close mobile menu on scroll
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        this.updateActiveSection();
                    }, 100);
                });

                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    // Close menu on Escape
                    if (e.key === 'Escape' && this.isMenuOpen) {
                        this.closeMobileMenu();
                        return;
                    }

                    // Only allow navigation if menu is closed
                    if (!this.isMenuOpen) {
                        switch(e.key) {
                            case 'ArrowDown':
                            case ' ':
                                e.preventDefault();
                                this.scrollToNextSection();
                                break;
                            case 'ArrowUp':
                                e.preventDefault();
                                this.scrollToPreviousSection();
                                break;
                            case '1':
                                this.scrollToSection('about');
                                break;
                            case '2':
                                this.scrollToSection('chatbot');
                                break;
                            case '3':
                                this.scrollToSection('skills');
                                break;
                            case '4':
                                this.scrollToSection('awards');
                                break;
                        }
                    }
                });

                // Wheel navigation for smooth section switching (only on desktop)
                let wheelTimeout;
                window.addEventListener('wheel', (e) => {
                    if (this.isMenuOpen || window.innerWidth <= 425) return;
                    
                    clearTimeout(wheelTimeout);
                    wheelTimeout = setTimeout(() => {
                        if (Math.abs(e.deltaY) > 50) {
                            if (e.deltaY > 0) {
                                this.scrollToNextSection();
                            } else {
                                this.scrollToPreviousSection();
                            }
                        }
                    }, 150);
                }, { passive: true });

                // Handle window resize
                window.addEventListener('resize', () => {
                    if (window.innerWidth > 425 && this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                });
            }

            toggleMobileMenu() {
                this.isMenuOpen = !this.isMenuOpen;
                this.hamburger.classList.toggle('active', this.isMenuOpen);
                this.navLinksContainer.classList.toggle('active', this.isMenuOpen);
                this.navOverlay.classList.toggle('active', this.isMenuOpen);
                this.navContent.classList.toggle('menu-open', this.isMenuOpen);
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
            }

            closeMobileMenu() {
                if (this.isMenuOpen) {
                    this.isMenuOpen = false;
                    this.hamburger.classList.remove('active');
                    this.navLinksContainer.classList.remove('active');
                    this.navOverlay.classList.remove('active');
                    this.navContent.classList.remove('menu-open');
                    document.body.style.overflow = '';
                }
            }

            scrollToSection(sectionName) {
                const element = document.getElementById(`${sectionName}-section`);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    this.currentSection = sectionName;
                    this.updateActiveStates();
                }
            }

            scrollToNextSection() {
                const currentIndex = this.sections.indexOf(this.currentSection);
                if (currentIndex < this.sections.length - 1) {
                    this.scrollToSection(this.sections[currentIndex + 1]);
                }
            }

            scrollToPreviousSection() {
                const currentIndex = this.sections.indexOf(this.currentSection);
                if (currentIndex > 0) {
                    this.scrollToSection(this.sections[currentIndex - 1]);
                }
            }

            updateActiveSection() {
                const scrollPosition = window.scrollY + window.innerHeight / 2;
                
                this.sections.forEach(section => {
                    const element = document.getElementById(`${section}-section`);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        const elementTop = rect.top + window.scrollY;
                        const elementBottom = elementTop + rect.height;
                        
                        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                            if (this.currentSection !== section) {
                                this.currentSection = section;
                                this.updateActiveStates();
                            }
                        }
                    }
                });
            }

            updateActiveStates() {
                // Update navigation links
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === this.currentSection) {
                        link.classList.add('active');
                    }
                });

                // Update scroll dots
                this.scrollDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.dataset.section === this.currentSection) {
                        dot.classList.add('active');
                    }
                });
            }

            updateNavbarOnScroll() {
                if (window.scrollY > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }

            handleFrameLoading() {
                let framesLoaded = 0;
                const totalFrames = Object.keys(this.frames).length;

                Object.values(this.frames).forEach(frame => {
                    frame.addEventListener('load', () => {
                        framesLoaded++;
                        console.log(`Frame loaded: ${frame.id} (${framesLoaded}/${totalFrames})`);
                        this.setupFrameCommunication(frame);
                    });

                    frame.addEventListener('error', () => {
                        console.warn(`Failed to load frame: ${frame.id}`);
                        framesLoaded++;
                    });
                });
            }

            setupFrameCommunication(frame) {
                try {
                    frame.contentWindow?.postMessage({
                        type: 'PORTFOLIO_INIT',
                        parentReady: true
                    }, '*');
                } catch (e) {
                    console.log('Cross-origin frame communication blocked for:', frame.id);
                }
            }

            hideLoadingWhenReady() {
                let checkCount = 0;
                const checkFrames = () => {
                    checkCount++;
                    
                    try {
                        const aboutLoaded = this.frames.about.contentDocument !== null;
                        const chatbotLoaded = this.frames.chatbot.contentDocument !== null;
                        const skillsLoaded = this.frames.skills.contentDocument !== null;
                        const awardsLoaded = this.frames.awards.contentDocument !== null;
                        
                        if ((aboutLoaded && chatbotLoaded && skillsLoaded && awardsLoaded) || checkCount > 20) {
                            setTimeout(() => {
                                this.loadingOverlay.classList.add('hidden');
                            }, 800);
                            return;
                        }
                    } catch (e) {
                        // Frames might be loading from different origins
                    }
                    
                    setTimeout(checkFrames, 200);
                };

                setTimeout(checkFrames, 500);
            }

            // Public methods
            getCurrentSection() {
                return this.currentSection;
            }

            goToSection(section) {
                if (this.sections.includes(section)) {
                    this.scrollToSection(section);
                }
            }
        }

        // Handle messages from frames
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type) {
                switch (event.data.type) {
                    case 'FRAME_READY':
                        console.log(`Frame ready: ${event.data.frame}`);
                        break;
                    case 'NAVIGATE_TO_SECTION':
                        if (window.portfolioManager && event.data.section) {
                            window.portfolioManager.goToSection(event.data.section);
                        }
                        break;
                }
            }
        });

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            window.portfolioManager = new PortfolioManager();
            window.goToSection = (section) => window.portfolioManager.goToSection(section);
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && window.portfolioManager) {
                Object.values(window.portfolioManager.frames).forEach(frame => {
                    try {
                        frame.contentWindow?.postMessage({ type: 'PAGE_VISIBLE' }, '*');
                    } catch (e) {}
                });
            }
        });