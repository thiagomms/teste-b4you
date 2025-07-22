-- Verifica se a tabela de migrações existe e quais foram executadas
USE crudb4you;

-- Verifica migrações executadas
SELECT * FROM SequelizeMeta;

-- Se não existir a tabela acima, a migração ainda não foi executada 