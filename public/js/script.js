document.addEventListener('DOMContentLoaded', function () {
    const cards = Array.from(document.querySelectorAll('.carousel-track .card'));
    let centerIndex = 0;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function showCardsMobile(order) {
        const track = document.querySelector('.carousel-track');
        // Remove todos .visible
        cards.forEach(card => {
            card.classList.remove('visible');
            // Força reflow para reiniciar animação
            void card.offsetWidth;
        });
        // Adiciona .visible na ordem correta
        order.forEach(idx => {
            cards[idx].classList.add('visible');
            track.appendChild(cards[idx]);
        });
    }

    function updatePositions() {
        if (isMobile()) {
            let order = [centerIndex, (centerIndex+2)%cards.length, (centerIndex+1)%cards.length];
            showCardsMobile(order);
        } else {
            cards.forEach((card, i) => {
                card.classList.remove('left', 'center', 'right', 'visible');
            });
            cards[(centerIndex + cards.length - 1) % cards.length].classList.add('left');
            cards[centerIndex % cards.length].classList.add('center');
            cards[(centerIndex + 1) % cards.length].classList.add('right');
        }
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

    window.addEventListener('resize', () => {
        updatePositions();
    });

    updatePositions();
});