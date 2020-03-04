const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

let bot = {};

// startTelegramBot();

function startTelegramBot () {
  const token = '944173870:AAEAOZ-Gq92u04d7PlxYH0anfaJmw0nmqC4';
  bot = new TelegramBot(token, {polling: true});

  const telegramConfigFile = fs.readFileSync('./server/telegram.json');
  const telegramConfig = JSON.parse(telegramConfigFile);

  telegramConfig.users.forEach((user) => {
    bot.sendMessage(user, 'Sistema iniciado com sucesso');
  });

  bot.on('message', (msg) => {
    if (telegramConfig.users.includes(msg.chat.id)) {
      bot.sendMessage(msg.chat.id, 'Seu usuário já está cadastrado no sistema de logs');
    } else {
      telegramConfig.users.push(msg.chat.id);
      fs.writeFileSync('./server/telegram.json', JSON.stringify(telegramConfig));
      bot.sendMessage(msg.chat.id, 'Seu usuário foi cadastrado com sucesso no sistema de logs');
    }
  });
}

function sendNotification (message) {
  const telegramConfigFile = fs.readFileSync('./server/telegram.json');
  const telegramConfig = JSON.parse(telegramConfigFile);

  telegramConfig.users.forEach((user) => {
    bot.sendMessage(user, message);
  });
}

exports.sendNotification = sendNotification;
