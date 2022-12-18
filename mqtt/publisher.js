import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
    setInterval(function () {
      client.publish('myTopic', 'Hallo subscriber'); // mengirim data
      console.log('mengirim data => [hallo subscriber]');
    }, 5000);
  });