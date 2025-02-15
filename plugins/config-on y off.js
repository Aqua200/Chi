import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
    let chat = global.db.data.chats[m.chat];
    let isEnable = /true|enable|(turn)?on|1/i.test(command);
    let type = (args[0] || '').toLowerCase();

    switch (type) {
        case 'antilink': case 'antienlace':
            if (!m.isGroup) return m.reply("⚠️ Este comando solo funciona en grupos.");
            if (!(isAdmin || isOwner)) return m.reply("❌ Solo los administradores pueden activar/desactivar el antilink.");
            chat.antiLink = isEnable; // Guarda la configuración correctamente
            break;

        default:
            return m.reply('⚠️ Opción no válida. Usa `.on antilink` o `.off antilink`.');
    }

    await m.reply(`✅ *Antilink ${isEnable ? 'Activado' : 'Desactivado'}* en este grupo.`);
};

handler.help = ['enable <option>', 'disable <option>'];
handler.tags = ['config'];
handler.command = /^((en|dis)able|(turn)?o(n|ff)|[01])$/i;
handler.register = true;

export default handler;
