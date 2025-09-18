// public/js/production.js
// ----------------------------------------------------
// Gestão do form de produção e visualização por turno
// ----------------------------------------------------

const container = document.getElementById("foodsContainer");
const addFoodBtn = document.getElementById("addFoodBtn");

// -------------------------
// Carrega produtos em um select específico
// -------------------------
async function loadProducts(selectElement) {
  try {
    if (selectElement.dataset.loaded === "true") return;

    const response = await fetch("http://localhost:3000/product");
    if (!response.ok) throw new Error("Erro ao carregar produtos!");

    const products = await response.json();

    const unique = new Map();
    products.forEach((prod) => {
      if (!unique.has(String(prod.id_product))) {
        unique.set(String(prod.id_product), prod.product_name);
      }
    });

    selectElement.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = "Selecione um produto";
    selectElement.appendChild(placeholder);

    unique.forEach((name, id) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = name;
      selectElement.appendChild(option);
    });

    selectElement.dataset.loaded = "true";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// -------------------------
// Cria um novo bloco de comida
// -------------------------
async function createFoodItem() {
  const div = document.createElement("div");
  div.classList.add("food-item");
  div.innerHTML = `
    <label>Comida:
      <select name="id_product[]" required></select>
    </label>
    <label>Produzido (kg):
      <input type="number" step="0.001" name="quantityProduced[]" required>
    </label>
    <label>Sobrou (kg):
      <input type="number" step="0.001" name="leftovers[]" required>
    </label>
  `;
  container.appendChild(div);

  const select = div.querySelector("select[name='id_product[]']");
  await loadProducts(select);
}

// -------------------------
// Carrega produção do dia e renderiza gráficos e tabelas
// -------------------------
window.loadProduction = async function () {
  const date =
    document.getElementById("productionDate").value ||
    new Date().toISOString().split("T")[0];

  try {
    const response = await fetch(
      `http://localhost:3000/production?date=${date}`
    );
    if (!response.ok) throw new Error("Erro ao carregar produção!");
    const data = await response.json();

    // -------------------------
    // Agrupar por turno
    // -------------------------
    const shiftsData = {
      morning: [],
      evening: [],
      night: [],
    };

    data.forEach((item) => {
      if (shiftsData[item.shift]) shiftsData[item.shift].push(item);
    });

    // Agregado por turno (totais)
    // Agregado por turno (totais)
    function aggregateShift(type) {
      if (type === "total") {
        return {
          produced: data.reduce(
            (sum, i) => sum + (i.quantity_produced || 0),
            0
          ),
          remnant: data.reduce((sum, i) => sum + (i.remnant || 0), 0),
        };
      } else {
        const shiftItems = shiftsData[type] || [];
        return {
          produced: shiftItems.reduce(
            (sum, i) => sum + (i.quantity_produced || 0),
            0
          ),
          remnant: shiftItems.reduce((sum, i) => sum + (i.remnant || 0), 0),
        };
      }
    }

    // Renderiza gráficos por turno
    renderShiftChart(
      "morningChart",
      aggregateShift("morning"),
      "Produção - Manhã"
    );
    renderShiftChart(
      "eveningChart",
      aggregateShift("evening"),
      "Produção - Tarde"
    );
    renderShiftChart("nightChart", aggregateShift("night"), "Produção - Noite");
    renderShiftChart("totalChart", aggregateShift("total"), "Produção Geral");

    renderShiftTables(data); // tabela de comidas por turno
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// -------------------------
// Renderiza gráficos por turno
// -------------------------
function renderShiftChart(canvasId, values, title) {
  const canvasEl = document.getElementById(canvasId);
  if (!canvasEl) return; // se o canvas não existir, sai da função

  const ctx = canvasEl.getContext("2d");

  // destrói gráfico antigo se existir
  if (window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  // cria novo gráfico
  window[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Produzido (kg)", "Sobrou (kg)"],
      datasets: [
        {
          label: title,
          data: [values.produced, values.remnant],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } },
  });
}

// -------------------------
// Renderiza tabelas de comidas por turno
// -------------------------
function renderShiftTables(items) {
  const tables = {
    morning: document.querySelector("#morningTable tbody"),
    evening: document.querySelector("#eveningTable tbody"),
    night: document.querySelector("#nightTable tbody"),
  };

  Object.values(tables).forEach((tbody) => (tbody.innerHTML = ""));

  items.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.product_name || item.food}</td>
      <td>${item.quantity_produced}</td>
      <td>${item.remnant}</td>
    `;
    if (tables[item.shift]) tables[item.shift].appendChild(tr);
  });
}

// -------------------------
// Inicialização
// -------------------------
window.addEventListener("DOMContentLoaded", async () => {
  // popula selects já presentes
  const initialSelects = document.querySelectorAll(
    'select[name="id_product[]"]'
  );
  for (const select of initialSelects) await loadProducts(select);

  addFoodBtn.addEventListener("click", createFoodItem);

  const loadBtn = document.getElementById("loadDataBtn");
  if (loadBtn) loadBtn.addEventListener("click", window.loadProduction);

  const mealForm = document.getElementById("mealForm");
  if (mealForm) {
    mealForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const mealType = formData.get("mealType");
      const shift = formData.get("shift");
      const notes = formData.get("notes");
      const productIds = formData.getAll("id_product[]");
      const quantities = formData.getAll("quantityProduced[]");
      const leftovers = formData.getAll("leftovers[]");

      const items = productIds.map((id, i) => ({
        id_product: parseInt(id),
        quantityProduced: parseFloat(quantities[i]),
        leftovers: parseFloat(leftovers[i]),
      }));

      const data = { mealType, shift, notes, items };

      try {
        const response = await fetch("http://localhost:3000/production", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok)
          throw new Error(
            (await response.text()) || "Erro ao salvar produção!"
          );
        alert("Produção registrada com sucesso!");
        if (typeof window.loadProduction === "function")
          await window.loadProduction();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
  }

  // carrega produção do dia ao abrir a página
  if (typeof window.loadProduction === "function") window.loadProduction();
});
