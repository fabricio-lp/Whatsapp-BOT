const {
  default: makeWASocket,
  DisconnectReason,
  JulsBotIncConnect,
  getAggregateVotesInPollMessage,
  delay,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  jidDecode,
  proto
} = require("baileys");
const fs = require("fs");
const path = require("path");
const { Boom } = require("@hapi/boom");
const NodeCache = require("node-cache");
const readline = require("readline");
const PhoneNumber = require("awesome-phonenumber");
const cfonts = require("cfonts");
const fetch = require("node-fetch");
const pino = require("pino");
const util = require("util");
const speed = require("performance-now");
const mimetype = require("mime-types");
const { exec, spawn, execSync } = require("child_process");
const crypto = require("crypto");
let phoneNumber = "5199999999";
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");


const chalk = require("chalk");
const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};


const banner = cfonts.render("BOT INICIANDO...", {
  font: "pallet",
  align: "center",
  gradient: ["green", "blue"]
});


const formatarTexto = (texto) => {
  if (typeof texto !== "string") return texto;

  return texto.replace(/(?<![@\d.,\/-])\d{4,}(?![.,\d\/-])/g, (match) => {
    return match.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  });
};


const lerNumero = (texto) => {
  if (typeof texto !== "string" || !texto) return texto;
  return texto.replace(/\./g, "");
};

const ZERO_BIGINT = 0n;

const paraBigIntSeguro = (valor, fallback = ZERO_BIGINT) => {
  if (typeof valor === "bigint") return valor;

  if (typeof valor === "number") {
    if (!Number.isFinite(valor) || !Number.isInteger(valor)) return fallback;
    return BigInt(Math.trunc(valor));
  }

  if (typeof valor === "string") {
    const limpo = lerNumero(valor).trim();
    if (!limpo) return fallback;

    try {
      return BigInt(limpo);
    } catch {
      const numero = Number(limpo);
      if (Number.isFinite(numero) && Number.isInteger(numero)) {
        return BigInt(Math.trunc(numero));
      }
      return fallback;
    }
  }

  return fallback;
};

const formatarMoeda = (valor) => paraBigIntSeguro(valor, ZERO_BIGINT).toString();

const randomBigIntAbaixo = (limite) => {
  const maximo = paraBigIntSeguro(limite, ZERO_BIGINT);
  if (maximo <= ZERO_BIGINT) return ZERO_BIGINT;

  const bits = maximo.toString(2).length;
  const bytes = Math.ceil(bits / 8);
  let aleatorio = ZERO_BIGINT;

  do {
    const hex = crypto.randomBytes(bytes).toString("hex") || "0";
    aleatorio = BigInt(`0x${hex}`);
  } while (aleatorio >= maximo);

  return aleatorio;
};

const calcularPercentualBigInt = (parte, total, casas = 2) => {
  const totalNormalizado = paraBigIntSeguro(total, ZERO_BIGINT);
  if (totalNormalizado <= ZERO_BIGINT) {
    return `0.${"0".repeat(casas)}`;
  }

  const fatorEscala = 10n ** BigInt(casas);
  const parteNormalizada = paraBigIntSeguro(parte, ZERO_BIGINT);
  const percentualEscalado =
  parteNormalizada * 100n * fatorEscala / totalNormalizado;
  const inteiro = percentualEscalado / fatorEscala;
  const fracao = (percentualEscalado % fatorEscala).toString().padStart(casas, "0");
  return `${inteiro}.${fracao}`;
};


const {
  fetchJson,
  getBuffer,
  fetchBuffer
} = require("./fuction/download/gets.js");

const { getExtension, getRandom } = require("./fuction/settings/fuctions.js");


const {
  sendVideoAsSticker,
  sendImageAsSticker
} = require("./fuction/sticker/rename.js");
const {
  sendVideoAsSticker2,
  sendImageAsSticker2
} = require("./fuction/sticker/rename2.js");


const {
  moedasDoRemetente,
  poupancaDoRemetente,
  adicionarMoedas,
  removerMoedas,
  adicionarRegistro,
  possuiRegistro,
  adicionarNivel,
  adicionarXp,
  nivelDoRemetente,
  xpDoRemetente,
  possuiRegistroUsuario,
  adicionarMoedasUsuario,
  removerMoedasUsuario,
  moedasDoUsuario,
  requisitoXp,
  adicionarRequisitoXp,
  adicionarReputacao,
  removerReputacao,
  reputacaoDoUsuario,
  adicionarPoupanca,
  removerPoupanca,
  saldoPoupancaDoRemetente
} = require("./settings/Grupo/Js/reg.js");


const {
  addClaim,
  checkClaim,
  timeClaim,
  expiredClaim
} = require("./Games/Js/claim.js");
const {
  verificarCassino,
  verificarAttp,
  verificarEmoji,
  verificarEve,
  adicionarCooldownCacaNiqueis,
  verificarCooldownCacaNiqueis,
  tempoCooldownCacaNiqueis,
  verificarRoleta,
  verificarMineracao,
  adicionarCassino,
  adicionarAttp,
  adicionarEmoji,
  adicionarEve,
  adicionarRoleta,
  adicionarMineracao,
  limparExpiradosCassino,
  limparExpiradosMineracao,
  limparExpiradosAttp,
  limparExpiradosEmoji,
  limparExpiradosEve,
  limparExpiradosRoleta,
  tempoAttp,
  tempoEmoji,
  tempoEve,
  tempoRoleta,
  tempoMineracao,
  tempoCassino,
  limparExpiradosDiario,
  CAMINHO_JSON_DIARIO,
  adicionarDiario,
  tempoDiario,
  verificarDiario,
  verificarPesca,
  tempoPesca,
  adicionarPesca,
  limparExpiradosPesca
} = require("./Games/Js/mineracao.js");


const Menu = require("./settings/Bot/Js/menu.js");

const CAMINHO_CHAT = "./settings/Grupo/Json/chat.json";
const CAMINHO_QUESTOES = "./Games/Json/questoes.json";
const CAMINHO_SETTINGS = "./settings/settings.json";
const CAMINHO_PATENTES = "./settings/patentes.json";

const normalizarConteudoJson = (conteudo) =>
typeof conteudo === "string" ? conteudo.replace(/^\uFEFF/, "").trim() : "";

const escreverFallbackJson = (caminho, fallback, motivo) => {
  fs.writeFileSync(caminho, JSON.stringify(fallback, null, 2));
  console.warn(
    `[WARN] ${path.basename(caminho)} inválido (${motivo}); fallback aplicado.`
  );
};

const lerJsonSeguro = (caminho, fallback, opcoes = {}) => {
  const { salvarFallback = false } = opcoes;

  try {
    if (!fs.existsSync(caminho)) {
      if (salvarFallback) {
        escreverFallbackJson(caminho, fallback, "arquivo ausente");
      }
      return fallback;
    }

    const conteudoCru = fs.readFileSync(caminho, "utf8");
    const conteudo = normalizarConteudoJson(conteudoCru);

    if (!conteudo) {
      if (salvarFallback) {
        escreverFallbackJson(caminho, fallback, "arquivo vazio");
      }
      return fallback;
    }

    return JSON.parse(conteudo);
  } catch {
    if (salvarFallback) {
      try {
        escreverFallbackJson(caminho, fallback, "JSON inválido");
      } catch (erro) {
        console.warn(
          `[WARN] Falha ao restaurar fallback de ${path.basename(caminho)}: ${erro.message}`
        );
      }
    }
    return fallback;
  }
};

const salvarJsonSeguro = (caminho, dados) => {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
};

const carregarConfiguracoes = () => {
  const configuracoes = lerJsonSeguro(
    CAMINHO_SETTINGS,
    {},
    {
      salvarFallback: true
    }
  );
  if (
  !configuracoes ||
  typeof configuracoes !== "object" ||
  Array.isArray(configuracoes))
  {
    return {};
  }
  return configuracoes;
};

const carregarQuestoes = () => {
  const questoes = lerJsonSeguro(CAMINHO_QUESTOES, [], {
    salvarFallback: true
  });
  if (!Array.isArray(questoes)) {
    salvarJsonSeguro(CAMINHO_QUESTOES, []);
    return [];
  }
  return questoes;
};

const carregarPatentes = () => {
  const patentes = lerJsonSeguro(
    CAMINHO_PATENTES,
    {},
    { salvarFallback: true }
  );
  if (!patentes || typeof patentes !== "object" || Array.isArray(patentes)) {
    salvarJsonSeguro(CAMINHO_PATENTES, {});
    return {};
  }
  return patentes;
};

const carregarAntiPrivadoLista = () => {
  const lista = lerJsonSeguro(CAMINHO_CHAT, [], { salvarFallback: true });
  if (Array.isArray(lista)) {
    return [...lista];
  }
  salvarJsonSeguro(CAMINHO_CHAT, []);
  return [];
};

const extrairNomeRegistro = (registro, fallbackNome = "") =>
registro?.nome ?? fallbackNome;

const extrairDinheiroRegistro = (registro) => {
  return paraBigIntSeguro(registro?.dinheiro, ZERO_BIGINT);
};

const normalizarRegistroEconomia = (registro, fallbackNome = "") => {
  const poupanca = paraBigIntSeguro(registro?.poupanca, ZERO_BIGINT);
  const dinheiro = extrairDinheiroRegistro(registro);

  return {
    nome: extrairNomeRegistro(registro, fallbackNome),
    dinheiro,
    poupanca,
    total: dinheiro + poupanca
  };
};



