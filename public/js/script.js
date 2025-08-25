document.addEventListener('DOMContentLoaded', function () {
    const cards = Array.from(document.querySelectorAll('.carousel-track .card'));
    let centerIndex = 1;

    function updatePositions() {
        cards.forEach((card, i) => {
            card.classList.remove('left', 'center', 'right');
        });
        cards[(centerIndex + cards.length - 1) % cards.length].classList.add('left');
        cards[centerIndex % cards.length].classList.add('center');
        cards[(centerIndex + 1) % cards.length].classList.add('right');
    }

    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            centerIndex = i;
            updatePositions();
        });
    });

    setInterval(() => {
        centerIndex = (centerIndex + 1) % cards.length;
        updatePositions();
    }, 10000);

    updatePositions();
});