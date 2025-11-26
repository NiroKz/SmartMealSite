document.addEventListener("DOMContentLoaded", () => {
  function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("is_user_admin");
  localStorage.removeItem("userId");
  localStorage.removeItem("usuario");
  window.location.href = "/html/index.html";
}

  const nameInput = document.getElementById("user_name");
  const cpfInput = document.getElementById("cpf");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Pegar ID do usuário salvo no login
  const userId = localStorage.getItem("userId");

  if (!userId) {
    //alert("Erro: usuário não identificado.");
    showPopup("Erro","Usuário não identificado.");
    window.location.href = "/html/prelogin.html";
    return;
  }

  // 🔹 1. Buscar dados do usuário
  async function loadProfile() {
    const res = await fetch(`/user/me?id=${userId}`);
    const user = await res.json();

    nameInput.value = user.user_name;
    cpfInput.value = user.cpf;
    emailInput.value = user.email;
    phoneInput.value = user.phone;
  }

  loadProfile();

  // 🔹 2. Habilitar edição
  editBtn.addEventListener("click", () => {
    nameInput.removeAttribute("readonly");
    emailInput.removeAttribute("readonly");
    phoneInput.removeAttribute("readonly");

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  });

  logoutBtn.addEventListener("click", () => {
    logout();
  });

  // 🔹 3. Salvar mudanças
  document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        user_name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
      };

      const res = await fetch(`/user/update?id=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showPopup("Sucesso", "Perfil atualizado!");

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showPopup("Erro", "Erro ao atualizar.");
      }
    });
});

