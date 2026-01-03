-- ======================================
-- INSERTS ATLETAS FC PORTO 2025/26
-- ======================================

-- Guarda-Redes
INSERT INTO public.t_athlete (name, birthdate, email, "phoneNumber", pfp, "divisionID", "injuredBit", "countryID")
VALUES 
('Cláudio Ramos', '1991-11-16', 'claudio.ramos@fcporto.pt', '912345002', NULL, 2, false, 89),
('João Costa', '2001-03-15', 'joao.costa@fcporto.pt', '912345003', NULL, 3, false, 89),
('Diogo Fernandes', '2004-02-10', 'diogo.fernandes@fcporto.pt', '912345004', NULL, 4, false, 89),
('Diogo Costa', '1999-09-19', 'diogo.costa@fcporto.pt', '912345001', NULL, 1, false, 89);

-- Defesas
INSERT INTO public.t_athlete (name, birthdate, email, "phoneNumber", pfp, "divisionID", "injuredBit", "countryID")
VALUES 
('Tiago Silva', '1984-09-22', 'tiago.silva@fcporto.pt', '912345005', NULL, 5, false, 89),
('Jakub Kiwior', '2002-09-18', 'jakub.kiwior@fcporto.pt', '912345012', NULL, 12, false, 89),
('Jan Bednarek', '1996-04-12', 'jan.bednarek@fcporto.pt', '912345006', NULL, 6, false, 88),
('Zaidu Sanusi', '1997-05-26', 'zaidu@fcporto.pt', '912345008', NULL, 8, false, 81),
('Nehuén Pérez', '2000-06-24', 'nehuen.perez@fcporto.pt', '912345007', NULL, 7, false, 6),
('Alberto Costa', '2003-11-28', 'alberto.costa@fcporto.pt', '912345009', NULL, 9, false, 89),
('Dominik Prpić', '2002-03-11', 'dominik.prpic@fcporto.pt', '912345021', NULL, 9, false, 26),
('Martim Fernandes', '2004-07-25', 'martim.fernandes@fcporto.pt', '912345011', NULL, 11, false, 89),
('Francisco Moura', '2001-02-19', 'francisco.moura@fcporto.pt', '912345010', NULL, 10, false, 89);

-- Médios
INSERT INTO public.t_athlete (name, birthdate, email, "phoneNumber", pfp, "divisionID", "injuredBit", "countryID")
VALUES 
('Stephen Eustáquio', '1996-12-21', 'stephen.eustaquio@fcporto.pt', '912345013', NULL, 1, false, 21),
('Victor Froholdt', '2002-11-02', 'victor.froholdt@fcporto.pt', '912345014', NULL, 2, false, 30),
('Gabri Veiga', '2002-05-27', 'gabri.veiga@fcporto.pt', '912345015', NULL, 3, false, 95),
('Pablo Rosário', '2003-09-14', 'pablo.rosário@fcporto.pt', '912345017', NULL, 5, false, 89),
('Alan Varela', '2001-07-20', 'alan.varela@fcporto.pt', '912345016', NULL, 4, false, 6),
('Tomás Pérez', '2004-05-08', 'tomas.perez@fcporto.pt', '912345018', NULL, 6, false, 100),
('Rodrigo Mora', '2002-01-30', 'rodrigo.mora@fcporto.pt', '912345020', NULL, 8, false, 89);

-- Avançados
INSERT INTO public.t_athlete (name, birthdate, email, "phoneNumber", pfp, "divisionID", "injuredBit", "countryID")
VALUES 
('William Gomes', '2005-01-15', 'william.gomes@fcporto.pt', '912345025', NULL, 1, false, 17),
('Samuel Omorodion', '2004-05-05', 'samu@fcporto.pt', '912345022', NULL, 10, false, 100),
('Pepê', '1997-02-14', 'pepe@fcporto.pt', '912345024', NULL, 12, false, 17),
('Borja Sainz', '2001-06-26', 'borja.sainz@fcporto.pt', '912345026', NULL, 2, false, 100),
('Luuk de Jong', '1990-08-27', 'luuk.dejong@fcporto.pt', '912345029', NULL, 5, false, 78),
('Deniz Gül', '2004-03-04', 'deniz.gul@fcporto.pt', '912345028', NULL, 4, false, 97),
('Ángel Alarcón', '2000-09-03', 'angel.alarcon@fcporto.pt', '912345027', NULL, 3, false, 54),
('Yann Karamoh', '2004-03-04', 'deniz.gul@fcporto.pt', '912345028', NULL, 4, false, 39);

