import mosca from 'mosca';

const settings = {
    port:1883
    }

const server = new mosca.Server(settings);

server.on('ready', function(){
console.log("Status: Ready\n");
console.log("*Broker siap menerima & mengirim data.\n");
});