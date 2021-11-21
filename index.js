const { Telegraf } = require('telegraf')
const bot = new Telegraf('2110225858:AAGPjnDrQ3skov42uYLZ32RzsqCol5dXk-E')

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

bot.start((message) => {
	return message.reply('Il bot è avviato')
})

bot.command('eur', context=> {
	  msg=context.update.message
  importo=msg.text.split(' ')[1]
  dollari=EXCHANGE*importo
  context.reply(`${dollari} USD`)
})
bot.command('usd', context=> {
	  msg=context.update.message
  importo=msg.text.split(' ')[1]
  euro=importo/EXCHANGE
  context.reply(`${euro} EUR`)
})

bot.launch()