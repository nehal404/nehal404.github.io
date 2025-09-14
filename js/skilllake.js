const skills = [
            {
                name: "Computer Vision",
                size: 90,
                description: "Expert in YOLO models for object detection and segmentation. Trained YOLOv8-seg for strawberry health detection with 92% accuracy and YOLOv11n for urine analysis with 89% mAP@0.5.",
                proficiency: 95,
                experience: "Led multiple CV projects including RoboDoc AI diagnostic tool with 430K images detecting 140 diseases at 95% accuracy. Specialized in medical imaging and agricultural applications."
            },
            {
                name: "Python",
                size: 85,
                description: "Advanced Python programming for AI/ML, desktop applications, and data processing. Proficient in TensorFlow, PyTorch, OpenCV, NumPy, SciPy, and PyQt.",
                proficiency: 92,
                experience: "Developed RoboDoc V5 desktop version, built custom G-code-free slicer reducing bioprinting time by 80%, and multiple AI model deployments."
            },
            {
                name: "Deep Learning",
                size: 88,
                description: "Expert in neural networks, transformers, and model optimization. Specialized in medical AI, computer vision, and NLP applications.",
                proficiency: 90,
                experience: "Trained models achieving 94% accuracy in plant disease detection, managed class imbalance using augmentation and active learning techniques."
            },
            {
                name: "YOLO",
                size: 80,
                description: "Specialized in YOLO architectures for real-time object detection and segmentation. Experience with YOLOv8-seg and YOLOv11n deployments.",
                proficiency: 93,
                experience: "Successfully deployed YOLO models in production environments including Raspberry Pi 4 deployment and real-time agricultural monitoring systems."
            },
            {
                name: "Model Deployment",
                size: 75,
                description: "Expert in deploying AI models to edge devices and production environments. Experience with Raspberry Pi, mobile platforms, and desktop applications.",
                proficiency: 88,
                experience: "Deployed YOLOv11n on Raspberry Pi 4, developed mobile app using Flutter with MCP, and created desktop applications for hospital use."
            },
            {
                name: "Flutter & Dart",
                size: 70,
                description: "Mobile app development using Flutter framework. Built RoboDoc V6 mobile application with AI diagnostic capabilities.",
                proficiency: 82,
                experience: "Led development of RoboDoc V6 mobile app version using Flutter and model context protocol (MCP) for medical diagnostics."
            },
            {
                name: "Embedded Systems",
                size: 78,
                description: "Hardware programming with Raspberry Pi, Arduino, and ESP microcontrollers for IoT and AI edge computing applications.",
                proficiency: 85,
                experience: "Deployed AI models on Raspberry Pi 4, developed IoT solutions for agricultural monitoring, and prototyped embedded AI systems."
            },
            {
                name: "3D Design & Printing",
                size: 72,
                description: "3D modeling with Blender, slicing with Cura, and expertise in FDM/DLP printing technologies. Specialized in bioprinting applications.",
                proficiency: 80,
                experience: "Collaborated on open-source MNN Slicer, led bioprinting workshops at Istanbul Gelişim University, and assembled custom DIY 3D bioprinters."
            },
            {
                name: "Biotech AI",
                size: 95,
                description: "Intersection of biotechnology and artificial intelligence. Published first-author research on 'The Role of Agentic AI in Biotechnology'.",
                proficiency: 94,
                experience: "Bachelor in Biotechnology with AI specialization, published in IJBRI, developed AI robotic pollinator raising yield by 30%, and algae-based CO2 reduction systems."
            },
            {
                name: "Medical AI",
                size: 85,
                description: "AI applications in healthcare and medical diagnostics. Developed RoboDoc series for disease detection and surgical precision.",
                proficiency: 91,
                experience: "Built RoboDoc AI diagnostic tool, developed RoboDoc-S with finetuned SAM model for surgical precision, won multiple medical AI competitions."
            },
            {
                name: "Data Science",
                size: 77,
                description: "Data analysis, augmentation, and processing for machine learning applications. Expert in handling large datasets and class imbalance.",
                proficiency: 84,
                experience: "Managed 430K image datasets, implemented data augmentation techniques, collected and labeled real production data for training models."
            },
            {
                name: "Research & Innovation",
                size: 82,
                description: "Research methodology, innovation in biotech-AI intersection, and academic publishing. Strong background in undergraduate research.",
                proficiency: 89,
                experience: "Undergraduate Research Assistant, published first-author paper in IJBRI, won 15+ innovation awards including Best Innovative Idea at IEEE competition."
            },
            {
                name: "Leadership",
                size: 75,
                description: "Team leadership, project management, and public speaking. Led workshops, managed development teams, and presented to government officials.",
                proficiency: 87,
                experience: "Led RoboDoc development team, conducted workshops at Istanbul Gelişim University, presented projects to Prime Minister, managed multiple concurrent projects."
            },
            {
                name: "Problem Solving",
                size: 73,
                description: "Analytical thinking and innovative solution development. Expertise in tackling complex biotechnology and AI challenges.",
                proficiency: 90,
                experience: "Solved agricultural yield problems with AI pollinator, addressed CO2 reduction with algae systems, innovated bioprinting efficiency improvements."
            }
        ];

        // Canvas and particle system
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let spheres = [];
        let mouseX = 0;
        let mouseY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let mouseMoving = false;
        let mouseStillTimer = 0;
        let animationId;

        // Resize canvas to fill viewport
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Particle class
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.originalX = x;
                this.originalY = y;
                this.vx = 0;
                this.vy = 0;
                this.size = Math.random() * 3 + 1;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.mass = this.size * 0.5;
                this.radius = this.size;
            }

            update() {
                // Check if mouse is moving by comparing current and previous positions
                const mouseMoved = Math.abs(mouseX - lastMouseX) > 1 || Math.abs(mouseY - lastMouseY) > 1;
                
                if (mouseMoved) {
                    mouseMoving = true;
                    mouseStillTimer = 0;
                } else {
                    mouseStillTimer++;
                    // After 30 frames (~0.5 seconds) of no movement, consider mouse still
                    if (mouseStillTimer > 30) {
                        mouseMoving = false;
                    }
                }

                // Mouse repulsion force - only when mouse is moving
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Set minDistance based on mouse movement
                const baseMinDistance = window.innerWidth <= 768 ? 150 : 300;
                const minDistance = mouseMoving ? baseMinDistance : 0; // Set to 0 when mouse is not moving

                if (distance < minDistance && minDistance > 0) {
                    const force = (minDistance - distance) / minDistance;
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * 50;
                    this.vy += Math.sin(angle) * force * 50;
                }

                // Gravity-like return to original position
                const returnForceX = (this.originalX - this.x) * 0.005;
                const returnForceY = (this.originalY - this.y) * 0.005;
                this.vx += returnForceX;
                this.vy += returnForceY;

                // Add some natural settling motion
                this.vy += 0.02; // Gravity effect

                // Update position
                this.x += this.vx;
                this.y += this.vy;

                // Boundaries - particles stay within canvas but can move dramatically
                if (this.x < 0) {
                    this.x = 0;
                    this.vx *= -0.3;
                }
                if (this.x > canvas.width) {
                    this.x = canvas.width;
                    this.vx *= -0.3;
                }
                if (this.y < canvas.height * 0.3) {
                    this.y = canvas.height * 0.3;
                    this.vy *= -0.2;
                }
                if (this.y > canvas.height) {
                    this.y = canvas.height;
                    this.vy *= -0.6;
                }

                // Friction - particles maintain momentum longer
                this.vx *= 0.88;
                this.vy *= 0.90;

                // Dynamic opacity based on movement
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                this.opacity = Math.min(0.8, 0.1 + speed * 0.08);
            }

            checkCollisionWithSphere(sphere) {
                const dx = this.x - (sphere.x + sphere.radius);
                const dy = this.y - (sphere.y + sphere.radius);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = this.radius + sphere.radius;

                if (distance < minDistance && distance > 0) {
                    // Collision detected
                    const nx = dx / distance;
                    const ny = dy / distance;

                    // Separate particle and sphere
                    const overlap = minDistance - distance;
                    const separationX = nx * overlap * 0.8; // Particle moves more
                    const separationY = ny * overlap * 0.8;

                    this.x += separationX;
                    this.y += separationY;
                    sphere.x -= separationX * 0.2; // Sphere moves less due to higher mass
                    sphere.y -= separationY * 0.2;

                    // Calculate relative velocity
                    const relativeVelX = this.vx - sphere.vx;
                    const relativeVelY = this.vy - sphere.vy;
                    const velAlongNormal = relativeVelX * nx + relativeVelY * ny;

                    if (velAlongNormal > 0) return; // Separating

                    // Collision response - particle bounces off sphere
                    const restitution = 0.4;
                    const impulse = -(1 + restitution) * velAlongNormal;
                    const totalMass = this.mass + sphere.mass;
                    const impulseScalar = impulse / totalMass;

                    const impulseX = impulseScalar * nx;
                    const impulseY = impulseScalar * ny;

                    // Apply impulse (particle gets more effect due to lower mass)
                    this.vx += impulseX * sphere.mass;
                    this.vy += impulseY * sphere.mass;
                    sphere.vx -= impulseX * this.mass * 0.3; // Sphere less affected
                    sphere.vy -= impulseY * this.mass * 0.3;

                    return true;
                }
                return false;
            }

            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Sphere class for skills
        class SkillSphere {
            constructor(skill, index) {
                this.skill = skill;
                this.radius = skill.size / 2;
                this.mass = skill.size / 5; // Mass based on size
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.element = this.createElement();
                this.bobPhase = Math.random() * Math.PI * 2;
                this.stabilityRadius = skill.size / 2 + 30;
                this.restingHeight = 0;
                this.isResting = false;
            }

            createElement() {
                const sphere = document.createElement('div');
                sphere.className = 'skill-sphere';
                sphere.textContent = this.skill.name;
                sphere.style.width = this.skill.size + 'px';
                sphere.style.height = this.skill.size + 'px';
                sphere.style.fontSize = Math.max(8, this.skill.size / 7) + 'px';
                sphere.addEventListener('click', () => showSkillInfo(this.skill, sphere));
                document.body.appendChild(sphere);
                return sphere;
            }

            findRestingHeight() {
                // Find the average height of particles beneath this sphere
                let totalHeight = 0;
                let particleCount = 0;
                const checkRadius = this.stabilityRadius;

                particles.forEach(particle => {
                    const dx = this.x + this.radius - particle.x;
                    const dy = this.y + this.radius - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < checkRadius) {
                        totalHeight += particle.y;
                        particleCount++;
                    }
                });

                if (particleCount > 0) {
                    const avgHeight = totalHeight / particleCount;
                    this.restingHeight = avgHeight - this.skill.size - 10;
                } else {
                    this.restingHeight = canvas.height * 0.6;
                }
            }

            checkCollisionWith(otherSphere) {
                const dx = (this.x + this.radius) - (otherSphere.x + otherSphere.radius);
                const dy = (this.y + this.radius) - (otherSphere.y + otherSphere.radius);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = this.radius + otherSphere.radius;

                if (distance < minDistance && distance > 0) {
                    // Collision detected - resolve it
                    this.resolveCollision(otherSphere, dx, dy, distance, minDistance);
                    return true;
                }
                return false;
            }

            resolveCollision(otherSphere, dx, dy, distance, minDistance) {
                // Normalize collision vector
                const nx = dx / distance;
                const ny = dy / distance;

                // Separate spheres to prevent overlap
                const overlap = minDistance - distance;
                const separationX = nx * overlap * 0.5;
                const separationY = ny * overlap * 0.5;

                this.x += separationX;
                this.y += separationY;
                otherSphere.x -= separationX;
                otherSphere.y -= separationY;

                // Calculate relative velocity
                const relativeVelX = this.vx - otherSphere.vx;
                const relativeVelY = this.vy - otherSphere.vy;

                // Calculate relative velocity along normal
                const velAlongNormal = relativeVelX * nx + relativeVelY * ny;

                // Don't resolve if velocities are separating
                if (velAlongNormal > 0) return;

                // Restitution (bounciness) - lower value for more realistic collisions
                const restitution = 0.3;

                // Calculate impulse scalar
                const impulse = -(1 + restitution) * velAlongNormal;
                const totalMass = this.mass + otherSphere.mass;
                const impulseScalar = impulse / totalMass;

                // Apply impulse
                const impulseX = impulseScalar * nx;
                const impulseY = impulseScalar * ny;

                this.vx += impulseX * otherSphere.mass;
                this.vy += impulseY * otherSphere.mass;
                otherSphere.vx -= impulseX * this.mass;
                otherSphere.vy -= impulseY * this.mass;

                // Add some friction to make collisions more realistic
                this.vx *= 0.95;
                this.vy *= 0.95;
                otherSphere.vx *= 0.95;
                otherSphere.vy *= 0.95;
            }

            update() {
                // Find resting height based on particles
                this.findRestingHeight();
                
                // Natural floating motion when near resting position
                this.bobPhase += 0.015;
                const naturalBob = Math.sin(this.bobPhase) * 1.5;

                // Check if sphere should rest on particle surface
                const distanceToRest = Math.abs(this.y - this.restingHeight);
                if (distanceToRest < 20 && Math.abs(this.vy) < 1) {
                    this.isResting = true;
                    // Gentle pull towards resting position
                    this.vy += (this.restingHeight + naturalBob - this.y) * 0.01;
                } else {
                    this.isResting = false;
                    // Gravity when not resting
                    this.vy += 0.15;
                }

                // Update position
                this.x += this.vx;
                this.y += this.vy;

                // Boundary collisions
                if (this.x <= 0) {
                    this.x = 0;
                    this.vx = Math.abs(this.vx) * 0.4; // Bounce off left wall
                }
                if (this.x >= canvas.width - this.skill.size) {
                    this.x = canvas.width - this.skill.size;
                    this.vx = -Math.abs(this.vx) * 0.4; // Bounce off right wall
                }
                if (this.y <= 100) {
                    this.y = 100;
                    this.vy = Math.abs(this.vy) * 0.3; // Bounce off top
                }
                if (this.y >= canvas.height - this.skill.size) {
                    this.y = canvas.height - this.skill.size;
                    this.vy = -Math.abs(this.vy) * 0.7; // Bounce off bottom
                }

                // Air resistance/friction
                this.vx *= 0.98;
                this.vy *= 0.99;

                // Update DOM element position
                this.element.style.left = this.x + 'px';
                this.element.style.top = this.y + 'px';
            }

            setInitialPosition(x, y) {
                this.x = x;
                this.y = y;
            }
        }

        // Function to place spheres with initial spacing
        function positionSpheresInitially() {
            const cols = Math.ceil(Math.sqrt(skills.length));
            const rows = Math.ceil(skills.length / cols);
            const spacing = 120;
            const startX = (canvas.width - (cols - 1) * spacing) / 2;
            const startY = 200;

            spheres.forEach((sphere, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);
                const x = startX + col * spacing - sphere.skill.size / 2;
                const y = startY + row * spacing;
                
                sphere.setInitialPosition(
                    Math.max(0, Math.min(canvas.width - sphere.skill.size, x)),
                    Math.max(100, y)
                );
                
                // Add some initial random velocity for natural settling
                sphere.vx = (Math.random() - 0.5) * 2;
                sphere.vy = Math.random() * 1;
            });
        }

        // Initialize particles - fill bottom half with dense particles
        function initParticles() {
            particles = [];
            const particleCount = 3000; // Very dense particle system
            
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width;
                const y = canvas.height * 0.5 + Math.random() * canvas.height * 0.5; // Bottom half
                particles.push(new Particle(x, y));
            }
        }

        // Initialize skill spheres
        function initSpheres() {
            spheres = skills.map((skill, index) => new SkillSphere(skill, index));
            positionSpheresInitially();
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles, check collisions with spheres
            particles.forEach(particle => {
                particle.update();
                
                // Check collisions with all spheres
                spheres.forEach(sphere => {
                    particle.checkCollisionWithSphere(sphere);
                });
                
                particle.draw();
            });

            // Update spheres and handle sphere-to-sphere collisions
            spheres.forEach((sphere, i) => {
                sphere.update();
                
                // Check collisions with other spheres
                for (let j = i + 1; j < spheres.length; j++) {
                    sphere.checkCollisionWith(spheres[j]);
                }
            });

            // Store previous mouse position for movement detection
            lastMouseX = mouseX;
            lastMouseY = mouseY;

            animationId = requestAnimationFrame(animate);
        }

        // Initialize everything
        function init() {
            resizeCanvas();
            initParticles();
            initSpheres();
            animate();
        }

        // Event listeners
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles(); // Reinitialize particles on resize
            positionSpheresInitially(); // Reposition spheres
        });

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Touch event listeners for mobile support - only prevent default for canvas area
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartTime = Date.now();
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            
            // Only prevent scrolling if touch is on canvas area and not on a skill sphere
            const target = e.target;
            const isSkillSphere = target.classList.contains('skill-sphere');
            const isOnCanvas = target === canvas || target.tagName === 'CANVAS';
            
            if (!isSkillSphere && isOnCanvas) {
                e.preventDefault();
            }
            
            mouseX = touch.clientX;
            mouseY = touch.clientY;
            mouseMoving = true;
            mouseStillTimer = 0;
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const moveDistance = Math.sqrt(
                Math.pow(touch.clientX - touchStartX, 2) + 
                Math.pow(touch.clientY - touchStartY, 2)
            );
            
            // Only prevent scrolling if user is actively dragging (moved more than 10px)
            // and not interacting with skill spheres
            const target = e.target;
            const isSkillSphere = target.classList.contains('skill-sphere');
            
            if (!isSkillSphere && moveDistance > 10) {
                e.preventDefault();
            }
            
            mouseX = touch.clientX;
            mouseY = touch.clientY;
            mouseMoving = true;
            mouseStillTimer = 0;
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touch = e.changedTouches[0];
            const moveDistance = Math.sqrt(
                Math.pow(touch.clientX - touchStartX, 2) + 
                Math.pow(touch.clientY - touchStartY, 2)
            );
            
            // If it was a quick tap (less than 300ms) with minimal movement (less than 10px)
            // and on a skill sphere, let the click event handle it
            const target = e.target;
            const isSkillSphere = target.classList.contains('skill-sphere');
            
            if (isSkillSphere && touchDuration < 300 && moveDistance < 10) {
                // This is a tap on a skill sphere, don't prevent the click
                return;
            }
        });

        // Handle multiple touches - use the first touch point
        document.addEventListener('touchcancel', (e) => {
            // Reset on touch cancel
        });

        // Skill info functions
        function showSkillInfo(skill, sphereElement) {
            document.querySelectorAll('.skill-sphere').forEach(s => s.classList.remove('clicked'));
            sphereElement.classList.add('clicked');
            
            document.getElementById('skillTitle').textContent = skill.name;
            document.getElementById('skillDescription').textContent = skill.description;
            document.getElementById('skillExperience').textContent = skill.experience;
            
            const progressFill = document.getElementById('progressFill');
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.width = skill.proficiency + '%';
            }, 300);
            
            document.getElementById('infoPanel').classList.add('active');
        }

        function closeInfo() {
            document.getElementById('infoPanel').classList.remove('active');
            document.querySelectorAll('.skill-sphere').forEach(s => s.classList.remove('clicked'));
        }

        // Start the application
        init();