const antilink = lerJsonSeguro("./settings/Grupo/Json/antilink.json", [], {
  salvarFallback: true
});
const bngp = lerJsonSeguro("./settings/Grupo/Json/grupo.json", [], {
  salvarFallback: true
});
const antiPrivadoLista = carregarAntiPrivadoLista();
const registro = lerJsonSeguro("./settings/Grupo/Json/registros.json", [], {
  salvarFallback: true
});
const Exportion = lerJsonSeguro("./Games/Json/exportion.json", [], {
  salvarFallback: true
});
const Exportion1 = lerJsonSeguro("./Games/Json/exportion1.json", [], {
  salvarFallback: true
});
const questoes = carregarQuestoes();

const moment = require("moment-timezone");
const time = moment.tz("America/Lima").format("DD/MM HH:mm:ss");
const horap = moment().format("HH");
var timeFt = "Opa";
if (horap >= "01" && horap <= "05") {
  timeFt = "Bom dia";
} else if (horap >= "05" && horap <= "12") {
  timeFt = "Bom dia";
} else if (horap >= "12" && horap <= "18") {
  timeFt = "Boa tarde";
} else if (horap >= "18" && horap <= "23") {
  timeFt = "Boa noite";
}


var { criador, owner, Bot, JpgBot, API_KEY_NAUFRA, INVERTEXTO_API_KEY } = carregarConfiguracoes();
const prefixo = ["/"];

const pairingCode = true;
const useMobile = process.argv.includes("--mobile");

function getGroupAdmins(participants) {
  admins = [];
  for (let i of participants) {
    if (i.admin == "admin") admins.push(i.id);
    if (i.admin == "superadmin") admins.push(i.id);
  }
  return admins;
}


let lootboxInterval = null;
const lootboxFile = "./settings/lootbox.json";
const criarEstadoLootboxInicial = () => ({
  active: false,
  amount: 0,
  nextDrop: Date.now() + 4 * 60 * 60 * 1000
});


function getLootboxState() {
  if (!fs.existsSync(lootboxFile)) {

    const initial = criarEstadoLootboxInicial();
    fs.writeFileSync(lootboxFile, JSON.stringify(initial));
    return initial;
  }
  return lerJsonSeguro(lootboxFile, criarEstadoLootboxInicial(), {
    salvarFallback: true
  });
}
function saveLootboxState(data) {
  fs.writeFileSync(lootboxFile, JSON.stringify(data));
}

