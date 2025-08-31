document.getElementById("mealForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const now = new Date();
  const hour = now.getHours();
  const shift = hour < 14 ? "manhã" : "tarde";

  const data = {
    mealType: formData.get("mealType"),
    quantityProduced: parseFloat(formData.get("quantityProduced")),
    leftovers: parseFloat(formData.get("leftovers")),
    notes: formData.get("notes"),
    shift: shift,
  };

  const response = await fetch("http://localhost:3000/production", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    //alert("Production saved!");
    renderChart(data.quantityProduced, data.leftovers);
  } else {
    alert("Error saving data.");
  }
});

// Função declarada fora do event listener
function renderChart(quantityProduced, leftovers) {
  const ctx = document.getElementById("productionChart").getContext("2d");

  if (window.productionChartInstance) {
    window.productionChartInstance.destroy();
  }

  window.productionChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Produzido", "Sobra"],
      datasets: [
        {
          label: "Quantidade (kg)",
          data: [quantityProduced, leftovers],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      // Sem scales aqui, pois gráfico pie não usa
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  });
}
