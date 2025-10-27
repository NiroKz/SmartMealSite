const form = document.querySelector("form");
const cpfInput = document.getElementById("cpf");

// Formata o CPF ao digitar
cpfInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, "").slice(0, 11); // Apenas números

  let formatted = "";
  if (input.length > 0) formatted += input.substring(0, 3);
  if (input.length >= 4) formatted += "." + input.substring(3, 6);
  if (input.length >= 7) formatted += "." + input.substring(6, 9);
  if (input.length >= 10) formatted += "-" + input.substring(9, 11);

  e.target.value = formatted;
});

// Corrige o comportamento ao apagar
cpfInput.addEventListener("keydown", function (e) {
  const key = e.key;
  if (key === "Backspace") {
    let pos = cpfInput.selectionStart;
    let val = cpfInput.value;
    if (val[pos - 1] === "." || val[pos - 1] === "-") {
      cpfInput.setSelectionRange(pos - 1, pos - 1);
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cpf = cpfInput.value.replace(/\D/g, "");
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      showPopup("Erro no login", errorText || "Usuário ou senha inválidos.");
      return;
    }

    const data = await response.json();
    sessionStorage.setItem("token", data.token);

    // 🔹 Salva usuário + permissões no localStorage
    localStorage.setItem("usuario", JSON.stringify({ ...data.usuario, permissions: data.permissions }));

    showPopup("Bem-vindo!", "Login realizado com sucesso.");
    console.log("Login bem-sucedido:", data);
    setTimeout(() => {
      window.location.href = "/html/hall.html";
    }, 2500);
  } catch (error) {
    console.error("Erro ao conectar:", error);
    showPopup("Erro de conexão", "Não foi possível se conectar ao servidor.");
  }
});