async function startProo() {
  console.clear();
  console.log(banner.string);


  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();


  const sock = makeWASocket({
    version,
    logger: pino({ level: "error" }),
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    syncFullHistory: false
  });


  const originalSendMessage = sock.sendMessage.bind(sock);
  sock.sendMessage = async (jid, content, options) => {
    if (content && typeof content === "object") {
      if (content.text && typeof content.text === "string") {
        content.text = formatarTexto(content.text);
      }
      if (content.caption && typeof content.caption === "string") {
        content.caption = formatarTexto(content.caption);
      }
    }
    return originalSendMessage(jid, content, options);
  };


  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const question = (text) =>
    new Promise((resolve) => rl.question(text, resolve));

    let number = await question(
      chalk.cyan(
        "📱 Digite seu número de WhatsApp com código do país (apenas números): "
      )
    );
    rl.close();
    number = number.replace(/[^0-9]/g, "");

    if (!number) {
      console.log(chalk.red("[❗] Número inválido."));
      process.exit(1);
    }

    console.log(chalk.yellow("⌛ Solicitando código de vinculação..."));
    try {
      const code = await sock.requestPairingCode(number);
      console.log(
        chalk.bgGreen.black("✅ CÓDIGO DE VINCULAÇÃO:"),
        chalk.white(code)
      );
    } catch (err) {
      console.error(
        chalk.red("[❗] Erro ao gerar código de vinculação:"),
        err.message
      );
      process.exit(1);
    }
  }


  if (lootboxInterval) clearInterval(lootboxInterval);

  lootboxInterval = setInterval(async () => {
    try {
      const lbState = getLootboxState();
      const now = Date.now();
      const targetGroup = "120363406690153385@g.us";


      if (!lbState.active && now >= lbState.nextDrop) {

        const premio = Math.floor(Math.random() * (500000 - 10000 + 1)) + 10000;

        lbState.active = true;
        lbState.amount = premio;
        saveLootboxState(lbState);

        const msgLoot = `🎁 *LOOTBOX DISPONÍVEL!* 🎁\n\n💰 Valor: *??? Bitcoins*\n🏃‍♂️ Digite */resgatar* rápido para pegar!`;
        await sock.sendMessage(targetGroup, { text: msgLoot });
        console.log(chalk.yellow("🎁 Lootbox enviada para o grupo!"));
      }
    } catch (err) {
      console.error("Erro no intervalo da Lootbox:", err);
    }
  }, 60 * 1000);


  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(
          chalk.red(
            "❌ Sessão encerrada. Apague a pasta 'session' e emparelhe novamente."
          )
        );
      } else {
        console.log(chalk.yellow("⚠️ Conexão encerrada, reconectando..."));
        startProo();
      }
    } else if (connection === "open") {
      console.log(chalk.greenBright("✅ Conectado com sucesso"));
      exec("rm -rf tmp && mkdir tmp");
    }
  });


  sock.ev.on("creds.update", saveCreds);



  sock.ev.on("group-participants.update", async (anu) => {

    try {
      const metadata = await sock.groupMetadata(anu.id);
      const participants = anu.participants;
      for (let num of participants) {
        if (!num) continue;

        if (anu.action == "add") {
          const grup = metadata.subject;
          const mem = metadata.participants.length;
          const descr = metadata.desc;
          const sol = ``;

          await sock.sendMessage(anu.id, {
            image: { url: "" },
            caption: sol,
            mentions: [num]
          });
        } else if (anu.action == "promote") {
          const teks = `@${num.split("@")[0]} Agora é um administrador`;
          await sock.sendMessage(anu.id, {
            image: { url: "" },
            caption: teks,
            mentions: [num]
          });
        }
      }
    } catch (e) {
      console.log("Error: %s", color(e, "red"));
    }
  });



  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("messages.upsert", () => {});

  sock.ev.on("messages.upsert", async (m) => {
    console.log("Mensagem recebida de:", m.messages[0]?.key?.remoteJid);
    try {
      const info = m.messages[0];
      if (!info.message) return;
      if (info.key && info.key.remoteJid == "status@broadcast") return;
      const altpdf = Object.keys(info.message);
      const type =
      altpdf[0] == "senderKeyDistributionMessage" ?
      altpdf[1] == "messageContextInfo" ?
      altpdf[2] :
      altpdf[1] :
      altpdf[0];
      const content = JSON.stringify(info.message);
      const from = info.key.remoteJid;
      var body =
      type === "conversation" ?
      info.message.conversation :
      type == "imageMessage" ?
      info.message.imageMessage.caption :
      type == "videoMessage" ?
      info.message.videoMessage.caption :
      type == "extendedTextMessage" ?
      info.message.extendedTextMessage.text :
      type == "buttonsResponseMessage" ?
      info.message.buttonsResponseMessage.selectedButtonId :
      type == "listResponseMessage" ?
      info.message.listResponseMessage.singleSelectReply.
      selectedRowId :
      type == "templateButtonReplyMessage" ?
      info.message.templateButtonReplyMessage.selectedId :
      "";

      if (!body) body = "";

      const budy =
      type === "conversation" ?
      info.message.conversation :
      type === "extendedTextMessage" ?
      info.message.extendedTextMessage.text :
      "";

      var pes =
      type === "conversation" && info.message.conversation ?
      info.message.conversation :
      type == "imageMessage" && info.message.imageMessage.caption ?
      info.message.imageMessage.caption :
      type == "videoMessage" && info.message.videoMessage.caption ?
      info.message.videoMessage.caption :
      type == "extendedTextMessage" &&
      info.message.extendedTextMessage.text ?
      info.message.extendedTextMessage.text :
      "";

      if (!pes) pes = "";

      const numerodono = [`${owner}`];

      const verificarN = async (sla) => {
        const [result] = await sock.onWhatsApp(sla);
        if (result == undefined) {
          enviar("Este usuário não existe no WhatsApp");
        } else {
          enviar(`${sla} Número existente no WhatsApp com id: ${result.jid}`);
        }
      };


      const isGroup = info.key.remoteJid.endsWith("@g.us");
      const sender = isGroup ? info.key.participant || info.participant : from;
      const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
      const groupName = isGroup ? groupMetadata.subject : "";
      const groupDesc = isGroup ? groupMetadata.desc : "";
      const groupMembers = isGroup ? groupMetadata.participants || [] : [];
      const nome = info.pushName ? info.pushName : "";
      const groupAdmins = groupMembers.filter((p) => p.admin);
      const Sadm = isGroup ? getGroupAdmins(groupAdmins) : "";
      const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(" ");
      const text = args.join(" ");
      const isCmd = body.startsWith(prefixo);


      const removeAccents = (str) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const prefixes = prefixo ?
      prefixo.map((prefix) => prefix.toLowerCase()) :
      [];
      const lowerBudy = budy.toLowerCase();
      const hasPrefix = prefixes.some((prefix) => lowerBudy.startsWith(prefix));
      const commandArgs = hasPrefix ?
      lowerBudy.
      slice(
        prefixes.find((prefix) => lowerBudy.startsWith(prefix)).length
      ).
      trim().
      split(" ") :
      lowerBudy.trim().split(" ");
      const comando = hasPrefix ? removeAccents(commandArgs[0]) : "";

      const mentions = (teks, memberr, id) => {
        id == null || id == undefined || id == false ?
        sock.sendMessage(from, { text: teks.trim(), mentions: memberr }) :
        sock.sendMessage(from, { text: teks.trim(), mentions: memberr });
      };
      const quoted = info.quoted ? info.quoted : info;
      const mime = (quoted.info || quoted).Mimetype || "";
      const sleep = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      const pushname = info.pushName ? info.pushName : "";
      const isBot = info.key.fromMe ? true : false;
      const senderNumber = sender ? sender.split("@")[0] : "";
      const BotNumber = sock.user?.id ?
      sock.user.id.split(":")[0] + "@s.whatsapp.net" :
      "";
      const isOwner = sender ? numerodono.includes(sender) : false;

      const isGroupAdmins = groupAdmins.some((admin) =>
      admin.id?.includes(sender)
      );
      const isBotGroupAdmins = esAdminFlexible(
        sock,
        groupAdmins.map((p) => p.id)
      );

      function esAdminFlexible(sock, listaDeAdmins = []) {
        if (!sock?.authState?.creds?.me?.id) return false;

        const botId = sock.authState.creds.me.id;
        const botLid = sock.authState.creds.me.lid;

        const clean = (jid) => jid?.split(":")[0];

        const botIdBase = clean(botId);
        const botLidBase = clean(botLid);

        return listaDeAdmins.some((adminJid) => {
          if (!adminJid) return false;
          const adminBase = clean(adminJid);
          return (
            adminJid === botId ||
            botLid && adminJid === botLid ||
            adminBase === botIdBase ||
            botLidBase && adminBase === botLidBase);

        });
      }

      const isUrl = (url) => {
        return url.match(
          new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
            "gi"
          )
        );
      };
      const deviceType =
      info.key.id.length > 21 ?
      "Android" :
      info.key.id.substring(0, 2) == "3A" ?
      "IPhone" :
      "WhatsApp web";
      const options = { timeZone: "America/Lima", hour12: false };
      const data = new Date().toLocaleDateString("PE", {
        ...options,
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      });
      const hora = new Date().toLocaleTimeString("PE", options);



      const isBanGp = isGroup ? bngp.includes(from) : false;
      const antiPrivadoAtivo = antiPrivadoLista.includes("ativo");
      const isReg = possuiRegistro(sender);
      const isAntiLink = isGroup ? antilink.includes(from) : false;
      const coins = moedasDoRemetente(sender);



      const estadoPath = "./settings/estadoBot.json";

      if (!fs.existsSync(estadoPath)) {
        fs.writeFileSync(estadoPath, JSON.stringify({ ativo: true }, null, 2));
      }

      const estadoBotDados = lerJsonSeguro(estadoPath, { ativo: true });
      let botAtivo = estadoBotDados.ativo;

      if (botAtivo === undefined) {
        botAtivo = true;
        salvarJsonSeguro(estadoPath, { ativo: true });
      }

      function guardarEstadoBot(estado) {
        salvarJsonSeguro(estadoPath, { ativo: estado });
        botAtivo = estado;
      }





      const modoAdminPath = "./settings/Grupo/Json/modo_admin.json";
      const modoAdminList = lerJsonSeguro(modoAdminPath, [], {
        salvarFallback: true
      });
      const isModoAdmin = isGroup ? modoAdminList.includes(from) : false;


      function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
      }
      function DLT_FL(file) {
        try {
          fs.unlinkSync(file);
        } catch (error) {
          return;
        }
      }


      const validarInteiro = (valor) => {
        if (valor === null || valor === undefined || valor === "") return false;
        const valorLimpo = lerNumero(String(valor)).trim();
        if (!/^\d+$/.test(valorLimpo)) return false;
        return paraBigIntSeguro(valorLimpo, -1n) > ZERO_BIGINT;
      };

      const enviar = (texto) => {
        try {
          sock.sendMessage(from, { text: texto });
        } catch (e) {
          console.error("Erro ao enviar mensagem:", e);
        }
      };


      const patentes = carregarPatentes();
      const YouN = nivelDoRemetente(sender);
      const nivelBase = Math.floor(YouN / 5) * 5;
      const Mlevel = patentes[nivelBase] || "Sem patente";

      const Rrxp = requisitoXp(sender);
      const Crxp = xpDoRemetente(sender);
      var Mrxp;
      if (Crxp <= Rrxp + 0) {
        var Mrxp = "*▒▒▒▒▒▒▒▒▒▒ 0%*";
      } else if (Crxp <= Rrxp + 2) {
        var Mrxp = "*█▒▒▒▒▒▒▒▒▒ 10%*";
      } else if (Crxp <= Rrxp + 4) {
        var Mrxp = "*██▒▒▒▒▒▒▒▒ 20%*";
      } else if (Crxp <= Rrxp + 6) {
        var Mrxp = "*███▒▒▒▒▒▒▒ 30%*";
      } else if (Crxp <= Rrxp + 8) {
        var Mrxp = "*████▒▒▒▒▒▒ 40%*";
      } else if (Crxp <= Rrxp + 10) {
        var Mrxp = "*█████▒▒▒▒▒ 50%*";
      } else if (Crxp <= Rrxp + 12) {
        var Mrxp = "*██████▒▒▒▒ 60%*";
      } else if (Crxp <= Rrxp + 14) {
        var Mrxp = "*███████▒▒▒ 70%*";
      } else if (Crxp <= Rrxp + 16) {
        var Mrxp = "*████████▒▒ 80%*";
      } else if (Crxp <= Rrxp + 18) {
        var Mrxp = "*█████████▒ 90%*";
      } else if (Crxp >= Rrxp + 20) {
        var Mrxp = "*██████████ 100%*";
      }



      const isImage = type == "imageMessage";
      const isVideo = type == "videoMessage";
      const isAudio = type == "audioMessage";
      const isSticker = type == "stickerMessage";
      const isContact = type == "contactMessage";
      const isLocation = type == "locationMessage";
      const isProduct = type == "productMessage";
      const isMedia =
      type === "imageMessage" ||
      type === "videoMessage" ||
      type === "audioMessage";
      typeMessage = body.substr(0, 50).replace(/\n/g, "");
      if (isImage) typeMessage = "Image";else
      if (isVideo) typeMessage = "Video";else
      if (isAudio) typeMessage = "Audio";else
      if (isSticker) typeMessage = "Sticker";else
      if (isContact) typeMessage = "Contact";else
      if (isLocation) typeMessage = "Location";else
      if (isProduct) typeMessage = "Product";
      const isQuotedMsg =
      type === "extendedTextMessage" && content.includes("textMessage");
      const isQuotedImage =
      type === "extendedTextMessage" && content.includes("imageMessage");
      const isQuotedVideo =
      type === "extendedTextMessage" && content.includes("videoMessage");
      const isQuotedDocument =
      type === "extendedTextMessage" && content.includes("documentMessage");
      const isQuotedAudio =
      type === "extendedTextMessage" && content.includes("audioMessage");
      const isQuotedSticker =
      type === "extendedTextMessage" && content.includes("stickerMessage");
      const isQuotedContact =
      type === "extendedTextMessage" && content.includes("contactMessage");
      const isQuotedLocation =
      type === "extendedTextMessage" && content.includes("locationMessage");
      const isQuotedProduct =
      type === "extendedTextMessage" && content.includes("productMessage");

      const getFileBuffer = async (mediakey, MediaType) => {
        const stream = await downloadContentFromMessage(mediakey, MediaType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
      };



      const obterMencionado = (info) => {
        const context =
        info.message?.extendedTextMessage?.contextInfo ||
        info.message?.contextInfo ||
        null;

        if (context?.mentionedJid && context.mentionedJid.length > 0) {
          return context.mentionedJid[0];
        }

        if (context?.participant) {
          return context.participant;
        }

        return null;
      };


      const runtime = function (seconds) {
        seconds = Number(seconds);
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor(seconds % (3600 * 24) / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const parts = [];
        if (days > 0) {
          parts.push(days + (days === 1 ? " dia" : " dias"));
        }
        if (hours > 0) {
          parts.push(hours + (hours === 1 ? " hora" : " horas"));
        }
        if (minutes > 0) {
          parts.push(minutes + (minutes === 1 ? " minuto" : " minutos"));
        }
        if (remainingSeconds > 0) {
          parts.push(
            remainingSeconds + (
            remainingSeconds === 1 ? " segundo" : " segundos")
          );
        }
        return parts.join(", ");
      };


      var saldoa = formatarMoeda(moedasDoRemetente(sender));
      const respostasSistema = {
        admin: "Comando apenas para administradores",
        botadmin: "O Bot precisa ser um administrador",
        grupos: "Comando apenas para grupos",
        vazio: "",
        escolhaValor: `Escolha um valor para ser apostado.
  Saldo atual: ${saldoa}₿`,
        somenteCriador: "Comando para uso exclusivo do criador",

        registro: `Primeiro se registre usando o comando ${prefixo[0]}reg <nome>`,

        jaRegistrado: `Você já está registrado`,

        coins: `Bitcoins insuficientes @${sender ? sender.split("@")[0] : ""}`
      };


      const SvnC = {
        key: { participant: "0@s.whatsapp.net" },
        message: { contactMessage: { displayName: `${pushname}` } }
      };



      function gerarCodigo() {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let codigo = "";
        for (let i = 0; i < 6; i++) {
          const indice = Math.floor(Math.random() * caracteres.length);
          codigo += caracteres.charAt(indice);
        }
        return codigo;
      }




      if (!isGroup && isCmd)
      console.log(
        "\n  ╔─━━━━ ",
        color("COMANDO", "blue"),
        "━━━━─╗",
        "\n",
        color(" GRUPO :", "lime"),
        color(groupName, "cyan"),
        "\n",
        color(" NOME :", "lime"),
        color(pushname, "cyan"),
        "\n",
        color(" COMANDO :", "lime"),
        color(comando, "cyan"),
        "\n",
        color(" HORA :", "lime"),
        color(hora, "cyan"),
        "\n",
        color(" DATA : ", "lime"),
        color(data, "cyan"),
        "\n",
        color(" ╚─━━━━ "),
        color("COMANDO", "red"),
        "━━━━━─╝"
      );


      if (!isCmd && !isGroup)
      console.log(
        "\n  ╔─━━━━━",
        color(" PV ", "blue"),
        "━━━━━─╗",
        "\n",
        color(" GRUPO :", "lime"),
        color(groupName, "cyan"),
        "\n",
        color(" NOME :", "lime"),
        color(pushname, "cyan"),
        "\n",
        color(" MENSAGEM :", "lime"),
        color(budy, "cyan"),
        "\n",
        color(" HORA :", "lime"),
        color(hora, "cyan"),
        "\n",
        color(" DATA :", "lime"),
        color(data, "cyan"),
        "\n",
        color(" ╚─━━━━━ "),
        color("PV", "red"),
        "━━━━━─╝"
      );


      if (isCmd && isGroup)
      console.log(
        "\n  ╔─━━━━ ",
        color("COMANDO", "blue"),
        "━━━━─╗",
        color(" GRUPO :", "lime"),
        color(groupName, "cyan"),
        "\n",
        color(" NOME :", "lime"),
        color(pushname, "cyan"),
        "\n",
        color(" COMANDO :", "lime"),
        color(comando, "cyan"),
        "\n",
        color(" HORA :", "lime"),
        color(hora, "cyan"),
        "\n",
        color(" DATA :", "lime"),
        color(data, "cyan"),
        "\n",
        color(" ╚─━━━━ "),
        color("COMANDO", "red"),
        "━━━━━─╝"
      );


      if (!isCmd && isGroup)
      console.log(
        "\n  ╔─━━━━ ",
        color("GRUPO", "blue"),
        "━━━━─╗",
        "\n",
        color(" GRUPO :", "lime"),
        color(groupName, "cyan"),
        "\n",
        color(" NOME :", "lime"),
        color(pushname, "cyan"),
        "\n",
        color(" MENSAGEM :", "lime"),
        color(budy, "cyan"),
        "\n",
        color(" HORA :", "lime"),
        color(hora, "cyan"),
        "\n",
        color(" DATA :", "lime"),
        color(data, "cyan"),
        "\n",
        color(" ╚─━━━━ "),
        color("GRUPO", "red"),
        "━━━━━─╝"
      );

      expiredClaim();
      limparExpiradosMineracao();
      limparExpiradosAttp();
      limparExpiradosEmoji();
      limparExpiradosEve();
      limparExpiradosDiario();
      limparExpiradosPesca();
      limparExpiradosRoleta();

      const whitelistGroups = [
      "120363406690153385@g.us",
      "120363422859824170@g.us"];

      if (isBanGp && !whitelistGroups.includes(from)) {
        return;
      }

      if (antiPrivadoAtivo && !isGroup && !isOwner) {
        sock.updateBlockStatus(sender, "block");
      }
      if (isModoAdmin && !isGroupAdmins && !isOwner) return;
      if (!botAtivo && !isOwner) return;

      switch (comando) {
        case "menu":
        case "help":
          {
            if (!isGroup) return;
            if (!isReg) return enviar(respostasSistema.registro);

            const Mnu = Menu(timeFt, Bot, sender, groupName, groupMembers);

            await sock.sendMessage(
              from,
              {
                text: Mnu,
                mentions: [sender]
              },
              { quoted: info }
            );
          }
          break;

        case "ligarbot":
        case "botligar":
        case "ativarbot":
          if (!isOwner) return enviar(respostasSistema.somenteCriador);
          if (botAtivo) return enviar("O bot já está ligado");
          guardarEstadoBot(true);
          enviar("O bot foi *ATIVADO*");
          break;

        case "desligarbot":
        case "botdesligar":
        case "desativarbot":
          if (!isOwner) return enviar(respostasSistema.somenteCriador);
          if (!botAtivo) return enviar("O bot já estava desligado");
          guardarEstadoBot(false);
          enviar("O bot foi *DESATIVADO*");
          break;

        case "antiprivado":
        case "antipv":
          {
            if (!isOwner) return enviar(respostasSistema.somenteCriador);
            if (args[0] === "on") {
              if (antiPrivadoAtivo)
              return enviar("O anti-privado já está ativo");
              antiPrivadoLista.push("ativo");
              salvarJsonSeguro(CAMINHO_CHAT, antiPrivadoLista);
              enviar("Anti-privado ativado com sucesso");
            } else if (args[0] === "off") {
              if (!antiPrivadoAtivo)
              return enviar("O anti-privado já estava desativado");
              const indiceAtivo = antiPrivadoLista.indexOf("ativo");
              if (indiceAtivo !== -1) {
                antiPrivadoLista.splice(indiceAtivo, 1);
              }
              salvarJsonSeguro(CAMINHO_CHAT, antiPrivadoLista);
              enviar("Anti-privado desativado com sucesso");
            } else {
              enviar("on para ativar e off para desativar");
            }
          }
          break;

        case "rvisu":
        case "revelarvisu":
        case "open":
          try {
            var vio =
            info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            var viewImage =
            vio?.imageMessage ||
            info.message?.imageMessage ||
            vio?.viewOnceMessageV2?.message?.imageMessage ||
            info.message?.viewOnceMessageV2?.message?.imageMessage ||
            info.message?.viewOnceMessage?.message?.imageMessage ||
            vio?.viewOnceMessage?.message?.imageMessage;
            var viewVideo =
            vio?.videoMessage ||
            info.message?.videoMessage ||
            vio?.viewOnceMessageV2?.message?.videoMessage ||
            info.message?.viewOnceMessageV2?.message?.videoMessage ||
            info.message?.viewOnceMessage?.message?.videoMessage ||
            vio?.viewOnceMessage?.message?.videoMessage;

            if (JSON.stringify(info).includes("videoMessage")) {
              viewVideo.viewOnce = false;
              viewVideo.video = { url: viewVideo.url };
              viewVideo.caption += "Vídeo *revelado*";
              sock.sendMessage(from, viewVideo);
            } else if (JSON.stringify(info).includes("imageMessage")) {
              viewImage.viewOnce = false;
              viewImage.image = { url: `${viewImage.url}` };
              viewImage.caption += "Foto *revelada*";
              sock.sendMessage(from, viewImage);
            } else {
              enviar(
                "Marque uma mensagem de visualização única (foto ou vídeo)."
              );
            }
          } catch (e) {
            console.log(e);
            enviar("Erro ao revelar mensagem de visualização única.");
          }
          break;

        case "reiniciar":
          {
            console.log("=== DEBUG REINICIAR ===");
            console.log("Número que executa o comando:", sender);
            console.log(
              "Número(s) configurados como owner:",
              global.owner || owner || "Não definido"
            );
            console.log("É owner?:", isOwner);

            if (!isOwner) return enviar(respostasSistema.somenteCriador);

            enviar("Reiniciando...");
            setTimeout(async () => {
              console.log("Reiniciando o bot...");
              process.exit(0);
            }, 1000);
          }
          break;

        case "infobot":
        case "ping":
          {
            if (!isGroup) return;
            let timestamp = speed();
            let latensi = speed() - timestamp;
            uptime = process.uptime();
            botinfo = `⏰  Hora  »  ${time}
📅  Data »  ${data}
⚡  Velocidade »  ${latensi.toFixed(4)} seg
📲  Dispositivo »  ${deviceType}
⏳  Online »  ${runtime(uptime)}
💾  Memória »  ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
              2
            )}MB / ${Math.round(require("os").totalmem / 1024 / 1024)}MB
👤  User »  ${pushname}`;
            sock.sendMessage(from, { text: botinfo }, { quoted: info });
          }
          break;

        case "bangp":
          {
            if (!isGroup) return;
            if (!isOwner) return enviar(respostasSistema.somenteCriador);
            if (!isBanGp) {
              const JsonGp = "./settings/Grupo/Json/grupo.json";
              bngp.push(from);
              fs.writeFileSync(JsonGp, JSON.stringify(bngp));
              enviar("GRUPO BANIDO COM SUCESSO");
            } else {
              enviar("O GRUPO JÁ ESTÁ BANIDO");
            }
          }
          break;

        case "unbangp":
          {
            if (!isGroup) return;
            if (!isOwner) return enviar(respostasSistema.somenteCriador);
            if (isBanGp) {
              const JsonGp = "./settings/Grupo/Json/grupo.json";
              bngp = bngp.filter((g) => g !== from);
              fs.writeFileSync(JsonGp, JSON.stringify(bngp));
              enviar("GRUPO DESBANIDO COM SUCESSO");
            } else {
              enviar("O GRUPO JÁ ESTÁ DESBANIDO");
            }
          }
          break;

        case "todos":
          if (!isReg) return enviar(respostasSistema.registro);
          if (!isGroup) return enviar("Pq vc quer usar esse comando no pv?");
          if (!isGroupAdmins) return enviar(respostasSistema.admin);
          members_id = [];
          teks = args.length > 1 ? body.slice(8).trim() : "";
          teks += `Total : ${groupMembers.length}\n`;
          nu = 0;
          for (let mem of groupMembers) {
            nu += 1;
            teks += ` ➫[${nu.toString()}] @${mem.id.split("@")[0]}\n`;
            members_id.push(mem.id);
          }
          mentions(
            `
➫ ${teks}
`,
            members_id,
            true
          );
          break;

        case "everyone":
          {
            if (!isGroup)
            return enviar("É sério invocar em um chat, seu tio te pegou né");
            if (!isGroupAdmins) return enviar(respostasSistema.admin);
            men = [];
            num = 0;
            teks = `👉 ❝ ${q} ❞ 👈 
\n`;
            for (let m of groupMembers) {
              num += 1;
              teks += `• [${num.toString()}] @${m.id.split("@")[0]}\n`;
              men.push(m.id);
            }
            mentions(teks, men, true);
          }
          break;

        case "modoadm":
          {
            if (!isGroup)
            return enviar("Este comando só pode ser usado em grupos");
            if (!isGroupAdmins)
            return enviar(
              "Apenas os administradores podem alterar este modo"
            );

            const JsonModoAdmin = "./settings/Grupo/Json/modo_admin.json";
            let modoAdmin = lerJsonSeguro(JsonModoAdmin, [], {
              salvarFallback: true
            });

            const estado = args[0];

            if (!estado)
            return enviar(
              "*modoadm 1* → Ativar modo admin\n*modoadm 0* → Desativar modo admin"
            );

            if (estado === "1") {
              if (!modoAdmin.includes(from)) {
                modoAdmin.push(from);
                fs.writeFileSync(
                  JsonModoAdmin,
                  JSON.stringify(modoAdmin, null, 2)
                );
                enviar(
                  "*Modo admin ativado* — Agora apenas os administradores podem usar o bot neste grupo"
                );
              } else {
                enviar("O modo admin já estava ativado neste grupo");
              }
            } else if (estado === "0") {
              if (modoAdmin.includes(from)) {
                modoAdmin = modoAdmin.filter((g) => g !== from);
                fs.writeFileSync(
                  JsonModoAdmin,
                  JSON.stringify(modoAdmin, null, 2)
                );
                enviar(
                  "*Modo admin desativado* — Todos os membros podem usar o bot novamente"
                );
              } else {
                enviar("O modo admin já estava desativado neste grupo");
              }
            } else {
              enviar("Você só pode usar *1* para ativar ou *0* para desativar");
            }
          }
          break;

        case "hidetag":
        case "notify":
          if (!isReg) return enviar(respostasSistema.registro);
          if (!isGroupAdmins) return enviar(respostasSistema.admin);
          if (!q) return enviar("Digite um texto");
          if (!isGroup)
          return enviartexto("Este comando só pode ser usado em grupos");
          if (!isGroupAdmins)
          return enviartexto("O bot precisa ser administrador");
          var group = await sock.groupMetadata(from);
          var member = group["participants"];
          var mem = [];
          member.map(async (adm) => {
            mem.push(adm.id.replace("c.us", "s.whatsapp.net"));
          });
          var optionshidetag = {
            text: q,
            contextInfo: { mentionedJid: mem },
            quoted: m
          };
          sock.sendMessage(from, optionshidetag);
          break;

        case "kick":
        case "ban":
        case "expulsar":
          {
            if (!isGroup) return;
            if (!isGroupAdmins) return enviar(respostasSistema.admin);
            let mentioned = obterMencionado(info);

            if (!mentioned)
            return enviar(
              "Você deve mencionar alguém para usar este comando"
            );

            if (mentioned === BotNumber || mentioned === owner)
            return enviar("Não");
            await sock.groupParticipantsUpdate(from, [mentioned], "remove");
            enviar("Ação realizada com sucesso");
          }
          break;

        case "s":
        case "sticker":
        case "fig":
        case "figurinha":
          if (!isReg) return enviar(respostasSistema.registro);
          var RSM =
          info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
          var boij2 =
          RSM?.imageMessage ||
          info.message?.imageMessage ||
          RSM?.viewOnceMessageV2?.message?.imageMessage ||
          info.message?.viewOnceMessageV2?.message?.imageMessage ||
          info.message?.viewOnceMessage?.message?.imageMessage ||
          RSM?.viewOnceMessage?.message?.imageMessage;
          var boij =
          RSM?.videoMessage ||
          info.message?.videoMessage ||
          RSM?.viewOnceMessageV2?.message?.videoMessage ||
          info.message?.viewOnceMessageV2?.message?.videoMessage ||
          info.message?.viewOnceMessage?.message?.videoMessage ||
          RSM?.viewOnceMessage?.message?.videoMessage;
          if (boij2) {
            var pack = `ㅤ`;
            var author2 = ` ㅤ`;
            owgi = await getFileBuffer(boij2, "image");
            let encmediaa = await sendImageAsSticker2(sock, from, owgi, info, {
              packname: pack,
              author: author2
            });
            await DLT_FL(encmediaa);
            await adicionarXp(sender, 1);
            await removerMoedas(sender, 1);
          } else if (boij && boij.seconds < 11) {
            var pack = `ㅤ`;
            var author2 = ` ㅤ`;
            owgi = await getFileBuffer(boij, "video");
            let encmedia = await sendVideoAsSticker2(sock, from, owgi, info, {
              packname: pack,
              author: author2
            });
            await DLT_FL(encmedia);
            await adicionarXp(sender, 1);
            await removerMoedas(sender, 1);
          } else {
            return enviar(
              `Marque uma imagem ou um vídeo de no máximo de 10 segundos`
            );
          }
          break;

        case "attp":
        case "attp2":
        case "attp3":
          try {
            if (!q.trim()) return enviar(`Escreva o texto que você quiser`);

            var Fontes =
            commandArgs === "attp2" ? "Roboto" : "Noto Emoji, Noto Sans Mono";

            let axios = require("axios");
            let res = await axios.get(
              `https://api.bronxyshost.com.br/api-bronxys/attp_edit?texto=${encodeURIComponent(
                q
              )}&fonte=${Fontes}&apikey=${API_KEY_NAUFRA}`,
              {
                responseType: "arraybuffer"
              }
            );

            await sock.sendMessage(
              from,
              { sticker: res.data },
              { quoted: info }
            );
          } catch (e) {
            console.error(e);
            return enviar("Error..");
          }
          break;

        case "amp3":
        case "tomp3":
          if (!isReg) return enviar(respostasSistema.registro);
          if (!isQuotedVideo) return enviar(`Marque um vídeo `);
          tomp = await getFileBuffer(
            info.message.extendedTextMessage.contextInfo.quotedMessage.
            videoMessage,
            "video"
          );
          sock.sendMessage(
            from,
            { audio: tomp, mimetype: "audio/mpeg" },
            { quoted: info }
          );
          await adicionarXp(sender, 6);
          await removerMoedas(sender, 3);
          break;

        case "toimg":
          if (!isReg) return enviar(respostasSistema.registro);
          if (!isQuotedSticker) return enviar("Marque uma figurinha");
          try {
            buff = await getFileBuffer(
              info.message.extendedTextMessage.contextInfo.quotedMessage.
              stickerMessage,
              "sticker"
            );
            sock.
            sendMessage(
              from,
              {
                image: buff,
                caption: ` [❗] *${pushname}*, Aqui está seu pedido `
              },
              { quoted: info }
            ).
            catch((e) => {
              console.log(e);
              enviar(
                "Não foi possível converter, verifique se é uma imagem e não um gif"
              );
            });
            await adicionarXp(sender, 3);
            await removerMoedas(sender, 2);
          } catch {
            enviar("ocorreu um erro");
          }
          break;

        case "calcular":
        case "cal":
          if (!isReg) return enviar(respostasSistema.registro);
          if (args.length == 0) return enviar(`Erro`);
          const resultzx = eval(q);
          enviar(`${q} = *${resultzx}*`);
          break;

        case "extenso":
          try {
            if (!q || !q.trim()) return enviar("Envie um número");
            if (q == "67") return enviar("six seven");
            const cleanedNumber = lerNumero(q.trim());
            const response = await fetch(
              `https://extenso-api.shardweb.app/extenso/${cleanedNumber}`
            );
            if (!response.ok) {
              return enviar(`Erro: ${response.status}`);
            }
            const data = await response.json();
            enviar(data.extenso);
          } catch (error) {
            enviar("Erro");
          }
          break;

        case "ia":
        case "gemini":
        case "bot":
          if (!q || !q.trim()) return enviar("Envie sua pergunta");

          const apiKey = "";

          const modelName = "gemini-3-pro-preview";

          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

          const fazerRequisicao = async (tentativa = 1) => {
            try {
              const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: q }] }] })
              });

              const data = await response.json();

              if (response.status === 503) {
                if (tentativa < 3) {
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  return fazerRequisicao(tentativa + 1);
                } else {
                  throw new Error("Erro");
                }
              }

              if (!response.ok)
              throw new Error(data.error?.message || "Erro desconhecido");

              return data.candidates[0].content.parts[0].text;
            } catch (err) {
              throw err;
            }
          };

          try {
            const text = await fazerRequisicao();
            enviar(text);
          } catch (err) {
            console.error(err);
            enviar(`Error`);
          }
          break;

        case "debug":
          try {
            const apiKey = "";

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
            );
            const data = await response.json();

            if (!data.models) {
              return enviar(
                "A API respondeu, mas não veio lista de modelos. Estranho... " +
                JSON.stringify(data)
              );
            }

            const modelosUteis = data.models.
            filter((m) =>
            m.supportedGenerationMethods.includes("generateContent")
            ).
            map((m) => m.name.replace("models/", "")).
            join("\n");

            enviar(
              `📋 *MODELOS DISPONÍVEIS NA SUA CONTA:*\n\n${modelosUteis}`
            );
          } catch (err) {
            console.error(err);
            enviar("Erro ao tentar listar: " + err.message);
          }
          break;


        case "perfil":
        case "carteira":
        case "nivel":
          {
            if (!isReg) return enviar(respostasSistema.registro);
            const saldo = paraBigIntSeguro(
              moedasDoRemetente(sender),
              ZERO_BIGINT
            );
            const Xp = xpDoRemetente(sender);
            const Mnv = nivelDoRemetente(sender);
            const Rxxp = requisitoXp(sender);
            const myrep2 = reputacaoDoUsuario(sender);
            const saldoPoup = paraBigIntSeguro(
              saldoPoupancaDoRemetente(sender),
              ZERO_BIGINT
            );
            const Xpnull = Rxxp - 20;
            if (Xp === null) return adicionarXp(sender, Xpnull);
            const Mp = `
🏷️  Nome      »  @${sender ? sender.split("@")[0] : ""}
⚔️  Patente       »  ${Mlevel}
💰  Dinheiro     »  ${formatarMoeda(saldo)}₿
🏦  Poupança     »  ${formatarMoeda(saldoPoup)}₿
📈  Nível       »  ${Mnv} ➜ ${Mnv + 1}
📚  XP         »  ${Xp} / ${Rxxp + 20}

Progresso:
▰▰ ${Mrxp} ▰▰`;
            sock.sendMessage(
              from,
              { text: Mp, mentions: [sender] },
              { quoted: info }
            );
          }
          break;

        case "poupanca":
          if (!isReg) return enviar(respostasSistema.registro);
          const saldoPoupanca = paraBigIntSeguro(
            saldoPoupancaDoRemetente(sender),
            ZERO_BIGINT
          );
          const poup = `🏦 *SUA POUPANÇA* 🏦\n\n💰 Saldo: *${formatarMoeda(
            saldoPoupanca
          )}₿*\n\nUse */depositar <valor>* para guardar dinheiro.\nUse */sacar <valor>* para retirar dinheiro.`;
          sock.sendMessage(
            from,
            { text: poup, mentions: [sender] },
            { quoted: info }
          );
          break;

        case "depositar":
        case "guardar":
          if (!isReg) return enviar(respostasSistema.registro);
          if (!q) return enviar("⚠️ Digite o valor que deseja depositar.");

          let valorDep;
          if (q.toLowerCase() === "tudo" || q.toLowerCase() === "all") {
            valorDep = paraBigIntSeguro(moedasDoRemetente(sender), ZERO_BIGINT);
          } else {
            if (!validarInteiro(q))
            return enviar("⚠️ Digite um valor inteiro válido.");
            valorDep = paraBigIntSeguro(q, ZERO_BIGINT);
          }

          if (valorDep <= ZERO_BIGINT)
          return enviar("⚠️ O valor deve ser maior que zero.");
          if (paraBigIntSeguro(moedasDoRemetente(sender), ZERO_BIGINT) < valorDep) {
            return enviar("❌ Você não tem Bitcoins suficientes na carteira.");
          }

          await removerMoedas(sender, valorDep);
          await adicionarPoupanca(sender, valorDep);

          enviar(
            `✅ *Depósito realizado!*\n💰 Você guardou *${formatarMoeda(
              valorDep
            )}₿* na poupança.\n🏦 Novo saldo na poupança: *${formatarMoeda(
              saldoPoupancaDoRemetente(sender)
            )}₿*`
          );
          break;

        case "sacar":
          if (!isReg) return enviar(respostasSistema.registro);
          if (!q) return enviar("⚠️ Digite o valor que deseja sacar.");

          let valorSac;
          const saldoPoup = paraBigIntSeguro(
            saldoPoupancaDoRemetente(sender),
            ZERO_BIGINT
          );

          if (q.toLowerCase() === "tudo" || q.toLowerCase() === "all") {
            valorSac = saldoPoup;
          } else {
            if (!validarInteiro(q))
            return enviar("⚠️ Digite um valor inteiro válido.");
            valorSac = paraBigIntSeguro(q, ZERO_BIGINT);
          }

          if (valorSac <= ZERO_BIGINT)
          return enviar("⚠️ O valor deve ser maior que zero.");
          if (saldoPoup < valorSac)
          return enviar("❌ Você não tem Bitcoins suficientes na poupança.");

          await removerPoupanca(sender, valorSac);
          await adicionarMoedas(sender, valorSac);

          enviar(
            `✅ *Saque realizado!*\n💰 Você retirou *${formatarMoeda(
              valorSac
            )}₿* da poupança.\n👛 Novo saldo na carteira: *${formatarMoeda(
              moedasDoRemetente(sender)
            )}₿*`
          );
          break;

        case "poup":
          if (!isReg) return enviar(respostasSistema.registro);
          const sP = paraBigIntSeguro(
            saldoPoupancaDoRemetente(sender),
            ZERO_BIGINT
          );
          const sC = paraBigIntSeguro(moedasDoRemetente(sender), ZERO_BIGINT);
          enviar(
            `🏦 *FINANÇAS* 🏦\n\n👛 Carteira: *${formatarMoeda(
              sC
            )}₿*\n🏦 Poupança: *${formatarMoeda(sP)}₿*`
          );
          break;


        case "tigrinho":
          if (!isReg)
          return enviar("Você deve se registrar para jogar, digite /reg");
          if (!q) return enviar(respostasSistema.escolhaValor);
          if (!validarInteiro(q))
          return enviar(
            "⚠️ Por favor, insira um número inteiro válido maior que zero."
          );
          const saldo = paraBigIntSeguro(moedasDoRemetente(sender), ZERO_BIGINT);
          const valorApostado = paraBigIntSeguro(q, ZERO_BIGINT);
          const apostas = valorApostado;
          const agora = Date.now();
          const tempoGuardado = tempoCooldownCacaNiqueis(sender) || 0;
          const tempoRestante = tempoGuardado - agora;
          if (valorApostado <= ZERO_BIGINT)
          return enviar("⚠️ O valor deve ser maior que zero.");
          if (valorApostado > saldo) return enviar("SALDO INSUFICIENTE!");

          if (tempoRestante > 0) {
            return await enviar(
              `Espere ${runtime(tempoRestante / 1000)} para jogar novamente.`
            );
          } else {
            const espera = 15 * 1000;
            await adicionarCooldownCacaNiqueis(sender, espera);
          }


          await removerMoedas(sender, apostas);


          const simbolos = [
          "🥕",
          "🐰",
          "🐸",
          "🦊",
          "🐱",
          "🍋",
          "🔔",
          "🍒",
          "🍉",
          "🍌"];



          const obterLinha = () => [
          simbolos[Math.floor(Math.random() * simbolos.length)],
          simbolos[Math.floor(Math.random() * simbolos.length)],
          simbolos[Math.floor(Math.random() * simbolos.length)]];



          const filaCima = obterLinha();
          const filaBaixo = obterLinha();

          let filaCentro;
          const probabilidade = Math.random();


          if (probabilidade < 0.65) {
            const simboloVencedor =
            simbolos[Math.floor(Math.random() * simbolos.length)];
            filaCentro = [simboloVencedor, simboloVencedor, simboloVencedor];
          } else {
            filaCentro = obterLinha();
          }


          const vencedor =
          filaCentro[0] === filaCentro[1] && filaCentro[1] === filaCentro[2];

          let mensagemResultado =
          "Você perdeu... tente novamente em 10 segundos.";
          let premioTexto = "";


          if (vencedor) {
            const quantidadePremio =
            randomBigIntAbaixo(valorApostado) + valorApostado * 2n;
            const tipoPremio = Math.random() < 0.8 ? "coins" : "exp";

            if (tipoPremio === "coins") {
              await adicionarMoedas(sender, quantidadePremio);
              premioTexto = `🎉 Recebeu ${formatarMoeda(quantidadePremio)}₿ 🪙.`;
            } else {
              const premioExp = Number(quantidadePremio);
              await adicionarXp(sender, premioExp);
              premioTexto = `📚 Recebeu ${premioExp} de EXP.`;
            }

            mensagemResultado = "🎉 Você ganhou! 🎉";
          }


          const mensagemCassino = `              *༻  FORTUNE TIGER ༺*
            ┏━━━━┛🐯┗━━━━┓
             ||   【${filaCima[0]}】【${filaCima[1]}】【${filaCima[2]}】   ||
           ◢◞───────────◟◣
        █ ||   【${filaCentro[0]}】【${filaCentro[1]}】【${filaCentro[2]}】   || █
           ◥◝───────────◜◤
             ||   【${filaBaixo[0]}】【${filaBaixo[1]}】【${filaBaixo[2]}】   ||
            ┗━━━━┓🐯┏━━━━┛
         ◆━━━━━━━▣✦▣━━━━━━━━◆

Você gastou ${formatarMoeda(apostas)} moedas.

${mensagemResultado}
${premioTexto}`;


          setTimeout(() => {
            enviar(mensagemCassino);
          }, 3000);

          break;

        case "diario":
        case "daily":
          if (!isGroup) return;
          if (!isReg) return;
          const diario = verificarDiario(sender);
          if (diario) {
            const agora = Date.now();
            const time = tempoDiario(sender);
            const result = agora - time;
            const resultado = (0 - result) / 1000;
            return sock.sendMessage(
              from,
              { text: `Espere ${runtime(resultado)} para sua nova recompensa` },
              { quoted: info }
            );
          } else {
            const time = 24 * 60 * 60 * 1000;
            await adicionarDiario(sender, time);
            const valorExperiencia = 100;
            const valor = 500;
            enviar(`RECOMPENSA DIÁRIA

Você ganhou ${valor}₿ e ${valorExperiencia} de XP.`);
            await adicionarMoedas(sender, valor);
            await adicionarXp(sender, valorExperiencia);
          }
          break;

        case "reg":
        case "registrar":
        case "rg":
          if (isReg) return enviar(respostasSistema.jaRegistrado);
          const nome = pushname;
          await adicionarRegistro(sender, nome);
          sock.sendMessage(
            from,
            {
              text: `🎉Registro completo *${nome}* 🥳
🪙Você recebeu *50₿* 🪙 como presente de boas vindas.`
            },
            { quoted: info }
          );
          break;

        case "levelup":
          {
            const nivelAtual = nivelDoRemetente(sender);

            const XpR = xpDoRemetente(sender);
            let Rxxp = requisitoXp(sender);

            let niveisParaUpar = 0;
            let coinsParaGanhar = 0;
            let aumentoNoRequisito = 0;


            if (XpR >= Rxxp + 20) {
              niveisParaUpar = Math.floor((XpR - Rxxp) / 20);
              coinsParaGanhar = niveisParaUpar * 10;
              aumentoNoRequisito = niveisParaUpar * 20;
            }

            if (niveisParaUpar > 0) {

              const novoNivel = nivelAtual + niveisParaUpar;




              let msgPatente = "";
              if (Math.floor(nivelAtual / 5) !== Math.floor(novoNivel / 5)) {
                msgPatente = "\n🎖️ PARABÉNS! NOVA PATENTE DESBLOQUEADA! 🎖️";
              }


              await adicionarNivel(sender, niveisParaUpar);
              await adicionarMoedas(sender, coinsParaGanhar);
              await adicionarRequisitoXp(sender, aumentoNoRequisito);

              const Mup = `          ★━━━ LEVEL UP ━━━★
@${sender ? sender.split("@")[0] : ""}
🚀 Níveis aumentados: +${niveisParaUpar}
🆙 Nível Atual: ${novoNivel}
💸 Ganhou: ${coinsParaGanhar}₿
${msgPatente}`;


              sock.sendMessage(
                from,
                { text: Mup, mentions: [sender] },
                { quoted: info }
              );
            } else {
              enviar(`❌ XP Insuficiente, ${pushname}.`);
            }
          }
          break;

        case "minerar":
          {
            if (!isReg) return enviar(respostasSistema.registro);
            if (!isGroup) return enviar(respostasSistema.grupos);
            const isMin = verificarMineracao(sender);
            if (isMin) {
              const agora = Date.now();
              const time = tempoMineracao(sender);
              const result = agora - time;
              const resultado = (0 - result) / 1000;
              return enviar(`Cavando... ${runtime(resultado)} `);
            } else {
              const time = 24 * 60 * 60 * 1000;
              await adicionarMineracao(sender, time);
              const numbeR = [1, 2, 3, 4, 5];
              const randomIndex = Math.floor(Math.random() * numbeR.length);
              const valor = numbeR[randomIndex] * 100 + 1518;
              const valorMinerado = valor - 1518;
              enviar(`               ★━━━ CONCLUÍDO... ━━━★
💰 Você descobriu ouro puro e obteve *${valorMinerado}₿* 
💬 ❝ 🌟 Graças ao CLT ⛏ você garantiu o salário mínimo de *1518₿* 🪙.❞

⏳ Volte em 24 horas.`);
              await adicionarMoedas(sender, valor);
            }
          }
          break;

        case "roletarussa":
        case "roleta":
          {
            if (!isReg) return enviar(respostasSistema.registro);
            const valorDigitado = q;
            const valor = paraBigIntSeguro(moedasDoRemetente(sender), ZERO_BIGINT);
            const isMinxxx = verificarRoleta(sender);
            if (isMinxxx) {
              const agora = Date.now();
              const time = tempoRoleta(sender);
              const result = agora - time;
              const resultado = (0 - result) / 1000;
              return enviar(`Espere... ${runtime(resultado)} `);
            } else {
              const premio = randomBigIntAbaixo(valor) + valor * 2n;
              const time = 60 * 1000;
              await adicionarRoleta(sender, time);
              const ppt = ["vivo", "morto"];
              const pptb = ppt[Math.floor(Math.random() * ppt.length)];
              let vit;


              if (pptb === "morto") {
                vit = `💭「𝘽𝙊𝙊𝙈!」
💭「${pushname} caiu e perdeu ${formatarMoeda(valor)}₿ 🪙」`;
                await removerMoedas(sender, valor);

              } else if (pptb === "vivo") {
                vit = `💭「Tec...」
  💭「${pushname} sobreviveu e ganhou ${formatarMoeda(premio)}₿ 🪙」`;
                await adicionarMoedas(sender, premio);

              }

              const datatt = `╭━━━╾⭑✦  ✦⭑╼━━━╮
         ⌬ Roleta Russa ⌬
         
${vit}

╰━━━╾⭑✦ ⬤ ✦⭑╼━━━╯`;

              enviar(datatt);
            }
          }
          break;

        case "pix":
          {
            if (!isGroup)
            return enviar("⚠️ Este comando só pode ser usado em grupos.");
            try {
              const mencionado = obterMencionado(info);
              const remetente = sender;
              const valor = paraBigIntSeguro(args[1], ZERO_BIGINT);

              if (!mencionado)
              return enviar(
                "⚠️ Você deve mencionar alguém para fazer o pix."
              );
              if (mencionado === remetente)
              return enviar("⚠️ Você não pode enviar um pix para si mesmo.");
              if (!validarInteiro(args[1]))
              return enviar(
                "⚠️ Por favor, insira um número inteiro válido maior que zero."
              );

              const saldoRemetente = await moedasDoUsuario(remetente);
              if (saldoRemetente < valor)
              return enviar(
                "❌ Você não tem moedas suficientes para fazer esta transferência."
              );


              await removerMoedas(remetente, valor);
              await adicionarMoedas(mencionado, valor);
              await sleep(100);

              const saldoAtualizado = await moedasDoUsuario(remetente);
              enviar(`✅ Pix concluído.\nVocê enviou *${formatarMoeda(valor)}₿.*`, {
                mentions: [remetente, mencionado]
              });
            } catch (e) {
              enviar("Erro: " + e.message);
            }
          }
          break;

        case "addcoin":
          {
            if (!isOwner) return enviar(respostasSistema.somenteCriador);
            try {
              const mencionado = obterMencionado(info);
              const valor = paraBigIntSeguro(args[1], ZERO_BIGINT);

              if (!mencionado) return enviar("⚠️ Você deve mencionar alguém.");
              if (!validarInteiro(args[1]))
              return enviar(
                "⚠️ Por favor, insira um número inteiro válido maior que zero."
              );

              await adicionarMoedas(mencionado, valor);
              await sleep(100);

              enviar(`✅ Concluído.\nVocê adicionou *${formatarMoeda(valor)}₿.*`);
            } catch (e) {
              enviar("Erro: " + e.message);
            }
          }
          break;

        case "delcoin":
          {
            if (!isOwner) return enviar(respostasSistema.somenteCriador);
            try {
              const mencionado = obterMencionado(info);
              const valor = paraBigIntSeguro(args[1], ZERO_BIGINT);

              if (!mencionado) return enviar("⚠️ Você deve mencionar alguém.");
              if (!validarInteiro(args[1]))
              return enviar(
                "⚠️ Por favor, insira um número inteiro válido maior que zero."
              );

              await removerMoedas(mencionado, valor);
              await sleep(100);

              enviar(`✅ Concluído.\nVocê removeu *${formatarMoeda(valor)}₿.*`);
            } catch (e) {
              enviar("Erro: " + e.message);
            }
          }
          break;
        case "rankcoins":
          {
            if (!isGroup) return;
            const pathi = "./settings/Grupo/Json/registros.json";


            const registro = lerJsonSeguro(pathi, [], {
              salvarFallback: true
            });

            let mensagemRanking = `*🏆 RANKING DE MILIONÁRIOS*\n\nPos.  User   Bitcoins\n\n`;


            const rankingArray = Array.isArray(registro) ?
            registro.map((usuario) => normalizarRegistroEconomia(usuario)) :
            Object.entries(registro).map(([jid, data]) =>
            normalizarRegistroEconomia(data, jid.split("@")[0])
            );

            rankingArray.
            sort((a, b) => {
              if (b.total > a.total) return 1;
              if (b.total < a.total) return -1;
              return 0;
            }).
            slice(0, 10).
            forEach((usuario, index) => {
              mensagemRanking += `• ${index + 1}. *${usuario.nome}* => ${
              formatarMoeda(usuario.total)}₿_\n`;

            });

            enviar(mensagemRanking);
          }
          break;

        case "ranknivel":
          {
            if (!isGroup) return;
            let teks = `*RANKING DE NÍVEL* :
Pos.  User   Nível\n`;
            registro.
            sort((a, b) => b.nivel - a.nivel).
            forEach((usuario, index) => {
              teks += `• ${index + 1}.     *${extrairNomeRegistro(usuario)}*  =>  _*${
              usuario.nivel}*_\n`;

            });
            enviar(teks);
          }
          break;


        case "play":
        case "p":
          if (!q)
          return enviar(
            `Exemplo: !play nome da música\nA música será baixada, Se não baixar, é possível que o YouTube tenha restringido o download`
          );
          try {

            const response = await axios.get(
              `https://api.bronxyshost.com.br/api-bronxys/pesquisa_ytb`,
              {
                params: {
                  nome: q,
                  apikey: API_KEY_NAUFRA
                }
              }
            );
            const data = response.data;


            if (data[0]?.tempo?.length >= 7)
            return enviar(
              "Desculpe, este vídeo ou áudio é muito longo, não posso realizar esta solicitação. Peça outra música com menos de uma hora."
            );


            const N_E = " Não encontrado.";
            const caption = `Título: ${data[0]?.titulo || N_E}
        Duração: ${data[0]?.tempo || N_E}
        Upload: ${data[0]?.postado || N_E}
        Descrição: ${data[0]?.desc || N_E}

        Se deseja baixar o vídeo, use /playvideo ${q.trim()}`;


            await sock.sendMessage(
              from,
              {
                image: { url: data[0]?.thumb || logoslink?.logo },
                caption: caption
              },
              { quoted: info }
            );


            await sock.
            sendMessage(
              from,
              {
                audio: {
                  url: `https://api.bronxyshost.com.br/api-bronxys/play?nome_url=${q}&apikey=${API_KEY_NAUFRA}`
                },
                mimetype: "audio/mpeg",
                fileName: data[0]?.titulo || "play.mp3"
              },
              { quoted: info }
            ).
            catch((e) => {
              return enviar("Error...");
            });
          } catch (e) {
            console.log(e);
            return enviar("Não foi possível encontrar / Erro");
          }
          break;


        case "playvideo":
        case "pvid":
        case "playmp4":
          {
            try {
              if (!q.trim())
              return enviar(
                `- Exemplo: !play nome da música\nSe não baixar, é possível que o YouTube tenha restringido o download ou haja algum outro problema.`
              );


              let data = await fetchJson(
                `https://api.bronxyshost.com.br/api-bronxys/pesquisa_ytb?nome=${q}&apikey=${API_KEY_NAUFRA}`
              );

              if (data[0]?.tempo?.length >= 7)
              return enviar(
                "Desculpe, este vídeo ou áudio é muito longo. Não posso processar esta solicitação. Por favor, escolha outra música que dure menos de uma hora."
              );

              var N_E = " Não encontrado.";
              var bla = `Título: ${data[0]?.titulo || N_E}
        Duração: ${data[0]?.tempo || N_E}
        Upload: ${data[0]?.postado || N_E}
        Descrição: ${data[0]?.desc || N_E}

        Se deseja baixar o áudio, use /play ${q.trim()}`;


              sock.sendMessage(
                from,
                {
                  image: { url: data[0]?.thumb || logoslink?.logo },
                  caption: bla
                },
                { quoted: info }
              );


              sock.
              sendMessage(
                from,
                {
                  video: {
                    url: `https://api.bronxyshost.com.br/api-bronxys/play_video?nome_url=${q}&apikey=${API_KEY_NAUFRA}`
                  },
                  mimetype: "video/mp4",
                  fileName: data[0]?.titulo || "play.mp4"
                },
                { quoted: info }
              ).
              catch((e) => {
                return enviar("Erro ao tentar baixar o vídeo.");
              });
            } catch (e) {
              console.log(e);
              return enviar("Não foi possível encontrar / Erro");
            }
          }
          break;


        case "tiktokvideo":
          try {
            if (!q)
            return enviar("Por favor, forneça um link do TikTok válido.");

            enviar("Baixando o vídeo...");


            let response = await fetch(
              `https://api.bronxyshost.com.br/api-bronxys/tiktok?url=${q}&apikey=${API_KEY_NAUFRA}`
            );


            let contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {

              let ABC = await response.json();
              enviar(
                "Não foi possível baixar o vídeo. Por favor, tente novamente."
              );
            } else {

              let buffer = await response.buffer();
              sock.sendMessage(
                from,
                { video: buffer, mimetype: "video/mp4" },
                { quoted: info }
              );
            }
          } catch (e) {
            enviar("Ocorreu um erro ao tentar baixar o vídeo.");
          }
          break;


        case "tiktokaudio":
          try {
            if (!q.includes("tiktok"))
            return enviar(`!tiktokaudio link de Tiktok`);
            enviar("Realizando ação..");
            sock.
            sendMessage(
              from,
              {
                audio: {
                  url: `https://api.bronxyshost.com.br/api-bronxys/tiktok?url=${q}&apikey=${API_KEY_NAUFRA}`
                },
                mimetype: "audio/mpeg"
              },
              { quoted: info }
            ).
            catch((e) => {
              console.log(e);
              return enviar("Erro..");
            });
          } catch (e) {
            console.log(e);
            return enviar("Erro...");
          }
          break;


        case "buscarapk":
          if (!q.trim()) return enviar(`exemplo: !buscarapk WhatsApp`);

          try {
            enviar("Aguarde...");
            let abc = await fetchJson(
              `https://api.bronxyshost.com.br/api-bronxys/aptoide_pesquisa?pesquisa=${q.trim()}&apikey=${API_KEY_NAUFRA}`
            );
            enviar(abc.aptoide || "Nenhuma informação encontrada.");
          } catch (e) {
            console.log(e);
            return enviar(mess.error());
          }
          break;



        case "baixarapk":
          if (!q.trim().includes("aptoide.com"))
          return enviar(
            `Exemplo: /baixarapk link do aplicativo\n\nUse o comando /buscarapk Exemplo: whatsapp, e você receberá uma url, cole a url depois do comando para baixá-la.`
          );
          enviar("Enviando apk...");
          try {
            abc = await fetchJson(
              `https://api.bronxyshost.com.br/api-bronxys/aptoide?url=${q.trim()}&apikey=${API_KEY_NAUFRA}`
            );
            sock.
            sendMessage(
              from,
              {
                document: { url: abc.link },
                mimetype: "application/vnd.android.package-archive",
                fileName: abc.titulo
              },
              { quoted: info }
            ).
            catch((e) => console.log(e));
          } catch (e) {
            console.log(e);
            return enviar("Erro...");
          }
          break;

        case "resgatar":

          try {

            const allowedGroups = [
            "120363406690153385@g.us",
            "120363422859824170@g.us"];

            if (!allowedGroups.includes(from)) return;

            const lbState = getLootboxState();

            if (lbState.active) {

              lbState.active = false;
              const valorGanho = lbState.amount;



              const minTime = 4 * 60 * 60 * 1000;
              const randomTime = Math.floor(
                Math.random() * (2 * 60 * 60 * 1000)
              );
              lbState.nextDrop = Date.now() + minTime + randomTime;

              saveLootboxState(lbState);

              await adicionarMoedas(sender, valorGanho);
              enviar(
                `🎉 *PARABÉNS ${pushname.toUpperCase()}!* 🎉\n\nVocê foi o mais rápido e resgatou a Lootbox!\n💰 Prêmio: *${valorGanho}₿* adicionados à sua carteira.`
              );
            } else {
              enviar(
                "❌ Nenhuma Lootbox ativa no momento ou alguém já resgatou.\n⏳ Tente ser mais rápido na próxima."
              );
            }
          } catch (err) {
            console.error("Erro no resgatar:", err);
            enviar("❌ Ocorreu um erro ao tentar resgatar.");
          }
          break;

        case "forcarlootbox":
          if (!isOwner) return enviar(respostasSistema.somenteCriador);
          try {
            const lbState = getLootboxState();
            lbState.active = true;
            lbState.amount =
            Math.floor(Math.random() * (500000 - 10000 + 1)) + 10000;
            saveLootboxState(lbState);

            const msgLoot = `🎁 *LOOTBOX DISPONÍVEL!* 🎁\n\n💰 Valor: *???₿*\n🏃‍♂️ Digite */resgatar* rápido para pegar!`;
            const targetGroup = "120363406690153385@g.us";
            await sock.sendMessage(targetGroup, { text: msgLoot });
            if (from !== targetGroup)
            enviar("✅ Lootbox enviada para o grupo oficial!");
          } catch (e) {
            console.error(e);
            enviar("Erro ao forçar lootbox.");
          }
          break;

        case "pib":
          {
            if (!isGroup) return enviar(respostasSistema.grupos);
            if (!isReg) return enviar(respostasSistema.registro);

            try {
              const registrosData = lerJsonSeguro(
                "./settings/Grupo/Json/registros.json",
                [],
                { salvarFallback: true }
              );
              let totalPib = ZERO_BIGINT;

              if (Array.isArray(registrosData)) {
                registrosData.forEach((usuario) => {
                  const dadosUsuario = normalizarRegistroEconomia(usuario);
                  totalPib += dadosUsuario.total;
                });
              }

              const userMoney = paraBigIntSeguro(
                moedasDoRemetente(sender),
                ZERO_BIGINT
              );
              const userPoupanca = paraBigIntSeguro(
                poupancaDoRemetente(sender),
                ZERO_BIGINT
              );
              const userTotal = userMoney + userPoupanca;
              const userPercentage = calcularPercentualBigInt(
                userTotal,
                totalPib,
                2
              );

              enviar(`💰 *PIB Total do Bot:* ${formatarMoeda(totalPib)}₿
Você é *${userPercentage}%* do PIB`);
            } catch (e) {
              console.error("Erro ao calcular PIB:", e);
              enviar("❌ Ocorreu um erro ao calcular o PIB.");
            }
          }
          break;
        default:
      }

    } catch (e) {
      e = String(e);
      if (
      !e.includes("this.isZero") &&
      !e.includes("Could not find MIME for Buffer <null>") &&
      !e.includes("Cannot read property 'conversation' of null") &&
      !e.includes("Cannot read property 'contextInfo' of undefined") &&
      !e.includes("Cannot set property 'mtype' of undefined") &&
      !e.includes("jid is not defined"))
      {
        console.log("Error : %s", color(e, "red"));
      }
    }
  });
}
startProo();
fs.watchFile("./index.js", (curr, prev) => {
  if (curr.mtime.getTime() !== prev.mtime.getTime()) {
    console.log(color("  [❗] O arquivo Index foi modificado", "blue"));
    process.exit();
  }
});
