const fs = require('fs');

const path = require('path');

const CAMINHO_REGISTROS = path.join(__dirname, '..', 'Json', 'registros.json');

const garantirArquivoRegistros = () => {
    if (!fs.existsSync(CAMINHO_REGISTROS)) {
        fs.writeFileSync(CAMINHO_REGISTROS, '[]\n');
    }
};

const salvarRegistros = registros => {
    fs.writeFileSync(CAMINHO_REGISTROS, `${JSON.stringify(registros, null, 2)}\n`);
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
    const registrosNormalizados = bruto.filter(item => item && typeof item === 'object').map(item => ({
        id: typeof item.id === 'string' ? item.id : '',
        nome: typeof item.nome === 'string' ? item.nome : '',
        nivel: typeof item.nivel === 'number' ? item.nivel : 1,
        xp: typeof item.xp === 'number' ? item.xp : 1,
        rxp: typeof item.rxp === 'number' ? item.rxp : 0,
        dinheiro: typeof item.dinheiro === 'number' ? item.dinheiro : 0,
        rep: typeof item.rep === 'number' ? item.rep : 0,
        poupanca: typeof item.poupanca === 'number' ? item.poupanca : 0
    })).filter(item => item.id);
    if (JSON.stringify(bruto) !== JSON.stringify(registrosNormalizados)) {
        salvarRegistros(registrosNormalizados);
    }
    return registrosNormalizados;
};

const registros = carregarRegistros();

const encontrarIndicePorId = idUsuario => registros.findIndex(item => item.id === idUsuario);

const possuiRegistro = remetente => encontrarIndicePorId(remetente) !== -1;

const possuiRegistroUsuario = usuario => encontrarIndicePorId(usuario) !== -1;

const adicionarRegistro = (remetente, nome) => {
    const novoRegistro = {
        id: remetente,
        nome: nome,
        nivel: 1,
        xp: 1,
        rxp: 0,
        dinheiro: 50,
        rep: 0,
        poupanca: 0
    };
    registros.push(novoRegistro);
    salvarRegistros(registros);
};

const removerMoedas = (remetente, valor) => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return;
    registros[indice].dinheiro -= valor;
    salvarRegistros(registros);
};

const adicionarMoedas = (remetente, valor) => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return;
    registros[indice].dinheiro += valor;
    salvarRegistros(registros);
};

const moedasDoRemetente = remetente => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return undefined;
    return registros[indice].dinheiro;
};

const poupancaDoRemetente = remetente => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return undefined;
    return registros[indice].poupanca || 0;
};

const adicionarPoupanca = (remetente, valor) => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return;
    if (registros[indice].poupanca === undefined) {
        registros[indice].poupanca = 0;
    }
    registros[indice].poupanca += valor;
    salvarRegistros(registros);
};

const removerPoupanca = (remetente, valor) => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return;
    if (registros[indice].poupanca === undefined) {
        registros[indice].poupanca = 0;
    }
    registros[indice].poupanca -= valor;
    salvarRegistros(registros);
};

const saldoPoupancaDoRemetente = remetente => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return undefined;
    return registros[indice].poupanca || 0;
};

const removerMoedasUsuario = (usuario, valor) => {
    const indice = encontrarIndicePorId(usuario);
    if (indice === -1) return;
    registros[indice].dinheiro -= valor;
    salvarRegistros(registros);
};

const adicionarMoedasUsuario = (usuario, valor) => {
    const indice = encontrarIndicePorId(usuario);
    if (indice === -1) return;
    registros[indice].dinheiro += valor;
    salvarRegistros(registros);
};

const moedasDoUsuario = usuario => {
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

const nivelDoRemetente = remetente => {
    const indice = encontrarIndicePorId(remetente);
    if (indice === -1) return undefined;
    return registros[indice].nivel;
};

const xpDoRemetente = remetente => {
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

const requisitoXp = remetente => {
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

const reputacaoDoUsuario = remetente => {
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