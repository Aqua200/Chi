let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
  let kickte = `☆彡 ¿A quién quieres eliminar, cariño? ☆彡
Por favor, etiqueta a una persona con @tag, ¡y sé más cuidadoso! (｡♥‿♥｡)`;
  
  if (!m.mentionedJid[0] && !m.quoted) {
    return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });
  }
  
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
  
  // Se elimina al usuario de inmediato
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
  
  // Se prepara el mensaje tierno, y se integran el texto y las menciones en un solo objeto
  let message = `*~(っ˘̩╭╮˘̩)っ* ¡Oh no, cariño! 😢💔
Lo siento mucho, pero ¡te tengo que sacar del grupo! Espero que no te enojes, te mando muchos abrazos. 💕✨`;
  
  await conn.sendMessage(m.chat, { text: message, mentions: [user] });
}

handler.help = ['kick *@user*'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.register = true;

export default handler;
