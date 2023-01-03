import mqtt from "mqtt";
import { deleteAll, getLogService } from "./resources/getLogService.js";
import getNilai from "./resources/getNilai/getNilai.js";
import { presensi } from "./resources/presensi/presensiService.js";
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

wa.on("connect", () => {
  wa.subscribe(topic1);
});

wa.on("message", async (topic, message) => {
  var data = JSON.parse(message.toString());
  var msg = data.msg;
  const quote = data.quote;
  let targetSender = data.targetSender;
  console.log(data);
  let media = data.mediaData;
  const spasi = /\s/;
  if (spasi.test(msg)) {
    msg = msg.split(" ");
  }
  console.log(quote);
  // System Command
  if (quote != null && msg === "!repeat") {
    msg = quote.split(" ");
  }

  // Custom Command
  if (msg === "!help") {
    await sendWa(
      targetSender,
      "List perintah: \n!nilai [NRP] [Password] \n!help",
      topic1
    );
  } else if (msg === "!halo") {
    await sendWa(targetSender, "Halo juga", topic1);
  } else if ((msg[0] || msg) == "!nilai") {
    try {
      const nrp = msg[1];
      const password = msg[2];
      console.log(nrp, password);
      await sendWa(targetSender, "Sedang mengambil data...", topic1);
      let result = await getNilai(nrp, password);
      await sendWa(targetSender, result, topic1);
    } catch (error) {
      console.log(error);
    }
  } else if (msg === "!log") {
    let result = await getLogService();
    await sendWa(targetSender, result, topic1);
  } else if (msg === "!delete") {
    await deleteAll();
    await sendWa(targetSender, "Log berhasil dihapus", topic1);
  } else if ((msg[0] || msg) === "!presensi") {
    await sendWa(targetSender, "Sedang melakukan presensi ...", topic1);
    let result = await presensi(msg[1]);
    await sendWa(targetSender, result, topic1);
  }
  // Masukan command Media disini
  else if (media.mimetype == "audio/ogg; codecs=opus") {
    if (msg === "nilai") {
      await sendWa(targetSender, "Sedang mengambil data..", topic1);
      let result = await getNilai("5027211045", "081Sultan");
      await sendWa(targetSender, result, topic1);
    } else if (msg === "") {
      wa.publish("broker1/voice", JSON.stringify(data));
    } else if (msg === "halo") {
      await sendWa(targetSender, "Halo juga", topic1);
    } else if (msg[0] === "sekarang" && msg[2] === "berapa") {
      let tanggal = new Date();
      await sendWa(targetSender, tanggal, topic1);
    }
  }
  // Masukan command baru disini
  else {
    await sendWa(targetSender, "Maaf, perintah tidak ditemukan", topic1);
  }
});
