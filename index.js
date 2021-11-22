const { Telegraf } = require('telegraf')
const bot = new Telegraf('2110225858:AAGPjnDrQ3skov42uYLZ32RzsqCol5dXk-E')
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'listamanga'
});



bot.start((message) => {
  con.connect(function(err) {
    if (err) throw err;
  });
	return message.reply('Il bot è avviato e connesso')
})

bot.command('ciao', context=> {
	msg=context.update.message
  context.reply(`Ciao`)
})

bot.command('collezione', context=> {
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM collezione", function (err, result, fields) {
      if (err) throw err;
      context.reply(result);
    });
  });
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))