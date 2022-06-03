const conexao = require('../conexao');
const { validarCorpoTransacao, validarTipo } = require('../validacoes/validar');

const listarTransacoes = async (request, response) => {

  try {
    const transacao = await conexao.query('SELECT * FROM  transacoes');

    return response.status(200).json(transacao.rows)

  } catch (error) {
    return response.status(404).json(error.message)
  }
}

const cadastrarTransacao = async (request, response) => {
  const { usuario } = request;
  const { tipo, descricao, valor, data, categoria_id } = request.body;

  const erro = validarCorpoTransacao(request.body);
  const erroDeTipo = validarTipo(request.body);

  if (erro) {
    return response.status(400).json({ "mensagem": erro });
  }

  if (erroDeTipo) {
    return response.status(401).json({ "mensagem": erroDeTipo })
  }

  try {
    const buscarCategoria = 'SELECT * FROM transacoes WHERE id = $1 ';
    const consultarCategoria = await conexao.query(buscarCategoria, [categoria_id]);
    if (consultarCategoria === 0) {
      return response.status(404).json({ "mensagem": "Categoria não existe!" });
    }

    const queryTransacao = 'INSERT INTO transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) VALUES ($1, $2, $3, $4, $5, $6)';

    const novaTranscao = await conexao.query(queryTransacao, [tipo, descricao, valor, data, categoria_id, usuario.id]);


    if (novaTranscao.rowCount === 0) {
      return response.status(500).json({ "mensagem": "Ocorreu um erro ao persistir o usuário. Favor tentar novamente." });
    }

    const transacoesDoUsuario = 'SELECT * FROM transacoes';
    const { rows } = await conexao.query(transacoesDoUsuario)
    const transacao = rows[0];
    const { senha: senhaUsuario, ...dadosDaTransacao } = transacao;

    return response.json({ transacao: dadosDaTransacao });

  } catch (error) {
    return response.status(400).json(error.message);
  }
}

const detalharTransacoes = async (request, response) => {
  const { id } = request.params;
  const { usuario } = request;

  try {
    const detalhesDasTransacoes = await conexao.query(
      `select tr.id, tr.descricao, tr.valor, tr.data, tr.tipo, tr.usuario_id, tr.categoria_id, cat.descricao as nomeCategoria
      from transacoes tr
      left join categorias cat on cat.id = tr.categoria_id
      where tr.usuario_id = $1 and tr.id = $2`, [usuario.id, id]

    );

    if (detalharTransacoes.rowCountwCount === 0) {
      return response.status(400).json({ "mensagem": "Transação não encontrada." });
    }

    return response.status(200).json(detalhesDasTransacoes.rows);

  } catch (error) {
    return response.status(404).json(error.message)
  }
}

const atualizarTransacao = async (request, response) => {
  const { usuario } = request;
  const { id } = request.params;
  const { tipo, descricao, valor, data, categoria_id } = request.body;

  const erro = validarCorpoTransacao(request.body);
  const erroDeTipo = validarTipo(request.body);

  if (erro) {
    return response.status(400).json({ "mensagem": erro });
  }

  if (erroDeTipo) {
    return response.status(401).json({ "mensagem": erroDeTipo })
  }

  try {
    const selecionarTransacoes = 'SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2'
    const verificarTransacao = await conexao.query(selecionarTransacoes, [id, usuario.id]);

    if (verificarTransacao.rowCount === 0) {
      return response.status(404).json({ "mensagem": "Transação nao encontrada !" })
    }

    const selecionarCategorias = "SELECT * FROM categorias WHERE id = $1"
    const verificarCategoria = await conexao.query(selecionarCategorias, [categoria_id]);

    if (verificarCategoria.rowCount === 0) {
      return response.status(404).json({ "mensagem": "Categoria nao encontrada !" })
    }

    const alterarTransacao = `UPDATE transacoes SET  tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5`
    const transacaoAlterada = await conexao.query(alterarTransacao, [tipo, descricao, valor, data, categoria_id]);

    if (transacaoAlterada.rowCount === 0) {
      return response.status(404).json({ "mensagem": "Não foi possivel atualizar transação!" })
    }

    return response.status(200).json();

  } catch (error) {
    return response.status(401).json(error.message)
  }
}

const deletarTransacao = async (request, response) => {
  const { usuario } = request;
  const { id } = request.params;

  try {
    const listaDeTransacoes = 'SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2'
    const existeTransacao = await conexao.query(listaDeTransacoes, [id, usuario.id]);

    if (existeTransacao.rowCount === 0) {
      return response.status(404).json({ "mensagem": "Não foi possivel excluir transação pois ela não existe !" })
    }
    const excluirTransacao = 'DELETE FROM transacoes WHERE id = $1'
    const transacaoExcluida = await conexao.query(excluirTransacao, [id])

    if (transacaoExcluida.rowCount === 0) {
      return response.status(404).json({ "mensagem": "Não foi possivel excluir transação !" })
    }

    return response.status(200).json();

  } catch (error) {

    return response.status(500).json(error.message)
  }
}

const extrato = async (request, response) => {
  const { usuario } = request;

  try {
    const extratosSaida = 'SELECT SUM(valor) FROM transacoes WHERE usuario_id=$1 and tipo=$2';
    const extratoSaida = await conexao.query(extratosSaida, [usuario.id, 'saida']);

    if (extratoSaida.rows[0].sum === null) {
      extratoSaida.rows[0].sum = 0;
    }

    const extratosEntrada = 'SELECT SUM(valor) FROM transacoes WHERE usuario_id=$1 and tipo=$2';
    const extratoEntrada = await conexao.query(extratosEntrada, [usuario.id, 'entrada']);

    if (extratoEntrada.rows[0].sum === null) {
      extratoEntrada.rows[0].sum = 0;
    }

    return response.status(200).json({
      saida: extratoSaida.rows[0].sum,
      entrada: extratoEntrada.rows[0].sum
    });
  } catch (error) {
    return response.status(500).json({ mensagem: error.message });
  }
}

module.exports = {
  listarTransacoes,
  detalharTransacoes,
  cadastrarTransacao,
  atualizarTransacao,
  deletarTransacao,
  extrato
}
