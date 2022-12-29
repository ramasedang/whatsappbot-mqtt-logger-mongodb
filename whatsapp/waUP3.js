import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import mqtt from "mqtt";

const waMqtt = mqtt.connect("ws://localhost:1883");

const { Client, LocalAuth } = pkg;

const waUP3 = () => {
  const wa = new Client({
    authStrategy: new LocalAuth(),
  });

  wa.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  wa.on("ready", () => {
    console.log("Client is ready!");
  });

  wa.on("message", async (message) => {
    const isGroupMsg = message.from.includes("@g.us");
    let typeChat = isGroupMsg ? "group" : "private";
    let test = await message.getQuotedMessage();
    let quote = test ? test.body : "null";
    let name = (await message.getContact()).pushname;
    let no_sender = (await message.getContact()).number;
    let no_group = "null";
    let targetSender = message.from;
    if (typeChat == "group") {
      no_group = message.from.split("@")[0];
    }
    let msg = message.body;
    // console.log(
    //   JSON.stringify({ name, no_sender, no_group, msg, quote, targetSender })
    // );
    waMqtt.publish(
      "broker1",
      JSON.stringify({ name, no_sender, no_group, msg, quote, targetSender })
    );
  });

  waMqtt.on("connect", () => {
    waMqtt.subscribe("broker2");
  });

  waMqtt.on("message", async (topic, message) => {
    var data = JSON.parse(message.toString());
    let phone = data.phone_number;
    let msg = data.message;
    wa.sendMessage(phone, msg);
    // console.log(data);
  });

  wa.initialize();
};

waUP3();
export default waUP3;
