$(document).ready(function() {
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
    });

    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function () {
        const header = $('header');
        const scrollPosition = $(window).scrollTop() - header.outerHeight();

        let activeSectionIndex = 0;

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1');
        }

        sections.each(function(i) {
            const section = $(this);
            const sectionTop = section.offset().top - 96;
            const sectionBottom = sectionTop+ section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        })

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    });

    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('.dish', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#testimonial_chef', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })

    const controls = document.querySelectorAll(".control");
    let currentItem = 0;
    const items = document.querySelectorAll(".item");
    const maxItems = items.length;
    
    // Função para atualizar o item ativo
    const updateCurrentItem = (index) => {
        items.forEach((item) => item.classList.remove("current-item")); // Remove a classe de todos os itens
        items[index].classList.add("current-item"); // Adiciona a classe ao item selecionado
    };
    
    // Evento para as setas de navegação
    controls.forEach((control) => {
        control.addEventListener("click", (e) => {
            const isLeft = e.target.classList.contains("arrow-left");
    
            if (isLeft) {
                currentItem -= 1;
            } else {
                currentItem += 1;
            }
    
            if (currentItem >= maxItems) {
                currentItem = 0;
            }
    
            if (currentItem < 0) {
                currentItem = maxItems - 1;
            }
    
            updateCurrentItem(currentItem); // Atualiza o item ativo
        });
    });
    
    // Evento para selecionar o card ao clicar
    items.forEach((item, index) => {
        item.addEventListener("click", () => {
            currentItem = index; // Atualiza o índice atual para o card clicado
            updateCurrentItem(currentItem); // Atualiza o item ativo
        });
    });
});