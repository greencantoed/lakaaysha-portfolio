// js/sand_animation.js

const heroSandCanvas = document.getElementById('heroSandCanvas');
if (heroSandCanvas) {
    const ctx = heroSandCanvas.getContext('2d');
    let particles = [];
    let NUM_PARTICLES = calculateNumParticles();
    const PARTICLE_SIZE_MIN = 1;
    const PARTICLE_SIZE_MAX = 2.5;
    const DAMPING = 0.97;

    const PHASE_GATHERING = 'GATHERING';
    const PHASE_SPIRALING = 'SPIRALING';
    const PHASE_BLOWING_AWAY = 'BLOWING_AWAY';
    const PHASE_RESETTING = 'RESETTING';

    let currentPhase = PHASE_GATHERING;
    let phaseTimer = 0;
    const GATHERING_DURATION = 3500;
    const SPIRALING_DURATION = 9000;
    const BLOWING_AWAY_DURATION = 6000;
    const RESET_DELAY = 2000;

    let centerX, centerY;
    let windDirection = { x: 0, y: 0 };

    const SAND_COLORS = ['#F0E6D0', '#C2B280', '#FFC999', '#B695C0', '#74B3CE'];
    let currentBackgroundColor = 'rgba(44, 62, 80, 0.5)'; // Initial
    const BACKGROUND_COLOR_GATHER = 'rgba(44, 62, 80, 0.5)';
    const BACKGROUND_COLOR_SPIRAL = 'rgba(0, 59, 78, 0.8)';
    const BACKGROUND_COLOR_BLOW = 'rgba(255, 113, 206, 0.3)';
    
    let animationFrameId;

    function calculateNumParticles() {
        const area = window.innerWidth * window.innerHeight;
        const baseParticles = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1200; // Less for reduced motion
        const baseArea = 1920 * 1080;
        return Math.max(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100: 500, Math.min(2000, Math.floor(baseParticles * (area / baseArea))));
    }

    function getRandomSandColor() {
        return SAND_COLORS[Math.floor(Math.random() * SAND_COLORS.length)];
    }

    class Particle {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.size = Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN;
            this.color = getRandomSandColor();
            this.vx = (Math.random() - 0.5) * 2; this.vy = (Math.random() - 0.5) * 2;
            this.mass = this.size * 0.5;
            this.angle = Math.random() * Math.PI * 2;
            this.initialDistanceFromCenter = Math.random() * Math.max(heroSandCanvas.width, heroSandCanvas.height) * 0.7 + Math.min(heroSandCanvas.width, heroSandCanvas.height) * 0.3;
            this.distanceFromCenter = this.initialDistanceFromCenter;
            this.targetRadius = 20 + Math.random() * (Math.min(heroSandCanvas.width, heroSandCanvas.height) * 0.1);
            this.spiralSpeed = (0.005 + Math.random() * 0.015) * (this.targetRadius / 50);
            this.alpha = 0.1 + Math.random() * 0.5;
        }
        update() {
            switch (currentPhase) {
                case PHASE_GATHERING: this.gather(); this.alpha = Math.min(1, this.alpha + 0.005); break;
                case PHASE_SPIRALING: this.spiral(); this.alpha = Math.min(1, this.alpha + 0.002); break;
                case PHASE_BLOWING_AWAY: this.blow(); this.alpha = Math.max(0, this.alpha - 0.008); break;
                case PHASE_RESETTING: this.vy += 0.05; this.alpha = Math.max(0, this.alpha - 0.01); break;
            }
            this.vx *= DAMPING; this.vy *= DAMPING;
            this.x += this.vx; this.y += this.vy;
        }
        gather() {
            let dx = centerX - this.x, dy = centerY - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let pullStrength = 0.03;
            if (dist > 1) {
                this.vx += (dx / dist) * pullStrength * (this.initialDistanceFromCenter / dist);
                this.vy += (dy / dist) * pullStrength * (this.initialDistanceFromCenter / dist);
                this.vx += -(dy / dist) * 0.005; this.vy += (dx / dist) * 0.005;
            }
            if (dist < Math.min(heroSandCanvas.width, heroSandCanvas.height) * 0.2) { this.vx *= 0.95; this.vy *= 0.95; }
        }
        spiral() {
            this.angle += this.spiralSpeed * (DAMPING / 0.98);
            if (this.distanceFromCenter > this.targetRadius) {
                this.distanceFromCenter -= (this.distanceFromCenter - this.targetRadius) * 0.015 + 0.1;
            } else { this.distanceFromCenter = this.targetRadius; }
            let targetX = centerX + Math.cos(this.angle) * this.distanceFromCenter;
            let targetY = centerY + Math.sin(this.angle) * this.distanceFromCenter;
            let dx = targetX - this.x, dy = targetY - this.y;
            this.vx += dx * 0.025; this.vy += dy * 0.025;
            const depthFactor = Math.max(0.3, this.distanceFromCenter / (Math.min(heroSandCanvas.width, heroSandCanvas.height) * 0.2));
            this.currentSize = this.size * depthFactor; this.currentAlpha = this.alpha * depthFactor;
        }
        blow() {
            this.vx += windDirection.x * (0.05 + Math.random() * 0.1) / this.mass;
            this.vy += windDirection.y * (0.05 + Math.random() * 0.1) / this.mass;
            this.vy -= (0.01 + Math.random() * 0.03);
        }
        draw() {
            if (this.alpha <= 0) return;
            ctx.beginPath();
            const sizeToDraw = (currentPhase === PHASE_SPIRALING) ? (this.currentSize || this.size) : this.size;
            const alphaToDraw = (currentPhase === PHASE_SPIRALING) ? (this.currentAlpha || this.alpha) : this.alpha;
            ctx.arc(this.x, this.y, Math.max(0.5, sizeToDraw), 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, alphaToDraw));
            ctx.fill();
        }
        isOutOfBounds() {
            return this.x < -this.size * 5 || this.x > heroSandCanvas.width + this.size * 5 ||
                   this.y < -this.size * 5 || this.y > heroSandCanvas.height + this.size * 5 || this.alpha <= 0;
        }
    }

    function initSandAnimation() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId); // Stop previous loop if any
        heroSandCanvas.width = window.innerWidth;
        heroSandCanvas.height = window.innerHeight;
        centerX = heroSandCanvas.width / 2;
        centerY = heroSandCanvas.height / 2;
        NUM_PARTICLES = calculateNumParticles();

        particles = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            let x, y;
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? Math.random() * centerX * 0.5 : heroSandCanvas.width - Math.random() * centerX * 0.5;
                y = Math.random() < 0.5 ? -Math.random() * 100 : heroSandCanvas.height + Math.random() * 100;
            } else {
                y = Math.random() < 0.5 ? Math.random() * centerY * 0.5 : heroSandCanvas.height - Math.random() * centerY * 0.5;
                x = Math.random() < 0.5 ? -Math.random() * 100 : heroSandCanvas.width + Math.random() * 100;
            }
            particles.push(new Particle(x, y));
        }
        currentPhase = PHASE_GATHERING;
        phaseTimer = Date.now();
        console.log("Sand Animation: Phase GATHERING. Particles:", NUM_PARTICLES);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
             animationFrameId = requestAnimationFrame(animateSand);
        } else {
            // Draw a static frame for reduced motion
            ctx.clearRect(0, 0, heroSandCanvas.width, heroSandCanvas.height);
            heroSandCanvas.style.backgroundColor = BACKGROUND_COLOR_SPIRAL; // A representative color
            particles.forEach(p => { p.x = centerX; p.y = centerY; p.alpha = 0.3; p.draw(); }); // Simple static display
            console.log("Sand Animation: Reduced motion - static frame drawn.");
        }
    }

    function updatePhase() {
        const elapsedTime = Date.now() - phaseTimer;
        if (currentPhase === PHASE_GATHERING && elapsedTime > GATHERING_DURATION) {
            currentPhase = PHASE_SPIRALING; phaseTimer = Date.now(); console.log("Sand Animation: Phase SPIRALING");
        } else if (currentPhase === PHASE_SPIRALING && elapsedTime > SPIRALING_DURATION) {
            currentPhase = PHASE_BLOWING_AWAY; phaseTimer = Date.now();
            const angle = (Math.random() - 0.5) * Math.PI * 0.8 + (Math.PI * 1.5);
            const strength = 0.6 + Math.random() * 0.3;
            windDirection = { x: Math.cos(angle) * strength, y: Math.sin(angle) * strength * 1.5 };
            console.log("Sand Animation: Phase BLOWING_AWAY");
        } else if (currentPhase === PHASE_BLOWING_AWAY && elapsedTime > BLOWING_AWAY_DURATION) {
            let allOut = particles.every(p => p.isOutOfBounds());
            if (allOut || elapsedTime > BLOWING_AWAY_DURATION + 3000) {
                 currentPhase = PHASE_RESETTING; phaseTimer = Date.now(); console.log("Sand Animation: Phase RESETTING");
                 setTimeout(initSandAnimation, RESET_DELAY);
            }
        }
    }

    function animateSand() {
        if (document.hidden) { // Pause animation when tab is not visible
            animationFrameId = requestAnimationFrame(animateSand);
            return;
        }

        let targetBgColor;
        if (currentPhase === PHASE_GATHERING) targetBgColor = BACKGROUND_COLOR_GATHER;
        else if (currentPhase === PHASE_SPIRALING) targetBgColor = BACKGROUND_COLOR_SPIRAL;
        else targetBgColor = BACKGROUND_COLOR_BLOW;
        
        if (heroSandCanvas.style.backgroundColor !== targetBgColor) {
            heroSandCanvas.style.backgroundColor = targetBgColor; // Simple switch, or implement smooth transition
        }

        ctx.clearRect(0, 0, heroSandCanvas.width, heroSandCanvas.height);
        ctx.globalAlpha = 1;

        updatePhase();
        particles.forEach(particle => { particle.update(); particle.draw(); });
        ctx.globalAlpha = 1;

        if (currentPhase === PHASE_BLOWING_AWAY || currentPhase === PHASE_RESETTING) {
            particles = particles.filter(p => !p.isOutOfBounds() && p.alpha > 0);
        }
        
        if (currentPhase !== PHASE_RESETTING || particles.length > 0) {
             animationFrameId = requestAnimationFrame(animateSand);
        } else if (currentPhase === PHASE_RESETTING && particles.length === 0) {
            console.log("Sand Animation: All particles cleared, awaiting reset.");
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("Sand Animation: Resizing and reinitializing...");
            initSandAnimation();
        }, 250);
    });
    
    const motionQuerySand = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuerySand.addEventListener('change', (e) => {
        console.log("Sand Animation: Prefers-reduced-motion changed.");
        initSandAnimation(); // Re-initialize to respect new preference
    });

    initSandAnimation();
} else {
    console.warn("heroSandCanvas not found. Sand animation will not run.");
}