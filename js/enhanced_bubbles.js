// js/enhanced_bubbles.js
document.addEventListener('DOMContentLoaded', () => {
    const bubbleCanvas = document.getElementById('bubbleCanvas');
    if (!bubbleCanvas) {
        console.warn("bubbleCanvas not found. Bubbles and sparkles animation will not run.");
        return;
    }

    const ctx = bubbleCanvas.getContext('2d');
    let particles = [];
    let animationFrameIdBubbles;

    const BUBBLE_COLORS = [
        'rgba(240, 248, 255, 0.6)', 'rgba(173, 216, 230, 0.5)', 'rgba(144, 238, 144, 0.45)',
    ];
    let SPARKLE_GEOMETRIC_COLORS = [ /* Will be populated via CSS vars */ ];

    let MAX_BUBBLES = calculateMaxParticles(40, 120);
    let MAX_SPARKLES = calculateMaxParticles(60, 180);
    const BUBBLE_SPAWN_RATE = 0.25;
    const SPARKLE_SPAWN_RATE = 0.4;

    function populateSparkleColors() {
        SPARKLE_GEOMETRIC_COLORS = [
            (getComputedStyle(document.documentElement).getPropertyValue('--vaporwave-pink').trim() || 'rgba(255, 113, 206, 0.8)'),
            (getComputedStyle(document.documentElement).getPropertyValue('--aegean-turquoise').trim() || 'rgba(64, 224, 208, 0.8)'),
            (getComputedStyle(document.documentElement).getPropertyValue('--glitch-accent-cyan').trim() || 'rgba(0, 255, 255, 0.8)'),
            'rgba(255, 255, 255, 0.9)'
        ];
    }

    function calculateMaxParticles(baseMin, baseMax) {
        const area = window.innerWidth * window.innerHeight;
        const baseArea = 1920 * 1080;
        const scaleFactor = area / baseArea;
        const count = Math.floor(Math.max(baseMin * 0.5, Math.min(baseMax, baseMax * scaleFactor)));
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? Math.floor(count * 0.2) : count; // Less for reduced motion
    }

    class Particle {
        constructor(type) {
            this.type = type;
            this.x = Math.random() * bubbleCanvas.width;
            this.y = bubbleCanvas.height + Math.random() * 100;

            if (this.type === 'bubble') {
                this.radius = Math.random() * 10 + 5;
                this.vy = -(Math.random() * 0.8 + 0.4);
                this.vx = (Math.random() - 0.5) * 0.4;
                this.color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
                this.lifespan = Math.random() * 200 + 150;
                this.maxLifespan = this.lifespan;
                this.opacity = 0;
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.015; // Slower rotation
                this.sides = Math.floor(Math.random() * 3) + 4;
            } else { // Geometric Sparkle
                this.size = Math.random() * 3 + 1.5; // Smaller sparkles
                this.vy = -(Math.random() * 0.6 + 0.2);
                this.vx = (Math.random() - 0.5) * 0.30;
                this.color = SPARKLE_GEOMETRIC_COLORS[Math.floor(Math.random() * SPARKLE_GEOMETRIC_COLORS.length)];
                this.lifespan = Math.random() * 100 + 50;
                this.maxLifespan = this.lifespan;
                this.opacity = 0;
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.04;
                this.shapeType = ['square', 'triangle', 'line'][Math.floor(Math.random() * 3)];
            }
        }
        update() {
            this.lifespan--; this.y += this.vy; this.x += this.vx; this.angle += this.rotationSpeed;
            const halfLife = this.maxLifespan / 2;
            if (this.lifespan > halfLife) { this.opacity = Math.min(1, this.opacity + 0.05); }
            else { this.opacity = Math.max(0, (this.lifespan / halfLife)); }
            if (this.type === 'bubble') { this.vx += (Math.random() - 0.5) * 0.01; this.vy *= 0.998; }
        }
        draw() {
            if (this.opacity <= 0) return;
            ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color; ctx.lineWidth = 1;

            if (this.type === 'bubble') {
                ctx.beginPath();
                for (let i = 0; i < this.sides; i++) {
                    const angle = (i / this.sides) * Math.PI * 2;
                    const xPos = Math.cos(angle) * this.radius; const yPos = Math.sin(angle) * this.radius;
                    if (i === 0) ctx.moveTo(xPos, yPos); else ctx.lineTo(xPos, yPos);
                }
                ctx.closePath(); ctx.fill();
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bubble-highlight').trim() || 'rgba(255,255,255,0.4)';
                ctx.beginPath(); ctx.arc(-this.radius * 0.4, -this.radius * 0.4, this.radius * 0.2, 0, Math.PI * 2); ctx.fill();
            } else {
                switch (this.shapeType) {
                    case 'square': ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); break;
                    case 'triangle':
                        ctx.beginPath(); ctx.moveTo(0, -this.size / 1.5);
                        ctx.lineTo(this.size / 1.732, this.size / 3); ctx.lineTo(-this.size / 1.732, this.size / 3);
                        ctx.closePath(); ctx.fill(); break;
                    case 'line':
                        ctx.beginPath(); ctx.moveTo(-this.size * 1.5, 0); ctx.lineTo(this.size * 1.5, 0); ctx.stroke(); break;
                }
            }
            ctx.restore();
        }
    }

    function spawnParticles() {
        if (particles.filter(p => p.type === 'bubble').length < MAX_BUBBLES && Math.random() < BUBBLE_SPAWN_RATE) {
            particles.push(new Particle('bubble'));
        }
        if (particles.filter(p => p.type === 'sparkle').length < MAX_SPARKLES && Math.random() < SPARKLE_SPAWN_RATE) {
            particles.push(new Particle('sparkle'));
        }
    }

    function animateBubbles() {
        if (document.hidden) { animationFrameIdBubbles = requestAnimationFrame(animateBubbles); return; }
        ctx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
        spawnParticles();
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update(); particles[i].draw();
            if (particles[i].lifespan <= 0 || particles[i].opacity <=0 || particles[i].y < -Math.max(particles[i].radius || particles[i].size, 20) ) {
                particles.splice(i, 1);
            }
        }
        animationFrameIdBubbles = requestAnimationFrame(animateBubbles);
    }

    function initBubbleAnimation() {
        if (animationFrameIdBubbles) cancelAnimationFrame(animationFrameIdBubbles);
        bubbleCanvas.width = window.innerWidth;
        bubbleCanvas.height = window.innerHeight;
        MAX_BUBBLES = calculateMaxParticles(40, 120);
        MAX_SPARKLES = calculateMaxParticles(60, 180);
        populateSparkleColors();
        particles = []; // Clear existing particles

        if (!motionQueryBubbles.matches) {
            animationFrameIdBubbles = requestAnimationFrame(animateBubbles);
            console.log("Geometric Bubbles & Sparkles Initialized/Restarted. Bubbles:", MAX_BUBBLES, "Sparkles:", MAX_SPARKLES);
        } else {
            ctx.clearRect(0,0, bubbleCanvas.width, bubbleCanvas.height); // Clear canvas if reduced motion
            console.log("Geometric Bubbles & Sparkles: Reduced motion - animation stopped.");
        }
    }
    
    let resizeTimeoutBubbles;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeoutBubbles);
        resizeTimeoutBubbles = setTimeout(initBubbleAnimation, 250);
    });

    const motionQueryBubbles = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQueryBubbles.addEventListener('change', initBubbleAnimation);

    initBubbleAnimation(); // Initial call
});