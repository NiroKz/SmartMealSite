document.getElementById("preloginForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;

      try {
        const response = await fetch("https://smart-meal-backend.vercel.app/auth/prelogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (result.sucesso) {
          showPopup("Sucesso!", result.mensagem);
          setTimeout(() => {
            window.location.href = "/html/login.html"; // redireciona depois do popup
          }, 2500);
        } else {
          showPopup("Erro!", result.mensagem);
        }

      } catch (err) {
        console.error(err);
        showPopup("Erro!", "Não foi possível conectar ao servidor.");
      }
    });