-- ======================================
-- INSERTS RESPONSÁVEIS (ACCOUNTABLES)
-- FC PORTO 2025/26
-- ======================================

INSERT INTO public.t_accountable (name, email, "phoneNumber", "athleteID", "relationID")
VALUES
-- Cláudio Ramos (28)
('Maria Ramos', 'maria.ramos@email.com', '912000003', 28, 2),

-- João Costa (29)
('Pedro Costa', 'pedro.costa@email.com', '912000004', 29, 1),
('Ana Costa', 'ana.costa@email.com', '912000005', 29, 2),

-- Diogo Fernandes (30)
('Carlos Fernandes', 'carlos.fernandes@email.com', '912000006', 30, 1),

-- Diogo Costa (31)
('Francisco Costa', 'francisco.costa@email.com', '912000001', 31, 1),
('Amanda Costa', 'amanda.costa@email.com', '912000002', 31, 2),

-- Tiago Silva (32)
('José Pedro Silva', 'jose.silva@email.com', '912000007', 32, 1),
('Teresa Silva', 'teresa.silva@email.com', '912000008', 32, 2),

-- Jakub Kiwior (33)
('Piotr Kiwior', 'piotr.kiwior@email.com', '+48912000040', 33, 1),

-- Jan Bednarek (34)
('Marek Bednarek', 'marek.bednarek@email.com', '+48912000009', 34, 1),

-- Zaidu Sanusi (35)
('Abdullahi Sanusi', 'abdullahi.sanusi@email.com', '+234912000011', 35, 1),

-- Nehuén Pérez (36)
('Javier Pérez', 'javier.perez@email.com', '+54912000010', 36, 1),

-- Alberto Costa (37)
('Manuel Costa', 'manuel.costa@email.com', '912000012', 37, 1),
('Sofia Costa', 'sofia.costa@email.com', '912000013', 37, 2),

-- Dominik Prpić (38)
('Ivan Prpić', 'ivan.prpic@email.com', '+385912000029', 38, 1),

-- Martim Fernandes (39)
('Ricardo Fernandes', 'ricardo.fernandes@email.com', '912000015', 39, 1),

-- Francisco Moura (40)
('António Moura', 'antonio.moura@email.com', '912000014', 40, 1),

-- Stephen Eustáquio (41)
('Robert Eustáquio', 'robert.eustaquio@email.com', '+1912000018', 41, 1),

-- Victor Froholdt (42)
('Lars Froholdt', 'lars.froholdt@email.com', '+45912000019', 42, 1),

-- Gabri Veiga (43)
('Luis Veiga', 'luis.veiga@email.com', '+34912000031', 43, 1),
('Carmen Veiga', 'carmen.veiga@email.com', '+34912000032', 43, 2),

-- Pablo Rosário (44)
('Miguel Rosário', 'miguel.rosario@email.com', '912000041', 44, 1),

-- Alan Varela (45)
('Fernando Varela', 'fernando.varela@email.com', '+54912000021', 45, 1),
('Mónica Varela', 'monica.varela@email.com', '+54912000022', 45, 2),

-- Tomás Pérez (46)
('Carlos Pérez', 'carlos.perez@email.com', '+34912000024', 46, 1),
('Isabel Pérez', 'isabel.perez@email.com', '+34912000025', 46, 2),

-- Rodrigo Mora (47)
('Rui Mora', 'rui.mora@email.com', '912000027', 47, 1),
('Helena Mora', 'helena.mora@email.com', '912000028', 47, 2),

-- William Gomes (48)
('Roberto Gomes', 'roberto.gomes@email.com', '+55912000034', 48, 1),
('Mariana Gomes', 'mariana.gomes@email.com', '+55912000035', 48, 2),

-- Samuel Omorodion (49)
('Mary Aghehowa', 'mary.aghehowa@email.com', '+34912000030', 49, 2),

-- Pepê (50)
('Eduardo Gomes', 'eduardo.gomes@email.com', '+55912000033', 50, 1),

-- Borja Sainz (51)
('José Sainz', 'jose.sainz@email.com', '+34912000036', 51, 1),

-- Luuk de Jong (52)
('Henk de Jong', 'henk.dejong@email.com', '+31912000039', 52, 1),

-- Deniz Gül (53)
('Mehmet Gül', 'mehmet.gul@email.com', '+421912000038', 53, 1);

COMMIT;

-- ======================================
-- INSERTS LESÕES (t_injury_record)
-- (com datas recentes em 2025-11 / 2025-12)
-- ======================================

