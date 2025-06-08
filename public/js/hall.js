
const addSchoolBtn = document.getElementById('addSchoolBtn');
const formBox = document.getElementById('formBox');
const saveSchoolBtn = document.getElementById('saveSchoolBtn');
const schoolList = document.getElementById('schoolList');

addSchoolBtn.addEventListener('click', () => {
    formBox.style.display = formBox.style.display === 'flex' ? 'none' : 'flex';
});

saveSchoolBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Evita o comportamento padrão de envio

    const nome_escola = document.getElementById('schoolName').value;
    const rua_endereco = document.getElementById('schoolAddress').value;
    const fone = document.getElementById('schoolPhone').value;

    const id_usuario = 1; // Substitua pelo valor real (ex: sessionStorage.getItem('id_usuario'))

    if (!nome_escola || !rua_endereco || !fone) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('/school/addSchools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, nome_escola, rua_endereco, fone })
        });

        const data = await response.json();

        if (response.ok) {
            // Criar o card visual só se o backend confirmar
            const card = document.createElement('div');
            card.className = 'school-card';

            card.innerHTML = `
                <div class="info">
                    <b>${nome_escola}</b>
                    <span>${rua_endereco}</span>
                    <span>${fone}</span>
                </div>
                <div class="icon">▶</div>
            `;

            schoolList.appendChild(card);

            // Limpar campos
            document.getElementById('schoolName').value = '';
            document.getElementById('schoolAddress').value = '';
            document.getElementById('schoolPhone').value = '';
            formBox.style.display = 'none';

            //alert(data.sucesso);
        } else {
            alert(data.erro || 'Erro ao cadastrar escola.');
        }
    } catch (err) {
        console.error(err);
        alert('Erro na conexão com o servidor.');
    }
});

// Função para criar visualmente um card de escola
function createSchoolCard(school) {
    const card = document.createElement('div');
    card.className = 'school-card';

    card.innerHTML = `
        <div class="info">
            <b>${school.nome_escola}</b>
            <span>${school.rua_endereco}</span>
            <span>${school.fone}</span>
        </div>
        <div class="icon">▶</div>
    `;

    schoolList.appendChild(card);
}

// Ao carregar a página, buscar todas as escolas
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/school/listSchool');
        const escolas = await response.json();

        escolas.forEach(createSchoolCard);
    } catch (err) {
        console.error('Erro ao carregar escolas:', err);
    }
});
