import fse from "fs-extra/esm";
import * as fs from "fs";
import got from "got";
import { loginService } from "../loginMyits/loginService.js";
import * as cheerio from "cheerio";

const presensi = async (kode_akses) => {
  let data = [];
  let data_tmid = [];
  const lat = "-7.281636";
  const long = "112.795435";
  await loginService("5027211045", "081Sultan");
  const cookies = await fse.readJSON("./cookies.json");
  const cookie = cookies.map((c) => `${c.name}=${c.value}`);
  const phpsessidRegex = /PHPSESSID=\w+/;
  const tvmsessidRegex = /TVMSESSID=\w+/;
  let phpsessid;
  let tvmsessid;

  for (const item of cookie) {
    const phpsessidResult = item.match(phpsessidRegex);
    if (phpsessidResult) {
      phpsessid = phpsessidResult[0];
    }
    const tvmsessidResult = item.match(tvmsessidRegex);
    if (tvmsessidResult) {
      tvmsessid = tvmsessidResult[0];
    }
  }
  console.log(phpsessid);
  console.log(tvmsessid);
  try {
    const kesehatan = await got.post('https://presensi.its.ac.id/healthcheck/daily/mhssave', {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.6',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Cookie': `${phpsessid}`,
        'Origin': 'https://presensi.its.ac.id',
        'Referer': 'https://presensi.its.ac.id/healthcheck/daily/mhs',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Sec-GPC': '1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      },
      form: {
        'is-confirmed': '0',
        'result1': '1',
        'result2': '1'
      }

    });
  } catch (error) {

  }
  const html = await got("https://presensi.its.ac.id/dashboard", {
    headers: {
      Cookie: `${phpsessid}`,
    },
  });
  // console.log(html.body);

  const $ = cheerio.load(html.body, {
    xmlMode: true,
    decodeEntities: true, // Decode HTML entities.
    withStartIndices: false, // Add a `startIndex` property to nodes.
    withEndIndices: false, // Add an `endIndex` property to nodes.
    normalizeWhitespace: false, // Normalize whitespace to single spaces.
  });
  const selector =
    "#main-container > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > ul > li";
  $(selector).each((i, el) => {
    const raw = $(el).find("a").text();
    const link = $(el).find("a").attr("href");
    const courseCode = raw.split("\n")[1].trim();
    const courseName = raw.split("\n")[3].trim();
    const courseLink = link;
    data.push({
      courseCode,
      courseName,
      courseLink,
    });
  });

  fs.writeFileSync("listMatkul.json", JSON.stringify(data));
  const listMatkul = await fse.readJSON("./listMatkul.json");
  for (let x = 0; x < listMatkul.length; x++) {
    const html_matkul = await got(listMatkul[x].courseLink, {
      headers: {
        Cookie: `${phpsessid}`,
      },
    });
    const $2 = cheerio.load(html_matkul.body, {
      xmlMode: true,
      decodeEntities: true, // Decode HTML entities.
      withStartIndices: false, // Add a `startIndex` property to nodes.
      withEndIndices: false, // Add an `endIndex` property to nodes.
      normalizeWhitespace: false, // Normalize whitespace to single spaces.
    });
    const selector_2 =
      "#main-container > div > div > div.block > div > div.table-responsive.d-none.d-sm-block > table > tbody";
    $2(selector_2).each((i, el) => {
      $2(el)
        .find("tr")
        .each((i, el) => {
          let tmid = $2(el)
            .find(
              "tr > td > button.btn.btn-sm.btn-its-primary.mr-5.mb-5.btn-hadir-mahasiswa.w-75"
            )
            .attr("data-tmid");
          data_tmid.push(tmid);
        });
    });
    data_tmid = data_tmid.filter((item) => item !== undefined);
    fs.writeFileSync("listTmid.json", JSON.stringify(data_tmid));
    for (let i = 0; i < data_tmid.length; i++) {
      console.log(data_tmid[i]);
      const goPresensi = await got.post('https://presensi.its.ac.id/kehadiran-mahasiswa/updatehadirmhs', {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.6',
          'Connection': 'keep-alive',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': `${phpsessid}`,
          'Origin': 'https://presensi.its.ac.id',
          'Referer': listMatkul[x].courseLink,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-GPC': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        },
        form: {
          'kode_akses': kode_akses,
          'id_tm': data_tmid[i],
          'jns_hadir': 'H',
          'id_kelas': listMatkul[x].courseLink.split('/')[5],
          'jns_hdr_tm': 'D',
          'lat': lat,
          'lon': long,
        }
      });
      console.log(goPresensi.body);
    }

  }

  return("Presensi Berhasil");
};

export default presensi;