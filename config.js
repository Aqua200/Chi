import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  const wm = "Tu mensaje o firma aquí"; // Define wm con un valor apropiado
  const bot = "Anika Bot"; // Nombre del bot
  const ig = "Instagram: @tuInstagram"; // Tu cuenta de Instagram
  const fb = "Facebook: @tuFacebook"; // Tu cuenta de Facebook
  const imagen2 = "url_de_imagen"; // URL de la imagen para el anuncio (asegúrate de que sea válida)
  const md = "https://enlace.com"; // Un enlace o URL para usar en el anuncio
  const fkontak = { /* tu objeto de contacto */ }; // Asegúrate de que esto esté correctamente definido

  // El número del owner
  const ownerNumber = '5216631079388';

  // Verificar si global.official está definido
  if (!global.official || !Array.isArray(global.official)) {
    console.error("global.official no está definido o no es un arreglo.");
    return;
  }

  // Asegurarse de que hay contactos con el estado 1
  const contacts = global.official.filter(([_, __, status]) => status === 1);

  // Verificar si hay contactos con estado 1
  if (contacts.length === 0) {
    console.log("No se encontraron contactos con estado 1.");
    return;
  }

  const lista = [];

  // Obtener información de los contactos
  for (const contact of contacts) {
    const [number, name, status] = contact;
    const jid = `${number}@s.whatsapp.net`;
    const displayName = await conn.getName(jid);
    const biografia = await conn.fetchStatus(jid).catch(() => null);
    const bio = biografia?.status || "Sin descripción";

    lista.push({ number, name: displayName || name || "Desconocido", bio });
  }

  // Crear el mensaje con la lista de contactos
  let cat = `${wm}
* ${bot}

*---------------------*

*💞 Creador de la bot𝖎 💋*
*${ig}*

*Creador Neykoor*
${fb}

*---------------------*

> ᴀ ᴄᴏɴᴛɪɴᴜᴀᴄɪᴏɴ sᴇ ᴇɴᴠɪᴀʀᴀɴ ʟᴏs ᴄᴏɴᴛᴀᴄᴛᴏs ᴅᴇ ᴍɪ ᴘʀᴏᴘɪᴇᴛᴀʀɪ@ / ᴅᴇsᴀʀʀᴏʟʟᴀᴅᴏʀᴇs`;

  for (const item of lista) {
    const { number, name, bio } = item;
    cat += `• ${name}\n   📞 +${number}\n   📄 ${bio}\n\n`;
  }

  // Agregar el número del dueño al final del mensaje
  cat += `*---------------------*\n*Dueño:* +${ownerNumber}\n*---------------------*`;

  // Depuración: Verificar que el mensaje se está construyendo correctamente
  console.log("Mensaje que se enviará:", cat);

  // Enviar mensaje con los contactos
  try {
    await conn.sendMessage(m.chat, { 
      text: cat, 
      contextInfo: { 
        forwardedNewsletterMessageInfo: { 
          newsletterJid: '120363392571425662@newsletter', 
          serverMessageId: '', 
          newsletterName: 'Seguirme bb 😘'
        },
        forwardingScore: 9999999,
        isForwarded: true,   
        externalAdReply: {  
          showAdAttribution: true,  
          renderLargerThumbnail: true,  
          title: wm,   
          containsAutoReply: true,  
          mediaType: 1,   
          thumbnail: imagen2, 
          sourceUrl: md
        }
      }
    }, { quoted: fkontak });

    console.log("Mensaje enviado correctamente.");
  } catch (err) {
    console.error("Error al enviar el mensaje:", err);
  }

  // Enviar información de contacto en formato VCARD
  for (const contact of lista) {
    const { number, name, bio } = contact;
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${name};;;\nFN:${name}\nORG:${name}\nTITLE:\nTEL;waid=${number}:${number}\nX-ABLabel:${bio}\nEND:VCARD`;
    try {
      await conn.sendMessage(m.chat, { 
        contacts: { 
          displayName: name, 
          contacts: [{ vcard }] 
        }
      }, { quoted: m });

      console.log(`VCARD de ${name} enviada.`);
    } catch (err) {
      console.error(`Error al enviar VCARD de ${name}:`, err);
    }
  }
};

handler.help = ['owner', 'creator', 'creador', 'dueño', 'fgowner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño', 'fgowner'];

export default handler;
