const { Telegraf } = require('telegraf')
const bot = new Telegraf('2110225858:AAGPjnDrQ3skov42uYLZ32RzsqCol5dXk-E')

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

bot.start((message) => {
	return message.reply('Il bot è avviato')
})
bot.command('ciao', context=> {
	  msg=context.update.message
  context.reply(`Ciao`)
})
bot.command('usd', context=> {
	  msg=context.update.message
  importo=msg.text.split(' ')[1]
  euro=importo/EXCHANGE
  context.reply(`${euro} EUR`)
})

bot.launch()