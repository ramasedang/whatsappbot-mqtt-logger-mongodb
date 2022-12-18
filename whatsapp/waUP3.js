import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import mqtt from "mqtt";

const waMqtt = mqtt.connect("mqtt://localhost:1883");

const { Client, LocalAuth } = pkg;

const waUP3 = function () {
  const wa = new Client({
    authStrategy: new LocalAuth(),
  });

  wa.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  wa.on("ready", () => {
    console.log("Client is ready!");
  });

  wa.on("message", (message) => {
    console.log(message.body);
    let phone = message.from.split("@")[0];
    waMqtt.publish("broker1", phone + " : " + message.body);
  });

  waMqtt.on("connect", function () {
    waMqtt.subscribe("broker2");
  })

  waMqtt.on("message", async function (topic, message) {
    var data = JSON.parse(message.toString());
    let phone = data.phone_number;
    let msg = data.message;
    let topic_ = data.topic;
    wa.sendMessage(phone + "@s.whatsapp.net", msg);
    console.log(data);
  });


  wa.initialize();
};

waUP3();
export default waUP3;
