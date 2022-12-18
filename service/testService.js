import mqtt from "mqtt";
import { PrismaClient } from "@prisma/client";

const wa = mqtt.connect("mqtt://localhost:1883");
const prisma = new PrismaClient();

wa.on("connect", function () {
  wa.subscribe("broker1");
});

wa.on("message", async function (topic, message) {
  var context = message.toString();
  let msg = context.split(" : ")[1];
  let phone = context.split(" : ")[0];
  

  if (msg === "Hello") {
    let data ={
        phone_number: phone,
        message: msg,
        topic: topic
      }
    wa.publish("broker2", JSON.stringify(data));
  }
  if(msg === "Getlog"){
    let log = await prisma.logger.findMany({
        select: {
            phone_number: true,
            message: true,
        }
    });
    
    let data ={
        phone_number: phone,
        message: JSON.stringify(log),
        topic: topic
    }
    wa.publish("broker2", JSON.stringify(data));
  }
});
