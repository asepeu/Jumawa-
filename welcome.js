const config = require('../config')

async function execute(conn, update) {
  if (update.action === 'add') {
    for (const participant of update.participants) {
      const metadata = await conn.groupMetadata(update.id)
      const user = participant.split('@')[0]
      const welcomeText = config.welcomeMessage.replace('@user', '@' + user)
      await conn.sendMessage(update.id, { text: welcomeText, mentions: [participant] })
    }
  }
}

module.exports = { execute }