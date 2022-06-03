const rotas = require('express')();
const { cadastrarUsuario, detalharUsuario, atualizarUsuario, listarCategoria } = require('./controladores/usuarios');
const { login } = require('./controladores/login');
const { listarTransacoes, detalharTransacoes, cadastrarTransacao, atualizarTransacao, deletarTransacao, extrato } = require('./controladores/transacoes');

const verificarLogin = require('./intermediarios/verificar_login');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarLogin);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);
rotas.get('/categoria', listarCategoria);
rotas.get('/transacao', listarTransacoes);
rotas.post('/transacao', cadastrarTransacao);
rotas.get('/transacao/extrato', extrato);
rotas.get('/transacoes/:id', detalharTransacoes);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', deletarTransacao);


module.exports = rotas;
