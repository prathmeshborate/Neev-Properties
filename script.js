document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const navItems = document.querySelectorAll(".nav-links a");

    // 1. Scroll effect for the header
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Mobile Menu Toggle Logic
    const toggleMenu = () => {
        mobileBtn.classList.toggle("active");
        navMenu.classList.toggle("active");
        sidebarOverlay.classList.toggle("active");
        
        // Prevent body from scrolling when menu is open
        if (navMenu.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    };

    mobileBtn.addEventListener("click", toggleMenu);
    
    // Close menu when clicking the dark overlay
    sidebarOverlay.addEventListener("click", toggleMenu);

    // 3. Close the mobile menu automatically when a link is clicked
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            mobileBtn.classList.remove("active");
            navMenu.classList.remove("active");
            sidebarOverlay.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    });










    // --- Dynamic Scroll-Spy for Sticky Section ---
    const infoCards = document.querySelectorAll('.info-card');

    // Tightened the rootMargin to leave only a tiny 2% trigger zone right in the center.
    const observerOptions = {
        root: null,
        rootMargin: '-49% 0px -49% 0px', 
        threshold: 0
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // FAILSAFE: Remove the active class from ALL cards first
                infoCards.forEach(card => card.classList.remove('active-card'));
                
                // Add the active class ONLY to the card hitting the center line
                entry.target.classList.add('active-card');
            } else {
                // Remove when it leaves the center
                entry.target.classList.remove('active-card');
            }
        });
    }, observerOptions);

    infoCards.forEach(card => {
        cardObserver.observe(card);
    });








    // --- Interactive Tabbed Showcase Logic ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentPanels = document.querySelectorAll('.content-panel');

    tabButtons.forEach(btn => {
        // Using 'mouseenter' for a smooth, fast hover experience. Change to 'click' if preferred.
        btn.addEventListener('mouseenter', () => {
            
            // 1. Remove active class from all tabs and panels
            tabButtons.forEach(t => t.classList.remove('active'));
            contentPanels.forEach(p => p.classList.remove('active'));

            // 2. Add active class to the hovered tab
            btn.classList.add('active');

            // 3. Find the target panel and activate it
            const targetId = btn.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });












    // --- Video Auto-Play on Scroll & Custom Controls ---
    const video = document.getElementById('neevVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // SVG Icons
    const iconPlay = document.querySelector('.icon-play');
    const iconPause = document.querySelector('.icon-pause');
    const iconMuted = document.querySelector('.icon-muted');
    const iconUnmuted = document.querySelector('.icon-unmuted');

    if (video) {
        // 1. Intersection Observer for Autoplay
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Play when 50% visible
                    video.play().catch(e => console.log("Autoplay prevented:", e));
                    updatePlayPauseUI(true);
                } else {
                    // Pause when out of view
                    video.pause();
                    updatePlayPauseUI(false);
                }
            });
        }, { threshold: 0.5 }); // Triggers when 50% of the video is on screen

        videoObserver.observe(video);

        // 2. Play/Pause Button Logic
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                updatePlayPauseUI(true);
            } else {
                video.pause();
                updatePlayPauseUI(false);
            }
        });

        // Helper to swap play/pause SVGs
        function updatePlayPauseUI(isPlaying) {
            if (isPlaying) {
                iconPlay.style.display = 'none';
                iconPause.style.display = 'block';
            } else {
                iconPlay.style.display = 'block';
                iconPause.style.display = 'none';
            }
        }

        // 3. Mute/Unmute Button Logic
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (video.muted) {
                iconMuted.style.display = 'block';
                iconUnmuted.style.display = 'none';
            } else {
                iconMuted.style.display = 'none';
                iconUnmuted.style.display = 'block';
            }
        });

        // 4. Fullscreen Logic
        fullscreenBtn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { /* Safari */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE11 */
                video.msRequestFullscreen();
            }
        });
        
        // 5. Sync UI if video is clicked directly
        video.addEventListener('play', () => updatePlayPauseUI(true));
        video.addEventListener('pause', () => updatePlayPauseUI(false));
    }







    // --- CERTIFICATE LIGHTBOX MODAL ---
    const certCards = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');
    const overlay = document.querySelector('.modal-overlay');

    let currentIndex = 0;
    const totalCerts = certCards.length;

    // Array to hold certificate data extracted from HTML
    const certData = [];
    certCards.forEach((card, index) => {
        certData.push({
            src: card.getAttribute('data-src'),
            title: card.getAttribute('data-title')
        });

        // Open modal on click
        card.addEventListener('click', () => {
            currentIndex = index;
            updateModalContent(false); // false = no animation delay on first open
            modal.classList.add('active');
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        });
    });

    function updateModalContent(animate = true) {
        if (animate) {
            // 1. Add fading class to trigger CSS transition
            modalImg.classList.add('fading');
            modalCaption.classList.add('fading');

            // 2. Wait for fade out, swap content, then remove fading class
            setTimeout(() => {
                modalImg.src = certData[currentIndex].src;
                modalCaption.textContent = certData[currentIndex].title;
                
                modalImg.classList.remove('fading');
                modalCaption.classList.remove('fading');
            }, 300); // 300ms matches the CSS transition time
        } else {
            // Instant swap for when modal first opens
            modalImg.src = certData[currentIndex].src;
            modalCaption.textContent = certData[currentIndex].title;
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = "auto";
    }

    function nextCert() {
        currentIndex = (currentIndex + 1) % totalCerts;
        updateModalContent();
    }

    function prevCert() {
        currentIndex = (currentIndex - 1 + totalCerts) % totalCerts;
        updateModalContent();
    }

    // Event Listeners for Controls
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal); // Click outside image to close
    nextBtn.addEventListener('click', nextCert);
    prevBtn.addEventListener('click', prevCert);

    // Keyboard Accessibility
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') nextCert();
        if (e.key === 'ArrowLeft') prevCert();
    });













    // --- Bento Box Staggered Reveal Animation ---
    const bentoCards = document.querySelectorAll('.reveal-bento');
    
    const bentoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation based on DOM index
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200); // 200ms delay between each card popping in
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    bentoCards.forEach(card => {
        bentoObserver.observe(card);
    });
});






