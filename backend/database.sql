create database tcc_relacao;
use tcc_relacao;

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

select * from aluno;

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

ALTER TABLE producao
ADD COLUMN sobra DECIMAL(5,3),
ADD COLUMN observacao VARCHAR(140);


create table liberacao_excecao (
id_excecao int auto_increment primary key,
id_rm int(5),
data_horario datetime, -- hh:mm dd/mm/yyyy --
motivo varchar(140),
foreign key(id_rm) references aluno(id_rm)
);

ALTER TABLE liberacao_excecao
ADD COLUMN tipo_refeicao ENUM('almoço', 'jantar') AFTER id_rm,
ADD COLUMN tipo_permissao ENUM('temporária', 'permanente') AFTER tipo_refeicao,
ADD COLUMN data_permitida DATE AFTER tipo_permissao;

ALTER TABLE liberacao_excecao
ADD COLUMN permitir_repeticao BOOLEAN AFTER data_permitida;

desc liberacao_excecao;

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

-- inserts fictícios (gerson cleida tairone)

INSERT INTO turma (curso, periodo, grade, date_matricula)
VALUES
('INFO', 'M', '1', CURDATE()),
('MEC',  'T', '2', CURDATE()),
('ADM',  'N', '3', CURDATE()),
('AUTO', 'M', '2', CURDATE()),
('PTEC', 'T', '3', CURDATE());

DELIMITER $$

CREATE PROCEDURE inserir_alunos_variados()
BEGIN
  DECLARE turma_id INT DEFAULT 1;
  DECLARE min_alunos INT;
  DECLARE max_alunos INT;
  DECLARE total_alunos INT;
  DECLARE i INT;
  DECLARE rm INT DEFAULT 10001;

  WHILE turma_id <= 5 DO
    CASE turma_id
      WHEN 1 THEN BEGIN SET min_alunos=30; SET max_alunos=60; END;
      WHEN 2 THEN BEGIN SET min_alunos=20; SET max_alunos=50; END;
      WHEN 3 THEN BEGIN SET min_alunos=15; SET max_alunos=40; END;
      WHEN 4 THEN BEGIN SET min_alunos=20; SET max_alunos=50; END;
      WHEN 5 THEN BEGIN SET min_alunos=10; SET max_alunos=30; END;
    END CASE;

    -- total_alunos aleatório entre min e max
    SET total_alunos = FLOOR(RAND() * (max_alunos - min_alunos + 1)) + min_alunos;

    SET i = 1;
    WHILE i <= total_alunos DO
      INSERT INTO aluno (id_rm, id_turma, id_biometria, nome_aluno, autorizacao_biometrica, data_autorizacao, aluno)
      VALUES (
        rm,
        turma_id,
        NULL,
        CONCAT('Aluno', rm),
        TRUE,
        CURDATE(),
        CONCAT('Aluno', rm)
      );
      SET i = i + 1;
      SET rm = rm + 1;
    END WHILE;

    SET turma_id = turma_id + 1;
  END WHILE;
END $$

DELIMITER ;

-- Executar o procedimento
CALL inserir_alunos_variados();

-- Depois pode apagar o procedimento se quiser
DROP PROCEDURE inserir_alunos_variados;

-- Apaga refeições do dia atual
DELETE FROM refeicao WHERE DATE(data_hora) = CURDATE();

-- Inserir refeições de almoço com 70% de chance para cada aluno
INSERT INTO refeicao (id_rm, data_hora, tipo_refeicao)
SELECT id_rm, NOW(), 'almoço'
FROM aluno
WHERE RAND() <= 0.7;

-- Inserir refeições de jantar com 50% de chance para cada aluno
INSERT INTO refeicao (id_rm, data_hora, tipo_refeicao)
SELECT id_rm, NOW(), 'jantar'
FROM aluno
WHERE RAND() <= 0.5;

SELECT
  (SELECT COUNT(DISTINCT id_rm) FROM refeicao WHERE DATE(data_hora) = CURDATE()) AS total_today,
  (SELECT COUNT(*) FROM aluno) AS total_students,
  (SELECT COUNT(*) FROM refeicao WHERE tipo_refeicao = 'almoço' AND DATE(data_hora) = CURDATE()) AS lunch_count,
  (SELECT COUNT(*) FROM refeicao WHERE tipo_refeicao = 'jantar' AND DATE(data_hora) = CURDATE()) AS dinner_count;
  
  SELECT le.id_excecao, le.id_rm, a.nome_aluno, le.data_horario, le.motivo, le.tipo_refeicao, le.tipo_permissao, le.data_permitida, le.permitir_repeticao
FROM liberacao_excecao le
JOIN aluno a ON le.id_rm = a.id_rm
WHERE le.id_rm BETWEEN 10001 AND 10009
ORDER BY le.data_horario DESC;

