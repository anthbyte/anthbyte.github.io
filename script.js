const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Mouse tracking
let mouse = {
    x: null,
    y: null,
    radius: 150 // How far away the nodes react to your mouse
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// If the mouse leaves the window, reset it so nodes return to normal
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Create Particle Object
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw an individual node
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#d1ff27'; // Neon accent color
        ctx.fill();
    }

    // Check particle position, calculate mouse collision, move particle
    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse collision detection (The "Shark/Swarm" repel effect)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            // Push particles away
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            // Multiply by a number to make the push stronger or weaker
            this.x -= forceDirectionX * force * 5;
            this.y -= forceDirectionY * force * 5;
        } else {
            // Slowly drift back to normal movement speed
            this.x += this.directionX;
            this.y += this.directionY;
        }

        this.draw();
    }
}

// Create the network
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1; // Size of nodes
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        // Speed and direction
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        
        let color = '#d1ff27'; // Matches CSS accent
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect nodes with lines if they are close enough
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000); // Lines fade out as nodes get further away
                ctx.strokeStyle = `rgba(209, 255, 39, ${opacityValue})`; // Neon color in RGBA
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Ensure the canvas resizes if the user resizes their browser window
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Start it up!
init();
animate();