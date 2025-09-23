document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector(".estoque-table tbody");

  try {
    const response = await fetch(`https://smart-meal-backend.vercel.app/stock`);
    const stockData = await response.json();

    tbody.innerHTML = ""; // limpa tabela mockada

    stockData.forEach(item => {
      const row = document.createElement("tr");

      const quantity_movement_formated = Number(item.quantity_movement);
      row.innerHTML = `
        <td>${item.batch}</td>
        <td>${item.date_movement}</td>
        <td>${quantity_movement_formated.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ${item.unit}</td>
        <td>${item.validity}</td>
        <td>${item.product_name}</td>
      `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
  }
});
