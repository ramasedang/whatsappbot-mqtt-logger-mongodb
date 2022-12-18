import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
    client.subscribe('myTopic')
})
client.on('message', function (topic, message) {
    var context = message.toString();
    console.log(context)
})