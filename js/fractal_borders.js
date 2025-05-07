// js/fractal_borders.js
document.addEventListener('DOMContentLoaded', () => {
    const leftCanvas = document.getElementById('leftBorderCanvas');
    const rightCanvas = document.getElementById('rightBorderCanvas');

    if (!leftCanvas || !rightCanvas) {
        console.warn("Fractal border canvases not found. Animation will not run.");
        return;
    }

    const canvases = [
        { el: leftCanvas, ctx: leftCanvas.getContext('2d'), side: 'left' },
        { el: rightCanvas, ctx: rightCanvas.getContext('2d'), side: 'right' }
    ];

    let lSystemConfig = { /* Will be populated by initConfig */ };

    function initConfig() {
        lSystemConfig = {
            axiom: "F",
            rules: { "F": "F+F-F-F+F" },
            angle: 90,
            iterations: window.innerWidth < 768 ? 1 : 2, // Simpler for mobile
            lineWidth: 1.5, // Thinner for more detail
            color1: getComputedStyle(document.documentElement).getPropertyValue('--fractal-terracotta').trim() || '#CB410B',
            color2: getComputedStyle(document.documentElement).getPropertyValue('--fractal-black').trim() || '#1A1A1A',
            numRepetitions: window.innerHeight < 600 ? 6 : 10, // Fewer on short screens
            // baseSegmentLength will be calculated dynamically
        };
    }

    function generateLSysString(axiom, rules, iterations) {
        let currentString = axiom;
        for (let i = 0; i < iterations; i++) {
            let newString = "";
            for (const char of currentString) { newString += rules[char] || char; }
            currentString = newString;
        }
        return currentString;
    }

    function drawLSysBorder(canvasInfo, lSystemString, segmentLength, repetitions) {
        const { el, ctx, side } = canvasInfo;
        let currentX, currentY, currentAngle;

        for (let rep = 0; rep < repetitions; rep++) {
            ctx.strokeStyle = (rep % 2 === 0) ? lSystemConfig.color1 : lSystemConfig.color2;
            ctx.lineWidth = lSystemConfig.lineWidth;
            ctx.beginPath();

            currentY = (rep + 0.5) * (el.height / repetitions) + (Math.random() - 0.5) * 10; // Add slight Y jitter

            if (side === 'left') {
                currentX = lSystemConfig.lineWidth / 2; // Start slightly inside
                currentAngle = 0; // Draw to the right initially
                ctx.moveTo(currentX, currentY);
            } else {
                currentX = el.width - (lSystemConfig.lineWidth / 2); // Start slightly inside
                currentAngle = Math.PI; // Draw to the left initially
                ctx.moveTo(currentX, currentY);
            }
            
            for (const char of lSystemString) {
                switch (char) {
                    case 'F':
                        const newX = currentX + segmentLength * Math.cos(currentAngle);
                        const newY = currentY + segmentLength * Math.sin(currentAngle);
                        ctx.lineTo(newX, newY);
                        currentX = newX; currentY = newY;
                        break;
                    case '+': currentAngle -= lSystemConfig.angle * (Math.PI / 180); break;
                    case '-': currentAngle += lSystemConfig.angle * (Math.PI / 180); break;
                }
            }
            ctx.stroke();
        }
    }

    function renderBorders() {
        initConfig(); // Update config based on current screen size/etc.
        const lString = generateLSysString(lSystemConfig.axiom, lSystemConfig.rules, lSystemConfig.iterations);

        canvases.forEach(canvasInfo => {
            const { el, ctx } = canvasInfo;
            // Calculate segment length based on available width and iterations.
            // A Koch quadratic of iteration N takes up width roughly (2^N - (-1)^N)/3 relative to initial segment if it expands both ways.
            // Here, it expands primarily one way.
            // Iteration 1: F+F-F-F+F -> 5 segments long. Total length = 5 * segmentLength. Width roughly segmentLength.
            // Iteration 2: (rule applied to each F) -> 5*5 = 25 F-segments. Total length = 25 * segmentLength. Width roughly 3 * segmentLength.
            // Let's set canvas width to be a factor of base segment length
            const maxFractalDepthFactor = lSystemConfig.iterations === 1 ? 1.5 : 3.5; // How many 'segmentLengths' deep the fractal might go
            let baseSegmentLength = Math.min( (window.innerWidth * 0.03) / maxFractalDepthFactor, (window.innerHeight / lSystemConfig.numRepetitions) / 5 );
            baseSegmentLength = Math.max(2, baseSegmentLength); // Min segment length of 2px
            
            el.width = baseSegmentLength * maxFractalDepthFactor + lSystemConfig.lineWidth * 2; // Ensure space for line width
            el.height = window.innerHeight;
            ctx.clearRect(0, 0, el.width, el.height);

            drawLSysBorder(canvasInfo, lString, baseSegmentLength, lSystemConfig.numRepetitions);
        });
        console.log("Geometric Fractal Borders Rendered. Iterations:", lSystemConfig.iterations, "Reps:", lSystemConfig.numRepetitions);
    }

    let resizeTimeoutFractals;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeoutFractals);
        resizeTimeoutFractals = setTimeout(() => {
            if (!motionQueryFractals.matches) renderBorders();
        }, 250);
    });

    const motionQueryFractals = window.matchMedia('(prefers-reduced-motion: reduce)');
    function handleMotionChangeFractals(e) {
        if (e.matches) {
            canvases.forEach(c => c.el.getContext('2d').clearRect(0, 0, c.el.width, c.el.height));
            console.log("Reduced motion preferred: Geometric fractal borders disabled.");
        } else {
            renderBorders();
        }
    }
    motionQueryFractals.addEventListener('change', handleMotionChangeFractals);
    
    // Initial Render
    if (!motionQueryFractals.matches) {
        renderBorders();
    } else {
        console.log("Reduced motion preferred on load: Geometric fractal borders disabled.");
    }
});