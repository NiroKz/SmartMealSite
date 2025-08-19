function showPopup(title, message) {
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-message").innerText = message;
  document.getElementById("popup").classList.remove("hidden");

 
  setTimeout(() => {
    closePopup();
  }, 3000);
}


function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
