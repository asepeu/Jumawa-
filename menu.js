async function execute(conn, from, msg) {
  const text = `
Menu Bot JUMAWA:
1. .menu - Tampilkan menu ini
2. .suit [gunting|batu|kertas] - Main suit
3. .tebakangka [angka] - Tebak angka dari 1 sampai 10
4. .tebakkata [kata] - Tebak kata rahasia
  `
  await conn.sendMessage(from, { text }, { quoted: msg })
}

module.exports = { execute }