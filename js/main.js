// -----------------------------------------------------------------
// PROJECT DATA STRUCTURE (for portfolio modal, etc.)
const projects = {
    "1104 Breakfast Menu": {
      images: [
        "1104 BM (2).webp",
        "1104 BM (3).webp",
        "1104 BM (4).webp",
        "1104 BM (5).webp",
        "1104 BM (6).webp"
      ],
      description: "A satirical exploration of breakfast culture and modern consumer rituals. [Placeholder text]"
    },
    "REFLECTIONS ON DUTCH CAPITALISM": {
      images: [
        "RDC (6).webp",
        "RDC (7).webp",
        "RDC (8).webp",
        "RDC (9).webp",
        "RDC (10).webp",
        "RDC (12).webp",
        "RDC (13).webp"
      ],
      description: "A critical reflection on consumer culture in contemporary society. [Placeholder text]"
    },
    "THE HERONS ARE COMING": {
      images: [
        "HRC.webp",
        "HRC (2).webp",
        "HRC (3).webp"
      ],
      description: "An evocative narrative capturing the mystique of nature and urban contrasts. [Placeholder text]"
    },
    "AUTONOMOUS OPINIONS OF THE MATTER OF THE VOID": {
      images: [
        "Autonymous opinion on the matter of the void (1).png.webp",
        "Autonymous opinion on the matter of the void (2).png.webp",
        "Autonymous opinion on the matter of the void (3).png.webp"
      ],
      description: "A visual journey into existential voids and autonomous thought. [Placeholder text]"
    },
    "HUMAN VS NATURE VS HUMAN VS NATURE (AND SO ON)": {
      images: [
        "HVSNVSHVSN (1).webp",
        "HVSNVSHVSN (2).webp",
        "HVSNVSHVSN (3).webp",
        "HVSNVSHVSN (4).webp"
      ],
      description: "A cyclic exploration of the tension between humanity and nature. [Placeholder text]"
    },
    "DOUBLE EXPOSURE": {
      images: [
        "DEFE (1).webp",
        "DEFE (2).webp",
        "DEFE (3).webp",
        "DEFE (4).webp",
        "DEFE (5).webp"
      ],
      description: "A layered narrative merging multiple visual perspectives. [Placeholder text]"
    },
    "THE DREAM": {
      images: [
        "THEDREAM (1).webp",
        "THEDREAM (2).webp",
        "THEDREAM (3).webp",
        "THEDREAM (4).webp",
        "THEDREAM.webp"
      ],
      description: "A surreal journey into the ephemeral realm of dreams. [Placeholder text]"
    },
    "7 + 1": {
      images: [
        "7+1 (0).webp",
        "7+1 (1).webp",
        "7+1 (2).webp",
        "7+1 (3).webp",
        "7+1 (4).webp"
      ],
      description: "An experimental exploration that pushes creative boundaries. [Placeholder text]"
    },
    "DIE TÜREN SCHLIESSEN SICH": {
      images: [
        "TSs (1).webp",
        "TSs (2).webp",
        "TSs (3).webp",
        "TSs (4).webp"
      ],
      description: "A high-fashion film shot in Germany, capturing dynamic movement and style. [Placeholder text]"
    }
  };
  
  // Global variables for modal functionality
  let currentProject = null;
  let currentSlideIndex = 0;
  
  document.addEventListener('DOMContentLoaded', () => {
    // ----- Modal Setup -----
    const modal = document.getElementById('modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const projectKey = item.getAttribute('data-project');
        if (projects[projectKey]) {
          currentProject = projects[projectKey];
          currentSlideIndex = 0;
          openModal(projectKey);
        }
      });
    });
    
    prevBtn.addEventListener('click', () => {
      if (currentProject) {
        currentSlideIndex = (currentSlideIndex - 1 + currentProject.images.length) % currentProject.images.length;
        updateModalImage();
      }
    });
    nextBtn.addEventListener('click', () => {
      if (currentProject) {
        currentSlideIndex = (currentSlideIndex + 1) % currentProject.images.length;
        updateModalImage();
      }
    });
    
    modalClose.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    function openModal(projectKey) {
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      modalTitle.textContent = projectKey;
      modalDescription.textContent = currentProject.description;
      updateModalImage();
      modal.classList.add('modal-fade-in');
      setTimeout(() => modal.classList.remove('modal-fade-in'), 500);
    }
    
    function updateModalImage() {
      modalImage.classList.remove('fade-in');
      void modalImage.offsetWidth;
      modalImage.src = "images/webp/" + currentProject.images[currentSlideIndex];
      modalImage.alt = modalTitle.textContent + " – Slide " + (currentSlideIndex + 1);
      modalImage.classList.add('fade-in');
    }
    
    function closeModal() {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
    
    // ----- Scroll-triggered Animations -----
    const sections = document.querySelectorAll('.section');
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));
    
    // ----- Portfolio Grid Shuffle -----
    const grid = document.querySelector('.portfolio-grid');
    if (grid) {
      const itemsArray = Array.from(grid.children);
      itemsArray.sort(() => Math.random() - 0.5);
      itemsArray.forEach(item => grid.appendChild(item));
      itemsArray.forEach(item => item.classList.add('cube-animate'));
      setTimeout(() => itemsArray.forEach(item => item.classList.remove('cube-animate')), 100);
    }
    
    // ----- Auto-cycle Preview Images for Portfolio Items -----
    const autoCycleItems = document.querySelectorAll('.portfolio-item');
    autoCycleItems.forEach(item => {
      const projectKey = item.getAttribute('data-project');
      const projectData = projects[projectKey];
      if (projectData && projectData.images.length > 1) {
        let cycleIndex = 0;
        const imgEl = item.querySelector('img');
        setInterval(() => {
          cycleIndex = (cycleIndex + 1) % projectData.images.length;
          imgEl.classList.add('fade-in');
          imgEl.src = "images/webp/" + projectData.images[cycleIndex];
          setTimeout(() => imgEl.classList.remove('fade-in'), 500);
        }, 5000);
      }
    });
    
    // ----- "Cracked Mirror" Glitch Effect for the Hero Section -----
    // Expanded image pool: all file names adapted to relative file paths
    const crackImages = [
      "images/webp/7+1 (0).webp",
      "images/webp/7+1 (1).webp",
      "images/webp/7+1 (2).webp",
      "images/webp/7+1 (3).webp",
      "images/webp/7+1 (4).webp",
      "images/webp/1104 BM (2).webp",
      "images/webp/1104 BM (3).webp",
      "images/webp/1104 BM (4).webp",
      "images/webp/1104 BM (5).webp",
      "images/webp/1104 BM (6).webp",
      "images/webp/Autonymous opinion on the matter of the void (1).png.webp",
      "images/webp/Autonymous opinion on the matter of the void (2).png.webp",
      "images/webp/Autonymous opinion on the matter of the void (3).png.webp",
      "images/webp/DEFE (1).webp",
      "images/webp/DEFE (2).webp",
      "images/webp/DEFE (3).webp",
      "images/webp/DEFE (4).webp",
      "images/webp/DEFE (5).webp",
      "images/webp/HRC (2).webp",
      "images/webp/HRC (3).webp",
      "images/webp/HRC.webp",
      "images/webp/HVSNVSHVSN (1).webp",
      "images/webp/HVSNVSHVSN (2).webp",
      "images/webp/HVSNVSHVSN (3).webp",
      "images/webp/HVSNVSHVSN (4).webp",
      "images/webp/RDC (6).webp",
      "images/webp/RDC (7).webp",
      "images/webp/RDC (8).webp",
      "images/webp/RDC (9).webp",
      "images/webp/RDC (10).webp",
      "images/webp/RDC (12).webp",
      "images/webp/RDC (13).webp",
      "images/webp/THEDREAM (1).webp",
      "images/webp/THEDREAM (2).webp",
      "images/webp/THEDREAM (3).webp",
      "images/webp/THEDREAM (4).webp",
      "images/webp/THEDREAM.webp",
      "images/webp/TSs (1).webp",
      "images/webp/TSs (2).webp",
      "images/webp/TSs (3).webp",
      "images/webp/TSs (4).webp"
    ];
    
    // Recursive scheduling so each shard updates asynchronously
    function scheduleUpdate(shard) {
      // Random delay between 4000ms and 7000ms for next update
      const delay = 4000 + Math.random() * 3000;
      setTimeout(() => {
        shard.classList.add('glitching');
        // After 250ms, switch the image
        setTimeout(() => {
          const newImg = crackImages[Math.floor(Math.random() * crackImages.length)];
          shard.style.backgroundImage = `url('${newImg}')`;
        }, 250);
        // Remove glitch effect after 500ms and schedule next update recursively
        setTimeout(() => {
          shard.classList.remove('glitching');
          scheduleUpdate(shard);
        }, 500);
      }, delay);
    }
    
    function createHeroCracks() {
      const container = document.getElementById('hero-cracks');
      if (!container) return;
      container.innerHTML = ""; // Clear any existing shards
      
      const rows = 4, cols = 4; // Create a grid of 16 shards
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const shardWidth = containerWidth / cols;
      const shardHeight = containerHeight / rows;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const shard = document.createElement('div');
          shard.classList.add('hero-crack');
          shard.style.width = shardWidth + "px";
          shard.style.height = shardHeight + "px";
          shard.style.left = c * shardWidth + "px";
          shard.style.top = r * shardHeight + "px";
          
          // Generate an irregular shape using clip-path with random offsets
          const offsetMax = 20; // Maximum offset percentage
          const tlx = Math.random() * offsetMax;
          const tly = Math.random() * offsetMax;
          const trx = 100 - Math.random() * offsetMax;
          const try_ = Math.random() * offsetMax;
          const brx = 100 - Math.random() * offsetMax;
          const bry = 100 - Math.random() * offsetMax;
          const blx = Math.random() * offsetMax;
          const bly = 100 - Math.random() * offsetMax;
          const clipPath = `polygon(${tlx}% ${tly}%, ${trx}% ${try_}%, ${brx}% ${bry}%, ${blx}% ${bly}%)`;
          shard.style.clipPath = clipPath;
          
          // Set an initial random background image from the enlarged pool
          const initialImg = crackImages[Math.floor(Math.random() * crackImages.length)];
          shard.style.backgroundImage = `url('${initialImg}')`;
          shard.style.backgroundSize = "cover";
          shard.style.backgroundPosition = "center";
          
          container.appendChild(shard);
          
          // Random initial delay (up to 5000ms) then schedule asynchronous updates
          const initialDelay = Math.random() * 5000;
          setTimeout(() => {
            scheduleUpdate(shard);
          }, initialDelay);
        }
      }
    }
    
    // Start the cracked mirror effect after 1.5 seconds delay so the hero background is visible first
    setTimeout(createHeroCracks, 1500);
    
    // ----- Mobile Hamburger Menu Toggle (for small phones up to 480px) -----
    const mobileHamburger = document.getElementById('mobile-hamburger');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    if (mobileHamburger && mobileMenuOverlay) {
      mobileHamburger.addEventListener('click', () => {
        mobileMenuOverlay.classList.toggle('open');
      });
    }
    
    // Helper function for mobile menu links
    window.toggleMobileMenu = function(show) {
      if (show) {
        mobileMenuOverlay.classList.add('open');
      } else {
        mobileMenuOverlay.classList.remove('open');
      }
    }
  });
  