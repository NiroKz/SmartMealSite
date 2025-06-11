function showTab(event, secao) {
    event.preventDefault();

    // Atualiza a seleção visual das abas
    document.querySelectorAll('.access-control2 a').forEach(function(tab) {
        tab.classList.remove('selected');
    });
    event.target.classList.add('selected');

    // Esconde todas as seções de conteúdo (menos a barra de abas)
    document.querySelectorAll('.tab-section').forEach(function(section) {
        if (!section.classList.contains('access-control2')) {
            section.style.display = 'none';
        }
    });

    // Mostra a barra de abas e a seção correspondente como bloco
    document.querySelector('.access-control2').style.display = 'flex';
    const secaoEl = document.getElementById(secao);
    if (secaoEl) secaoEl.style.display = 'block';
}

function togglePerms(btn) {
  const content = btn.parentElement.querySelector(".perms-content");
  const arrow = btn.querySelector(".arrow");
  content.classList.toggle("active");
  arrow.classList.toggle("down");
}

function irParaSecao(secao) {
    // Esconde o bloco de módulos
    const modulosSection = document.getElementById('modulos-section');
    if (modulosSection) modulosSection.style.display = 'none';

    // Mostra a barra de abas
    const accessControl2 = document.querySelector('.access-control2');
    if (accessControl2) accessControl2.style.display = 'flex';

    // Mostra a seção correspondente
    document.querySelectorAll('.tab-section').forEach(el => {
        if (!el.classList.contains('access-control2')) {
            el.style.display = 'none';
        }
    });
    const secaoEl = document.getElementById(secao);
    if (secaoEl) secaoEl.style.display = 'block';

    // Atualiza a seleção das abas
    document.querySelectorAll('.access-control2 a').forEach(a => a.classList.remove('selected'));
    const tab = Array.from(document.querySelectorAll('.access-control2 a')).find(a => a.getAttribute('onclick') && a.getAttribute('onclick').includes(secao));
    if (tab) tab.classList.add('selected');
}

// Inicializa mostrando apenas o bloco de módulos ao carregar
window.addEventListener('DOMContentLoaded', () => {
    // Mostra só o bloco de módulos
    const modulosSection = document.getElementById('modulos-section');
    if (modulosSection) modulosSection.style.display = '';
    // Esconde todas as seções de abas e a barra de abas
    document.querySelectorAll('.tab-section').forEach(el => el.style.display = 'none');
    document.querySelector('.access-control2').style.display = 'none';
});
