CREATE DATABASE estoque_limpeza;

USE estoque_limpeza;

CREATE TABLE produtos(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR (255) NOT NULL,
    marca VARCHAR (100) NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    estoque_minimo INT NOT NULL DEFAULT 0,
    estoque_maximo INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacoes(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
produto_id INT NOT NULL,
tipo ENUM('Entrada', 'Saida') NOT NULL,
quantidade INT NOT NULL,
data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_movimentacoes_produtos
	FOREIGN KEY (produto_id) REFERENCES produtos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

INSERT INTO produtos
(categoria, marca, valor_unitario, estoque_minimo, estoque_maximo)
VALUES
('Detergente', 'Ypê', 15.00, 1, 10),
('Desinfetante', 'Sol', 30.90, 2, 20),
('Desengordurante', 'Cif', 50.00, 3, 30);


INSERT INTO movimentacoes
(produto_id, tipo, quantidade, data_movimentacao)
VALUES
(1, 'ENTRADA', 8, '2026-01-03 09:00:00'),
(1, 'SAIDA', 3, '2026-01-10 15:10:00'),
(1, 'SAIDA', 2, '2026-01-15 11:30:00'),
(2, 'ENTRADA', 12, '2026-01-04 10:00:00'),
(2, 'SAIDA', 8, '2026-01-17 16:00:00'),
(3, 'ENTRADA', 27, '2026-01-05 08:30:00'),
(3, 'SAIDA', 19, '2026-01-20 13:15:00'),
(1, 'ENTRADA', 2, '2026-01-22 09:00:00'),
(2, 'ENTRADA', 9, '2026-01-27 09:00:00'),
(3, 'ENTRADA', 10, '2026-01-28 09:00:00');


CREATE VIEW vw_movimentacoes AS 
SELECT p.id AS produto_id,
p.categoria,
p.marca,
p.valor_unitario,
m.data_movimentacao,
m.tipo,
SUM(
CASE
	WHEN m.tipo = 'Entrada' THEN m.quantidade
	WHEN m.tipo = 'Saida' THEN -m.quantidade
    ELSE 0
END) AS saldo_estoque,
SUM(
CASE
	WHEN m.tipo = 'Entrada' THEN m.quantidade
	WHEN m.tipo = 'Saida' THEN -m.quantidade
    ELSE 0
END) * p.valor_unitario AS valor_total


FROM produtos p 
LEFT JOIN movimentacoes m ON m.produto_id = p.id
GROUP BY p.id,
m.tipo,
m.quantidade,
m.data_movimentacao,
p.categoria,
p.marca,
p.valor_unitario;


SELECT * FROM vw_movimentacoes ORDER BY data_movimentacao DESC;


CREATE VIEW vw_produtos AS 
SELECT p.id AS produto_id,
p.categoria,
p.marca,
p.valor_unitario,
SUM(
CASE
	WHEN m.tipo = 'Entrada' THEN m.quantidade
	WHEN m.tipo = 'Saida' THEN -m.quantidade
    ELSE 0
END)  AS saldo_estoque,
SUM(
CASE
	WHEN m.tipo = 'Entrada' THEN m.quantidade
	WHEN m.tipo = 'Saida' THEN -m.quantidade
    ELSE 0
END) * p.valor_unitario AS valor_total



FROM produtos p 
LEFT JOIN movimentacoes m ON m.produto_id = p.id
GROUP BY p.id,
m.tipo,
p.categoria,
p.marca,
p.valor_unitario;

SELECT * FROM vw_produtos;


CREATE VIEW vw_saida AS
SELECT p.id AS produto_id, 
p.categoria AS produtos, 
p.valor_unitario, 
m.quantidade_total_saida 
FROM produtos p 
LEFT JOIN 
( SELECT produto_id, SUM(quantidade) AS quantidade_total_saida 
FROM movimentacoes 
WHERE tipo = 'SAIDA' 
AND data_movimentacao 
GROUP BY produto_id ) 
m ON m.produto_id = p.id 
ORDER BY m.quantidade_total_saida DESC;

SELECT * FROM vw_saida;

CREATE VIEW vw_entrada AS
SELECT p.id AS produto_id, 
p.categoria AS produtos, 
p.valor_unitario, 
m.quantidade_total_entrada 
FROM produtos p 
LEFT JOIN 
( SELECT produto_id, SUM(quantidade) AS quantidade_total_entrada 
FROM movimentacoes 
WHERE tipo = 'ENTRADA' s
AND data_movimentacao 
GROUP BY produto_id ) 
m ON m.produto_id = p.id 
ORDER BY m.quantidade_total_entrada DESC;

SELECT * FROM vw_entrada;