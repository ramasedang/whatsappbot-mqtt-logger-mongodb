import mqtt from "mqtt";
import { PrismaClient } from "@prisma/client";

const client = mqtt.connect("mqtt://localhost:1883");
const prisma = new PrismaClient();

client.on("connect", () => {
  client.subscribe("broker1");
  console.log("Connected to MQTT");
});

client.on("message", async (topic, message) => {
  var data = JSON.parse(message.toString());

  await prisma.loggers.create({
    data: {
      no_sender: data.no_sender,
      no_group: data.no_group,
      name: data.name,
      message: data.msg,
      quoted_message: data.quote,
      topic: topic,
    },
  });
});