-- Cláudio Ramos (28) - 2 lesões
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(28, 8, 'Entorse no tornozelo direito durante treino.', 2, null, '2023-09-10', '2023-09-20', 'Entorse Tornozelo'),
(28, 9, 'Lesão muscular na coxa esquerda.', 2, null, '2025-12-01', '2025-12-15', 'Lesão Muscular');

-- João Costa (29) - 1 lesão (recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(29, 10, 'Concussão após choque em jogo.', 2, null, '2025-11-18', '2025-11-25', 'Concussão');

-- Diogo Fernandes (30) - nenhuma lesão

-- Diogo Costa (31) - 1 lesão (recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(31, 11, 'Distensão muscular na coxa direita.', 2, null, '2025-12-05', '2025-12-18', 'Distensão Muscular');

-- Tiago Silva (32) - 3 lesões (uma recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(32, 8, 'Fratura no dedo do pé esquerdo.', 2, null, '2022-07-10', '2022-07-25', 'Fratura Dedo do Pé'),
(32, 9, 'Lesão no ombro direito.', 2, null, '2023-08-01', '2023-08-15', 'Lesão Ombro'),
(32, 10, 'Entorse no joelho esquerdo.', 2, null, '2025-11-10', '2025-11-25', 'Entorse Joelho');

-- Jakub Kiwior (33) - 1 lesão
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(33, 11, 'Lesão muscular na coxa esquerda.', 2, null, '2025-05-18', '2025-05-28', 'Lesão Muscular');

-- Jan Bednarek (34) - nenhuma lesão

-- Zaidu Sanusi (35) - 2 lesões (uma recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(35, 8, 'Torção no tornozelo direito.', 2, null, '2024-03-10', '2024-03-20', 'Torção Tornozelo'),
(35, 9, 'Entorse no joelho esquerdo.', 2, null, '2025-12-03', '2025-12-20', 'Entorse Joelho');

-- Nehuén Pérez (36) - 1 lesão
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(36, 10, 'Lesão na coxa direita.', 2, null, '2023-10-12', '2023-10-20', 'Lesão Coxa');

-- Alberto Costa (37) - nenhuma lesão

-- Dominik Prpić (38) - 1 lesão (recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(38, 11, 'Entorse no tornozelo esquerdo.', 2, null, '2025-11-22', '2025-12-05', 'Entorse Tornozelo');

-- Martim Fernandes (39) - 1 lesão
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(39, 8, 'Distensão muscular no quadríceps.', 2, null, '2025-01-12', '2025-01-20', 'Distensão Muscular');

-- Francisco Moura (40) - nenhuma lesão

-- Stephen Eustáquio (41) - 2 lesões (uma recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(41, 9, 'Lesão no joelho direito.', 2, null, '2023-04-10', '2023-04-25', 'Lesão Joelho'),
(41, 10, 'Torção no tornozelo esquerdo.', 2, null, '2025-11-30', '2025-12-12', 'Torção Tornozelo');

-- Victor Froholdt (42) - nenhuma lesão

-- Gabri Veiga (43) - 1 lesão (recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(43, 11, 'Entorse no joelho esquerdo.', 2, null, '2025-12-08', '2025-12-22', 'Entorse Joelho');

-- Pablo Rosário (44) - nenhuma lesão

-- Alan Varela (45) - 1 lesão (recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(45, 8, 'Lesão muscular na coxa direita.', 2, null, '2025-11-15', '2025-11-30', 'Lesão Muscular');

-- Tomás Pérez (46) - nenhuma lesão

-- Rodrigo Mora (47) - 2 lesões
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(47, 9, 'Distensão no ombro esquerdo.', 2, null, '2023-05-12', '2023-05-20', 'Distensão Ombro'),
(47, 10, 'Torção no tornozelo direito.', 2, null, '2025-12-02', '2025-12-16', 'Torção Tornozelo');

-- William Gomes (48) - 1 lesão (recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(48, 11, 'Lesão muscular na coxa esquerda.', 2, null, '2025-11-25', '2025-12-05', 'Lesão Muscular');

-- Samuel Omorodion (49) - nenhuma lesão

-- Pepê (50) - 1 lesão
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(50, 8, 'Torção no tornozelo direito.', 2, null, '2024-08-10', '2024-08-20', 'Torção Tornozelo');

-- Borja Sainz (51) - nenhuma lesão

-- Luuk de Jong (52) - 1 lesão
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(52, 9, 'Distensão muscular na coxa direita.', 2, null, '2023-09-15', '2023-09-25', 'Distensão Muscular');

-- Deniz Gül (53) - 1 lesão (recente)
INSERT INTO public.t_injury_record ("athleteID", "userID", resume, "statusID", "errorSpecID", "dateStart", "dateEnd", title)
VALUES
(53, 10, 'Entorse no tornozelo esquerdo.', 2, null, '2025-12-10', '2025-12-24', 'Entorse Tornozelo');

-- ======================================
-- NOTAS - Cláudio Ramos (28) | Lesão Muscular (2025-12)
-- ======================================
INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Avaliação inicial: dor moderada na coxa esquerda, sem rotura aparente.',
  '2025-12-02',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 28 AND title = 'Lesão Muscular' AND "dateStart" = '2025-12-01';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Início de fisioterapia com exercícios de mobilidade e gelo local.',
  '2025-12-04',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 28 AND title = 'Lesão Muscular' AND "dateStart" = '2025-12-01';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Boa evolução clínica. Redução significativa da dor.',
  '2025-12-08',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 28 AND title = 'Lesão Muscular' AND "dateStart" = '2025-12-01';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Início de corrida ligeira e exercícios excêntricos.',
  '2025-12-11',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 28 AND title = 'Lesão Muscular' AND "dateStart" = '2025-12-01';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Alta clínica prevista. Jogador apto para reintegração progressiva.',
  '2025-12-15',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 28 AND title = 'Lesão Muscular' AND "dateStart" = '2025-12-01';

-- ======================================
-- NOTAS - João Costa (29) | Concussão (2025-11)
-- ======================================
INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Avaliação pós-jogo: sintomas compatíveis com concussão leve.',
  '2025-11-18',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 29 AND title = 'Concussão';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Repouso absoluto recomendado. Sem treino.',
  '2025-11-19',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 29 AND title = 'Concussão';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Sem queixas de tonturas ou cefaleias.',
  '2025-11-22',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 29 AND title = 'Concussão';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Liberado para regresso progressivo ao treino.',
  '2025-11-25',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 29 AND title = 'Concussão';

-- ======================================
-- NOTAS - Tiago Silva (32) | Entorse Joelho (2025-11)
-- ======================================
INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Entorse confirmada. Inchaço ligeiro e limitação funcional.',
  '2025-11-10',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 32 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Início de tratamento conservador com fisioterapia.',
  '2025-11-12',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 32 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Boa resposta ao tratamento. Estabilidade articular preservada.',
  '2025-11-18',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 32 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Regresso ao treino condicionado.',
  '2025-11-22',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 32 AND title = 'Entorse Joelho';

-- ======================================
-- NOTAS - Zaidu Sanusi (35) | Entorse Joelho (2025-12)
-- ======================================
INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Queixas de dor medial no joelho esquerdo.',
  '2025-12-03',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 35 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'RMN sem lesões ligamentares graves.',
  '2025-12-06',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 35 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Fortalecimento muscular iniciado.',
  '2025-12-10',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 35 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Jogador responde bem, sem dor à palpação.',
  '2025-12-16',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 35 AND title = 'Entorse Joelho';

-- ======================================
-- NOTAS - Gabri Veiga (43) | Entorse Joelho (2025-12)
-- ======================================
INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Avaliação inicial após trauma em jogo.',
  '2025-12-08',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 43 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Início de protocolo RICE.',
  '2025-12-09',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 43 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Mobilidade quase total recuperada.',
  '2025-12-15',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 43 AND title = 'Entorse Joelho';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Apto para regressar à competição.',
  '2025-12-22',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 43 AND title = 'Entorse Joelho';

-- ======================================
-- NOTAS - Deniz Gül (53) | Entorse Tornozelo (2025-12)
-- ======================================
INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Edema significativo no tornozelo esquerdo.',
  '2025-12-10',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 53 AND title = 'Entorse Tornozelo';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Uso de ligadura funcional.',
  '2025-12-12',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 53 AND title = 'Entorse Tornozelo';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Boa evolução funcional. Marcha sem dor.',
  '2025-12-18',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 53 AND title = 'Entorse Tornozelo';

INSERT INTO public.t_note (text, date, "injuryRecordID")
SELECT
  'Alta médica e retorno progressivo.',
  '2025-12-24',
  "injuryRecordID"
FROM t_injury_record
WHERE "athleteID" = 53 AND title = 'Entorse Tornozelo';
