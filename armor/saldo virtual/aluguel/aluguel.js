const fs = require("fs");

const { sendHours, saveJSON, isJsonIncludes, alerandom, letras, randomLetra, addNumberMais, identArroba, sendButton, sleep, contarMin, moment, sendFutureTime, allvaluerent } = require("../../../config.js")

const { NomeDoBot, NickDono, prefix, numerodono } = require("../../../dono/settings.json");

//================GRUPOS==============\\

const groupspath = `./base de funcionamento/saldo virtual/aluguel/grupos.json`

if(!fs.existsSync(groupspath)) {saveJSON([{id: "@m4thxyz_", save: sendHours("MM"), gps: []}], groupspath)}

const grupos = JSON.parse(fs.readFileSync(groupspath))

function saveGroupsRent() {saveJSON(grupos, groupspath)}

const isSaveGroup = (from) => {
  nmr = 0
  for(i of grupos) {
    if(from == i.id) nmr += 1
  }
  return nmr > 0 ? true : false
}

const getSaveGroup = (from) => {
  nmr = -1
  caixa = []
  for(i of grupos) {
    nmr += 1
    if(from == i.id) caixa.push(nmr)
  }
  if(caixa.length > 0) {
    AB = caixa[0]
    return grupos[AB]
  }
}

function addGroupInRent(from, validado = false) {
  sn = validado != true && validado != false ? false : validado
  if(!isSaveGroup(from)) {
    grupos.push({id: from, limite: 5, validado: sn})
    saveGroupsRent()
  } else {
    getSaveGroup(from).validado = sn
    saveGroupsRent()
  }
}

function rmGroupInRent(from) {
  nmr = -1
  caixa = []
  for(i of grupos) {
    nmr += 1
    if(from == i.id) caixa.push(nmr)
  }
  if(caixa.length > 0) {
    AB = caixa[0]
    grupos.splice(AB, 1)
    saveGroupsRent()
  }
}

//================ALUGUEL==============\\

const rentpath = `./base de funcionamento/saldo virtual/aluguel/aluguel.json`

if(!fs.existsSync(rentpath)) {saveJSON([], rentpath)}

const aluguel = JSON.parse(fs.readFileSync(rentpath))

function saveRent() {saveJSON(aluguel, rentpath)}

const sendTimeDay = (nmr) => {
  if(Number(nmr) > 1) {
    return `${Number(nmr)} dias`
  } else {
    hh = Number(sendHours('HH'))
    mm = Number(sendHours('mm'))
    ss = Number(sendHours('ss'))
    txt = `${60 - ss} segundo${ss < 59 ? 's' : ''}`
    if(mm < 59) txt = `${60 - mm} minutos`
    if(hh < 23) txt = `${24 - hh} horas`
    return txt
  }
}

const sendTimeHours = (txt) => {
  nmr = Number(txt)
  if(nmr <= 36) return `${nmr} hora${nmr != 1 ? `s` : ``}`
  dias = Number(nmr / 24).toFixed(0)
  return `${dias} dia${dias != 1 ? `s` : ``}`
}

const sendLetterTime = (txt) => {
  nmr = Number(txt)
  if(nmr <= 36) return `${nmr}h`
  dias = Number(nmr / 24).toFixed(0)
  return `${dias}d`
}

const isGroupInRent = (from) => {
  if(isJsonIncludes(aluguel, from)) return true
  return false
}

const getGroupRent = (from) => {
  AB = aluguel.map(i => i.id).indexOf(from)
  return aluguel[AB]
}

const valoresDeAluguel = allvaluerent.aluguel

const getValuesRent = (nmr) => {
  value = [{tempo: 0, valor: 0}]
  for(i of valoresDeAluguel) {
    if(Number(nmr) === i.tempo) value.push(i)
  }
  return value[value.length - 1]
}

