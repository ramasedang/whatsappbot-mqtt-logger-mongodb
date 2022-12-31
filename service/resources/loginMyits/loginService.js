import puppeteer from "puppeteer";
import * as fs from "fs";

const loginService = async (nrp, pass) => {
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
  await page.setRequestInterception(true);
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
  });
  const cookies1 = await page.cookies();
  await page.goto("https://presensi.its.ac.id/dashboard");
  const cookies2 = await page.cookies();
  const fixCookies = cookies1.concat(cookies2);
  const checkDir = fs.existsSync("./cookies.json");
  if (checkDir) {
     fs.unlinkSync("./cookies.json");
  }
   fs.writeFileSync("./cookies.json", JSON.stringify(fixCookies));
  await browser.close();
};
// loginService("5027211045", "081Sultan");

export { loginService };
