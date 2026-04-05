const canvas = document.getElementById('footer-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let width = canvas.width;
let height = canvas.height;

const particles = [];
const particleCount = 100;
const maxDistance = 100;
const mouse = { x: null, y: null };

class Particle {
  constructor(x, y, angle, radius) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.radius = radius;
    this.speed = Math.random() * 0.02 + 0.005;
  }

  update() {
    this.angle += this.speed;
    this.x = this.baseX + Math.cos(this.angle) * this.radius;
    this.y = this.baseY + Math.sin(this.angle) * this.radius;

    if (mouse.x !== null && mouse.y !== null) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += dx / dist;
        this.y += dy / dist;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fill();
  }
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    let angle = Math.random() * Math.PI * 2;
    let radius = Math.random() * 200 + 50;
    particles.push(new Particle(width / 2, height / 2, angle, radius));
  }
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,240,255,${1 - dist / maxDistance})`;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  width = canvas.width;
  height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  for (let p of particles) {
    p.update();
    p.draw();
  }
  drawLines();
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

resizeCanvas();
initParticles();
animate();