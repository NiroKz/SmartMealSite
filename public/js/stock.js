// public/js/stock.js
document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector(".estoque-table tbody");

  try {
    const response = await fetch("http://localhost:3000/stock");
    const stockData = await response.json();

    tbody.innerHTML = ""; // limpa dados mockados

    stockData.forEach(item => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.batch}</td>
        <td>${item.date_movement}</td>
        <td>${item.quantity_movement}</td>
        <td>${item.validity}</td>
        <td>${item.product_name}</td>
      `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
  }
});
