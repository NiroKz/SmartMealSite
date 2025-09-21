document.addEventListener("DOMContentLoaded", () => {
  const courseSelect = document.getElementById("Course");
  const form = document.getElementById("studentForm");
  const messageDiv = document.getElementById("message");

  // 1️⃣ Carrega cursos do banco
  fetch("/student/courses")
    .then(response => response.json())
    .then(courses => {
      courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.course;
        option.textContent = course.course;
        courseSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Erro ao carregar cursos:", err));

  // 2️⃣ Envio do formulário via fetch
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // previne reload da página

    const data = {
      nome: document.getElementById("nome").value,
      RM: document.getElementById("RM").value,
      Course: document.getElementById("Course").value,
      student_legal_guardian: document.getElementById("student_legal_guardian").value,
      food_restriction: document.getElementById("food_restriction").value
    };

    try {
      const response = await fetch("/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.text();

      if (response.ok) {
        messageDiv.style.color = "green";
        messageDiv.textContent = result;
        form.reset(); // limpa o formulário
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent = result;
      }
    } catch (err) {
      console.error(err);
      messageDiv.style.color = "red";
      messageDiv.textContent = "Erro ao cadastrar aluno.";
    }
  });
});
