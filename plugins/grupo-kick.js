let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
  let kickte = `☆彡 ¿A quién quieres eliminar, cariño? ☆彡\nPor favor, etiqueta a una persona con @tag, ¡y sé más cuidadoso! (｡♥‿♥｡)`
  if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) }) 
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  let owr = m.chat.split`-`[0]
  
  // Realizar la eliminación
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

  // Mensaje tierno y decorado
  let message = `*~(っ˘̩╭╮˘̩)っ* ¡Oh no, @${user.split('@')[0]}! 😢💔\nLo siento mucho, pero ¡te tengo que sacar del grupo! Espero que no te enojes, te mando muchos abrazos. 💕✨`

  // Enviar el mensaje con la mención correctamente
  conn.sendMessage(m.chat, message, { mentions: [user] })
}

handler.help = ['kick *@user*']
handler.tags = ['group']
handler.command = ['kick', 'expulsar'] 
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.register = true 
export default handler
