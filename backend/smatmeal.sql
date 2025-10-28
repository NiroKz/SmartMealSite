DROP DATABASE IF EXISTS final_course_work;
CREATE DATABASE final_course_work;
USE final_course_work;

create table IF NOT EXISTS biometrics (
id_biometrics int auto_increment primary key NOT NULL,
hash_digital1 varchar(256) NOT NULL,
hash_digital2 varchar(256) NOT NULL,
hash_digital3 varchar(256) NOT NULL
);



create table IF NOT EXISTS class (
id_class int auto_increment primary key NOT NULL,
course varchar(4) NOT NULL,
period enum('M', 'T', 'N') NOT NULL, -- manhã, tarde e noite (respectivamente)--
grade char(1) NOT NULL,
date_registration date NOT NULL -- dd/mm/yyyy --         
);


create table IF NOT EXISTS student(
id_rm int(5) primary key NOT NULL,
id_class int NOT NULL,
id_biometrics int,
student_name varchar(60) NOT NULL,
biometrics_authorization boolean,
date_authorization date, -- dd/mm/yyyy --
student_legal_guardian varchar(60) NOT NULL,
food_restriction varchar (30),

foreign key(id_class) references class(id_class),
foreign key(id_biometrics) references biometrics(id_biometrics)
);


create table IF NOT EXISTS meal (
id_meal int auto_increment primary key NOT NULL,
id_rm int(5) NOT NULL,
date_time datetime NOT NULL, -- hh:mm dd/mm/yyyy --
type_meal enum('lunch', 'dinner') NOT NULL,
access_status enum('allowed', 'blocked', 'exception'),

foreign key(id_rm) references student(id_rm)
);


create table IF NOT EXISTS feedback (
id_feedback int auto_increment primary key NOT NULL,
id_rm int(5) NOT NULL,
date_feedback date NOT NULL, -- dd/mm/yyyy --
rating enum('good', 'bad', 'mid') NOT NULL,
comment varchar(140),
foreign key(id_rm) references student(id_rm)
);


create table IF NOT EXISTS product (
id_product int auto_increment primary key NOT NULL,
product_name varchar(40) NOT NULL,
current_quantity decimal(7,3) NOT NULL,
unit varchar(15) NOT NULL,
minimum_quantity decimal(6,3) NOT NULL
);


create table IF NOT EXISTS stock (
id_stock int auto_increment primary key NOT NULL,
id_product int NOT NULL,
quantity_movement decimal(7,3) NOT NULL,
date_movement date NOT NULL, -- dd/mm/yyyy --
validity date NOT NULL, -- dd/mm/yyyy --
batch varchar(20) NOT NULL,
destination varchar(140) NOT NULL,
origin varchar(140) NOT NULL,
price decimal(7,2) NOT NULL,

foreign key(id_product) references product(id_product)
);
select * from stock;
-- DESC stock;

-- ALTER TABLE stock ADD COLUMN price decimal(7,2) NOT NULL;
-- alter table para adicionar 
-- origin varchar(140) NOT NULL, -- novo
-- price decimal(7,2) NOT NULL, -- novo

create table IF NOT EXISTS production (
id_production int auto_increment primary key NOT NULL,
id_product int NOT NULL,
id_meal int NULL,
date_production date NOT NULL, -- dd/mm/yyyy --
food varchar(25) NOT NULL,
quantity_produced decimal(5,3) NOT NULL,
meal_type enum('breakfast','lunch', 'snack', 'dinner') NOT NULL,
shift enum('morning', 'evening', 'night') NOT NULL,
remnant decimal(5,3),
note varchar (40),

foreign key(id_product) references product(id_product),
foreign key(id_meal) references meal(id_meal)
);


create table IF NOT EXISTS release_exception (
id_exception int auto_increment primary key NOT NULL,
id_rm int(5) NOT NULL,
date_time datetime NOT NULL, -- hh:mm dd/mm/yyyy --
reason varchar(140),
meal_type enum('breakfast','lunch', 'snack', 'dinner') NOT NULL,
type_release enum('temporary', 'permanent') NOT NULL,
allow_repeat enum('yes', 'no') NOT NULL,
foreign key(id_rm) references student(id_rm)
);

create table IF NOT EXISTS school_user (
id_user int auto_increment primary key NOT NULL,
user_name varchar(60) NOT NULL,
cpf char(11) unique NOT NULL,
phone char(11) NOT NULL,
email varchar(320) NOT NULL,
is_user_admin boolean
);
SELECT * FROM access WHERE id_user = 12;

select * from school_user;
select * from access;
create table IF NOT EXISTS access(
id_access int auto_increment primary key,
id_user int,

access_stock boolean,
access_production boolean,
access_accesses boolean,
access_student_register boolean,
access_reports boolean,
access_student_perm boolean,
access_class_register boolean,

foreign key(id_user) references school_user(id_user)
);


create table IF NOT EXISTS school (
id_school int auto_increment primary key NOT NULL,
id_user int NOT NULL,
school_name varchar(60) unique NOT NULL,
address_road varchar(35) NOT NULL,
phone char(11) NOT NULL, -- 99 99999-9999 --
foreign key(id_user) references school_user(id_user)
);


