// public/js/production.js
console.log("✅ production.js carregado!");
const form = document.getElementById("mealForm");
const loadDataBtn = document.getElementById("loadDataBtn");
const productionDate = document.getElementById("productionDate");
const foodsContainer = document.getElementById("foodsContainer");

// Guarda os gráficos ativos
const charts = {};

// ------------------- Carregar produtos no select -------------------
// ------------------- Carregar produtos no select -------------------
async function loadProducts() {
  try {
    const response = await fetch(`https://smartmealsite-backend.up.railway.app/product`);
    if (!response.ok) throw new Error("Erro ao carregar produtos!");
    const products = await response.json();

    // Preenche todos os selects de comida
    const selects = Array.from(document.getElementsByName("id_product[]"));
    selects.forEach((select) => {
      const prevValue = select.value; // guarda a seleção anterior

      select.innerHTML = ""; // limpa as opções antigas

      // recria as opções
      products.forEach((prod) => {
        const option = document.createElement("option");
        option.value = prod.id_product;
        option.textContent = prod.product_name;
        select.appendChild(option);
      });

      // tenta restaurar a seleção
      if (prevValue) {
        select.value = prevValue;
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// ------------------- Adicionar novo campo de comida -------------------
// Função para adicionar novos blocos de comida
document.addEventListener("DOMContentLoaded", () => {
  const addFoodBtn = document.getElementById("addFoodBtn");
  const foodContainer = document.getElementById("foodInputsContainer");

  if (addFoodBtn && foodContainer) {
    addFoodBtn.addEventListener("click", () => {
      const foodBlock = document.createElement("div");
      foodBlock.classList.add("food-block");

      foodBlock.innerHTML = `
        <label>
          Comida:
          <select>
            <option value="">Carregando produtos...</option>
          </select>
        </label>
        <label>
          Produzido (kg):
          <input type="number" placeholder="Ex: 50" />
        </label>
        <label>
          Sobrou (kg):
          <input type="number" placeholder="Ex: 10" />
        </label>
      `;

      foodContainer.appendChild(foodBlock);
    });
  }
});


// ------------------- Carregar produção do backend -------------------
async function loadProduction(date) {
  try {
    const query = date ? `?date=${date}` : "";
    const response = await fetch(`https://smartmealsite-backend.up.railway.app/production${query}`);
    if (!response.ok) throw new Error("Erro ao carregar produção!");
    const data = await response.json();

    renderTables(data);
    renderCharts(data);
  } catch (err) {
    console.error(err);
  }
}

// ------------------- Renderizar tabelas -------------------
function renderTables(data) {
  const totalBody = document.querySelector("#totalTable tbody");
  const morningBody = document.querySelector("#morningTable tbody");
  const afternoonBody = document.querySelector("#afternoonTable tbody");
  const nightBody = document.querySelector("#nightTable tbody");

  [totalBody, morningBody, afternoonBody, nightBody].forEach(
    (body) => (body.innerHTML = "")
  );

  data.forEach((item) => {
    const row = `
      <tr>
        <td>${item.product_name || item.food}</td>
        <td>${item.produced}</td>
        <td>${item.remnant}</td>
      </tr>
    `;
    totalBody.innerHTML += row;
    if (item.shift === "morning") morningBody.innerHTML += row;
    if (item.shift === "evening") afternoonBody.innerHTML += row;
    if (item.shift === "night") nightBody.innerHTML += row;
  });
}

// ------------------- Renderizar gráficos -------------------
function renderCharts(data) {
  const shiftsData = {
    morning: data.filter((i) => i.shift === "morning"),
    evening: data.filter((i) => i.shift === "evening"),
    night: data.filter((i) => i.shift === "night"),
  };

  function aggregate(items) {
    return {
      produced: items.reduce((sum, i) => sum + parseFloat(i.produced || 0), 0),
      remnant: items.reduce((sum, i) => sum + parseFloat(i.remnant || 0), 0),
    };
  }

  renderShiftChart(
    "morningChart",
    aggregate(shiftsData.morning),
    "Produção - Manhã"
  );
  renderShiftChart(
    "afternoonChart",
    aggregate(shiftsData.evening),
    "Produção - Tarde"
  );
  renderShiftChart(
    "nightChart",
    aggregate(shiftsData.night),
    "Produção - Noite"
  );
  renderShiftChart("totalChart", aggregate(data), "Produção - Total do Dia");
}

// ------------------- Criar ou atualizar gráfico -------------------
function renderShiftChart(canvasId, values, title) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (charts[canvasId]) charts[canvasId].destroy();

  charts[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [""], // só um rótulo no eixo X
      datasets: [
        {
          label: "Produzido",
          data: [values.produced],
          backgroundColor: "#4CAF50",
        },
        {
          label: "Sobra",
          data: [values.remnant],
          backgroundColor: "#FF5722",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: title },
      },
    },
  });
}

// ------------------- Envio do formulário -------------------
// ------------------- Envio do formulário -------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const foods = Array.from(document.getElementsByName("id_product[]"));
  const produced = Array.from(document.getElementsByName("quantityProduced[]"));
  const leftovers = Array.from(document.getElementsByName("leftovers[]"));

  const items = foods.map((food, i) => ({
    id_product: food.value,
    quantityProduced: parseFloat(produced[i].value),
    leftovers: parseFloat(leftovers[i].value),
  }));

  const body = {
    mealType: formData.get("mealType"),
    shift: formData.get("shift"),
    notes: formData.get("notes"),
    items,
  };

  try {
    const response = await fetch(`https://smartmealsite-backend.up.railway.app/production`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Erro ao salvar produção!");

    // 🔹 Reseta o formulário
    form.reset();

    // 🔹 Remove todos os itens de comida extras
    foodsContainer.innerHTML = "";

    // 🔹 Cria um novo item padrão
    const div = document.createElement("div");
    div.classList.add("food-item");
    div.innerHTML = `
      <label>Comida:
        <select name="id_product[]" required>
          <option value="" disabled selected>Carregando produtos...</option>
        </select>
      </label>
      <label>Produzido (kg):
        <input type="number" step="0.001" name="quantityProduced[]" required>
      </label>
      <label>Sobrou (kg):
        <input type="number" step="0.001" name="leftovers[]" required>
      </label>
    `;
    foodsContainer.appendChild(div);

    // 🔹 Recarrega os produtos no novo select
    loadProducts();

    // 🔹 Recarrega a produção para atualizar tabelas/gráficos
    loadProduction(productionDate.value || null);
  } catch (err) {
    console.error(err);
  }
});

// ------------------- Botão carregar produção por data -------------------
loadDataBtn.addEventListener("click", () => {
  loadProduction(productionDate.value || null);
});

// ------------------- Inicializar -------------------
loadProducts();
loadProduction();
