let TelegramBot = require("node-telegram-bot-api");
let token = "5774103762:AAEgtyDRqanuMAJ2Ivtza2S16eanqnyJIgs";
let bot = new TelegramBot(token, { polling: true });
//使用Long Polling的方式與Telegram伺服器建立連線

//收到Start訊息時會觸發這段程式
bot.onText(/\/start/, function (msg) {
  let chatId = msg.chat.id; //用戶的ID
  let resp = "你好"; //括號裡面的為回應內容，可以隨意更改
  bot.sendMessage(chatId, resp); //發送訊息的function
});

//收到/cal開頭的訊息時會觸發這段程式
bot.onText(/\/cal (.+)/, function (msg, match) {
  let fromId = msg.from.id; //用戶的ID
  let resp = match[1].replace(/[^-()\d/*+.]/g, "");
  // match[1]的意思是 /cal 後面的所有內容
  resp = "計算結果為: " + eval(resp);
  // eval是用作執行計算的function
  bot.sendMessage(fromId, resp); //發送訊息的function
});
