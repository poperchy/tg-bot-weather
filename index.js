const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios');
const token = '5661922741:AAHkyE22j9xcdchqDUmqK7_iOi9FBa7G3oU';
const api = '960047d09aee18009b5b51f962292d8f';

const weatherEndpoint = (city) => (
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${api}`
);

const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;

// Template for weather response
const weatherHtmlTemplate = (name, main, weather, wind, clouds) => (
        `Погода в <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Температура: <b>${main.temp} °C</b>
Давление: <b>${main.pressure} hPa</b>
Влажность: <b>${main.humidity} %</b>
Ветер: <b>${wind.speed} meter/sec</b>
Облака: <b>${clouds.all} %</b>
`
);

const bot = new TelegramApi(token, {
    polling: true
});


const getWeather = (chatId, city) => {
    const endpoint = weatherEndpoint(city);

    axios.get(endpoint).then((resp) => {
        const {
            name,
            main,
            weather,
            wind,
            clouds
        } = resp.data;

        bot.sendPhoto(chatId, weatherIcon(weather[0].icon))
        bot.sendMessage(
            chatId,
            weatherHtmlTemplate(name, main, weather[0], wind, clouds), {
                parse_mode: "HTML"
            }
        );
    }, error => {
        console.log("error", error);
        bot.sendMessage(
            chatId,
            `Ooops...I couldn't be able to get weather for <b>${city}</b>`, {
                parse_mode: "HTML"
            }
        );
    });
}

bot.onText(/\/weather/, (msg, match) => {
    const chatId = msg.chat.id;
    const city = match.input.split(' ')[1];

    if (city === undefined) {
        bot.sendMessage(
            chatId,
            `Please provide city name`
        );
        return;
    }
    getWeather(chatId, city);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `Welcome at <b>MyTestWeatherInfoBot</b>
    
Available commands:

/weather <b>city</b> - shows weather for selected <b>city</b>
  `, {
            parse_mode: "HTML"
        }
    );
});