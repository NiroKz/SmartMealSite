const form = document.querySelector("form"); // ou selecione pelo id, se tiver

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(errorText || "Erro no login");
      return;
    }

    // Recebe o JSON com o token
    const data = await response.json();

    // Salva o token no sessionStorage
    sessionStorage.setItem("token", data.token);

    // Redireciona para hall.html
    window.location.href = "/html/hall.html";
  } catch (error) {
    console.error("Erro ao conectar:", error);
    alert("Erro na conexão com o servidor.");
  }
});
