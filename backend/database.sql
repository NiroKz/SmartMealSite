create database tcc_relacao;
use tcc_relacao;

/* 
-> Inserção dos dados fictícios (gerson chico trindade)
INSERT INTO turma (curso, periodo, grade, date_matricula)
VALUES
('INFO', 'M', 'A', CURDATE()),
('MEC',  'T', 'B', CURDATE()),
('ADM',  'N', 'C', CURDATE()),
('AUTO', 'M', 'D', CURDATE()),
('PTEC', 'T', 'E', CURDATE());

-- id_turma = 1 → INFO
-- id_turma = 2 → MEC
-- id_turma = 3 → ADM
-- id_turma = 4 → AUTO
-- id_turma = 5 → PTEC

DELIMITER $$

CREATE PROCEDURE inserir_alunos()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE rm INT DEFAULT 10001;
  WHILE i <= 200 DO
    INSERT INTO aluno (id_rm, id_turma, id_biometria, nome_aluno, autorizacao_biometrica, data_autorizacao, aluno)
    VALUES (
      rm,
      FLOOR(1 + RAND() * 5), -- id_turma aleatório de 1 a 5
      NULL,
      CONCAT('Aluno', i),
      TRUE,
      CURDATE(),
      CONCAT('Aluno', i)
    );
    SET i = i + 1;
    SET rm = rm + 1;
  END WHILE;
END $$

DELIMITER ;

-- Executa o procedimento
CALL inserir_alunos();

-- Remove o procedimento se desejar
DROP PROCEDURE inserir_alunos;

-> Consulta do dados fictícios dos alunos para o gráfico 
SELECT t.curso, COUNT(*) AS total_alunos
FROM aluno a
JOIN turma t ON a.id_turma = t.id_turma
GROUP BY t.curso;
*/

create table aluno (
id_rm int(5) primary key,
id_turma int,
id_biometria int,
nome_aluno varchar(60),
autorizacao_biometrica boolean,
data_autorizacao date, -- dd/mm/yyyy --
aluno varchar(60),

foreign key(id_turma) references turma(id_turma),
foreign key(id_biometria) references biometria(id_biometria)
);

create table biometria (
id_biometria int auto_increment primary key,
hash_digital1 varchar(256),
hash_digital2 varchar(256),
hash_digital3 varchar(256)
);

create table refeicao (
id_refeicao int auto_increment primary key,
id_rm int(5),
data_hora datetime, -- hh:mm dd/mm/yyyy --
tipo_refeicao enum('almoço', 'jantar'),
foreign key(id_rm) references aluno(id_rm)
);

create table feedback (
id_feedback int auto_increment primary key,
id_rm int(5),
data_feedback date, -- dd/mm/yyyy --
avaliacao enum('gostei', 'não gostei', 'indiferente'),
comentario varchar(140),
foreign key(id_rm) references aluno(id_rm)
);

create table produto (
id_produto int auto_increment primary key,
nome_produto varchar(40),
quantidade_atual decimal(7,3),
unidade varchar(15),
quantidade_minima decimal(6,3)
);

create table estoque (
id_estoque int auto_increment primary key,
id_produto int,
qtde_movimentada decimal(7,3),
data_movimentada date, -- dd/mm/yyyy --
validade date, -- dd/mm/yyyy --
lote varchar(20),
destino varchar(140),

foreign key(id_produto) references produto(id_produto)
);


create table producao (
id_producao int auto_increment primary key,
id_produto int,
id_refeicao int,
data_producao date, -- dd/mm/yyyy --
alimento varchar(25),
quantidade_produzida decimal(5,3),
tipo_refeicao enum('café','almoço', 'lanche', 'jantar'),
turno enum('manhã', 'tarde', 'noite'),

foreign key(id_produto) references produto(id_produto),
foreign key(id_refeicao) references refeicao(id_refeicao)
);

create table liberacao_excecao (
id_excecao int auto_increment primary key,
id_rm int(5),
data_horario datetime, -- hh:mm dd/mm/yyyy --
motivo varchar(140),
foreign key(id_rm) references aluno(id_rm)
);

create table turma (
id_turma int auto_increment primary key,
curso varchar(4),
periodo enum('M', 'T', 'N'), -- manhã, tarde e noite (respectivamente)--
grade char(1),
date_matricula date -- dd/mm/yyyy --         
);

create table usuario (
id_usuario int auto_increment primary key,
nome_usuario varchar(60),
cpf char(11) unique,
fone char(11),
email varchar(320),
is_usuario_admin boolean
);

select * from usuario;

create table acesso(
id_acess int auto_increment primary key,
id_usuario int,

acess_estoque boolean,
acess_producao boolean,
acess_acessos boolean,
acess_cad_aluno boolean,
acess_relatorios boolean,
acess_perm_aluno boolean,
acess_cad_turma boolean,

foreign key(id_usuario) references usuario(id_usuario)
);

create table escola (
id_escola int auto_increment primary key,
id_usuario int,
nome_escola varchar(60) unique,
rua_endereco varchar(35),
fone char(11), -- 99 99999-9999 --
foreign key(id_usuario) references usuario(id_usuario)
);