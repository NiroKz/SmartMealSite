async function createGraphic() {
  try {
    const response = await fetch("/graphic/studentsCurses");
    const dados = await response.json();

    // Extrair labels e dados do resultado
    const labels = dados.map((item) => item.curso);
    const totalAlunos = dados.map((item) => item.total_alunos);

    const cores = {
      INFO: "rgba(255, 99, 132, 0.6)",
      MEC: "rgba(54, 162, 235, 0.6)",
      ADM: "rgba(255, 206, 86, 0.6)",
      PTEC: "rgba(75, 192, 192, 0.6)",
      AUTO: "rgba(153, 102, 255, 0.6)",
    };

    const bgColors = labels.map((curso) => cores[curso] || "gray");
    const borderColors = bgColors.map((c) => c.replace("0.6", "1"));

    const ctx = document
      .getElementById("graphicStudents")
      .getContext("2d");

    new Chart(ctx, {
      type: "polarArea", // gráfico de barras
      data: {
        labels: labels,
        datasets: [
          {
            label: "Número de alunos",
            data: totalAlunos,
            backgroundColor: bgColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0, // para não mostrar valores decimais
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao carregar dados do gráfico:", error);
  }
}

// Chama a função para criar o gráfico assim que a página carregar
window.onload = createGraphic;
