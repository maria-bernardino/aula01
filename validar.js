const validarCorpoUsuario = (usuario) => {
  const { nome, email, senha } = usuario;

  if (!nome) {
    return "Nome é obrigatorio";
  }

  if (!email) {
    return "Email é obrigatorio";
  }

  if (!senha) {
    return "Senha é obrigatorio";
  }
}

const validarCorpoTransacao = (transacao) => {
  const { tipo, descricao, valor, data, categoria_id } = transacao;

  if (!tipo || !descricao || !valor || !data || !categoria_id) {
    return "Todos os campos obrigatórios devem ser informados.";
  }
}

const validarTipo = (tipoValido) => {
  const { tipo } = tipoValido;

  if (tipo !== 'entrada' && tipo !== 'saida') {
    return "Por favor informe se o tipo correto";
  }
}

module.exports = { validarCorpoUsuario, validarCorpoTransacao, validarTipo }
