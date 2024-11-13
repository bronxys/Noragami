const axios = require("axios");
const Crypto = require("crypto")
const { ImageUploadService } = require('node-upload-images');

async function pixhost(buffer) {
  return new Promise(async(resolve, reject) => {
    try {
        let resposta = {};
        const service = new ImageUploadService('pixhost.to');
        await service.uploadFromBinary(buffer, Crypto.randomBytes(10).toString('hex') + ".png")
        .then(({ directLink }) => {
                resposta.resultado = directLink;
                resolve(resposta);
            }).catch((error)=>{
                resposta.erro = "Houve um erro no upload da imagem.";
                reject(resposta);
            })
        } catch(err){
            reject({ erro: "Houve um erro no upload da imagem." })
        }
    })
}

async function imgur(media) {
  return new Promise(async(resolve, reject) => {
    try {
      const convert64 = media.toString('base64');
      const response = await axios.post('https://api.imgur.com/3/image', {
        image: convert64, 
        type: 'base64'
      }, {
          headers: { 
            'Authorization': 'Client-ID b3db908dbe6a8a1'
        }
      });
       if (response.data && response.data.data && response.data.data.link) {
         resolve(response.data.data.link);
       } else {
          reject(JSON.stringify(response.data));
       }
    } catch (erro) {
        reject('Erro no upload: ' + erro.message);
    }
 });
}

module.exports = { pixhost, imgur }