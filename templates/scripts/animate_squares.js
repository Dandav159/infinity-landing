document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById('animation');

  function createSquare() {
    const square = document.createElement('div');
    const size = Math.random() * 60 + 40;
    const duration = 16 + Math.random() * 6;
    const rotation = Math.random() * 720;
    square.classList.add('square');
    square.style.width = `${size}px`;
    square.style.height = `${size}px`;
    square.style.left = `${Math.random() * 100}%`;
    square.style.animationDuration = `${duration}s`;
    square.style.transform = `rotate(${rotation}deg)`;
    container.appendChild(square);
    setTimeout(() => square.remove(), duration * 1000);
  }

  setInterval(createSquare, 800);
})
