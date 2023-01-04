import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
const A = 4.0;
const AB = 3.5;
const B = 3.0;
const BC = 2.5;
const C = 2.0;
const D = 1.0;
let nilai_sementara = 0;
let sks_sementara = 0;
let nilai_akhir = nilai_sementara / sks_sementara;

const getNilai = async (nrp, pass) => {
  var data = [];
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-web-security",
      "--disable-gpu",
    ],
  });
  const page = await browser.newPage();
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(
    "https://www.google.com/url?sa=t&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjDxpWyip77AhW0SmwGHWlpAHwQFnoECAwQAQ&url=https%3A%2F%2Fmy.its.ac.id%2F&usg=AOvVaw2eMWHwlcvs5ef75gAthUJN"
  );
  await page.waitForSelector("#username");
  await page.type("#username", nrp);
  await page.click("#continue");
  await page.waitForSelector("#password");
  await page.type("#password", pass);
  await page.click("#login").then(async () => {
    await page.waitForSelector(
      "#main-container > div:nth-child(2) > div > div.block-header > h3"
    );

    await page.goto("https://akademik.its.ac.id/home.php").then(async () => {
      await page.goto("https://akademik.its.ac.id/list_frs.php");
    });
  });

  const html = await page.content();
  const $ = cheerio.load(html);
  $("#sipform > table.GridStyle > tbody > tr").each((i, el) => {
    const matkul = $(el).find("td:nth-child(2)").text();
    const sks = $(el).find("td:nth-child(3)").text();
    var nilai = $(el).find("tr > td:nth-child(7)").text().split(" ")[0];
    nilai = nilai.replace("\n\t\t\t\t", "");
    data.push({
      matkul: matkul,
      sks: sks,
      nilai: nilai,
    });
  });
  for (let i = 15; i > 9; i--) {
    data.pop();
  }
  data.shift();
  let msg = "";
  for (let i = 0; i < data.length; i++) {
    msg += `Mata Kuliah: ${data[i].matkul}\nSKS: ${data[i].sks}\nNilai: ${data[i].nilai}\n\n`;
    hitungNilai(data[i].sks, data[i].nilai);
  }
  msg += `IPS: ${nilai_akhir}`;
  await browser.close();
  return msg;
};

const hitungNilai = async (sks, nilai) => {
  if (nilai == "A") {
    nilai_sementara += sks * A;
    sks_sementara += sks;
  } else if (nilai == "AB") {
    nilai_sementara += sks * AB;
    sks_sementara += sks;
  } else if (nilai == "B") {
    nilai_sementara += sks * B;
    sks_sementara += sks;
  } else if (nilai == "BC") {
    nilai_sementara += sks * BC;
    sks_sementara += sks;
  } else if (nilai == "C") {
    nilai_sementara += sks * C;
    sks_sementara += sks;
  } else if (nilai == "D") {
    nilai_sementara += sks * D;
    sks_sementara += sks;
  }
};

export default getNilai;
