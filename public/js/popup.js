function showPopup(title, message, duration = 3000) {
  const popup = document.getElementById("popup");
  const titleEl = document.getElementById("popup-title");
  const msgEl = document.getElementById("popup-message");

  titleEl.innerText = title;
  msgEl.innerText = message;

  // Remove a classe hidden
  popup.classList.remove("hidden");

  // Remove barrinha antiga (se existir)
  const oldBar = popup.querySelector(".progress-bar");
  if (oldBar) oldBar.remove();

  // Cria nova barrinha com duração
  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  progressBar.style.animationDuration = duration + "ms";

  popup.querySelector(".popup-content").appendChild(progressBar);

  // Mostra o popup
  popup.style.display = "block";

  // Fecha sozinho após o tempo
  setTimeout(() => {
    closePopup();
  }, duration);
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
  // Re-adiciona a classe hidden
  popup.classList.add("hidden");
}
