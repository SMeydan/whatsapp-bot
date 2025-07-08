const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

const unicornImages = [
  'https://www.shutterstock.com/image-vector/cute-cartoon-rainbow-unicorn-vector-600nw-2487769365.jpg',
  'https://images.photowall.com/products/57496/unicorn-2.jpg?h=699&q=85',
  'https://cdn11.bigcommerce.com/s-x49po/images/stencil/1500x1500/products/64503/260989/1611503387393_unicorn-original__06970.1687170098.jpg?c=2&imbypass=on',
  'https://cdn.shopify.com/s/files/1/0757/8393/0173/files/buleball_a_beautiful_unicorn_19f36e05-21f4-4cd8-8fc3-70c86401450d_480x480.jpg?v=1699024007',
  'https://cdn.pixabay.com/photo/2017/02/23/13/05/unicorn-2097819_1280.png'
];

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  console.log('Scan QR Code :');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('It is ready!');
});

client.on('message', async msg => {
  console.log('Ding ding Messsageee:', msg.body);

 if (msg.body.toLowerCase().includes('unicorn')) {
    try {
      const random = unicornImages[Math.floor(Math.random() * unicornImages.length)];
      console.log('Unicorn Photo:', random);

      const response = await axios.get(random, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const media = new MessageMedia('image/png', base64, 'unicorn.png');

      await client.sendMessage(msg.from, media, { caption: 'Unicornnnn :' });

    } catch (e) {
      console.error('Error:', e.message);
      await client.sendMessage(msg.from, 'Error occured. There is no more magic !');
    }
  }
});

client.initialize();
client.on('disconnected', (reason) => {
  console.log('Connection Error:', reason);
  client.initialize();
});

client.on('auth_failure', (msg) => {
  console.error('Auth Error:', msg);
  client.initialize();
});