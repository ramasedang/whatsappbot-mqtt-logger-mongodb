import got from 'got';

const response = await got.post('https://presensi.its.ac.id/kehadiran-mahasiswa/updatehadirmhs', {
    headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.6',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'PHPSESSID=v1p74o69slk5gjqggnlqv8okq6',
        'Origin': 'https://presensi.its.ac.id',
        'Referer': 'https://presensi.its.ac.id/tatap-muka/20221:53100:IT184304:A',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    },
    form: {
        'kode_akses': '722019',
        'id_tm': '405906',
        'jns_hadir': 'H',
        'id_kelas': '20221:53100:IT184304:A',
        'jns_hdr_tm': 'L',
        'lat': '-7.2484',
        'lon': '112.7419'
    }
    
});

console.log(response.body);