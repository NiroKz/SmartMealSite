document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    const cards = Array.from(track.children);
    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, idx) => {
            card.classList.remove('active', 'left', 'right');
            card.style.position = 'absolute';
            card.style.opacity = '';
            card.style.pointerEvents = '';
            if (idx === currentIndex) {
                card.classList.add('active');
            } else if (idx === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('left');
            } else if (idx === (currentIndex + 1) % cards.length) {
                card.classList.add('right');
            } else {
                card.style.opacity = 0;
                card.style.pointerEvents = 'none';
            }
        });
    }

    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            if (idx !== currentIndex) {
                currentIndex = idx;
                updateCarousel();
            }
        });
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }, 10000);

    updateCarousel();
});