const fs = require('fs');

const path = require('path');

const CAMINHO_JSON_MINERACAO = path.join(__dirname, '..', 'Json', 'mineracao.json');

const CAMINHO_JSON_CASSINO = path.join(__dirname, '..', 'Json', 'casino.json');

const CAMINHO_JSON_PESCA = path.join(__dirname, '..', 'Json', 'pescar.json');

const CAMINHO_JSON_CACA_NIQUEIS = path.join(__dirname, '..', 'Json', 'cacaniqueis.json');

const CAMINHO_JSON_DIARIO = path.join(__dirname, '..', 'Json', 'diario.json');

const CAMINHO_JSON_ROLETA = path.join(__dirname, '..', 'Json', 'roleta.json');

const CAMINHO_JSON_EVE = path.join(__dirname, '..', 'Json', 'eve.json');

const CAMINHO_JSON_EMOJI = path.join(__dirname, '..', 'Json', 'emoji.json');

const CAMINHO_JSON_ATTP = path.join(__dirname, '..', 'Json', 'attp.json');

const garantirArquivoArray = caminho => {
    if (!fs.existsSync(caminho)) {
        fs.writeFileSync(caminho, '[]\n');
    }
};

const salvarArrayJson = (caminho, dados) => {
    fs.writeFileSync(caminho, `${JSON.stringify(dados, null, 2)}\n`);
};