async function addRent(reply, pc, blackmd, from, q) {
  groupName = (await blackmd.groupMetadata(from)).subject
    if(!isJsonIncludes(aluguel, from)) {
        if(!q.includes('/')) return reply(`Você vai colocar o número da pessoa que alugou e após isso uma barra ( / ). Após a barra, coloque a quantidade de dias que este alugou para seu grupo. Ex:
${pc} ${addNumberMais(numerodono)}/30d`)
        barra = q.replace(" /", "/").replace("/ ", "/").replace(" / ", "/")
        var [nmr, dias] = barra.split('/')
        day = dias.slice(0, dias.length-1)
        if(!Number(day)) return reply(day+` não é número... Use ${prefix+command} ${addNumberMais(nmrdn)}/30d`)
        if(Number(day) <= 0) return reply(`É necessário ao menos 1 hora de aluguel né`)
        if(dias.includes('.')) return reply("Não use números decimais")
        if(dias.slice(dias.length-1, dias.length).toLowerCase() === "h") { letra = 1
        } else if(dias.slice(dias.length-1, dias.length).toLowerCase() === "d") { letra = 24
        } else return reply("Retorne após o número uma letra como d/h, ex: 30d ou 24h")
        matheuzinho = identArroba(nmr)
        const [checkwpp] = await blackmd.onWhatsApp(matheuzinho)
        if(checkwpp == undefined) return reply(`O número ${matheuzinho.split('@')[0]} não é válido no whatsapp`)
        ttr = (Number(day) + 1) * letra
        addGroupInRent(from, true)
        aluguel.push({id: from, nome: groupName, tempo: ttr, totalRent: ttr, horario: sendHours("HH:mm"), cliente: matheuzinho, save: Number(sendHours(ttr > 48 ? "DD" : "HH")), cortesia: false})
        saveRent()
        reply(`*Grupo adicionado ao aluguel com sucesso* ✅`)
    } else {
        day = q.slice(0, q.length-1)
        if(!Number(day)) return reply(`Coloque quantos dias mais serão adicionados ao aluguel deste grupo... Ex: ${pc} 30d`)
        if(q.slice(q.length-1, q.length).toLowerCase() === "h") { letra = 1
        } else if(q.slice(q.length-1, q.length).toLowerCase() === "d") { letra = 24
        } else return reply("Retorne após o número uma letra como d/h, ex: 30d ou 24h")
        hehe = Number(day) * letra
        AB = aluguel.map(i => i.id).indexOf(from)
        aluguel[AB].cortesia = false
        aluguel[AB].nome = groupName
        aluguel[AB].totalRent = aluguel[AB].tempo + hehe
        aluguel[AB].tempo += hehe
        saveRent()
        addGroupInRent(from, true)
        reply(`+${sendLetterTime(hehe)} adicionad${letra == 1 ? "a" : "o"}${Number(day) > 1 ? 's' : ''} para este grupo`)
    }
}

const isCourtesyGroup = (from) => {
  if(isJsonIncludes(grupos[0].gps, from)) return true
  return false
}

function addCourtesy(reply, from) {
  if(isGroupInRent(from)) return reply(`Este grupo já está registrado no sistema de aluguel...`)
  addGroupInRent(from, true)
  ttr = 24
  aluguel.push({id: from, nome: ``, tempo: ttr, totalRent: ttr, horario: sendHours("HH:mm"), cliente: ``, save: Number(sendHours("HH")), cortesia: true})
  saveRent()
  grupos[0].gps.push(from)
  saveGroupsRent()
  reply(`💳 Card "courtesy 24h" liberado neste grupo com sucesso, válido até ${sendFutureTime([{valor: 1, type: `days`}])}`)
}

function tirarRent(from, reply, q) {
  dias = q
  day = dias.slice(0, dias.length-1)
  if(!Number(day)) return reply(day+` não é número... Use ${prefix+command} ${addNumberMais(nmrdn)}/30d`)
  if(Number(day) <= 0) return reply(`É necessário ao menos 1 hora de aluguel né`)
  if(dias.includes('.')) return reply("Não use números decimais")
  if(dias.slice(dias.length-1, dias.length).toLowerCase() === "h") { letra = 1
  } else if(dias.slice(dias.length-1, dias.length).toLowerCase() === "d") { letra = 24
  } else return reply("Retorne após o número uma letra como d/h, ex: 30d ou 24h")
  ttr = (Number(day)) * letra
  AB = aluguel.map(i => i.id).indexOf(from)
  aluguel[AB].tempo -= ttr
  saveRent()
  reply(`${q} retirad${letra == 1 ? "a" : "o"}${Number(args[0]) > 1 ? 's' : ''} deste grupo`)
}

