const fs = require('fs');

const path = require('path');

const CAMINHO_REGISTROS = path.join(__dirname, '..', 'Json', 'registros.json');

const garantirArquivoRegistros = () => {
  if (!fs.existsSync(CAMINHO_REGISTROS)) {
    fs.writeFileSync(CAMINHO_REGISTROS, '[]\n');
  }
};

const normalizarNumeroInteiro = (valor, padrao = 0) => (
  typeof valor === 'number' && Number.isInteger(valor) ? valor : padrao
);

const normalizarMoedaBigInt = (valor, padrao = 0n) => {
  if (typeof valor === 'bigint') return valor;

  if (typeof valor === 'number') {
    if (!Number.isFinite(valor) || !Number.isInteger(valor)) return padrao;
    return BigInt(Math.trunc(valor));
  }

  if (typeof valor === 'string') {
    const valorLimpo = valor.trim();
    if (!valorLimpo) return padrao;

    try {
      return BigInt(valorLimpo);
    } catch {
      const numero = Number(valorLimpo);
      if (Number.isFinite(numero) && Number.isInteger(numero)) {
        return BigInt(Math.trunc(numero));
      }
      return padrao;
    }
  }

  return padrao;
};

const serializarRegistro = (item) => ({
  id: item.id,
  nome: item.nome,
  nivel: item.nivel,
  xp: item.xp,
  rxp: item.rxp,
  dinheiro: item.dinheiro.toString(),
  rep: item.rep,
  poupanca: item.poupanca.toString()
});

const serializarRegistros = (lista) => lista.map((item) => serializarRegistro(item));

const salvarRegistros = (registros) => {
  const registrosSerializados = serializarRegistros(registros);
  fs.writeFileSync(CAMINHO_REGISTROS, `${JSON.stringify(registrosSerializados, null, 2)}\n`);
};

const carregarRegistros = () => {
  garantirArquivoRegistros();
  let bruto = [];
  try {
    const conteudo = fs.readFileSync(CAMINHO_REGISTROS, 'utf8').replace(/^\uFEFF/, '').trim();
    bruto = conteudo ? JSON.parse(conteudo) : [];
  } catch {
    salvarRegistros([]);
    return [];
  }
  if (!Array.isArray(bruto)) {
    salvarRegistros([]);
    return [];
  }
  const registrosNormalizados = bruto.filter((item) => item && typeof item === 'object').map((item) => ({
    id: typeof item.id === 'string' ? item.id : '',
    nome: typeof item.nome === 'string' ? item.nome : '',
    nivel: normalizarNumeroInteiro(item.nivel, 1),
    xp: normalizarNumeroInteiro(item.xp, 1),
    rxp: normalizarNumeroInteiro(item.rxp, 0),
    dinheiro: normalizarMoedaBigInt(item.dinheiro, 0n),
    rep: normalizarNumeroInteiro(item.rep, 0),
    poupanca: normalizarMoedaBigInt(item.poupanca, 0n)
  })).filter((item) => item.id);

  const registrosNormalizadosSerializados = serializarRegistros(registrosNormalizados);
  if (JSON.stringify(bruto) !== JSON.stringify(registrosNormalizadosSerializados)) {
    salvarRegistros(registrosNormalizados);
  }
  return registrosNormalizados;
};

const registros = carregarRegistros();

const encontrarIndicePorId = (idUsuario) => registros.findIndex((item) => item.id === idUsuario);

const possuiRegistro = (remetente) => encontrarIndicePorId(remetente) !== -1;

const possuiRegistroUsuario = (usuario) => encontrarIndicePorId(usuario) !== -1;

const adicionarRegistro = (remetente, nome) => {
  const novoRegistro = {
    id: remetente,
    nome: nome,
    nivel: 1,
    xp: 1,
    rxp: 0,
    dinheiro: 50n,
    rep: 0,
    poupanca: 0n
  };
  registros.push(novoRegistro);
  salvarRegistros(registros);
};

const normalizarValorMoeda = (valor) => normalizarMoedaBigInt(valor, 0n);

const removerMoedas = (remetente, valor) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return;
  registros[indice].dinheiro -= normalizarValorMoeda(valor);
  salvarRegistros(registros);
};

const adicionarMoedas = (remetente, valor) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return;
  registros[indice].dinheiro += normalizarValorMoeda(valor);
  salvarRegistros(registros);
};

