// ==============================
// feedback.js
// ==============================

// Função para carregar e renderizar os feedbacks
async function loadFeedbacks() {
  try {
    const response = await fetch("http://localhost:3000/feedback/getAllFeedbacks");
    const feedbacks = await response.json();
    console.log("Feedbacks recebidos:", feedbacks);

    const container = document.querySelector(".feedbacks-container");
    if (!container) {
      console.error("Container de feedbacks não encontrado!");
      return;
    }

    container.innerHTML = ""; // limpa cards antigos

    feedbacks.forEach(fb => {
      const cardClass = fb.rating === "good" ? "positive" :
                        fb.rating === "bad" ? "negative" : "neutral";
      const emoji = fb.rating === "good" ? "😍" :
                    fb.rating === "bad" ? "😞" : "😐";

      const card = document.createElement("div");
      card.classList.add("feedback-card", cardClass);
      card.innerHTML = `
        <div class="feedback-header">
          <h3>${fb.student_name}</h3>
          <span class="icon">${emoji}</span>
        </div>
        <p>${fb.comment}</p>
        <span class="feedback-date">${new Date(fb.date_feedback).toLocaleDateString("pt-BR")}</span>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar feedbacks:", error);
  }
}

// ==============================
// Função para enviar feedback
// ==============================
async function submitFeedback(e) {
  e.preventDefault();

  const id_rm = document.getElementById("rm").value;
  const date_feedback = document.getElementById("date").value;
  const comment = document.getElementById("comentary").value;

  const ratingSlider = document.getElementById("rating");
  let ratingValue;
  switch (ratingSlider.value) {
    case "1": ratingValue = "bad"; break;
    case "2": ratingValue = "mid"; break;
    case "3": ratingValue = "good"; break;
    default: ratingValue = "mid";
  }

  try {
    const response = await fetch("http://localhost:3000/feedback/submitFeedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_rm, date_feedback, rating: ratingValue, comment })
    });

    const data = await response.json();
    console.log("Resposta do servidor:", data);

    showPopup("Sucesso!", "Feedback enviado com sucesso!");
    document.getElementById("feedbackForm").reset();

    // Atualiza os cards com o novo feedback
    loadFeedbacks();

  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
    showPopup("Erro", "Erro ao enviar feedback.");
  }
}

// ==============================
// Eventos
// ==============================

// Envio de feedback
document.getElementById("feedbackForm")?.addEventListener("submit", submitFeedback);

// Carrega feedbacks quando a aba de feedbacks for aberta
document.querySelector('#feedbacks-tab-button')?.addEventListener('click', loadFeedbacks);

// Carrega feedbacks assim que a página é carregada (fallback)
window.addEventListener("DOMContentLoaded", loadFeedbacks);
