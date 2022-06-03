const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require ( 'dotenv' ) . config ( );

const login = async (request, response) => {
  const { email, senha } = request.body;

  if (!email || !senha) {
    return response.status(400).json("E-mail ou senha inválido!")
  }

  try {
    const queryVerificarEmail = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows, rowCount } = await conexao.query(queryVerificarEmail, [email]);

    if (rowCount === 0) {
      return response.status(404).json("Usuário não encontrado.")
    }

    const usuario = rows[0];

    const verificarSenha = await bcrypt.compare(senha, usuario.senha);

    if (!verificarSenha) {
      return response.status(400).json("E-mail ou senha inválido")
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT, { expiresIn: '1d' });

    const { senha: senhaUsuario, ...dadosUsuario } = usuario;

    return response.status(200).json({
      usuario: dadosUsuario, token
    });

  } catch (error) {
    return response.status(404).json(error.message)
  }
}

module.exports = {
  login
}
