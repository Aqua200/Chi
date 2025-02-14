let linkRegex = /https?:\/\/(chat\.whatsapp\.com|wa\.me)\/[A-Za-z0-9]{20,24}/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat = global.db.data.chats[m.chat];
  let delet = m.key.participant;
  let bang = m.key.id;
  const user = `@${m.sender.split`@`[0]}`;
  const groupAdmins = participants.filter(p => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');
  let bot = global.db.data.settings[this.user.jid] || {};

  // Verifica el enlace con la nueva expresión regular
  const messageText = m.text || m.body || '';
  const isGroupLink = linkRegex.exec(messageText);

  if (!chat.antiLink) return;  // Solo proceder si el AntiLink está activado en el chat

  const grupo = `https://chat.whatsapp.com`;

  // Si el mensaje contiene el enlace de grupo, y el usuario es admin, no se aplica el AntiLink
  if (isAdmin && m.text.includes(grupo)) return m.reply('*El AntiLink Esta activo pero que salvarte eres admin 😎!*');

  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      // Obtiene el enlace de invitación del grupo y lo compara
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return;
    }

    // Notifica al usuario que rompió las reglas
    await conn.sendMessage(m.chat, {
      text: `*「 ANTILINK DETECTADO 」*\n\n${user} 🤨 Rompiste las reglas del Grupo. Serás eliminado...`,
      mentions: [m.sender]
    }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 });

    // Si el bot no es admin, avisa a los admins
    if (!isBotAdmin) {
      return conn.sendMessage(m.chat, {
        text: `*Te salvaste, no soy admin y no puedo eliminarte*`,
        mentions: [...groupAdmins.map(v => v.id)]
      }, { quoted: m });
    }

    // Si el bot es admin, elimina al usuario
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
    let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    if (responseb[0].status === "404") return;
  } else if (!bot.restrict) {
    return m.reply('*𝙀𝙡 𝙥𝙧𝙤𝙥𝙞𝙚𝙩𝙖𝙧𝙞𝙤 𝙙𝙚𝙡 𝙗𝙤𝙩 𝙣𝙤 𝙩𝙞𝙚𝙣𝙚 𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙤 𝙚𝙡 𝙧𝙚𝙨𝙩𝙧𝙞𝙘𝙘𝙞𝙤𝙣 (𝙚𝙣𝙖𝙗𝙡𝙚 𝙧𝙚𝙨𝙩𝙧𝙞𝙘𝙩) 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙚 𝙘𝙤𝙣 𝙚𝙡 𝙥𝙖𝙧𝙖 𝙦𝙪𝙚 𝙡𝙤𝙨 𝙝𝙖𝙗𝙞𝙡𝙞𝙩𝙚*');
  }

  return !0;
}
