let linkRegex = /(?:https?:\/\/)?(?:chat\.whatsapp\.com\/[A-Za-z0-9_-]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
    if (!m.isGroup) return;
    if (isAdmin || isOwner || m.fromMe || isROwner) return;

    let chat = global.db.data.chats[m.chat] || {};
    let delet = m.key.participant;
    let bang = m.key.id;
    const user = `@${m.sender.split`@`[0]}`;
    const groupAdmins = participants.filter(p => p.admin);
    let bot = global.db.data.settings[this.user?.jid] || {}; 

    // Verifica si el mensaje contiene un enlace de grupo de WhatsApp
    console.log("Texto del mensaje:", m.text);  // Agregar log para depuración
    const isGroupLink = linkRegex.test(m.text);
    console.log("¿Es un enlace de grupo?", isGroupLink);  // Verificar si se detecta el enlace
    
    if (isAdmin && chat.antiLink && isGroupLink) {
        return m.reply('*El AntiLink está activo, pero te salvaste porque eres admin 😎!*');
    }

    if (chat.antiLink && isGroupLink && !isAdmin) {
        let linkThisGroup = "";
        try {
            linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
        } catch (e) {
            console.error("Error obteniendo el enlace del grupo:", e);
        }

        if (m.text.includes(linkThisGroup)) return;

        await conn.sendMessage(
            m.chat,
            {
                text: `*「 ANTILINK DETECTADO 」*\n\n${user} 🤨 Rompiste las reglas del grupo, serás eliminado....`,
                mentions: [m.sender]
            },
            { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 }
        );

        if (!isBotAdmin) {
            return conn.sendMessage(
                m.chat,
                {
                    text: `*Te salvaste gil, no soy admin, no te puedo eliminar*`,
                    mentions: groupAdmins.map(v => v.id)
                },
                { quoted: m }
            );
        }

        if (isBotAdmin) {
            await conn.sendMessage(m.chat, {
                delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }
            });

            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            if (responseb[0]?.status === "404") return;
        }
    } else if (!bot.restrict) {
        return m.reply('*El propietario del bot no tiene activado el modo restricción (enable restrict). Contacta con él para que lo active.*');
    }

    return !0;
}
