function showTab(event, secao) {
  event.preventDefault();

  // Atualiza visual das abas
  document.querySelectorAll('.access-control2 a').forEach(function(tab) {
    tab.classList.remove('selected');
  });
  event.target.classList.add('selected');

  // Esconde todas as seções (menos a barra de abas)
  document.querySelectorAll('.tab-section').forEach(function(section) {
    if (!section.classList.contains('access-control2')) {
      section.style.display = 'none';
    }
  });

  // Mostra a barra de abas e a seção desejada
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

  // Mostra a barra de abas e a seção selecionada
  const accessControl2 = document.querySelector('.access-control2');
  if (accessControl2) accessControl2.style.display = 'flex';

  document.querySelectorAll('.tab-section').forEach(el => {
    if (!el.classList.contains('access-control2')) {
      el.style.display = 'none';
    }
  });

  const secaoEl = document.getElementById(secao);
  if (secaoEl) secaoEl.style.display = 'block';

  // Atualiza dados do backend
  fetch("/studentAccess/today")
    .then((res) => res.json())
    .then((data) => {
      const { total_today, total_students, lunch_count, dinner_count } = data;
      const percentage =
        total_students > 0
          ? Math.round((total_today / total_students) * 100)
          : 0;

      document.querySelector(".percentage span").textContent = `${percentage}%`;

      const infoDivs = document.querySelectorAll(".info > div");
      if (infoDivs.length >= 2) {
        infoDivs[0].querySelector("p").textContent = `Qtd: ${lunch_count}`;
        infoDivs[1].querySelector("p").textContent = `Qtd: ${dinner_count}`;
      }

      // Destaca aba correta
      document.querySelectorAll('.access-control2 a').forEach(a => a.classList.remove('selected'));
      const tab = Array.from(document.querySelectorAll('.access-control2 a')).find(a => a.getAttribute('onclick')?.includes(secao));
      if (tab) tab.classList.add('selected');
    })
    .catch((error) => {
      console.error("Failed to load student access data:", error);
    });
}

// Ao carregar a página: mostrar só o bloco de módulos e esconder as abas
window.addEventListener('DOMContentLoaded', () => {
  const modulosSection = document.getElementById('modulos-section');
  if (modulosSection) modulosSection.style.display = '';

  document.querySelectorAll('.tab-section').forEach(el => el.style.display = 'none');
  document.querySelector('.access-control2').style.display = 'none';
});
