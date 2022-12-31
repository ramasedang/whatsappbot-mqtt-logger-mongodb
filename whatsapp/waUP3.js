import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import mqtt from "mqtt";
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";



const { Client, LocalAuth, RemoteAuth } = pkg;

const waUP3 = () => {
  mongoose
    .connect(
      "mongodb+srv://root:root@cluster0.ateetri.mongodb.net/%3FretryWrites=true&w=majority"
    )
    .then( () => {
      const waMqtt = mqtt.connect("mqtt://8.219.195.118:1883");
      const store = new MongoStore({ mongoose: mongoose });

      const wa = new Client({
        authStrategy: new RemoteAuth({
          store: store,
          backupSyncIntervalMs: 300000,
        }),
        puppeteer: {
          args: ["--no-sandbox"],
        },
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
        console.log(
          JSON.stringify({
            name,
            no_sender,
            no_group,
            msg,
            quote,
            targetSender,
          })
        );
        waMqtt.publish(
          "broker1",
          JSON.stringify({
            name,
            no_sender,
            no_group,
            msg,
            quote,
            targetSender,
          })
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
      });

      wa.initialize();
    });
};

waUP3();
export default waUP3;
