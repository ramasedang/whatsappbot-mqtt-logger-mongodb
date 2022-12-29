import mqtt from "mqtt";
import { deleteAll, getLogService } from "./resources/getLogService.js";
const wa = mqtt.connect("mqtt://8.219.195.118:1883");
const topic1 = "broker1";
const topic2 = "broker2";

async function sendWa(phone, message, topic) {
  let data = {
    phone_number: phone,
    message: message,
    topic: topic,
  };
  wa.publish(topic2, JSON.stringify(data));
}

wa.on("connect",  () => {
  wa.subscribe(topic1); 
});

wa.on("message", async (topic, message) => {
  var data = JSON.parse(message.toString());
  let msg = data.msg;
  let targetSender = data.targetSender;
  console.log(data);
  switch (msg) {
    case "!halo":
      sendWa(targetSender, "Halo juga " + data.name, topic);
      break;

    case "!log":
      try {
        let log = await getLogService();
      sendWa(targetSender, log, topic);
      break;
      } catch (error) {
        console.log(error);
      }

    case "!delete":
      try {
        let deleteLog = await deleteAll();
      sendWa(targetSender, "Berhasil mengahpus log", topic);
      break;
      } catch (error) {
        console.log(error);
      }

    case "!help":
      sendWa(
        targetSender,
        "Berikut adalah perintah yang tersedia:\n!halo\n!log\n!delete\n!help",
        topic
      );
      break;

    // masukan perintah lainnya disini
    default:
      sendWa(targetSender, "Maaf, perintah tidak dikenali", topic);
      break;
  }
});
