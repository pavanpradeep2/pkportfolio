document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Typing Effect ---
    const typedTextSpan = document.getElementById("typed-text");
    const textArray = ["Frontend Developer", "UI/UX Enthusiast", "Creative Coder", "BCA Student"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start Typing Effect
    if(textArray.length) setTimeout(type, newTextDelay + 250);


    // --- Intersection Observer for Scroll Animations ---
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('appear');
            
            // If it's a progress bar, animate its width
            if (entry.target.classList.contains('skill-category')) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
            }

            // If it's a counter, animate it
            if(entry.target.classList.contains('about-content')) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / 50; // speed

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 40);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
            }

            observer.unobserve(entry.target);
        });
    }, appearOptions);

    const faders = document.querySelectorAll('.fade-in');
    const sliders = document.querySelectorAll('.slide-up');

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    sliders.forEach(slider => {
        appearOnScroll.observe(slider);
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- Voice Commands (Web Speech API) ---
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    let isListening = false;

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after a command
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        voiceBtn.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch(e) {
                    console.error("Speech recognition already started");
                }
            }
        });

        recognition.onstart = () => {
            isListening = true;
            voiceBtn.classList.add('listening');
            voiceStatus.classList.remove('hidden');
            voiceStatus.textContent = "Listening...";
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            voiceStatus.textContent = `Heard: "${transcript}"`;
            
            // Command Matching
            if (transcript.includes('home') || transcript.includes('top')) {
                document.querySelector('a[href="#home"]').click();
            } else if (transcript.includes('about')) {
                document.querySelector('a[href="#about"]').click();
            } else if (transcript.includes('skill')) {
                document.querySelector('a[href="#skills"]').click();
            } else if (transcript.includes('project')) {
                document.querySelector('a[href="#projects"]').click();
            } else if (transcript.includes('education') || transcript.includes('journey')) {
                document.querySelector('a[href="#education"]').click();
            } else if (transcript.includes('contact') || transcript.includes('message')) {
                document.querySelector('a[href="#contact"]').click();
            } else if (transcript.includes('dark mode')) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else if (transcript.includes('light mode')) {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else if (transcript.includes('resume') || transcript.includes('download')) {
                window.open('assets/Pradeep_Resume (1).pdf', '_blank');
            } else {
                setTimeout(() => {
                    voiceStatus.textContent = "Command not recognized.";
                }, 1000);
            }

            // Hide status after a delay
            setTimeout(() => {
                voiceStatus.classList.add('hidden');
            }, 3000);
        };

        recognition.onerror = (event) => {
            voiceStatus.textContent = "Error occurred in recognition: " + event.error;
            setTimeout(() => {
                voiceStatus.classList.add('hidden');
            }, 3000);
        };

        recognition.onend = () => {
            isListening = false;
            voiceBtn.classList.remove('listening');
        };

    } else {
        // Fallback for unsupported browsers
        voiceBtn.addEventListener('click', () => {
            alert("Voice commands are not supported in your browser. Please try Chrome or Edge.");
        });
    }

});