function delRent(reply, from) {
  AB = aluguel.map(i => i.id).indexOf(from)
  grupo = aluguel[AB].nome
  aluguel.splice(AB, 1)
  saveRent()
  rmGroupInRent(from)
  reply(`📍 Grupo ${grupo} deletado do aluguel com sucesso ✔`)
}

async function rentContSystem(blackmd, sendMess, tempo) {
  if(aluguel.length > 0) {
    gp_numeral = -1
    for(a of aluguel) {
      gp_numeral += 1
      grupo = a.id
      cliente = a.cliente
      nome = a.nome
      if(a.tempo > 0) {
        if(a.tempo > 48) {
          if(Number(a.save) !== Number(sendHours("DD")) && contarMin(sendHours("HH:mm")) >= contarMin(a.horario)) {
            total = a.tempo
            sub = a.tempo
            while(sub > (total - 24)) {
              sub -= 1
              if(sub == (24 * 2) || sub == (24 * 3) || sub == (24 * 7)) blackmd.sendMessage(cliente, {text: `${tempo} @${cliente.split("@")[0]} 👋🏽😃\nSegundo consta em meus registros, o grupo ${nome} terminará o seu aluguel em ${Number(a.tempo) === (24 * 7) ? `1 semana (7 dias)` : Number(a.tempo / 24).toFixed(0) != 2 ? `${(Number(a.tempo / 24).toFixed(0)) - 1} dias` : `24 horas`}... Use o comando ${prefix}alugar para renovar o seu contrato com o melhor bot da região 📍\n_(OBS: Qualquer dúvida, contacte meu dono)_`, contextInfo: {mentionedJid: [cliente], forwardingScore: 1, isForwarded: true}})
            }
            a.tempo = sub
            a.save = sendHours("DD")
            saveRent()
          }
        } else {
          if(Number(a.save) !== Number(sendHours("HH"))) {
            if((a.tempo == 24 || a.tempo == 48) && !a.cortesia) blackmd.sendMessage(cliente, {text: `${tempo} @${cliente.split("@")[0]} 👋🏽😃\nSegundo consta em meus registros, o grupo ${nome} terminará o seu aluguel em ${Number(a.tempo / 24).toFixed(0) != 1 ? `${(Number(a.tempo / 24).toFixed(0)) - 1} dias` : `24 horas`}... Use o comando ${prefix}alugar para renovar o seu contrato com o melhor bot da região 📍\n_(OBS: Qualquer dúvida, contacte meu dono)_`, contextInfo: {mentionedJid: [cliente], forwardingScore: 1, isForwarded: true}})
            a.tempo -= 1
            a.save = sendHours("HH")
            saveRent()
          }
        }
      } else {
        if(a.tempo == 0) {
          a.tempo -= 1
          saveRent()
          data = await blackmd.groupMetadata(grupo)
          admins = []
          for(d of data.participants) {if(d.admin != null) admins.push(d.id)}
          blackmd.sendMessage(grupo, {text: `\t\t⚠️ *TRANSMISSÃO DO BLACK* ⚠️\n\n\`\`\`O tempo limite deste grupo acabou. Para renovação de contrato, use o comando ${prefix}alugar ou entre em contato com meu dono:\`\`\`\nwa.me/${identArroba(numerodono).split('@')[0]}`, mentions: admins})
          await sleep(1000)
          blackmd.sendMessage(identArroba(numerodono), {text: `💆🏻‍♂️ ${tempo} meu chefe, o grupo ${nome} expirou o aluguel neste exato momento... Visto que o cliente @${cliente.split("@")[0]} não renovou contrato, eu saí do grupo e deletei os dados dele 🗑`, contextInfo: {mentionedJid: [cliente], forwardingScore: 999, isForwarded: true}})
          await sleep(500)
          aluguel.splice(gp_numeral, 1)
          saveRent()
          rmGroupInRent(grupo)
          await sleep(4000)
          blackmd.groupLeave(grupo)
        }
      }
    }
  }
}

module.exports = { groupspath, grupos, saveGroupsRent, addGroupInRent, rmGroupInRent, aluguel, saveRent, sendTimeDay, sendTimeHours, sendLetterTime, isGroupInRent, getGroupRent, addRent, isCourtesyGroup, addCourtesy, tirarRent, delRent, rentContSystem, valoresDeAluguel, getValuesRent, getSaveGroup, isSaveGroup }