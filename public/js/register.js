const form = document.getElementById("registerForm");
const telefoneInput = document.getElementById("telefone");
const cpfInput = document.getElementById("cpf");
const messageDiv = document.getElementById("registerMessage");

// Funções de formatação de telefone e CPF (mantidas do seu código)
telefoneInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, "").slice(0, 11);
  let formatted = "";
  if (input.length > 0) formatted += "(" + input.substring(0, 2);
  if (input.length >= 3) formatted += ") " + input.substring(2, 7);
  if (input.length >= 8) formatted += "-" + input.substring(7, 11);
  e.target.value = formatted;
});

cpfInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, "").slice(0, 11);
  let formatted = "";
  if (input.length > 0) formatted += input.substring(0, 3);
  if (input.length >= 4) formatted += "." + input.substring(3, 6);
  if (input.length >= 7) formatted += "." + input.substring(6, 9);
  if (input.length >= 10) formatted += "-" + input.substring(9, 11);
  e.target.value = formatted;
});

// Submit via JS
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita o submit tradicional

  // Remove formatação para enviar ao backend
  const data = {
    nome: document.getElementById("nome").value.trim(),
    cpf: cpfInput.value.replace(/\D/g, ""),
    email: document.getElementById("email").value.trim(),
    telefone: telefoneInput.value.replace(/\D/g, ""),
    is_user_admin: document.getElementById("is_user_admin").checked ? 1 : 0,
  };

  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      messageDiv.style.color = "red";
      messageDiv.textContent = "Erro: " + errorText;
      return;
    }

    const result = await response.json();
    //messageDiv.style.color = "green";
    //messageDiv.textContent = "Cadastro realizado com sucesso!";
    showPopup("Sucesso", "Cadastro realizado com sucesso!");

    // Limpa o formulário
    form.reset();
  } catch (err) {
    console.error(err);
    //messageDiv.style.color = "red";
    //messageDiv.textContent = "Erro ao conectar com o servidor.";
    showPopup("Erro", "Erro ao conectar com o servidor.");
  }
});
