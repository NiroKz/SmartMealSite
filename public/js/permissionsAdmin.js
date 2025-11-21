console.log("✅ permissionsAdmin.js carregado!");

// Deixa a função acessível globalmente
window.loadPermissions = async function () {
  console.log("🔹 loadPermissions() foi chamado!");
  try {
    const response = await fetch("http://localhost:3000/admin/access");
    console.log("🔹 Requisição feita para /admin/access");

    if (!response.ok) throw new Error("Falha ao buscar permissões");
    const data = await response.json();

    const tbody = document.querySelector("#permissionsTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((user) => {
        console.log("🔹 Dados recebidos:", data);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.user_name}</td>
        <td>${user.email}</td>
        <td><input type="checkbox" ${user.access_stock ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_production ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_accesses ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_student_register ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_reports ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_student_perm ? "checked" : ""}></td>
        <td><input type="checkbox" ${user.access_class_register ? "checked" : ""}></td>
        <td><button class="save-btn">Salvar</button></td>
      `;

      // Botão "Salvar"
      row.querySelector(".save-btn").addEventListener("click", async () => {
        const inputs = row.querySelectorAll("input[type='checkbox']");
        const updatedPermissions = {
          access_stock: inputs[0].checked,
          access_production: inputs[1].checked,
          access_accesses: inputs[2].checked,
          access_student_register: inputs[3].checked,
          access_reports: inputs[4].checked,
          access_student_perm: inputs[5].checked,
          access_class_register: inputs[6].checked,
        };
        await savePermissions(user.id_user, updatedPermissions);
      });

      tbody.appendChild(row);
    });

    // Cabeçalho
    const thead = document.querySelector("#permissionsTable thead tr");
    if (thead) {
      thead.innerHTML = `
        <th>Nome</th>
        <th>Email</th>
        <th>Estoque</th>
        <th>Produção</th>
        <th>Acessos</th>
        <th>Cadastro Aluno</th>
        <th>Relatórios</th>
        <th>Cardápio</th>
        <th>Administração</th>
        <th>Salvar</th>
      `;
    }
  } catch (error) {
    console.error("Erro ao carregar permissões:", error);
  }
};

async function savePermissions(id_user, updatedPermissions) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/access/${id_user}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPermissions),
      }
    );
    if (!response.ok) throw new Error("Erro ao atualizar permissões");
    alert("✅ Permissões atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar permissões:", error);
    alert("❌ Erro ao salvar permissões.");
  }
}




// Função para gerar relatório de permissões em formato imprimível
// Abre uma nova janela com apenas a tabela de permissões e chama window.print()
window.printPermissionsTable = function () {
  try {
    const container = document.getElementById('permissionsTableContainer');
    const table = document.getElementById('permissionsTable');
    if (!container || !table) {
      alert('Tabela de permissões não encontrada. Abra a aba Administração antes de gerar o relatório.');
      return;
    }

    // Clona o HTML da tabela
    const tableHtml = container.outerHTML;

    // Minimal CSS to keep table readable in print (copied/derived from main styles)
    const styles = `
      <style>
        body{font-family:Segoe UI, Arial, sans-serif; margin:20px; color:#222}
        h3{color:#222}
        table{width:100%; border-collapse:collapse;}
        thead th{background:#645949;color:#fff;padding:10px;text-align:left}
        td, th{border:1px solid #eee;padding:8px}
        tbody tr:nth-child(odd){background:#fbf6ea}
        tbody tr:hover{background:#f6efe1}
        td:first-child, th:first-child{text-align:left}
      </style>`;

    const win = window.open('', '_blank');
    if (!win) {
      alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está ativo.');
      return;
    }

    win.document.open();
    win.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Relatório de Permissões</title>' + styles + '</head><body>');

    // opcional: adicionar cabeçalho
    const schoolName = (localStorage.getItem('nomeEscola') || 'SmartMeal');
    win.document.write('<header style="margin-bottom:12px;">' +
      '<strong>' + schoolName + '</strong></header>');

    // Escreve apenas a tabela, mas remove a coluna de salvar (última coluna) no HTML string
    const temp = document.createElement('div');
    temp.innerHTML = tableHtml;
    const tbl = temp.querySelector('#permissionsTable');
    if (tbl) {
     
      const theadRow = tbl.querySelector('thead tr');
      if (theadRow) {
        const lastTh = theadRow.lastElementChild;
        if (lastTh) lastTh.remove();
      }
    
      tbl.querySelectorAll('tbody tr').forEach(r => {
        const lastTd = r.lastElementChild;
        if (lastTd) lastTd.remove();
      });
    }

    win.document.write(temp.innerHTML);
    win.document.write('</body></html>');
    win.document.close();

    // Espera o conteúdo carregar antes de imprimir
    win.focus();
    setTimeout(() => {
      try { win.print(); } catch (e) { console.error(e); }
      // opcionalmente fechar a janela após impressão (nem todos navegadores permitem)
      // setTimeout(() => win.close(), 500);
    }, 250);
  } catch (err) {
    console.error('Erro ao gerar janela de impressão:', err);
    alert('Erro ao gerar relatório. Veja o console para mais detalhes.');
  }
};