const moedasDoRemetente = (remetente) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return undefined;
  return registros[indice].dinheiro;
};

const poupancaDoRemetente = (remetente) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return undefined;
  return registros[indice].poupanca || 0n;
};

const adicionarPoupanca = (remetente, valor) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return;
  if (registros[indice].poupanca === undefined) {
    registros[indice].poupanca = 0n;
  }
  registros[indice].poupanca += normalizarValorMoeda(valor);
  salvarRegistros(registros);
};

const removerPoupanca = (remetente, valor) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return;
  if (registros[indice].poupanca === undefined) {
    registros[indice].poupanca = 0n;
  }
  registros[indice].poupanca -= normalizarValorMoeda(valor);
  salvarRegistros(registros);
};

const saldoPoupancaDoRemetente = (remetente) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return undefined;
  return registros[indice].poupanca || 0n;
};

const removerMoedasUsuario = (usuario, valor) => {
  const indice = encontrarIndicePorId(usuario);
  if (indice === -1) return;
  registros[indice].dinheiro -= normalizarValorMoeda(valor);
  salvarRegistros(registros);
};

const adicionarMoedasUsuario = (usuario, valor) => {
  const indice = encontrarIndicePorId(usuario);
  if (indice === -1) return;
  registros[indice].dinheiro += normalizarValorMoeda(valor);
  salvarRegistros(registros);
};

const moedasDoUsuario = (usuario) => {
  const indice = encontrarIndicePorId(usuario);
  if (indice === -1) return undefined;
  return registros[indice].dinheiro;
};

const adicionarNivel = (remetente, valor) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return;
  registros[indice].nivel += valor;
  salvarRegistros(registros);
};

const adicionarXp = (remetente, valor) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return;
  registros[indice].xp += valor;
  salvarRegistros(registros);
};

const nivelDoRemetente = (remetente) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return undefined;
  return registros[indice].nivel;
};

const xpDoRemetente = (remetente) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return undefined;
  return registros[indice].xp;
};

const adicionarRequisitoXp = (remetente, valor) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return;
  registros[indice].rxp += valor;
  salvarRegistros(registros);
};

const requisitoXp = (remetente) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return undefined;
  return registros[indice].rxp;
};

const adicionarReputacao = (usuario, valor) => {
  if (typeof usuario !== 'string') return;
  const usuarioNormalizado = usuario.trim();
  const indice = encontrarIndicePorId(usuarioNormalizado);
  if (indice === -1) return;
  registros[indice].rep += valor;
  salvarRegistros(registros);
};

const removerReputacao = (usuario, valor) => {
  if (typeof usuario !== 'string') return;
  const usuarioNormalizado = usuario.trim();
  const indice = encontrarIndicePorId(usuarioNormalizado);
  if (indice === -1) return;
  registros[indice].rep -= valor;
  salvarRegistros(registros);
};

const reputacaoDoUsuario = (remetente) => {
  const indice = encontrarIndicePorId(remetente);
  if (indice === -1) return undefined;
  return registros[indice].rep;
};

module.exports = {
  moedasDoRemetente: moedasDoRemetente,
  poupancaDoRemetente: poupancaDoRemetente,
  adicionarMoedas: adicionarMoedas,
  removerMoedas: removerMoedas,
  adicionarRegistro: adicionarRegistro,
  possuiRegistro: possuiRegistro,
  adicionarNivel: adicionarNivel,
  adicionarXp: adicionarXp,
  nivelDoRemetente: nivelDoRemetente,
  xpDoRemetente: xpDoRemetente,
  possuiRegistroUsuario: possuiRegistroUsuario,
  adicionarMoedasUsuario: adicionarMoedasUsuario,
  removerMoedasUsuario: removerMoedasUsuario,
  moedasDoUsuario: moedasDoUsuario,
  requisitoXp: requisitoXp,
  adicionarRequisitoXp: adicionarRequisitoXp,
  adicionarReputacao: adicionarReputacao,
  removerReputacao: removerReputacao,
  reputacaoDoUsuario: reputacaoDoUsuario,
  adicionarPoupanca: adicionarPoupanca,
  removerPoupanca: removerPoupanca,
  saldoPoupancaDoRemetente: saldoPoupancaDoRemetente
};