-- logica do filtro
SELECT
    s.id_rm,
    s.student_name,
    m.type_meal,
    m.access_status
FROM student s
JOIN class c
    ON s.id_class = c.id_class
LEFT JOIN meal m
    ON m.id_rm = s.id_rm
    AND DATE(m.date_time) = CURDATE()
WHERE c.course = 'INFO'
  AND c.period = 'M'
  AND c.grade = '1';

/*
SELECT 
    s.id_rm, 
    s.student_name, 
    m.type_meal, 
    m.access_status
FROM student s
JOIN class c 
    ON s.id_class = c.id_class
LEFT JOIN meal m 
    ON m.id_rm = s.id_rm 
    AND DATE(m.date_time) = CURDATE()
WHERE c.course = ?
  AND c.`period` = ?
  AND c.`grade` = ?; */
  /*
  -- logica do filtro com anabolizante
SELECT
        s.id_rm,
        s.student_name,
        COUNT(CASE WHEN m.type_meal = 'lunch' AND m.access_status = 'allowed' THEN 1 ELSE NULL END) AS lunch_allowed_count,
        COUNT(CASE WHEN m.type_meal = 'dinner' AND m.access_status = 'allowed' THEN 1 ELSE NULL END) AS dinner_allowed_count,
        COUNT(CASE WHEN m.type_meal = 'lunch' AND m.access_status = 'exception' THEN 1 ELSE NULL END) AS lunch_exception_count,
        COUNT(CASE WHEN m.type_meal = 'dinner' AND m.access_status = 'exception' THEN 1 ELSE NULL END) AS dinner_exception_count,
        MAX(CASE WHEN m.type_meal = 'lunch' THEN m.date_time END) AS lunch_time,
        MAX(CASE WHEN m.type_meal = 'dinner' THEN m.date_time END) AS dinner_time
    FROM student s
    JOIN class c ON s.id_class = c.id_class
    LEFT JOIN meal m ON m.id_rm = s.id_rm AND DATE(m.date_time) = '2025-09-18'
    WHERE c.course = 'INFO' AND c.period = 'T' AND c.grade = '3'
    GROUP BY s.id_rm, s.student_name
    ORDER BY s.student_name;
    
    SELECT
    s.id_rm,
    s.student_name,
    MAX(CASE WHEN m.type_meal = 'lunch' THEN m.date_time END) AS lunch_time,
    MAX(CASE WHEN m.type_meal = 'dinner' THEN m.date_time END) AS dinner_time,
    GROUP_CONCAT(CASE WHEN m.type_meal = 'lunch' AND m.id_meal <> (
        SELECT MIN(m2.id_meal)
        FROM meal m2
        WHERE m2.id_rm = s.id_rm AND DATE(m2.date_time) = ?
          AND m2.type_meal = 'lunch'
    ) THEN DATE_FORMAT(m.date_time, '%H:%i') END SEPARATOR ', ') AS lunch_repeat_times,
    GROUP_CONCAT(CASE WHEN m.type_meal = 'dinner' AND m.id_meal <> (
        SELECT MIN(m2.id_meal)
        FROM meal m2
        WHERE m2.id_rm = s.id_rm AND DATE(m2.date_time) = ?
          AND m2.type_meal = 'dinner'
    ) THEN DATE_FORMAT(m.date_time, '%H:%i') END SEPARATOR ', ') AS dinner_repeat_times
FROM student s
JOIN class c ON s.id_class = c.id_class
LEFT JOIN meal m ON m.id_rm = s.id_rm AND DATE(m.date_time) = '2025-09-18'
WHERE c.course = 'INFO' AND c.period = 'M' AND c.grade = '3'
GROUP BY s.id_rm, s.student_name
ORDER BY s.student_name;

SELECT
      s.id_rm,
      s.student_name,
      MAX(CASE WHEN m.type_meal = 'lunch' THEN m.date_time END) AS lunch_time,
      MAX(CASE WHEN m.type_meal = 'dinner' THEN m.date_time END) AS dinner_time,
      GROUP_CONCAT(
        CASE WHEN m.type_meal = 'lunch' AND m.id_meal <> (
          SELECT MIN(m2.id_meal)
          FROM meal m2
          WHERE m2.id_rm = s.id_rm AND DATE(m2.date_time) = ? AND m2.type_meal = 'lunch'
        ) THEN DATE_FORMAT(m.date_time, '%H:%i') END
        SEPARATOR ', '
      ) AS lunch_repeat_times,
      GROUP_CONCAT(
        CASE WHEN m.type_meal = 'dinner' AND m.id_meal <> (
          SELECT MIN(m2.id_meal)
          FROM meal m2
          WHERE m2.id_rm = s.id_rm AND DATE(m2.date_time) = ? AND m2.type_meal = 'dinner'
        ) THEN DATE_FORMAT(m.date_time, '%H:%i') END
        SEPARATOR ', '
      ) AS dinner_repeat_times
    FROM student s
    JOIN class c ON s.id_class = c.id_class
    LEFT JOIN meal m ON m.id_rm = s.id_rm AND DATE(m.date_time) = '2025-09-18'
    WHERE c.course = 'INFO' AND c.period = 'T' AND c.grade = '3'
    GROUP BY s.id_rm, s.student_name
    ORDER BY s.student_name */
    
    INSERT INTO biometrics (hash_digital1, hash_digital2, hash_digital3) VALUES
