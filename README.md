<div align="center">

  <img src="public/images/SmartMealLogo.png" alt="Logo do SmartMeal" width="130">

  <h1>SmartMeal 🍽️</h1>

  <p><strong>Mais organização na cozinha. Mais informação para a escola.</strong></p>

  <p>Gestão de alimentação escolar: do estoque ao acompanhamento das refeições.</p>

  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Projeto-TCC-2563EB?style=flat-square" alt="Projeto de TCC">

  <br><br>

  <a href="#sobre-o-projeto">Sobre</a> ·
  <a href="#funcionalidades">Funcionalidades</a> ·
  <a href="#tecnologias">Tecnologias</a> ·
  <a href="#como-executar">Como executar</a> ·
  <a href="#estrutura-do-projeto">Estrutura</a>

</div>

---

## Sobre o projeto

O **SmartMeal** é uma aplicação web voltada à gestão de refeições em instituições de ensino, desenvolvida como projeto de Trabalho de Conclusão de Curso (TCC).

A proposta é reunir informações que fazem parte da rotina da alimentação escolar: alimentos disponíveis, quantidades produzidas, refeições consumidas, permissões dos alunos e avaliações do cardápio. Com esses dados em um só lugar, a equipe pode acompanhar o consumo e apoiar o planejamento da produção, buscando reduzir desperdícios.

O sistema combina uma interface em HTML, CSS e JavaScript com uma API em Node.js e persistência em MySQL.

## Funcionalidades

| Módulo | O que oferece |
| --- | --- |
| 🏫 **Escolas e usuários** | Cadastro de usuários e instituições, edição de perfil e configuração de permissões por módulo. |
| 🎓 **Alunos e turmas** | Cadastro, consulta, edição e exclusão de alunos e turmas, com registro de RM, responsável e restrições alimentares. |
| 🍽️ **Acompanhamento de refeições** | Consulta dos acessos às refeições no dia e no mês, com filtros por curso, período e turma. |
| 🔓 **Liberação de alunos** | Registro de exceções temporárias ou permanentes por tipo de refeição, com indicação de permissão para repetir. |
| 📦 **Estoque** | Cadastro de produtos e movimentações com quantidade, unidade, lote, validade, origem, destino e preço, além de indicadores de estoque baixo e validade próxima. |
| 👨‍🍳 **Produção** | Registro de alimentos produzidos, quantidades, sobras e observações, com resumos por data e turno. |
| 📅 **Cardápios** | Cadastro de refeições, consulta do cardápio semanal e impressão pelo navegador. |
| 📊 **Painéis e relatórios** | Gráficos de produção, distribuição de alunos por curso e avaliações, além de opções de impressão. |
| 💬 **Feedback** | Avaliação das refeições por RM, com classificação, comentário e consulta dos registros. |
| 🔑 **Autenticação** | Acesso com senha temporária enviada por e-mail e emissão de token JWT. |

## Tecnologias

| Camada | Tecnologias utilizadas |
| --- | --- |
| Interface | HTML5, CSS3 e JavaScript |
| Gráficos e ícones | Chart.js, Chart.js DataLabels e Font Awesome, carregados via CDN |
| Servidor | Node.js e Express 5 |
| Banco de dados | MySQL, com acesso pelo `mysql2` |
| Autenticação | JSON Web Token e senhas temporárias geradas com `crypto` |
| Envio de e-mails | API do Resend, consumida com Axios |
| Configuração | dotenv |

O Express serve os arquivos da pasta `public/` e disponibiliza as rotas da API na mesma aplicação. Não há etapa de compilação do frontend.

## Como executar

### 1. Pré-requisitos

- Node.js compatível com Express 5 (**20 ou superior**) e npm.
- Uma instância MySQL e uma ferramenta para executar SQL, como MySQL Workbench.
- Uma chave de API do Resend e uma configuração de envio habilitada para o destinatário utilizado no login.
- Acesso à internet para envio de e-mails e carregamento das bibliotecas via CDN.

### 2. Clone e instale as dependências

```bash
git clone https://github.com/NiroKz/SmartMealSite.git
cd SmartMealSite
npm install
```

### 3. Prepare o banco de dados

O arquivo [`backend/smatmeal.sql`](backend/smatmeal.sql) contém as definições das tabelas, incluindo `menu` e os campos de estoque utilizados pela aplicação.

No MySQL Workbench ou em uma ferramenta equivalente:

1. Crie e selecione um banco local:

   ```sql
   CREATE DATABASE IF NOT EXISTS final_course_work;
   USE final_course_work;
   ```

2. Em `backend/smatmeal.sql`, selecione e execute **somente os blocos `CREATE TABLE`**, na ordem em que aparecem, de `biometrics` até `menu`.
3. Para popular o banco, revise e execute separadamente as inserções desejadas, respeitando os relacionamentos entre as tabelas e os campos obrigatórios.

