console.log("📘 studentRegister.js carregado!");

// Pegando formulário
const form = document.getElementById("studentForm");

// Evento no submit
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Evita reload da página

  // Pegando valores dos inputs
  const course = document.getElementById("nome").value;
  const period = document.getElementById("period").value;
  const grade = document.getElementById("grade").value;
  const date_registration = document.querySelector("input[type='date']").value;

  // curso com no máximo 4 caracteres
  if (course.length > 4) {
    showPopup("Erro!", "O nome do curso deve ter no máximo 4 letras.");
    return; // impede o envio
  }

  // Montando objeto
  const data = {
    course,
    period,
    grade,
    date_registration
  };

  try {
    // Enviando via POST
    const response = await fetch(`/class/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // Sucesso
    if (response.status === 201) {
      showPopup("Sucesso!", result.message);
      form.reset();
    } else {
      showPopup("Erro!", result.message);
    }

  } catch (error) {
    console.error("Erro no fetch:", error);
    showPopup("Erro!", "Falha ao conectar com o servidor.");
  }
});
