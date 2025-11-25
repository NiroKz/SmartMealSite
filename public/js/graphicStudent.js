async function createGraphic() {
  try {
    const response = await fetch("/graphic/studentsCurses");
    const dados = await response.json();

    // Extrair labels e dados do resultado
    const labels = dados.map(item => item.course);
    const totalAlunos = dados.map(item => item.total_students);

    // Gerar cores automáticas
    const bgColors = generateColors(labels.length);
    const borderColors = bgColors.map(c =>
      c.replace("60%", "40%") // borda um pouco mais escura
    );

    const ctx = document.getElementById("graphicStudents").getContext("2d");

    new Chart(ctx, {
      type: "polarArea",
      data: {
        labels,
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
    });
  } catch (error) {
    console.error("Erro ao carregar dados do gráfico:", error);
  }
}

function generateColors(qtd) {
  const colors = [];
  for (let i = 0; i < qtd; i++) {
    const hue = Math.floor((360 / qtd) * i);
    colors.push(`hsl(${hue}, 55%, 75%)`);
  }
  return colors;
}

window.onload = createGraphic;
