export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

let setting = global.db.data.settings[this.user.jid]
const settingsREAD = global.db.data.settings[this.user.jid] || {}

if (m.text && prefixRegex.test(m.text)) {
await this.sendPresenceUpdate('composing', m.chat)
await this.readMessages([m.key])
        
let usedPrefix = m.text.match(prefixRegex)[0]
let command = m.text.slice(usedPrefix.length).trim().split(' ')[0]
}

if (m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0 
if (m.chat === "120363297379773397@newsletter") return; 
if (m.chat === "120363355261011910@newsletter") return;
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') ||  m.text.includes('menu') || m.text.includes('code') || m.text.includes('Code') || m.text.includes('estado') || m.text.includes('bots') ||  m.text.includes('serbot') || m.text.includes('jadibot')) return !0
let chat = global.db.data.chats[m.chat]
let bot = global.db.data.settings[this.user.jid] || {}
if (bot.antiPrivate && !isOwner && !isROwner) {
await m.reply(`Hola esta prohibido usar los comando al privado del bot, por lo cual seras bloqueado...\nwww.instagram.com/mitzuki_chinita\n\n> _*Para usar mi funciones unirte al  grupo oficial 👇*_\n${[nnn, nnnttt, nnnt].getRandom()}`, false, { mentions: [m.sender] })
await this.updateBlockStatus(m.chat, 'block')}
return !1
}
