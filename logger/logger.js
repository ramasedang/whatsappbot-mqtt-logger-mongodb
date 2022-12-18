import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';

const client = mqtt.connect('mqtt://localhost:1883');
const prisma = new PrismaClient()

client.on('connect', function () {
    client.subscribe('broker1')
    console.log('Connected to MQTT')
})

client.on('message', async function (topic, message) {
    let messageString = message.toString();
    let context = messageString.split(" : ")[1];
    let phone =  messageString.split(" : ")[0];
    console.log(phone, context, topic)

    await prisma.logger.create({
        data :{
            phone_number: phone,
            message: context,
            topic: topic
        }
    })
})