// Aguarda o carregamento completo da página para executar o script
document.addEventListener("DOMContentLoaded", () => {
  // --- Selecionando os elementos do HTML ---
  const courseSelect = document.getElementById("course");
  const periodSelect = document.getElementById("period");
  const gradeSelect = document.getElementById("grade");
  const dateInput = document.getElementById("filterDate");
  const filterBtn = document.getElementById("filterBtn");
  const tableBody = document.getElementById("studentsTableBody");
  const selectedDateDisplay = document.getElementById("selectedDateDisplay");

  // Define a data de hoje como padrão no campo de data
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  // --- 1. Função para carregar os cursos do backend ---
  async function loadCourses() {
    try {
      // Faz a requisição para a rota /api/filter/courses que você criou
      const response = await fetch("/filter/courses");
      if (!response.ok) {
        throw new Error("Erro ao buscar cursos");
      }
      const courses = await response.json();

      // Limpa opções antigas (exceto a primeira "Selecione")
      courseSelect.innerHTML = '<option value="">Selecione</option>';

      // Adiciona cada curso recebido como uma nova <option> no select
      courses.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.course;
        option.textContent = item.course;
        courseSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Falha ao carregar cursos:", error);
      // Opcional: exibir mensagem de erro para o usuário
    }
  }

  // --- 2. Função para buscar e exibir os alunos filtrados ---
  async function fetchAndDisplayStudents() {
    // Pega os valores selecionados nos filtros
    const course = courseSelect.value;
    const period = periodSelect.value;
    const grade = gradeSelect.value;
    const date = dateInput.value;

    // Validação: verifica se todos os campos foram preenchidos
    if (!course || !period || !grade || !date) {
      alert("Por favor, preencha todos os filtros para continuar.");
      return; // Interrompe a função se algum filtro estiver faltando
    }

    // Monta a URL para a requisição com os parâmetros do filtro
    const queryParams = new URLSearchParams({
      course,
      period,
      grade,
      date,
    });
    const url = `/filter/students?${queryParams.toString()}`;

    try {
      // Faz a requisição ao backend
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados dos alunos");
      }
      const students = await response.json();

      // Limpa a tabela antes de adicionar os novos dados
      tableBody.innerHTML = "";

      // Exibe a data selecionada acima da tabela
      const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
        "pt-BR"
      );
      selectedDateDisplay.textContent = `Exibindo resultados para: ${formattedDate}`;

      // Se não houver alunos, exibe uma mensagem
      if (students.length === 0) {
        const row = `<tr><td colspan="6">Nenhum aluno encontrado para os filtros selecionados.</td></tr>`;
        tableBody.innerHTML = row;
        return;
      }

      // Itera sobre cada aluno e cria uma linha na tabela
      students.forEach((student) => {
        // Formata os horários ou coloca "--/--" se não tiver
        const lunchTime = student.lunch.time
          ? new Date(student.lunch.time).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--/--";
        const dinnerTime = student.dinner.time
          ? new Date(student.dinner.time).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--/--";

        // Função para pegar a cor de fundo
        function getStatusColor(status) {
          switch (status) {
            case "green":
              return "#4CAF50";
            case "yellow":
              return "#FFC107";
            case "red":
              return "#F44336";
            default:
              return "#9c9c9cff"; // branco como padrão
          }
        }

        // Cria as células com a cor de fundo inline
        const lunchCell = `<td style="background-color: ${getStatusColor(
          student.lunch.status
        )}; color: ${
          student.lunch.status === "yellow" ? "black" : "white"
        }; text-align:center;">${lunchTime}</td>`;

        const dinnerCell = `<td style="background-color: ${getStatusColor(
          student.dinner.status
        )}; color: ${
          student.dinner.status === "yellow" ? "black" : "white"
        }; text-align:center;">${dinnerTime}</td>`;

        // Colunas de REPETIÇÃO (mantendo lógica atual)
        const lunchRepeatCell = `<td style="background-color:${
          student.lunch.count > 1 ? "#FFC107" : "transparent"
        }; text-align:center;">
                             ${
                               student.lunch.count > 1
                                 ? `Sim (${student.lunch.count}x)`
                                 : "Não"
                             }
                           </td>`;
        const dinnerRepeatCell = `<td style="background-color:${
          student.dinner.count > 1 ? "#FFC107" : "transparent"
        }; text-align:center;">
                              ${
                                student.dinner.count > 1
                                  ? `Sim (${student.dinner.count}x)`
                                  : "Não"
                              }
                          </td>`;

        // Monta a linha da tabela
        const row = `
<tr>
  <td>${student.id_rm}</td>
  <td>${student.student_name}</td>
  ${lunchCell}
  ${dinnerCell}
  ${lunchRepeatCell}
  ${dinnerRepeatCell}
</tr>
`;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Falha ao aplicar filtro:", error);
      tableBody.innerHTML = `<tr><td colspan="6">Erro ao carregar dados. Tente novamente.</td></tr>`;
    }
  }

  // --- 3. Adiciona o "escutador" de evento ao botão ---
  filterBtn.addEventListener("click", fetchAndDisplayStudents);

  // --- Executa a função para carregar os cursos assim que a página é carregada ---
  loadCourses();
});
