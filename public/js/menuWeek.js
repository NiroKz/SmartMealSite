console.log("📅 menuWeek.js carregado!");

// Tradução das refeições
const mealTypeTranslate = {
  breakfast: "Café da Manhã",
  lunch: "Almoço",
  snack: "Lanche",
  dinner: "Jantar"
};

// Ordem fixa
const mealOrder = ["breakfast", "lunch", "snack", "dinner"];

async function loadMenuWeek() {
  try {
    const res = await fetch(`/menu/week`);
    const data = await res.json();

    // Estrutura: refeição → dia
    const tableData = {};

    mealOrder.forEach(t => {
      tableData[t] = { 1:null, 2:null, 3:null, 4:null, 5:null }; // seg–sex
    });

    data.forEach(item => {
      const weekday = item.weekday - 1; // Ajusta MySQL
      if (weekday >= 1 && weekday <= 5) {
        tableData[item.meal_type][weekday] = item;
      }
    });

    // GERAR HTML
    const tableContainer = document.getElementById("menu-table");
    let html = `
      <div class="menu-row header">
        <div class="menu-type-header">Refeição</div>
        <div class="menu-day">Segunda</div>
        <div class="menu-day">Terça</div>
        <div class="menu-day">Quarta</div>
        <div class="menu-day">Quinta</div>
        <div class="menu-day">Sexta</div>
      </div>
    `;

    mealOrder.forEach(type => {
      html += `<div class="menu-row">`;

      // Nome da refeição
      html += `<div class="menu-type-col"><b>${mealTypeTranslate[type]}</b></div>`;

      // Dias
      for (let d = 1; d <= 5; d++) {
        const item = tableData[type][d];

        if (item) {
          html += `
            <div class="menu-cell">
              ${item.product_name_1}<br>
              ${item.product_name_2}<br>
              ${item.product_name_3}<br>
              ${item.product_name_4}
            </div>
          `;
        } else {
          html += `<div class="menu-cell empty"></div>`;
        }
      }

      html += `</div>`;
    });

    tableContainer.innerHTML = html;

  } catch (err) {
    console.error("Erro ao carregar cardápio semanal:", err);
  }
}

loadMenuWeek();
