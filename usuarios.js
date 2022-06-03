const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const { validarCorpoUsuario } = require('../validacoes/validar');

const cadastrarUsuario = async (request, response) => {
  const { nome, email, senha } = request.body;
  const erro = validarCorpoUsuario(request.body);

  if (erro) {
    return response.status(400).json({ "mensagem": erro });
  }

  try {
    const queryVerificarEmail = 'SELECT * FROM usuarios WHERE email = $1';
    const quantidadeUsuarios = await conexao.query(queryVerificarEmail, [email]);

    if (quantidadeUsuarios.rowCount > 0) {
      return response.status(400).json('O e-mail informado já possui cadastro');
    }

    const senhaCryptografada = await bcrypt.hash(senha, 10);
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
    const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCryptografada]);

    if (usuarioCadastrado.rowCount === 0) {
      return response.status(400).json("Nao foi possivel cadastrar o usuário")
    }

    return response.status(201).json("Requisição bem sucedida e algo foi criado")

  } catch (error) {
    return response.status(400).json(error.message);
  }

}

const detalharUsuario = async (request, response) => {

  try {
    const perfilDoUsuario = 'SELECT * FROM usuarios';
    const { rows } = await conexao.query(perfilDoUsuario)
    const perfil = rows[0];
    const { senha: senhaUsuario, ...dadosDoPerfil } = perfil;

    return response.json({ perfil: dadosDoPerfil });
  } catch (error) {
    return response.status(500).json(error)
  }
}

const atualizarUsuario = async (request, response) => {
  const { nome, email, senha } = request.body;
  const erro = validarCorpoUsuario(request.body);

  if (erro) {
    return response.status(400).json({ "mensagem": erro });
  }

  try {
    const queryVerificarEmail = 'SELECT * FROM usuarios WHERE email = $1';
    const { rowCount: quantidadeUsuarios } = await conexao.query(queryVerificarEmail, [email]);

    if (quantidadeUsuarios > 0) {
      return response.status(400).json('O e-mail informado já possui cadastro');
    }

    const senhaCryptografada = await bcrypt.hash(senha, 10);
    const query = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3';
    const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCryptografada]);

    if (usuarioCadastrado.rowCount === 0) {
      return response.status(400).json("Nao foi possivel cadastrar o usuário")
    }

    return response.status(201).json();

  } catch (error) {
    return response.status(400).json(error.message);
  }

}

const listarCategoria = async (request, response) => {
  try {
    const categoria = await conexao.query('SELECT * FROM categorias');

    return response.status(200).json(categoria.rows)

  } catch (error) {
    return response.status(404).json(error.message)
  }

}

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  atualizarUsuario,
  listarCategoria
}
