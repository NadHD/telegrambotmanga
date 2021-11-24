const { Telegraf } = require('telegraf')
const bot = new Telegraf('2110225858:AAGPjnDrQ3skov42uYLZ32RzsqCol5dXk-E')
const { Client } = require('pg');

const con = new Client({
  user: 'oqwbxqejjailno',
  host: 'ec2-3-248-87-6.eu-west-1.compute.amazonaws.com',
  database: 'd28nmt9tcqrc7g',
  password: 'f0c81f84afad27cb7c2e4049c52d388109f2379545d17e578ab5321805d1b29d',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

con.connect();
 
let queryResult =  []
let index = 0;
let join = 'SELECT "volumi"."codv", "nome", "numero", "variant", "special", "posseduto", "costo" FROM "volumi" INNER JOIN "collezione" ON "volumi"."codv" = "collezione"."codv"'

bot.start((message) => {
	return message.reply('Il bot è avviato e connesso')
})

bot.command('comandi', context=>{
  context.reply('Ecco una lista dei comandi da usare:\n\n/collezione: per ottenere un recap della collezione\n\n' + 
  '/volumi: per ottenere tutti i volumi nella collezione\n\n/indice: per ottenere l\'indice dei titoli in collezione\n\n' +
  '/[indice]: sostituire [indice] con l\'indice relativo al titolo per ottenere la lista dei volumi per quel titolo\n\n' + 
  '/add: per aggiungere un volume alla collezione\n\n/addcol: per aggiungere un nuovo titolo alla collezione')
})

bot.command('indice', context=> {
  con.query("SELECT * FROM collezione", function (err, result) {
    if (err) throw err;
    let str = '';
    for (const row of result.rows){
      str = str + '/' + row.codv + ' ' + row.nome + '\n';
    }
    context.reply(str);
  });
})

bot.command('si', context=>{
  if(queryResult.length == 0){
    context.reply("Sono d'accordo")
  }
  else if(index == 0 && queryResult.length == 1){
    context.reply(queryResult[index] + '\nPagina ' + (index + 1) + ' di ' + queryResult.length)
    queryResult = [];
    index = 0;
  }
  else if(index == 0 && queryResult.length != 0){
    context.reply(queryResult[index] + '\nPagina 1 di ' + queryResult.length + '\nScrivi /next per la prossima pagina...')
    index++
  }
  else context.reply(index + ' ' +  ' ' + queryResult.length + "Pagina già inviata, scrivi /next per avere la prossima.")
})

bot.command('no', context=>{
  if(queryResult.length == 0){
    context.reply('Ovviamente...')
  }
  else {
    context.reply('Non invio la lista.')
    queryResult = []
    index = 0
  }
})

bot.command('next', context=>{
  let len = queryResult.length
  if(len != 0 && index < queryResult.length - 1){
    context.reply(queryResult[index] + '\nPagina ' + (index + 1) + ' di ' + queryResult.length + '\nScrivi /next per la prossima pagina...')
    index++;
  }
  else if (len != 0 && index == queryResult.length - 1){
    context.reply(queryResult[index] + '\nPagina ' + (index + 1) + ' di ' + queryResult.length)
    queryResult = [];
    index = 0;
  }
  else context.reply('Ma Next che?')
})

bot.command('volumi', context=>{
  con.query(join, function (err, result) {
    if (err) throw err;
    queryResult = format(result);
    context.reply("La lista è lunga " + queryResult.length + " pagine. Inviare? /si o /no")
  })
})

bot.on('text', context=>{
  let txt = context.update.message.text
  let cmd = txt.substring(1)
  let num = Number(cmd)
  if(Number.isNaN(num) != true){
    con.query(join + ' WHERE "volumi"."codv" = ' + num, function(err, result){
      if (err) throw err;
      queryResult = format(result);
      context.reply("La lista è lunga " + queryResult.length + " pagine. Inviare? /si o /no")
    });
  }
});

function format(result){
  let array = [];
  let str = '';
  let term = '';
  let poss = '';
  let vari = '';
  let spec = '';
  let count = 0;
  let cod = 0;
  for (const row of result.rows){
    if(row.codv != cod){
      str = str + '\nCodice: ' + row.codv + '\n'
      cod = row.codv
    }
    if(row.posseduto == 1) poss = 'In collezione'
    else poss = 'Da comprare'
    if(row.variant == 1) vari = ' Variant' 
    else vari = ''
    if(row.special == 1) spec = ' Edizione speciale'
    else spec = ''
    if(row.terminata == 1) term = ', Serie Terminata'
    else term = ''
    str = str + row.nome + ' ' + row.numero 
    + vari + spec + ', Prezzo: ' + row.costo 
    + ' €, ' + poss + term + '\n';
    count++;
    if(count%50 == 0){
      array[array.length] = str
      str = '';
    }
    else if(str != '' && count == result.rows.length){
      array[array.length] = str
    }
  }

  return array;
}

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))