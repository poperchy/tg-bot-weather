const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5661922741:AAHkyE22j9xcdchqDUmqK7_iOi9FBa7G3oU'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



bot.setMyCommands([
    {command: '/start', description: 'This is start'},
    {command: '/info', description: 'THis is Info'},
    {command: '/game', description: 'THis is Game'},
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `choose number`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'otgadivay', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {


        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, 'Hello mother fucker')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Hello ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'ya ne ponimay tebya')
        console.log(msg)
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)

        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `congratulations ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `plak plak ${chats[chatId]}`, againOptions)

        }
        // bot.sendMessage(chatId, `your choose ${data}`)
        console.log(msg)
    })
}

start()