> **Sobre os arquivos SQL:** eles também contêm consultas de desenvolvimento, parâmetros `?` e inserções que precisam de revisão. O arquivo `smatmeal.sql` começa com `DROP DATABASE`, que apaga o banco existente. Por isso, a execução integral do arquivo não é o procedimento de instalação. O arquivo `bd_smatmeal.sql` apresenta outra versão da estrutura e dos dados; não importe os dois em sequência.

### 4. Configure as variáveis de ambiente

Crie ou ajuste o arquivo `.env` na raiz do projeto com os dados do seu ambiente:

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=final_course_work

JWT_SECRET=substitua_por_uma_chave_longa_e_aleatoria
RESEND_API_KEY=sua_chave_resend
```

O `.env` já está listado no `.gitignore`. Mantenha suas credenciais fora do repositório.

O envio de senha temporária está implementado em `backend/controllers/authController.js`, com o remetente `SmartMeal <onboarding@resend.dev>`. A configuração da conta Resend deve permitir o envio com esse remetente para o e-mail informado.

### 5. Inicie a aplicação

Execute na raiz do projeto:

```bash
npm start
```

Acesse **[http://localhost:3000](http://localhost:3000)**.

> Para reproduzir a configuração atual, utilize `localhost` e a porta `3000`. O frontend define a URL da API em `public/js/config.js`, e alguns scripts de permissões usam `http://localhost:3000` diretamente. Alterar somente `PORT` no `.env` não atualiza essas referências.

### 6. Primeiro acesso

1. Na página inicial, selecione **Comece Agora** e cadastre um usuário com um e-mail que possa receber as mensagens do Resend.
2. Selecione **Entrar** e informe o e-mail cadastrado para solicitar uma senha temporária.
3. Na tela de login, informe o CPF cadastrado e a senha recebida.
4. Após entrar, cadastre a instituição e explore os módulos conforme as permissões do usuário.

As senhas temporárias são mantidas na memória do servidor e removidas após o uso. Se o servidor for reiniciado antes do login, solicite uma nova senha.

## Estrutura do projeto

```text
SmartMealSite/
├── backend/
│   ├── config/            # Conexão com o MySQL
│   ├── controllers/       # Tratamento das requisições
│   ├── middleware/        # Validação de autenticação
│   ├── models/            # Consultas e operações no banco
│   ├── routes/            # Rotas da API por módulo
│   ├── bd_smatmeal.sql     # Versão alternativa da estrutura e dados
│   ├── smatmeal.sql        # Definições de tabelas e consultas de desenvolvimento
│   └── server.js          # Inicialização do Express e arquivos estáticos
├── public/
│   ├── html/              # Páginas dos módulos
│   ├── images/            # Identidade visual e imagens
│   ├── js/                # Interações e integração com a API
│   ├── styles/            # Estilos das páginas
│   └── index.html         # Página de apresentação
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Rotas da API

As rotas são organizadas por área funcional. Alguns pontos de entrada para explorar o backend:

| Prefixo | Responsabilidade |
| --- | --- |
| `/auth` | Cadastro, solicitação de senha temporária e login |
| `/user` e `/school` | Perfil do usuário e instituições |
| `/student` e `/class` | Alunos e turmas |
| `/studentAccess` e `/filter` | Histórico de refeições e consultas filtradas |
| `/studentLiberation` | Exceções de acesso às refeições |
| `/product` e `/stock` | Produtos e movimentações de estoque |
| `/production` | Registros e resumos de produção |
| `/menu` | Cadastro e consulta de cardápios |
| `/feedback` e `/graphic` | Avaliações e dados para gráficos |
| `/admin` | Consulta e atualização de permissões |

Os métodos HTTP e caminhos completos estão definidos em [`backend/routes/`](backend/routes/).

## Desenvolvimento e contribuições

Sugestões e relatos de problemas podem ser registrados nas [issues do projeto](https://github.com/NiroKz/SmartMealSite/issues). Para contribuir com código, crie uma branch, descreva a alteração e abra um pull request com as verificações realizadas.

Atualmente, o repositório não possui uma suíte de testes automatizados configurada: o comando `npm test` contém apenas o aviso padrão. A validação funcional pode ser feita executando a aplicação com um banco local e percorrendo os fluxos dos módulos.

## Autores

O SmartMeal foi desenvolvido como projeto de TCC por:

- Eric Fracassi de Gois
- Erick Joshua Revollo
- Gabriel Xavier de Almeida
- Marcelo Enrique Korin
- Pedro Henrique Lopes Vilela Coelho
- Tiago Bondezan Bazani
- Yuri Shinnishi de Queiroz Rossi

## Licença

O campo `license` do `package.json` declara **ISC**. O repositório ainda não inclui um arquivo `LICENSE` com o texto da licença.

---

<div align="center">
  <strong>SmartMeal — informação para planejar, organização para servir.</strong>
</div>
