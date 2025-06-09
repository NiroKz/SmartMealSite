function showTab(event, tabId) {
  event.preventDefault();
  document
    .querySelectorAll(".tab-section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document
    .querySelectorAll(".access-control2 a")
    .forEach((a) => a.classList.remove("selected"));
  event.target.classList.add("selected");
}

function togglePerms(btn) {
  const content = btn.parentElement.querySelector(".perms-content");
  const arrow = btn.querySelector(".arrow");
  content.classList.toggle("active");
  arrow.classList.toggle("down");
}

function mostrarModulos(nomeEscola) {
  document.querySelector("main").style.display = "none";
  const container = document.getElementById("modulos-container");
  container.style.display = "block";
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
<<<<<<< HEAD
  document.getElementById("modulos-container").style.display = "none";
  document.querySelector("main").style.display = "block";
  document
    .querySelectorAll(".tab-section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById(secaoId).classList.add("active");
  document
    .querySelectorAll(".access-control2 a")
    .forEach((a) => a.classList.remove("selected"));
  const tabMap = {
    acesso: 0,
    refeicao: 1,
    estoque: 2,
    admin: 3,
  };
  document
    .querySelectorAll(".access-control2 a")
    [tabMap[secaoId]].classList.add("selected");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
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
    })
    .catch((error) => {
      console.error("Failed to load student access data:", error);
    });
});
=======
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

function renderCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const date = new Date(year, month, 1);
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
        <button id="prevMonth">&lt;</button>
        <span>${monthNames[month]} ${year}</span>
        <button id="nextMonth">&gt;</button>
    `;
    calendar.appendChild(header);

    const table = document.createElement('table');
    table.className = 'calendar-table';
    let thead = '<thead><tr>';
    days.forEach(d => thead += `<th>${d}</th>`);
    thead += '</tr></thead>';
    table.innerHTML = thead;

    let tbody = '<tbody><tr>';
    let firstDay = date.getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        tbody += '<td></td>';
    }

    for (let day = 1; day <= lastDate; day++) {
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) tbody += '</tr><tr>';
        tbody += `<td class="calendar-day" data-day="${day}">${day}</td>`;
    }

    let lastCell = (firstDay + lastDate) % 7;
    if (lastCell !== 0) {
        for (let i = lastCell; i < 7; i++) {
            tbody += '<td></td>';
        }
    }
    tbody += '</tr></tbody>';
    table.innerHTML += tbody;
    calendar.appendChild(table);

    document.getElementById('prevMonth').onclick = () => {
        let m = month - 1, y = year;
        if (m < 0) { m = 11; y--; }
        renderCalendar(m, y);
    };
    document.getElementById('nextMonth').onclick = () => {
        let m = month + 1, y = year;
        if (m > 11) { m = 0; y++; }
        renderCalendar(m, y);
    };

    document.querySelectorAll('.calendar-day').forEach(td => {
        td.onclick = () => {
            document.querySelectorAll('.calendar-day.selected').forEach(e => e.classList.remove('selected'));
            td.classList.add('selected');
        };
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const calendarDiv = document.getElementById('calendar');
    if (calendarDiv) {
        const today = new Date();
        renderCalendar(today.getMonth(), today.getFullYear());
    }
});
>>>>>>> 68a3907c0b564015caf7451b8cde2d685dba62a3