('abc123def456ghi789jkl000aaa111bbb222ccc333ddd444eee555fff666', 'eee999zzz888yyy777xxx666www555vvv444uuu333ttt222sss111rrr000', '123abc456def789ghi000jkl111mno222pqr333stu444vwx555yz666abc'),
('987xyz654wvu321tsr000qpo111nml222kjh333gfe444dcb555aaa666bbb', '654qwe321asd000zxc111rty222fgh333vbn444uio555jkl666mnb777lkj', '321cba654fed987ihg000lkj111onm222rqp333uts444vwx555zyx666wvu'),
('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd', 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba098765'),
('111aaa222bbb333ccc444ddd555eee666fff777ggg888hhh999iii000jjj', '999zzz888yyy777xxx666www555vvv444uuu333ttt222sss111rrr000qqq', '000ppp111ooo222nnn333mmm444lll555kkk666jjj777iii888hhh999ggg'),
('abcd1234efgh5678ijkl9012mnop3456qrst6789uvwx9012yzab3456cdef', 'fedc4321hgfe8765lkji2109ponm6543tsrq9876xwvu2109bazy6543fedc', 'aaaa1111bbbb2222cccc3333dddd4444eeee5555ffff6666gggg7777hhhh'),
('1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d', '0d9c8b7a6z5y4x3w2v1u0t9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a', 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef'),
('abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', '123412341234123412341234123412341234123412341234123412341234', 'zzzz9999yyyy8888xxxx7777wwww6666vvvv5555uuuu4444tttt3333ssss'),
('098f6bcd4621d373cade4e832627b4f6', 'ad0234829205b9033196ba818f7a872b', '8ad8757baa8564dc136c1e07507f4a98'),
('c4ca4238a0b923820dcc509a6f75849b', 'c81e728d9d4c2f636f067f89cc14862c', 'eccbc87e4b5ce2fe28308fd9f2a7baf3'),
('a87ff679a2f3e71d9181a67b7542122c', 'e4da3b7fbbce2345d7772b0674a318d5', '1679091c5a880faf6fb5e6087eb1b2dc');

select * from biometrics;


 -- Inserindo novas turmas (5 cursos × 3 turnos = 15 turmas)
INSERT INTO class (course, period, grade, date_registration) VALUES
('INFO', 'M', 'A', '2025-01-10'),
('INFO', 'T', 'B', '2025-01-11'),
('INFO', 'N', 'C', '2025-01-12'),

('ADM', 'M', 'A', '2025-01-13'),
('ADM', 'T', 'B', '2025-01-14'),
('ADM', 'N', 'C', '2025-01-15'),

('PTEC', 'M', 'A', '2025-01-16'),
('PTEC', 'T', 'B', '2025-01-17'),
('PTEC', 'N', 'C', '2025-01-18'),

('MECA', 'M', 'A', '2025-01-19'),
('MECA', 'T', 'B', '2025-01-20'),
('MECA', 'N', 'C', '2025-01-21'),

('AUTO', 'M', 'A', '2025-01-22'),
('AUTO', 'T', 'B', '2025-01-23'),
('AUTO', 'N', 'C', '2025-01-24');

INSERT INTO class (course, period, grade, date_registration) VALUES
('INF', 'M', 'A', '2023-02-10'),
('MAT', 'T', 'B', '2023-03-15'),
('BIO', 'N', 'C', '2023-04-20'),
('QUI', 'M', 'A', '2024-01-05'),
('INF', 'T', 'B', '2024-06-25'),
('MAT', 'N', 'C', '2024-09-12'),
('BIO', 'M', 'A', '2025-01-08'),
('QUI', 'T', 'B', '2025-05-20'),
('INF', 'N', 'C', '2025-07-04'),
('MAT', 'M', 'A', '2025-08-10'); 

-- Exemplo de inserção para 'grade' como ano letivo
INSERT INTO class (course, period, grade, date_registration) VALUES
('INFO', 'M', '1', '2025-01-10'),
('INFO', 'T', '1', '2025-01-11'),

('INFO', 'M', '2', '2025-01-10'),
('INFO', 'T', '2', '2025-01-11'),

('INFO', 'M', '3', '2025-01-10'),
('INFO', 'T', '3', '2025-01-11');

select * from class;


-- Inserindo 50 alunos fictícios
INSERT INTO student (id_rm, id_class, id_biometrics, student_name, biometrics_authorization, date_authorization, student_legal_guardian, food_restriction) VALUES
(10000, 1, NULL, 'Lucas Pereira', TRUE, '2025-02-01', 'Carlos Pereira', 'Nenhuma'),
(10001, 2, NULL, 'Ana Oliveira', TRUE, '2025-02-02', 'Maria Oliveira', 'Glúten'),
(10002, 3, NULL, 'Pedro Souza', FALSE, '2025-02-03', 'João Souza', 'Lactose'),
(10003, 4, NULL, 'Juliana Costa', TRUE, '2025-02-04', 'Marcos Costa', 'Ovos'),
(10004, 5, NULL, 'Gabriel Rocha', FALSE, '2025-02-05', 'Sandra Rocha', 'Nenhuma'),
(10005, 6, NULL, 'Camila Lima', TRUE, '2025-02-06', 'Paulo Lima', 'Glúten'),
(10006, 7, NULL, 'Rafael Martins', TRUE, '2025-02-07', 'Tatiane Martins', 'Nenhuma'),
(10007, 8, NULL, 'Isabela Almeida', FALSE, '2025-02-08', 'Roberto Almeida', 'Lactose'),
(10008, 9, NULL, 'Fernando Santos', TRUE, '2025-02-09', 'Elaine Santos', 'Nenhuma'),
(10009, 10, NULL, 'Mariana Teixeira', TRUE, '2025-02-10', 'Ricardo Teixeira', 'Amendoim'),

(10010, 11, NULL, 'João Gabriel', TRUE, '2025-02-11', 'Paula Gabriel', 'Nenhuma'),
(10011, 12, NULL, 'Clara Fernandes', FALSE, '2025-02-12', 'Luiz Fernandes', 'Glúten'),
(10012, 13, NULL, 'Rodrigo Nunes', TRUE, '2025-02-13', 'Sônia Nunes', 'Lactose'),
(10013, 14, NULL, 'Beatriz Ribeiro', TRUE, '2025-02-14', 'Hugo Ribeiro', 'Nenhuma'),
(10014, 15, NULL, 'Matheus Carvalho', FALSE, '2025-02-15', 'Fernanda Carvalho', 'Ovos'),

(10015, 1, NULL, 'Carolina Mendes', TRUE, '2025-02-16', 'Marcelo Mendes', 'Nenhuma'),
(10016, 2, NULL, 'Thiago Lopes', FALSE, '2025-02-17', 'Patrícia Lopes', 'Glúten'),
(10017, 3, NULL, 'Larissa Gomes', TRUE, '2025-02-18', 'José Gomes', 'Nenhuma'),
(10018, 4, NULL, 'Eduardo Araujo', TRUE, '2025-02-19', 'Cláudia Araujo', 'Lactose'),
(10019, 5, NULL, 'Sofia Barros', FALSE, '2025-02-20', 'André Barros', 'Nenhuma'),

(10020, 6, NULL, 'Leonardo Castro', TRUE, '2025-02-21', 'Rosa Castro', 'Amendoim'),
(10021, 7, NULL, 'Gabriela Duarte', TRUE, '2025-02-22', 'Mariana Duarte', 'Nenhuma'),
(10022, 8, NULL, 'Bruno Farias', FALSE, '2025-02-23', 'Henrique Farias', 'Nenhuma'),
(10023, 9, NULL, 'Débora Silveira', TRUE, '2025-02-24', 'Luciana Silveira', 'Ovos'),
(10024, 10, NULL, 'Gustavo Araújo', TRUE, '2025-02-25', 'Paulo Araújo', 'Nenhuma'),

(10025, 11, NULL, 'Amanda Melo', TRUE, '2025-02-26', 'Silvia Melo', 'Glúten'),
(10026, 12, NULL, 'Ricardo Monteiro', FALSE, '2025-02-27', 'Carlos Monteiro', 'Nenhuma'),
(10027, 13, NULL, 'Juliana Batista', TRUE, '2025-02-28', 'Marta Batista', 'Nenhuma'),
(10028, 14, NULL, 'Diego Correia', TRUE, '2025-03-01', 'Eduardo Correia', 'Lactose'),
(10029, 15, NULL, 'Patrícia Reis', FALSE, '2025-03-02', 'Fábio Reis', 'Nenhuma'),

(10030, 1, NULL, 'Anderson Lima', TRUE, '2025-03-03', 'Luciana Lima', 'Nenhuma'),
(10031, 2, NULL, 'Marina Pires', TRUE, '2025-03-04', 'Renato Pires', 'Nenhuma'),
(10032, 3, NULL, 'Felipe Cardoso', FALSE, '2025-03-05', 'Roberta Cardoso', 'Ovos'),
(10033, 4, NULL, 'Natália Vieira', TRUE, '2025-03-06', 'Fernando Vieira', 'Nenhuma'),
(10034, 5, NULL, 'Henrique Souza', TRUE, '2025-03-07', 'Carla Souza', 'Glúten'),

(10035, 6, NULL, 'Alice Ribeiro', TRUE, '2025-03-08', 'Antônio Ribeiro', 'Nenhuma'),
(10036, 7, NULL, 'Rafaela Lopes', FALSE, '2025-03-09', 'Daniel Lopes', 'Nenhuma'),
(10037, 8, NULL, 'Caio Martins', TRUE, '2025-03-10', 'Tatiane Martins', 'Nenhuma'),
(10038, 9, NULL, 'Bruna Fernandes', TRUE, '2025-03-11', 'Felipe Fernandes', 'Lactose'),
(10039, 10, NULL, 'José Henrique', FALSE, '2025-03-12', 'André Henrique', 'Nenhuma'),

(10040, 11, NULL, 'Fernanda Lima', TRUE, '2025-03-13', 'Eduarda Lima', 'Nenhuma'),
(10041, 12, NULL, 'Marcelo Gomes', TRUE, '2025-03-14', 'Raquel Gomes', 'Glúten'),
(10042, 13, NULL, 'Tatiane Silva', FALSE, '2025-03-15', 'Mário Silva', 'Nenhuma'),
(10043, 14, NULL, 'Paulo Henrique', TRUE, '2025-03-16', 'Sueli Henrique', 'Nenhuma'),
(10044, 15, NULL, 'Letícia Rocha', TRUE, '2025-03-17', 'Márcio Rocha', 'Nenhuma'),

(10045, 1, NULL, 'Vinícius Almeida', TRUE, '2025-03-18', 'Renata Almeida', 'Ovos'),
(10046, 2, NULL, 'Carla Mendes', FALSE, '2025-03-19', 'Bruno Mendes', 'Nenhuma'),
(10047, 3, NULL, 'Eduarda Castro', TRUE, '2025-03-20', 'Sérgio Castro', 'Glúten'),
(10048, 4, NULL, 'Felipe Barbosa', TRUE, '2025-03-21', 'Patrícia Barbosa', 'Nenhuma'),
(10049, 5, NULL, 'Amanda Souza', FALSE, '2025-03-22', 'Lucas Souza', 'Nenhuma');

-- Alunos novos para teste de filtro
INSERT INTO student (id_rm, id_class, student_name, biometrics_authorization, date_authorization, student_legal_guardian, food_restriction) VALUES
(30060, 4, 'Lucas Teste', TRUE, '2025-09-01', 'Carlos Teste', 'Nenhuma'),
(30061, 4, 'Ana Teste', TRUE, '2025-09-01', 'Maria Teste', 'Glúten'),
(30062, 4, 'Pedro Teste', TRUE, '2025-09-01', 'João Teste', 'Lactose'),
(30063, 13, 'Juliana Teste', TRUE, '2025-09-01', 'Marcos Teste', 'Ovos'),
(30064, 13, 'Gabriel Teste', TRUE, '2025-09-01', 'Sandra Teste', 'Nenhuma'),
(30065, 12, 'Camila Teste', TRUE, '2025-09-01', 'Paulo Teste', 'Glúten');

select * from student;
select * from student
join meal
on student.id_rm= meal.id_rm 
where student.id_rm = 10014;


INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
(10000, '2025-08-01 11:40:00', 'lunch', 'allowed'),
(10001, '2025-08-01 17:50:00', 'dinner', 'allowed'),
(10002, '2025-08-02 11:45:00', 'lunch', 'blocked'),
(10003, '2025-08-02 18:00:00', 'dinner', 'exception'),
(10004, '2025-08-03 11:50:00', 'lunch', 'allowed'),
(10005, '2025-08-03 17:55:00', 'dinner', 'allowed'),
(10006, '2025-08-04 12:00:00', 'lunch', 'allowed'),
(10007, '2025-08-04 18:05:00', 'dinner', 'blocked'),
(10008, '2025-08-05 12:10:00', 'lunch', 'allowed'),
(10009, '2025-08-05 18:10:00', 'dinner', 'exception'),
(10010, '2025-08-05 18:10:00', 'dinner', 'exception'),

(10011, '2025-08-01 11:40:00', 'lunch', 'allowed'),
(10012, '2025-08-01 17:50:00', 'dinner', 'allowed'),
(10013, '2025-08-02 11:45:00', 'lunch', 'blocked'),
(10014, '2025-08-02 18:00:00', 'dinner', 'exception'),
(10015, '2025-08-03 11:50:00', 'lunch', 'allowed'),
(10016, '2025-08-03 17:55:00', 'dinner', 'allowed'),
(10017, '2025-08-04 12:00:00', 'lunch', 'allowed'),
(10018, '2025-08-04 18:05:00', 'dinner', 'blocked'),
(10019, '2025-08-05 12:10:00', 'lunch', 'allowed'),
(10020, '2025-08-05 18:10:00', 'dinner', 'exception'),

(10021, '2025-08-01 11:40:00', 'lunch', 'allowed'),
(10022, '2025-08-01 17:50:00', 'dinner', 'allowed'),
(10023, '2025-08-02 11:45:00', 'lunch', 'blocked'),
(10024, '2025-08-02 18:00:00', 'dinner', 'exception'),
(10025, '2025-08-03 11:50:00', 'lunch', 'allowed'),
(10026, '2025-08-03 17:55:00', 'dinner', 'allowed'),
(10027, '2025-08-04 12:00:00', 'lunch', 'allowed'),
(10028, '2025-08-04 18:05:00', 'dinner', 'blocked'),
(10029, '2025-08-05 12:10:00', 'lunch', 'allowed'),
(10030, '2025-08-05 18:10:00', 'dinner', 'exception'),

(10031, '2025-08-01 11:40:00', 'lunch', 'allowed'),
(10032, '2025-08-01 17:50:00', 'dinner', 'allowed'),
(10033, '2025-08-02 11:45:00', 'lunch', 'blocked'),
(10034, '2025-08-02 18:00:00', 'dinner', 'exception'),
(10035, '2025-08-03 11:50:00', 'lunch', 'allowed'),
(10036, '2025-08-03 17:55:00', 'dinner', 'allowed'),
(10037, '2025-08-04 12:00:00', 'lunch', 'allowed'),
(10038, '2025-08-04 18:05:00', 'dinner', 'blocked'),
(10039, '2025-08-05 12:10:00', 'lunch', 'allowed'),
(10040, '2025-08-05 18:10:00', 'dinner', 'exception'),

(10041, '2025-08-01 11:40:00', 'lunch', 'allowed'),
(10042, '2025-08-01 17:50:00', 'dinner', 'allowed'),
(10043, '2025-08-02 11:45:00', 'lunch', 'blocked'),
(10044, '2025-08-02 18:00:00', 'dinner', 'exception'),
(10045, '2025-08-03 11:50:00', 'lunch', 'allowed'),
(10046, '2025-08-03 17:55:00', 'dinner', 'allowed'),
(10047, '2025-08-04 12:00:00', 'lunch', 'allowed'),
(10048, '2025-08-04 18:05:00', 'dinner', 'blocked'),
(10049, '2025-08-05 12:10:00', 'lunch', 'allowed');

SELECT * FROM meal WHERE DATE(date_time) = CURDATE();

-- Refeições para teste de filtro
INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
-- 06/09/2025
(30030, '2025-09-23 11:30:00', 'lunch', 'allowed'),
(30031, '2025-09-23 11:40:00', 'lunch', 'blocked'),
(30032, '2025-09-23 12:00:00', 'lunch', 'exception'),
(30033, '2025-09-23 12:10:00', 'lunch', 'allowed'),
(30034, '2025-09-23 18:00:00', 'dinner', 'blocked'),
(30035, '2025-09-23 18:10:00', 'dinner', 'allowed'),

-- 07/09/2025 (outro dia)
(30040, '2025-09-23 11:30:00', 'lunch', 'allowed'),
(30041, '2025-09-23 11:40:00', 'lunch', 'allowed'),
(30042, '2025-09-23 12:00:00', 'lunch', 'blocked'),
(30043, '2025-09-23 12:10:00', 'lunch', 'exception'),
(30044, '2025-09-23 18:00:00', 'dinner', 'allowed'),
(30045, '2025-09-23 18:10:00', 'dinner', 'blocked');

INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
(20015, '2025-10-15 12:40:00', 'lunch', 'allowed'),
(20014, '2025-10-15 18:30:00', 'dinner', 'allowed');


INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
(20015, '2025-09-21 12:20:00', 'lunch', 'allowed'),
(20015, '2025-09-21 18:30:00', 'dinner', 'allowed');

INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
(20014, '2025-09-21 12:20:00', 'lunch', 'blocked'),
(20014, '2025-09-21 18:30:00', 'dinner', 'allowed');

INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
(20013, '2025-09-21 18:30:00', 'dinner', 'allowed');

INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
(20012, '2025-09-21 12:10:00', 'lunch', 'allowed');

/* INSERT INTO meal (id_rm, date_time, type_meal, access_status) VALUES
(10245, '2025-09-21 12:10:00', 'lunch', 'allowed'); */

select * from meal;


INSERT INTO feedback (id_rm, date_feedback, rating, comment) VALUES
(10000, '2025-08-01', 'good', 'Muito bom o almoço!'),
(10001, '2025-08-01', 'mid', 'Estava razoável.'),
(10002, '2025-08-02', 'bad', 'Comida fria e sem gosto.'),
(10003, '2025-08-02', 'good', 'Gostei da salada.'),
(10004, '2025-08-03', 'good', 'Excelente refeição hoje.'),
(10005, '2025-08-03', 'bad', 'Não gostei do tempero.'),
(10006, '2025-08-04', 'mid', 'Poderia ser melhor.'),
(10007, '2025-08-04', 'good', 'Delicioso e bem servido.'),
(10008, '2025-08-05', 'bad', 'Pouca quantidade.'),
(10009, '2025-08-05', 'mid', 'Estava ok.'),
(10010, '2025-08-05', 'mid', 'Estava ok.'),

(10011, '2025-08-01', 'good', 'Muito bom o almoço!'),
(10012, '2025-08-01', 'mid', 'Estava razoável.'),
(10013, '2025-08-02', 'bad', 'Comida fria e sem gosto.'),
(10014, '2025-08-02', 'good', 'Gostei da salada.'),
(10015, '2025-08-03', 'good', 'Excelente refeição hoje.'),
(10016, '2025-08-03', 'bad', 'Não gostei do tempero.'),
(10017, '2025-08-04', 'mid', 'Poderia ser melhor.'),
(10018, '2025-08-04', 'good', 'Delicioso e bem servido.'),
(10019, '2025-08-05', 'bad', 'Pouca quantidade.'),
(10020, '2025-08-05', 'mid', 'Estava ok.'),

(10021, '2025-08-01', 'good', 'Muito bom o almoço!'),
(10022, '2025-08-01', 'mid', 'Estava razoável.'),
(10023, '2025-08-02', 'bad', 'Comida fria e sem gosto.'),
(10024, '2025-08-02', 'good', 'Gostei da salada.'),
(10025, '2025-08-03', 'good', 'Excelente refeição hoje.'),
(10026, '2025-08-03', 'bad', 'Não gostei do tempero.'),
(10027, '2025-08-04', 'mid', 'Poderia ser melhor.'),
(10028, '2025-08-04', 'good', 'Delicioso e bem servido.'),
(10029, '2025-08-05', 'bad', 'Pouca quantidade.'),
(10030, '2025-08-05', 'mid', 'Estava ok.'),

(10031, '2025-08-01', 'good', 'Muito bom o almoço!'),
(10032, '2025-08-01', 'mid', 'Estava razoável.'),
(10033, '2025-08-02', 'bad', 'Comida fria e sem gosto.'),
(10034, '2025-08-02', 'good', 'Gostei da salada.'),
(10035, '2025-08-03', 'good', 'Excelente refeição hoje.'),
(10036, '2025-08-03', 'bad', 'Não gostei do tempero.'),
(10037, '2025-08-04', 'mid', 'Poderia ser melhor.'),
(10038, '2025-08-04', 'good', 'Delicioso e bem servido.'),
(10039, '2025-08-05', 'bad', 'Pouca quantidade.'),
(10040, '2025-08-05', 'mid', 'Estava ok.'),

(10041, '2025-08-01', 'good', 'Muito bom o almoço!'),
(10042, '2025-08-01', 'mid', 'Estava razoável.'),
(10043, '2025-08-02', 'bad', 'Comida fria e sem gosto.'),
(10044, '2025-08-02', 'good', 'Gostei da salada.'),
(10045, '2025-08-03', 'good', 'Excelente refeição hoje.'),
(10046, '2025-08-03', 'bad', 'Não gostei do tempero.'),
(10047, '2025-08-04', 'mid', 'Poderia ser melhor.'),
(10048, '2025-08-04', 'good', 'Delicioso e bem servido.'),
(10049, '2025-08-05', 'bad', 'Pouca quantidade.');


select * from feedback;


INSERT INTO product (product_name, current_quantity, unit, minimum_quantity) VALUES
('Arroz', 120.500, 'kg', 10.000),
('Feijão', 85.750, 'kg', 8.000),
('Macarrão', 60.250, 'kg', 5.000),
('Frango', 45.000, 'kg', 7.000),
('Carne', 78.100, 'kg', 10.000),
('Alface', 30.000, 'kg', 3.000),
('Tomate', 25.400, 'kg', 2.000),
('Batata', 55.900, 'kg', 4.000),
('Óleo', 15.000, 'L', 2.000),
('Sal', 8.750, 'kg', 1.000);


select * from product;


INSERT INTO stock (id_product, quantity_movement, date_movement, validity, batch, destination) VALUES
(1, 25.000, '2025-07-20', '2025-09-20', 'L01A23', 'Cozinha principal'),
(2, 15.750, '2025-07-22', '2025-09-22', 'L02B34', 'Cozinha principal'),
(3, 20.000, '2025-07-24', '2025-09-24', 'L03C45', 'Cozinha secundária'),
(4, 10.000, '2025-07-25', '2025-08-30', 'L04D56', 'Setor de carnes'),
(5, 30.100, '2025-07-26', '2025-09-10', 'L05E67', 'Cozinha principal'),
(6, 8.000, '2025-07-27', '2025-08-15', 'L06F78', 'Hortifruti'),
(7, 12.400, '2025-07-28', '2025-08-18', 'L07G89', 'Hortifruti'),
(8, 18.900, '2025-07-29', '2025-09-01', 'L08H90', 'Armazém'),
(9, 10.000, '2025-07-30', '2026-01-01', 'L09I91', 'Despensa de óleo'),
(10, 5.750, '2025-07-31', '2026-01-10', 'L10J92', 'Estoque geral');


select * from stock;
delete from stock where id_stock = 18;



INSERT INTO production (id_product, date_production, food, quantity_produced, meal_type, shift, remnant, note) VALUES 
(1,  '2025-08-01', 'Pão de Queijo', 20.000, 'breakfast', 'morning', 20.000, 'Produção inicial para o café da manhã'),
(2,  '2025-08-01', 'Arroz com Feijão', 30.000, 'lunch', 'morning', 50.000, 'Produção para o almoço completo'),
(3,  '2025-08-01', 'Bolo de Chocolate', 15.000, 'snack', 'morning', 30.000, 'Lanche para a tarde'),
(4,  '2025-08-01', 'Frango Assado', 25.000, 'dinner', 'evening', 10.000, 'Refeição principal do jantar'),
(5,  '2025-08-01', 'Mingau de Aveia', 10.000, 'breakfast', 'morning', 5.000, 'Opção saudável para café'),
(6,  '2025-08-01', 'Pão de Queijo', 18.000, 'breakfast', 'morning', 25.000, 'Produção para café da manhã, extra'),
(7,  '2025-08-01', 'Arroz à Grega', 25.000, 'lunch', 'night', 40.000, 'Almoço com opções de acompanhamento'),
(8,  '2025-08-01', 'Lasanha de Carne', 22.000, 'dinner', 'evening', 15.000, 'Jantar com prato quente e reforçado'),
(9,  '2025-08-02', 'Salada de Frutas', 11.000, 'snack', 'morning', 12.000, 'Lanche saudável para a manhã'),
(10,  '2025-08-02', 'Sopa de Legumes', 12.000, 'dinner', 'night', 18.000, 'Sopa leve para a noite');


select * from production where date_production = CURDATE();

    select id_rm, meal_type, type_release, date_time, reason from release_exception;
    select * from release_exception;
    
    INSERT INTO release_exception (id_rm, date_time, reason, meal_type, type_release, allow_repeat) VALUES
(10000, '2025-08-23 07:30:00', 'Problema de saúde', 'breakfast', 'temporary', 'no'),
(10001, '2025-08-23 12:00:00', 'Viajei para outro estado', 'lunch', 'temporary', 'yes'),
(10002, '2025-08-24 15:00:00', 'Compromisso acadêmico', 'snack', 'permanent', 'no'),
(10003, '2025-08-24 19:30:00', 'Feriado prolongado', 'dinner', 'temporary', 'yes'),
(10004, '2025-08-25 07:00:00', 'Reunião fora da cidade', 'breakfast', 'temporary', 'no'),
(10005, '2025-08-25 12:30:00', 'Visita de familiares', 'lunch', 'temporary', 'no'),
(10006, '2025-08-26 16:00:00', 'Curso de atualização profissional', 'snack', 'permanent', 'yes'),
(10007, '2025-08-26 20:00:00', 'Viagem internacional', 'dinner', 'temporary', 'no'),
(10008, '2025-08-27 08:00:00', 'Atraso devido ao trânsito', 'breakfast', 'temporary', 'yes'),
(10009, '2025-08-27 13:00:00', 'Evento corporativo', 'lunch', 'permanent', 'no');


select * from release_exception;


select * from student
join release_exception
on student.id_rm= release_exception.id_rm 
where student.id_rm = 10014;



INSERT INTO school_user (user_name, cpf, phone, email, is_user_admin) VALUES
('Cláudia Santos', '12345678900', '11987654321', 'claudia.santos@example.com', TRUE),
('Marcos Lima', '23456789011', '11976543210', 'marcos.lima@example.com', FALSE),
('Renata Alves', '34567890122', '11965432109', 'renata.alves@example.com', TRUE),
('Carlos Pereira', '45678901233', '11954321098', 'carlos.pereira@example.com', FALSE),
('Juliana Rocha', '56789012344', '11943210987', 'juliana.rocha@example.com', TRUE),
('Paulo Gomes', '67890123455', '11932109876', 'paulo.gomes@example.com', FALSE),
('Fernanda Castro', '78901234566', '11921098765', 'fernanda.castro@example.com', TRUE),
('André Costa', '89012345677', '11910987654', 'andre.costa@example.com', FALSE),
('Camila Souza', '90123456788', '11909876543', 'camila.souza@example.com', TRUE),
('Roberta Nunes', '01234567899', '11908765432', 'roberta.nunes@example.com', FALSE);


select * from school_user;


INSERT INTO access (id_user, access_stock, access_production, access_accesses, access_student_register, access_reports, access_student_perm, access_class_register) VALUES
(11, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
(2, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, TRUE),
(3, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE),
(4, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE),
(5, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE),
(6, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE),
(7, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE),
(8, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE),
(9, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE),
(10, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);
-- (11, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

INSERT INTO access (id_user, access_stock, access_production, access_accesses, access_student_register, access_reports, access_student_perm, access_class_register) VALUES
(12, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE);

select * from access;

INSERT INTO school (id_user, school_name, address_road, phone) VALUES
(1, 'Escola Modelo Central', 'Rua das Flores', '11987654321'),
(2, 'Colégio Esperança', 'Avenida Brasil', '11976543210'),
(3, 'Instituto Saber Mais', 'Rua da Paz', '11965432109'),
(4, 'Centro Educacional Avançar', 'Rua do Progresso', '11954321098'),
(5, 'Escola Padrão', 'Rua das Palmeiras', '11943210987'),
(6, 'Colégio Alpha', 'Avenida dos Estudantes', '11932109876'),
(7, 'Instituto Futuro Brilhante', 'Rua Nova Esperança', '11921098765'),
(8, 'Centro Educacional Integração', 'Rua da Liberdade', '11910987654'),
(9, 'Escola Conectar', 'Avenida Central', '11909876543'),
(10, 'Colégio União', 'Rua do Saber', '11908765432');


select * from school; 