const links = document.querySelectorAll('.nav-link');
const underline = document.querySelector('.underline');
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
const pixelRatio = window.devicePixelRatio;

canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';
ctx.scale(pixelRatio, pixelRatio);

class Star {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width / pixelRatio) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height / pixelRatio) {
            this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

let stars = [];

function init() {
    for (let i = 0; i < 400; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        const colors = ['#333', '#999', '#6D1995', '#4FBBDD', '#84991C, #C93C20, #1C60D4, #B6B648'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
        }

        stars.push(new Star(x, y, radius, color, velocity));
    }
}

function connectStars(star1, star2) {
    ctx.strokeStyle = star1.color;
    ctx.lineWidth = 0.2;
    ctx.beginPath();
    ctx.moveTo(star1.x, star1.y);
    ctx.lineTo(star2.x, star2.y);
    ctx.stroke();
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
        stars[i].update();

        // Connect stars
        for (let j = i + 1; j < stars.length; j++) {
            if (distance(stars[i].x, stars[i].y, stars[j].x, stars[j].y) < 100) {
                connectStars(stars[i], stars[j]);
            }
        }
    }
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        adjustUnderline(link);
    });

    link.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('.nav-link[data-active="true"]');
        adjustUnderline(activeLink);
    });

    link.addEventListener('click', (e) => {
        links.forEach(l => l.removeAttribute('data-active'));
        link.setAttribute('data-active', 'true');

        adjustUnderline(link);

        setTimeout(() => {
            if(link.href) {
                window.location.href = link.href;
            }
        }, 350);  // This delay allows the underline transition to complete before the page navigation occurs.
    });
});

function adjustUnderline(element) {
    const width = element.offsetWidth;
    const left = element.offsetLeft;

    underline.style.width = `${width}px`;
    underline.style.left = `${left}px`;
}

function adjustActiveUnderline() {
    const activeLink = document.querySelector('.nav-link[data-active="true"]');
    adjustUnderline(activeLink);
}

function resizeCanvas() {
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(pixelRatio, pixelRatio);

}

document.querySelector('.dropdown-btn').addEventListener('click', function() {
    var navList = document.querySelector('.nav-list');
    if (navList.style.display === 'none' || navList.style.display === '') {
        navList.style.display = 'flex';
    } else {
        navList.style.display = 'none';
    }
});

window.addEventListener('resize', adjustActiveUnderline);

window.addEventListener('resize', resizeCanvas);
adjustActiveUnderline();

init();
animate();