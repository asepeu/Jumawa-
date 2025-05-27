const commands = ['suit', 'tebakangka', 'tebakkata']

let tebakanKataRahasia = 'openai'
let tebakanKataJawaban = null
let tebakanAngkaJawaban = null

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function execute(conn, from, msg, command, text) {
  if (command === 'suit') {
    await mainSuit(conn, from, msg, text)
  } else if (command === 'tebakangka') {
    await mainTebakAngka(conn, from, msg, text)
  } else if (command === 'tebakkata') {
    await mainTebakKata(conn, from, msg, text)
  }
}

async function mainSuit(conn, from, msg, text) {
  const pilihan = ['gunting', 'batu', 'kertas']
  const botPilih = pilihan[randomInt(0, 2)]
  const userPilih = text.trim().split(' ')[1]
  if (!pilihan.includes(userPilih)) {
    await conn.sendMessage(from, { text: 'Gunakan perintah: .suit gunting|batu|kertas' }, { quoted: msg })
    return
  }
  let hasil = ''
  if (userPilih === botPilih) hasil = 'Seri!'
  else if (
    (userPilih === 'gunting' && botPilih === 'kertas') ||
    (userPilih === 'batu' && botPilih === 'gunting') ||
    (userPilih === 'kertas' && botPilih === 'batu')
  )
    hasil = 'Kamu Menang!'
  else hasil = 'Kamu Kalah!'
  await conn.sendMessage(from, { text: `Kamu: ${userPilih}\nBot: ${botPilih}\nHasil: ${hasil}` }, { quoted: msg })
}

async function mainTebakAngka(conn, from, msg, text) {
  const angkaUser = parseInt(text.trim().split(' ')[1])
  if (isNaN(angkaUser)) {
    tebakanAngkaJawaban = randomInt(1, 10)
    await conn.sendMessage(from, { text: 'Game Tebak Angka dimulai! Tebak angka 1 sampai 10 dengan perintah .tebakangka [angka]' }, { quoted: msg })
    return
  }
  if (tebakanAngkaJawaban === null) {
    tebakanAngkaJawaban = randomInt(1, 10)
    await conn.sendMessage(from, { text: 'Game Tebak Angka dimulai! Tebak angka 1 sampai 10 dengan perintah .tebakangka [angka]' }, { quoted: msg })
    return
  }
  if (angkaUser === tebakanAngkaJawaban) {
    await conn.sendMessage(from, { text: `Benar! Angka rahasia adalah ${tebakanAngkaJawaban}` }, { quoted: msg })
    tebakanAngkaJawaban = null
  } else {
    await conn.sendMessage(from, { text: 'Salah, coba lagi!' }, { quoted: msg })
  }
}

async function mainTebakKata(conn, from, msg, text) {
  const kataUser = text.trim().split(' ')[1]
  if (!kataUser) {
    tebakanKataJawaban = tebakanKataRahasia
    await conn.sendMessage(from, { text: 'Game Tebak Kata dimulai! Tebak kata rahasia dengan perintah .tebakkata [kata]' }, { quoted: msg })
    return
  }
  if (!tebakanKataJawaban) {
    tebakanKataJawaban = tebakanKataRahasia
    await conn.sendMessage(from, { text: 'Game Tebak Kata dimulai! Tebak kata rahasia dengan perintah .tebakkata [kata]' }, { quoted: msg })
    return
  }
  if (kataUser.toLowerCase() === tebakanKataJawaban.toLowerCase()) {
    await conn.sendMessage(from, { text: 'Selamat! Kamu berhasil menebak kata rahasia.' }, { quoted: msg })
    tebakanKataJawaban = null
  } else {
    await conn.sendMessage(from, { text: 'Salah, coba lagi!' }, { quoted: msg })
  }
}

module.exports = { commands, execute }