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
  console.log('Mensaje recibido:', messageText); // Log para verificar el contenido del mensaje

  const isGroupLink = linkRegex.exec(messageText); // Verificar si el mensaje contiene un enlace de grupo
  console.log('¿Enlace de grupo detectado?', isGroupLink); // Log para verificar si el enlace fue detectado correctamente

  if (!chat.antiLink) return; // Si el AntiLink no está activado, no hacer nada

  const grupo = `https://chat.whatsapp.com`; // Enlace del grupo

  // Si el mensaje contiene un enlace de grupo (y no es del grupo al que pertenece el bot)
  if (isGroupLink && !m.text.includes(grupo)) {
    console.log('Enlace no pertenece a este grupo, procediendo a eliminar usuario...'); // Log de control

    // Si el usuario es admin, no eliminarlo
    if (isAdmin) return m.reply('*El AntiLink está activo pero te salvaste, eres admin 😎!*');

    // Si el bot tiene permisos de admin y el enlace es diferente del grupo actual
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
      if (m.text.includes(linkThisGroup)) return; // No eliminar si es el enlace de invitación del grupo

      // Notificar que se detectó un enlace de otro grupo
      await conn.sendMessage(m.chat, {
        text: `*「 ANTILINK DETECTADO 」*\n\n${user} 🤨 Rompiste las reglas del Grupo, serás eliminado...`,
        mentions: [m.sender]
      }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 });

      // Eliminar al usuario del grupo
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
      let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if (responseb[0].status === "404") return;
    }
  }

  // Si el bot no tiene activada la restricción
  else if (!bot.restrict) {
    return m.reply('*𝙴𝙻 𝙿𝙍𝙊𝙋𝙸𝙴𝙏𝙰𝙍𝙄𝙊 𝙃𝙐𝙁𝙄𝙀𝙍𝙊 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀 𝙀𝙇 𝙀𝙉𝘼𝘽𝙇𝙀𝘿𝙄𝙕𝘼 𝙀𝙇 𝙍𝙀𝙎𝙏𝙍𝙄𝘾𝙏𝙄𝙊𝙉 (𝙀𝙉𝘼𝘽𝙇𝙀 𝙍𝙀𝙎𝙏𝙍𝙄𝘾𝙏) 𝘾𝙊𝙉𝙏𝘼𝘾𝙏𝙀 𝘾𝙊𝙉 𝙀𝙇 𝙋𝘼𝙍𝙖 𝙌𝙐𝙀 𝙇𝙊𝙎 𝙃𝘼𝘽𝙄𝙇𝙄𝙏𝙀*');
  }

  return !0;
}
