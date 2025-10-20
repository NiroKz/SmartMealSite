// feedback.js
console.log("Script feedback.js carregado!");

let feedbackChart = null;

// Função para carregar e renderizar os feedbacks + atualizar o gráfico
async function loadFeedbacks() {
  try {
    const response = await fetch(`/feedback/getAllFeedbacks`);
    const feedbacks = await response.json();
    console.log("Feedbacks recebidos:", feedbacks);

    const container = document.querySelector(".feedbacks-container");
    if (!container) {
      console.error("Container de feedbacks não encontrado!");
      return;
    }

    container.innerHTML = ""; // limpa cards antigos

    // Montar cards visuais
    feedbacks.forEach((fb) => {
      const cardClass =
        fb.rating === "good"
          ? "positive"
          : fb.rating === "bad"
          ? "negative"
          : "neutral";
      const emoji =
        fb.rating === "good" ? "😍" : fb.rating === "bad" ? "😞" : "😐";

      const card = document.createElement("div");
      card.classList.add("feedback-card", cardClass);
      card.innerHTML = `
        <div class="feedback-header">
          <h3>${fb.student_name}</h3>
          <span class="icon">${emoji}</span>
        </div>
        <p>${fb.comment}</p>
        <span class="feedback-date">${new Date(
          fb.date_feedback
        ).toLocaleDateString("pt-BR")}</span>
      `;
      container.appendChild(card);
    });

    // Contagem dos tipos de feedback
    const totalGood = feedbacks.filter((f) => f.rating === "good").length;
    const totalMid = feedbacks.filter((f) => f.rating === "mid").length;
    const totalBad = feedbacks.filter((f) => f.rating === "bad").length;

    // Atualizar gráfico de pizza
    setTimeout(() => {
      updateFeedbackChart(totalGood, totalMid, totalBad);
    }, 300);
  } catch (error) {
    console.error("Erro ao carregar feedbacks:", error);
  }
}

// Função para atualizar o gráfico
function updateFeedbackChart(good, mid, bad) {
  console.log("Atualizando gráfico...", good, mid, bad);
  const ctx = document.getElementById("feedbackChart");

  if (!ctx) {
    console.error("Canvas do gráfico não encontrado!");
    return;
  }

  // Se já existir um gráfico, destrói antes de criar outro
  if (feedbackChart) {
    feedbackChart.destroy();
  }

  feedbackChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Bom", "Médio", "Ruim"],
      datasets: [
        {
          data: [good, mid, bad],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"], // cores verde, amarelo, vermelho
          borderColor: "#F2E4C8",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: { color: "#333", font: { size: 14 } },
        },
       datalabels: {
                    color: "#f6f6f6ff",
                    font: { size: 14 },
                    formatter: (value, ctx) => {
                        const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / sum) * 100).toFixed(0) + "%";
                        return percentage;
                    }
                }
            }
        },
        plugins: [ChartDataLabels] // ativando plugin
    });
}

// Envio de feedback
async function submitFeedback(e) {
  e.preventDefault();

  const id_rm = document.getElementById("rm").value;
  const date_feedback = document.getElementById("date").value;
  const comment = document.getElementById("comentary").value;

  const ratingSlider = document.getElementById("rating");
  let ratingValue;
  switch (ratingSlider.value) {
    case "1":
      ratingValue = "bad";
      break;
    case "2":
      ratingValue = "mid";
      break;
    case "3":
      ratingValue = "good";
      break;
    default:
      ratingValue = "mid";
  }

  try {
    const response = await fetch(`/feedback/submitFeedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_rm,
        date_feedback,
        rating: ratingValue,
        comment,
      }),
    });

    const data = await response.json();
    console.log("Resposta do servidor:", data);

    showPopup("Sucesso!", "Feedback enviado com sucesso!");
    document.getElementById("feedbackForm").reset();

    // Atualiza feedbacks e gráfico
    loadFeedbacks();
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
    showPopup("Erro", "Erro ao enviar feedback.");
  }
}

// Eventos
// Envio de feedback
document
  .getElementById("feedbackForm")
  ?.addEventListener("submit", submitFeedback);
// Carrega feedbacks quando a aba de feedbacks for aberta
document
  .querySelector("#feedbacks-tab-button")
  ?.addEventListener("click", loadFeedbacks);
// Carrega feedbacks assim que a página é carregada (fallback)
window.addEventListener("DOMContentLoaded", loadFeedbacks);
