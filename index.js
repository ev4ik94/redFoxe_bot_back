const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const webApp_url = 'https://dynamic-cheesecake-27bd73.netlify.app/'
const token = '5739592120:AAF20DknTLTSYiqEiuPfZU2PYP1KCr9hBp4';


const bot = new TelegramBot(token, {polling: true});

const app = express()
app.use(express.json())
app.use(cors())


bot.on('message', async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text==='/start'){
        // await bot.sendMessage(chatId, 'Ниже появится кнопка, заполните форму', {
        //     reply_markup: {
        //         inline_keyboard: [
        //             [{text: 'Сделать заказ', web_app: {url:webApp_url+'/form'}}]
        //         ]
        //     }
        // });

        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполните форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url:webApp_url+'/form'}}]
                ]
            }
        });
    }
    console.log(msg)

    if(msg?.web_app_data?.data){
        try{
            const data = JSON.parse(msg?.web_app_data?.data)
            await bot.sendMessage(chatId, `City: ${data?.city}`)
        }catch(e){
            console.log(e)
        }
    }


});


app.post('/web-data', async(req,res)=>{
    const {queryId, products, totalPrice} = req.body

    try{
        await bot.answerWebAppQuery(queryId, {
            type:'article',
            id: queryId,
            title: `Список товаров в Корзине`,
            input_message_content: {
                message_text: `${products.map(item=>`${item.name} - ${item.price} сум`).join('\n')} \n Общас сумма ${totalPrice} сум`
            }
        })
        return res.status(500).json({})
    }catch (e){
        await bot.answerWebAppQuery(queryId, {
            type:'article',
            id: queryId,
            title: `Не удалось добавить в Корзину`,
            input_message_content: {
                message_text: `Ошибка`
            }
        })

        return res.status(500).json({})
    }
})

app.listen(8000, ()=>{
    console.log('server run in 8000 PORT')
})