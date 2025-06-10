const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const groupName = "Gaktau";  // Ganti sesuai nama grup WhatsApp kamu
const message = "Tolong Update Kerjaannya Hari ini";

const client = new Client({
    webVersionCache: {
        type: 'none'
    }
});

client.on('qr', (qr) => {
    console.log('Scan QR berikut di WhatsApp Web Anda:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client sudah siap!');

    const chats = await client.getChats();
    const groups = chats.filter(chat => chat.isGroup);
    console.log("Grup ditemukan:");
    groups.forEach(group => console.log("- " + group.name));

    // Kirim otomatis setiap hari jam 08:00 pagi
    cron.schedule('0 8 * * *', async () => {
        console.log(`[${new Date().toLocaleString()}] Mengirim pesan...`);

        const updatedChats = await client.getChats();
        const group = updatedChats.find(chat => chat.isGroup && chat.name === groupName);

        if (group) {
            await client.sendMessage(group.id._serialized, message);
            console.log(`Pesan terkirim ke grup "${group.name}"`);
        } else {
            console.log(`Grup dengan nama "${groupName}" tidak ditemukan.`);
        }
    });
});

client.initialize();
