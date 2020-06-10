const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const keyboard = require('./keyboard/keyboard')
const  bt = require('./keyboard/buttun')
const unirest = require('unirest')
const bot = new TelegramBot(config.TOKEN, {polling: true})


bot.on('message', msg => {
    const chat_id = msg.chat.id

    switch (msg.text) {
        case bt.home.start:
            bot.sendMessage(chat_id, 'Menu', {
                reply_markup: {
                    keyboard: keyboard.menu
                }
            })
            break
        case bt.home.about:
            bot.sendMessage(chat_id, 'Привет, этот бот собирает информацию о распространении covid-19, по РБ и РФ')
            break
        case bt.menu.belarus:
            let data
                var req = unirest("GET", "https://covid-193.p.rapidapi.com/statistics")

                req.headers({
                    "x-rapidapi-host": "covid-193.p.rapidapi.com",
                    "x-rapidapi-key": "5edb29b096mshb64ec6c8c1a257cp13f62ejsn20375450de9b",
                    "useQueryString": true
                })

                req.query({
                    "country": "Belarus"
                })

                req.end(function (res) {
                    if (res.error) throw new Error(res.error)

                    data = res.body

                    let content = (data.response[0])

                    bot.sendMessage(chat_id, `Страна: ${content.country}\nНаселение: ${content.population}\nЗа сегодня: ${content.cases.new}\nВсего: ${content.cases.total}\nСмертей: ${content.deaths.total}\nДата: ${content.day}\n`)
                })

            break
        case bt.menu.russia:
            var req = unirest("GET", "https://covid-193.p.rapidapi.com/statistics");

            req.query({
                "country": "Russia"
            });

            req.headers({
                "x-rapidapi-host": "covid-193.p.rapidapi.com",
                "x-rapidapi-key": "5edb29b096mshb64ec6c8c1a257cp13f62ejsn20375450de9b",
                "useQueryString": true
            });


            req.end(function (res) {
                if (res.error) throw new Error(res.error);

                let data = res.body

                let content = (data.response[0])

                bot.sendMessage(chat_id, `Страна: ${content.country}\nНаселение: ${content.population}\nЗа сегодня: ${content.cases.new}\nВсего: ${content.cases.total}\nСмертей: ${content.deaths.total}\nДата: ${content.day}\n`)

            });
            break
        case bt.menu.back:
            bot.sendMessage(chat_id, 'Назад', {
                reply_markup: {
                    keyboard: keyboard.home
                }
            })
            break
    }

})


bot.onText(/\/start/, query => {
    bot.sendMessage(query.chat.id, 'start', {
        reply_markup: {
            keyboard: keyboard.home
        }
    })
})