const lerArrayJson = caminho => {
    try {
        garantirArquivoArray(caminho);
        const conteudo = fs.readFileSync(caminho, 'utf8');
        const dados = conteudo.trim() ? JSON.parse(conteudo) : [];
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
};

const jogoMineracao = lerArrayJson(CAMINHO_JSON_MINERACAO);

const jogoCassino = lerArrayJson(CAMINHO_JSON_CASSINO);

const jogoPesca = lerArrayJson(CAMINHO_JSON_PESCA);

const jogoCacaNiqueis = lerArrayJson(CAMINHO_JSON_CACA_NIQUEIS);

const jogoDiario = lerArrayJson(CAMINHO_JSON_DIARIO);

const jogoRoleta = lerArrayJson(CAMINHO_JSON_ROLETA);

const jogoEve = lerArrayJson(CAMINHO_JSON_EVE);

const jogoEmoji = lerArrayJson(CAMINHO_JSON_EMOJI);

const jogoAttp = lerArrayJson(CAMINHO_JSON_ATTP);

const criarRegistroTempo = (remetente, tempoMs) => ({
    user: remetente,
    time: Date.now() + tempoMs
});

const adicionarDiario = (remetente, tempoMs) => {
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoDiario.push(registro);
    salvarArrayJson(CAMINHO_JSON_DIARIO, jogoDiario);
};

const adicionarMineracao = (remetente, tempoMs) => {
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoMineracao.push(registro);
    salvarArrayJson(CAMINHO_JSON_MINERACAO, jogoMineracao);
};

const adicionarRoleta = (remetente, tempoMs) => {
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoRoleta.push(registro);
    salvarArrayJson(CAMINHO_JSON_ROLETA, jogoRoleta);
};

const adicionarEve = (remetente, tempoMs) => {
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoEve.push(registro);
    salvarArrayJson(CAMINHO_JSON_EVE, jogoEve);
};

const adicionarEmoji = (remetente, tempoMs) => {
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoEmoji.push(registro);
    salvarArrayJson(CAMINHO_JSON_EMOJI, jogoEmoji);
};

const adicionarAttp = (remetente, tempoMs) => {
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoAttp.push(registro);
    salvarArrayJson(CAMINHO_JSON_ATTP, jogoAttp);
};

const adicionarCassino = (remetente, tempoMs) => {
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoCassino.push(registro);
    salvarArrayJson(CAMINHO_JSON_CASSINO, jogoCassino);
};

const adicionarPesca = (remetente, tempoMs) => {
    if (!remetente || typeof tempoMs !== 'number') return;
    const registro = criarRegistroTempo(remetente, tempoMs);
    jogoPesca.push(registro);
    salvarArrayJson(CAMINHO_JSON_PESCA, jogoPesca);
};

const adicionarCooldownCacaNiqueis = (remetente, tempoMs) => {
    const indice = jogoCacaNiqueis.findIndex(item => item.user === remetente);
    const novoTempo = Date.now() + tempoMs;
    if (indice !== -1) {
        jogoCacaNiqueis[indice].time = novoTempo;
    } else {
        jogoCacaNiqueis.push({
            user: remetente,
            time: novoTempo
        });
    }
    salvarArrayJson(CAMINHO_JSON_CACA_NIQUEIS, jogoCacaNiqueis);
};

const verificarCooldownCacaNiqueis = remetente => {
    const usuario = jogoCacaNiqueis.find(item => item.user === remetente);
    if (!usuario) return false;
    return usuario.time > Date.now();
};

const tempoCooldownCacaNiqueis = remetente => {
    const dado = jogoCacaNiqueis.find(item => item.user === remetente);
    return dado ? dado.time : 0;
};

const verificaEntrada = (lista, remetente) => lista.some(item => item.user === remetente);

const verificarDiario = remetente => verificaEntrada(jogoDiario, remetente);

const verificarMineracao = remetente => verificaEntrada(jogoMineracao, remetente);

const verificarRoleta = remetente => verificaEntrada(jogoRoleta, remetente);

const verificarEve = remetente => verificaEntrada(jogoEve, remetente);

const verificarPesca = remetente => verificaEntrada(jogoPesca, remetente);

const verificarEmoji = remetente => verificaEntrada(jogoEmoji, remetente);

const verificarAttp = remetente => verificaEntrada(jogoAttp, remetente);

const verificarCassino = remetente => verificaEntrada(jogoCassino, remetente);

const obterTempo = (lista, remetente) => {
    const dado = lista.find(item => item.user === remetente);
    return dado ? dado.time : undefined;
};

const tempoDiario = remetente => obterTempo(jogoDiario, remetente);

const tempoPesca = remetente => {
    const dado = jogoPesca.find(item => item.user === remetente);
    return dado ? dado.time : 0;
};

const tempoMineracao = remetente => obterTempo(jogoMineracao, remetente);

const tempoRoleta = remetente => obterTempo(jogoRoleta, remetente);

const tempoEve = remetente => obterTempo(jogoEve, remetente);

const tempoEmoji = remetente => obterTempo(jogoEmoji, remetente);

const tempoAttp = remetente => obterTempo(jogoAttp, remetente);

const tempoCassino = remetente => obterTempo(jogoCassino, remetente);

const iniciarLimpezaExpirada = (lista, caminho, intervaloMs = 60 * 1e3) => {
    setInterval(() => {
        const agora = Date.now();
        const ativos = lista.filter(item => agora < item.time);
        if (ativos.length !== lista.length) {
            lista.length = 0;
            lista.push(...ativos);
            salvarArrayJson(caminho, lista);
        }
    }, intervaloMs);
};

const limparExpiradosRoleta = () => iniciarLimpezaExpirada(jogoRoleta, CAMINHO_JSON_ROLETA);

const limparExpiradosPesca = () => iniciarLimpezaExpirada(jogoPesca, CAMINHO_JSON_PESCA);

const limparExpiradosEve = () => iniciarLimpezaExpirada(jogoEve, CAMINHO_JSON_EVE);

const limparExpiradosDiario = () => iniciarLimpezaExpirada(jogoDiario, CAMINHO_JSON_DIARIO);

const limparExpiradosEmoji = () => iniciarLimpezaExpirada(jogoEmoji, CAMINHO_JSON_EMOJI);

const limparExpiradosAttp = () => iniciarLimpezaExpirada(jogoAttp, CAMINHO_JSON_ATTP);

const limparExpiradosMineracao = () => iniciarLimpezaExpirada(jogoMineracao, CAMINHO_JSON_MINERACAO);

const limparExpiradosCassino = () => iniciarLimpezaExpirada(jogoCassino, CAMINHO_JSON_CASSINO);

module.exports = {
    verificarCassino: verificarCassino,
    verificarAttp: verificarAttp,
    verificarEmoji: verificarEmoji,
    verificarEve: verificarEve,
    tempoCooldownCacaNiqueis: tempoCooldownCacaNiqueis,
    adicionarCooldownCacaNiqueis: adicionarCooldownCacaNiqueis,
    verificarCooldownCacaNiqueis: verificarCooldownCacaNiqueis,
    verificarRoleta: verificarRoleta,
    verificarMineracao: verificarMineracao,
    adicionarCassino: adicionarCassino,
    adicionarAttp: adicionarAttp,
    adicionarEmoji: adicionarEmoji,
    adicionarEve: adicionarEve,
    adicionarRoleta: adicionarRoleta,
    adicionarMineracao: adicionarMineracao,
    limparExpiradosCassino: limparExpiradosCassino,
    limparExpiradosMineracao: limparExpiradosMineracao,
    limparExpiradosAttp: limparExpiradosAttp,
    limparExpiradosEmoji: limparExpiradosEmoji,
    limparExpiradosEve: limparExpiradosEve,
    limparExpiradosRoleta: limparExpiradosRoleta,
    tempoAttp: tempoAttp,
    tempoEmoji: tempoEmoji,
    tempoEve: tempoEve,
    tempoRoleta: tempoRoleta,
    tempoMineracao: tempoMineracao,
    tempoCassino: tempoCassino,
    limparExpiradosDiario: limparExpiradosDiario,
    CAMINHO_JSON_DIARIO: CAMINHO_JSON_DIARIO,
    adicionarDiario: adicionarDiario,
    tempoDiario: tempoDiario,
    verificarDiario: verificarDiario,
    limparExpiradosPesca: limparExpiradosPesca,
    verificarPesca: verificarPesca,
    adicionarPesca: adicionarPesca,
    tempoPesca: tempoPesca
};