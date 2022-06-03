const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const verificarLogin = async (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    response.status(401).json(
      { "mensagem": "O usuário precisa esta logado e com token valido" }
    )
  }

  try {
    const token = authorization.replace('Bearer', '').trim();

    const { id } = await jwt.verify(token, process.env.JWT);

    const usuario = 'SELECT * FROM usuarios WHERE id = $1'
    const { rowCount, rows } = await conexao.query(usuario, [id]);

    if (rowCount === 0) {
      return response.status(404).json({ "mensagem": "Usuario não encontrado!" });
    }

    const { senha: senhaUsuario, ...dadosUsuario } = rows[0];
    request.usuario = dadosUsuario;

    next();

  } catch (error) {
    return response.status(500).json(error.message);
  }
}

module.exports = verificarLogin
