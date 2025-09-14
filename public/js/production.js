// Container de comidas e botão de adicionar
const container = document.getElementById("foodsContainer");
const addFoodBtn = document.getElementById("addFoodBtn");

// Função para carregar produtos do backend
async function loadProducts(selectElement) {
  try {
    const response = await fetch("http://localhost:3000/product");
    if (!response.ok) throw new Error("Erro ao carregar produtos!");

    const products = await response.json();
    selectElement.innerHTML = ""; // limpa opções anteriores

    products.forEach(prod => {
      const option = document.createElement("option");
      option.value = prod.id_product;
      option.textContent = prod.product_name;
      selectElement.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Função para criar um novo item de comida
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
  await loadProducts(select); // Preenche o select
}

// Inicializa os selects existentes ao carregar a página
window.addEventListener("DOMContentLoaded", async () => {
  const initialSelects = document.querySelectorAll('select[name="id_product[]"]');
  for (const select of initialSelects) {
    await loadProducts(select);
  }
});

// Adicionar comida extra
addFoodBtn.addEventListener("click", createFoodItem);

// Salvar produção
document.getElementById("mealForm").addEventListener("submit", async (e) => {
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
    leftovers: parseFloat(leftovers[i])
  }));

  const data = { mealType, shift, notes, items };

  try {
    const response = await fetch("http://localhost:3000/production", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao salvar produção!");

    alert("Produção registrada com sucesso!");
    loadProduction(); // Atualiza tabela e gráfico
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// Carregar produção por data
document.getElementById("loadDataBtn").addEventListener("click", loadProduction);

async function loadProduction() {
  const date = document.getElementById("productionDate").value || new Date().toISOString().split("T")[0];
  try {
    const response = await fetch(`http://localhost:3000/production?date=${date}`);
    if (!response.ok) throw new Error("Erro ao carregar produção!");

    const data = await response.json();
    renderChart(data);
    renderTable(data);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Renderizar gráfico
function renderChart(items) {
  const ctx = document.getElementById("productionChart").getContext("2d");

  if (window.productionChartInstance) window.productionChartInstance.destroy();

  window.productionChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: items.map(i => i.product_name || i.food),
      datasets: [
        { label: "Produzido (kg)", data: items.map(i => i.quantity_produced), backgroundColor: "#4caf50" },
        { label: "Sobrou (kg)", data: items.map(i => i.remnant), backgroundColor: "#f44336" }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });
}

// Renderizar tabela
function renderTable(items) {
  const tbody = document.querySelector("#productionTable tbody");
  tbody.innerHTML = "";

  items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.product_name || item.food}</td>
      <td>${item.quantity_produced}</td>
      <td>${item.remnant}</td>
      <td>${item.meal_type}</td>
      <td>${item.shift}</td>
      <td>${item.note}</td>
    `;
    tbody.appendChild(tr);
  });
}
