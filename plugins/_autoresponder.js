import axios from 'axios';
import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';
import { sticker } from '../lib/sticker.js';

let handler = m => m;
let lastMessageTime = {};

handler.all = async function (m, { conn }) {
    // Verificar si `m` y `conn` están definidos
    if (!m || !m.sender || !conn || !m.chat) {
        console.error("Error: El mensaje, el sender o la conexión no están definidos.");
        return;
    }

    // Asegurar que la base de datos global exista
    if (!global.db) global.db = {};
    if (!global.db.data) global.db.data = {};
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.chats) global.db.data.chats = {};

    // Verificar si el usuario existe en la base de datos
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {}; // Inicializar el usuario si no existe
    }

    let chat = global.db.data.chats?.[m.chat] || {}; // Evitar errores si `chats` no está definido

    m.isBot = m.id?.startsWith('BAE5') && m.id.length === 16 ||
              m.id?.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) ||
              m.id?.startsWith('B24E') && m.id.length === 20;

    if (m.isBot || m.id?.startsWith('NJX-') || m.fromMe || conn.user?.jid === m.sender) return;

    let prefixRegex = new RegExp('^[' + (opts?.prefix || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

    if (m.sender.includes('bot') || m.sender.includes('Bot')) return true;

    let currentTime = Date.now();
    if (lastMessageTime[m.sender] && (currentTime - lastMessageTime[m.sender] < 5000)) return true;

    lastMessageTime[m.sender] = currentTime;

    // Verificar si el usuario tiene `gameActive` definido
    if (global.db.data.users[m.sender]?.gameActive) return;

    if (m.mentionedJid?.includes(conn.user?.jid) || (m.quoted && m.quoted.sender === conn.user?.jid)) {
        if (["PIEDRA", "PAPEL", "TIJERA", "menu", "estado", "bots", "serbot", "jadibot", "Video", "Audio", "audio", "Bot", "bot", "Exp", "diamante", "lolicoins", "Diamante", "Lolicoins"].some(word => m.text.includes(word))) return true;

        await conn.sendPresenceUpdate('composing', m.chat);

        async function luminsesi(q, username, logic) {
            try {
                const response = await axios.post("https://luminai.my.id", {
                    content: q,
                    user: username,
                    prompt: logic,
                    webSearchMode: true
                });
                return response.data.result;
            } catch (error) {
                console.error("Error en LuminAI:", error);
                return null;
            }
        }

        async function geminiProApi(q, logic) {
            try {
                const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(logic)}`);
                if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
                const result = await response.json();
                return result.answer;
            } catch (error) {
                console.error('Error en Gemini Pro:', error);
                return null;
            }
        }

        let query = m.text;
        let username = m.pushName || "Usuario";

        let syms1 = `Actualmente juegas el rol de una chica llamada China 💋...`; // (Texto de rol puede mantenerse igual)

        if (!chat.autorespond) return;
        if (m.fromMe) return;

        let result = await geminiProApi(query, syms1);
        if (!result || result.trim().length === 0) {
            result = await luminsesi(query, username, syms1);
        }

        if (result && result.trim().length > 0) {
            await conn.reply(m.chat, result, m);
            await conn.readMessages([m.key]);
        } else {
            let gpt = await fetch(`${apis}/tools/simi?text=${encodeURIComponent(m.text)}`);
            let res = await gpt.json();
            await conn.reply(m.chat, res.data.message, m);
        }
    }
    return true;
}

export default handler;
