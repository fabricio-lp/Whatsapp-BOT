const fs = require('fs');

const caminhoJsonClaim = './Games/Json/claim.json';

const jogosClaim = JSON.parse(fs.readFileSync(caminhoJsonClaim));

const addClaim = (sender, time) => {
  const obj = {
    user: sender,
    time: Date.now() + time
  };
  jogosClaim.push(obj);
  fs.writeFileSync(caminhoJsonClaim, `${JSON.stringify(jogosClaim, null, 2)}\n`);
};

const checkClaim = (sender) => jogosClaim.some((item) => item.user === sender);

const timeClaim = (sender) => {
  let position = false;
  Object.keys(jogosClaim).forEach((i) => {
    if (jogosClaim[i].user === sender) {
      position = i;
    }
  });
  if (position !== false) {
    return jogosClaim[position].time;
  }
  return undefined;
};

const expiredClaim = () => {
  setInterval(() => {
    const agora = Date.now();
    jogosClaim.forEach((item, indice) => {
      if (agora >= item.time) {
        jogosClaim.splice(indice, 1);
        fs.writeFileSync(caminhoJsonClaim, `${JSON.stringify(jogosClaim, null, 2)}\n`);
      }
    });
  }, 5 * 60 * 1e3);
};

module.exports = {
  addClaim: addClaim,
  checkClaim: checkClaim,
  timeClaim: timeClaim,
  expiredClaim: expiredClaim
};