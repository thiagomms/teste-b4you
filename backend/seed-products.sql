-- Insere dados de teste na tabela products
USE testcrud;

-- Limpa a tabela antes de inserir
TRUNCATE TABLE products;

-- Insere produtos de exemplo
INSERT INTO products (name, description, price, category, stock, active) VALUES
('Notebook Dell Inspiron', 'Notebook com processador Intel Core i5, 8GB RAM, 256GB SSD', 3599.90, 'Eletrônicos', 15, 1),
('Mouse Logitech MX Master', 'Mouse sem fio ergonômico com múltiplas conexões', 399.90, 'Periféricos', 50, 1),
('Teclado Mecânico Razer', 'Teclado mecânico RGB com switches Cherry MX', 699.90, 'Periféricos', 30, 1),
('Monitor LG 27"', 'Monitor IPS Full HD com bordas ultrafinas', 1299.90, 'Monitores', 20, 1),
('Headset HyperX Cloud', 'Headset gamer com microfone removível', 299.90, 'Áudio', 40, 1),
('Webcam Logitech C920', 'Webcam Full HD 1080p com correção automática de luz', 449.90, 'Periféricos', 25, 1),
('SSD Kingston 1TB', 'SSD NVMe com velocidade de leitura até 3500MB/s', 599.90, 'Armazenamento', 60, 1),
('Cadeira Gamer', 'Cadeira ergonômica com apoio lombar ajustável', 1199.90, 'Móveis', 10, 1),
('Hub USB-C 7 em 1', 'Hub com HDMI, USB 3.0, SD Card e Ethernet', 249.90, 'Acessórios', 45, 1),
('Fonte 650W Corsair', 'Fonte de alimentação 80 Plus Gold modular', 549.90, 'Componentes', 35, 1);

-- Verifica se os dados foram inseridos
SELECT COUNT(*) as total FROM products;
SELECT * FROM products LIMIT 5; 