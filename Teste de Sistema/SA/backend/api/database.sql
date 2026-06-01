CREATE DATABASE IF NOT EXISTS teste;
USE teste;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20)
);


CREATE TABLE motos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    cor VARCHAR(30),
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    quilometragem INT DEFAULT 0,
    UNIQUE KEY marca_modelo_unique (marca, modelo)
);

INSERT INTO usuarios (nome, email, senha, telefone) VALUES
('Administrador', 'admin@motoprime.com', '123456', '11999999999')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO motos (marca, modelo, ano, cor, preco, descricao, quilometragem) VALUES
('Honda', 'CB 500F', 2025, 'Vermelha', 39900.00, 'Moto street pronta para entrega.', 0),
('Yamaha', 'MT-03', 2024, 'Cinza', 32990.00, 'Naked seminova em excelente estado.', 1800),
('BMW', 'G 310 GS', 2025, 'Azul', 42990.00, 'Adventure compacta com baixa quilometragem.', 0),
('Kawasaki', 'Ninja 400', 2023, 'Verde', 36900.00, 'Sport usada com revisoes em dia.', 5200)
ON DUPLICATE KEY UPDATE preco = VALUES(preco), quilometragem = VALUES(quilometragem);
