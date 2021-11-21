const { Telegraf } = require('telegraf')
const bot = new Telegraf('2110225858:AAGPjnDrQ3skov42uYLZ32RzsqCol5dXk-E')

const { Client } = require('pg');
const EXCHANGE = 1.125
const client = new Client({
	user: 'sastjtgosyizfr',
    password: 'dbf2113d05da3f4e6de9d1ce13575859971714b2cb6eaa3c8da4aa8cb469d8e5',
    database: 'deksproc2dlgv', 
    host: 'ec2-54-155-200-16.eu-west-1.compute.amazonaws.com',
    port: 5432
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

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))