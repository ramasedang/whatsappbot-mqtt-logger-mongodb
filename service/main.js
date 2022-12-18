import mqtt from "mqtt";
import getLogService from "./resources/getLogService.js";
const wa = mqtt.connect("mqtt://localhost:1883");

wa.on("connect", function () {
  wa.subscribe("broker1");
});

wa.on("message", async function (topic, message) {
  var context = message.toString();
  let msg = context.split(" : ")[1];
  let phone = context.split(" : ")[0];

  if (msg === "Hello") {
    wa.publish("broker2", phone + " : " + msg);
  }
  if (msg === "Getlog") {
    let log = await getLogService(phone);
    let data = {
      phone_number: phone,
      message: JSON.stringify(log),
      topic: topic,
    };
    wa.publish("broker2", JSON.stringify(data));
  } else {
    let data = {
      phone_number: phone,
      message: "Command not found",
      topic: topic,
    };

    wa.publish("broker2", JSON.stringify(data));
  }
});
