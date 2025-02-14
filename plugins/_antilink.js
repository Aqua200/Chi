let linkRegex = /https?:\/\/(chat\.whatsapp\.com\/[A-Za-z0-9]{20,24}|whatsapp\.com\/channel\/[A-Za-z0-9]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return; // Si no es un grupo, no hacer nada

  if (isAdmin || isOwner || m.fromMe || isROwner) return; // Si el usuario es admin o dueño, no procesar el mensaje

  let chat = global.db.data.chats[m.chat]; // Obtener los datos del chat
  let delet = m.key.participant; // Usuario que envió el mensaje
  let bang = m.key.id; // ID del mensaje
  const user = `@${m.sender.split`@`[0]}`; // Usuario que envía el mensaje
  const groupAdmins = participants.filter(p => p.admin); // Administradores del grupo

  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');
  let bot = global.db.data.settings[this.user.jid] || {}; // Configuración del bot

  const messageText = m.text || m.body || ''; // Texto del mensaje
  const isGroupLink = linkRegex.exec(messageText); // Verificar si el mensaje contiene un enlace de grupo

  if (!chat.antiLink) return; // Si el AntiLink no está activado, no hacer nada

  const grupo = `https://chat.whatsapp.com`; // Enlace del grupo

  if (isAdmin && m.text.includes(grupo)) {
    return m.reply('*El AntiLink está activo pero te salvaste, eres admin 😎!*');
  }

  // Si se detecta un enlace y no es admin, tomar acción
  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return; // No eliminar si es el enlace de invitación del grupo
    }

    // Notificar que se detectó el enlace
    await conn.sendMessage(m.chat, {
      text: `*「 ANTILINK DETECTADO 」*\n\n${user} 🤨 Rompiste las reglas del Grupo, serás eliminado...`,
      mentions: [m.sender]
    }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 });

    // Si el bot no es admin, notificar a los admins
    if (!isBotAdmin) {
      return conn.sendMessage(m.chat, {
        text: `*Te salvaste, no soy admin y no puedo eliminarte*`,
        mentions: [...groupAdmins.map(v => v.id)]
      }, { quoted: m });
    }

    // Si el bot es admin, eliminar al usuario
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
    let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    if (responseb[0].status === "404") return;
  } else if (!bot.restrict) {
    return m.reply('*𝙀𝙡 𝙥𝙧𝙤𝙥𝙞𝙚𝙩𝙖𝙧𝙞𝙤 𝙙𝙚𝙡 𝙗𝙤𝙩 𝙣𝙤 𝙩𝙞𝙚𝙣𝙚 𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙤 𝙚𝙡 𝙧𝙚𝙨𝙩𝙧𝙞𝙘𝙘𝙞𝙤𝙣 (𝙚𝙣𝙖𝙗𝙡𝙚 𝙧𝙚𝙨𝙩𝙧𝙞𝙘𝙩) 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙚 𝙘𝙤𝙣 𝙚𝙡 𝙥𝙖𝙧𝙖 𝙦𝙪𝙚 𝙡𝙤𝙨 𝙝𝙖𝙗𝙞𝙡𝙞𝙩𝙚*');
  }

  return !0;
}
