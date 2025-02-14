let handler = m => m;
handler.all = async function (m) {
    if (m.fromMe) return;
    if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) {
        return true; 
    }

    try {
        if (m.text.toLowerCase().includes('bot')) {
            await m.reply('¡Hola! 💖 Soy Anika, ¿en qué puedo ayudarte? 😺✨');
        }
    } catch (error) {
        // Manejo de errores si es necesario
    }
}
