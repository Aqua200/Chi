const linkRegex = /(https?:\/\/chat\.whatsapp\.com\/(?:invite\/)?[0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return; 
    if (!m.isGroup) return; // Solo funciona en grupos

    let chat = global.db.data.chats[m.chat];
    if (!chat.antiLink) return; // Si antilink está desactivado, salir

    const isGroupLink = linkRegex.test(m.text);
    if (isGroupLink && !isAdmin) {
        if (!isBotAdmin) {
            return m.reply("⚠️ No puedo eliminar enlaces porque no soy administrador.");
        }

        // Verificar si el enlace es del mismo grupo
        const groupInvite = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
        if (m.text.includes(groupInvite)) return; 

        // Eliminar mensaje y expulsar usuario
        await conn.sendMessage(m.chat, { delete: m.key });
        await m.reply(`🚫 *Enlace Detectado*\n\nNo se permiten enlaces en este grupo, *@${m.sender.split('@')[0]}* serás eliminado.`, null, { mentions: [m.sender] });
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
}
