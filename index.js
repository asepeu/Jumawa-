const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const { state, saveState } = useSingleFileAuthState('./session/auth_info.json')
const welcome = require('./plugins/welcome')
const minigame = require('./plugins/minigame')
const menu = require('./plugins/menu')

async function startBot() {
    const conn = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    })

    conn.ev.on('creds.update', saveState)

    conn.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        const msg = messages[0]
        if (!msg.message) return
        if (msg.key.fromMe) return

        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        if (text.startsWith('.')) {
            const command = text.slice(1).trim().split(' ')[0].toLowerCase()
            if (command === 'menu') {
                await menu.execute(conn, from, msg)
            } else if (minigame.commands.includes(command)) {
                await minigame.execute(conn, from, msg, command, text)
            }
        }
    })

    conn.ev.on('group-participants.update', async (update) => {
        await welcome.execute(conn, update)
    })

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            if ((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot()
            } else {
                console.log('Connection closed. You are logged out.')
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp')
        }
    })
}

startBot()