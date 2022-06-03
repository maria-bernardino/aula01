CREATE DATABASE dindin;

CREATE TABLE usuarios (
   id SERIAL PRIMARY KEY,
   nome TEXT NOT NULL,
   email Text UNIQUE ,
   senha TEXT NOT NULL
);


CREATE TABLE categorias (
   id SERIAL PRIMARY KEY,
   descricao TEXT NOT NULL
);

CREATE TABLE transacoes (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor integer NOT NULL,
  data TIMESTAMP NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias (id),
  usuario_id INTEGER NOT NULL REFERENCES usuarios (id),
  tipo TEXT NOT NULL
);


INSERT INTO categorias (descricao)
VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');
