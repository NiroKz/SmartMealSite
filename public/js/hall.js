
const addSchoolBtn = document.getElementById('addSchoolBtn');
const formBox = document.getElementById('formBox');
const saveSchoolBtn = document.getElementById('saveSchoolBtn');
const schoolList = document.getElementById('schoolList');

addSchoolBtn.addEventListener('click', () => {
    formBox.style.display = formBox.style.display === 'flex' ? 'none' : 'flex';
});

saveSchoolBtn.addEventListener('click', () => {
    const name = document.getElementById('schoolName').value;
    const address = document.getElementById('schoolAddress').value;
    const phone = document.getElementById('schoolPhone').value;

    if (name && address && phone) {
        const card = document.createElement('div');
        card.className = 'school-card';

        card.innerHTML = `
            <div class="info">
                <b>${name}</b>
                <span>${address}</span>
                <span>${phone}</span>
            </div>
            <div class="icon">▶</div>
        `;

        schoolList.appendChild(card);

        // Limpar os campos
        document.getElementById('schoolName').value = '';
        document.getElementById('schoolAddress').value = '';
        document.getElementById('schoolPhone').value = '';

        formBox.style.display = 'none';
    } else {
        alert('Por favor, preencha todos os campos!');
    }
});
