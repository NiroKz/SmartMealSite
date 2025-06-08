function showTab(event, tabId) {
    event.preventDefault();
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.access-control2 a').forEach(a => a.classList.remove('selected'));
    event.target.classList.add('selected');
}

function togglePerms(btn) {
    const content = btn.parentElement.querySelector('.perms-content');
    const arrow = btn.querySelector('.arrow');
    content.classList.toggle('active');
    arrow.classList.toggle('down');
}

function mostrarModulos(nomeEscola) {
    document.querySelector('main').style.display = 'none';
    const container = document.getElementById('modulos-container');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="modulos-header">
            <h1>${nomeEscola}</h1>
            <h3>Você é diretor(a) desta escola</h3>
        </div>
        <div class="modulos-botoes">
            <button class="modulo-btn" onclick="irParaSecao('acesso')">Controle de Acesso <span class="modulo-icone">&#9654;</span></button>
            <button class="modulo-btn" onclick="irParaSecao('refeicao')">Controle de Refeições <span class="modulo-icone">&#9654;</span></button>
            <button class="modulo-btn" onclick="irParaSecao('estoque')">Controle de Estoque <span class="modulo-icone">&#9654;</span></button>
            <button class="modulo-btn" onclick="irParaSecao('admin')">Administração <span class="modulo-icone">&#9654;</span></button>
        </div>
    `;
}

function irParaSecao(secaoId) {
    document.getElementById('modulos-container').style.display = 'none';
    document.querySelector('main').style.display = 'block';
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(secaoId).classList.add('active');
    document.querySelectorAll('.access-control2 a').forEach(a => a.classList.remove('selected'));
    const tabMap = {
        'acesso': 0,
        'refeicao': 1,
        'estoque': 2,
        'admin': 3
    };
    document.querySelectorAll('.access-control2 a')[tabMap[secaoId]].classList.add('selected');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}