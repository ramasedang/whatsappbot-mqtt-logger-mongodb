import got from 'got';

const response = await got('https://shortener.its.ac.id/', {
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Cookie': 'PHPSESSID=oibei1s39duhvn0cc9c3q5pvob; XSRF-TOKEN=eyJpdiI6Ijc1WExkbG5INlljRk9rZlJrdWhYQnc9PSIsInZhbHVlIjoibHRCNkZxQVZXdmVMWUdVUzJVZlFieGVcLytVZUNLcVRBNDEycnJ5ZGVOdlVcL3drRUZIK2JJaERxQWxKTkptSHlha2V1VU5wVmVwVVlHQkhQUnl1cEpVUT09IiwibWFjIjoiMjEzYWM2NzVhNTk3M2Q1YTUxOTdmMGZkOTQ4ZjFjMTlhYTMyOGNiZGY4OWY3N2I5YmJkMWE3Y2IwMmM5YmNmMyJ9; laravel_session=eyJpdiI6IkVwalwvMUU1SUQ0bW4yXC9IeFwvZTRLRlE9PSIsInZhbHVlIjoiYlBqQ2FIUVNzcXgrZkZoZ0J4RGlRZ1wvUEtiYlpzdmZWaHpvazI1OTRxZkR6VDlKamNnYzRib29Ba1l3WjFNc3VtUjlSejJITWpcLzJwU1krQlBmME5Ndz09IiwibWFjIjoiYzlhODgzZGJmNWU5MzdlZTg0MTZjZTEyNTdiMmY4YzNjYmE4ZDgyZGYyZmNkMDkwMzVmNmFjMWEyNTkzMGQwOCJ9',
        'Referer': 'https://my.its.ac.id/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-User': '?1',
        'Sec-GPC': '1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }
});
console.log(response.body);