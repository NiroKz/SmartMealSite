console.log("📝 menuRegister.js carregado!");
console.log("menu.js carregou! formulário:", document.getElementById("menuForm"));


const form = document.getElementById("menuForm");
const selectMealType = document.getElementById("meal_type");

// Função para traduzir tipos
function translateMealType(type) {
  const map = {
    breakfast: "Café da Manhã",
    lunch: "Almoço",
    snack: "Lanche",
    dinner: "Jantar",
  };
  return map[type] || type;
}

// Carregar tipos de refeição
async function loadMealTypes() {
  try {
    const res = await fetch(`/menu/meal-types`);
    const data = await res.json();

    selectMealType.innerHTML = `<option value="">Selecione</option>`;

    data.forEach((item) => {
      const translated = translateMealType(item.meal_type);
      selectMealType.innerHTML += `
        <option value="${item.meal_type}">${translated}</option>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar tipos:", error);
    showPopup("Erro", "Erro ao carregar tipos de refeição.");
  }
}

loadMealTypes();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    date_time: document.getElementById("date_time").value,
    meal_type: document.getElementById("meal_type").value,
    product_name_1: document.getElementById("product_name_1").value,
    product_name_2: document.getElementById("product_name_2").value,
    product_name_3: document.getElementById("product_name_3").value,
    product_name_4: document.getElementById("product_name_4").value,
  };

  try {
    const res = await fetch("/menu/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (res.ok) {
      console.log("✔ Registrado, chamando popup...");
      showPopup("Sucesso", "Cardápio registrado com sucesso!");
      form.reset();
    } else {
      console.log("❌ Erro no registro, chamando popup...");
      showPopup("Erro", json.error || "Erro ao registrar cardápio.");
    }

  } catch (err) {
    console.error("Erro ao registrar cardápio:", err);
    showPopup("Erro", "Erro inesperado ao registrar cardápio.");
  }
});
