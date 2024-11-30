import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChannelId: process.env.TELEGRAM_CHANNEL_ID,
  thenaUrl: 'https://thena.fi/swap?inputCurrency=0xf4c8e32eadec4bfe97e0f595add0f4450a863a11&outputCurrency=0xcdc3a010a3473c0c4b2cb03d8489d6ba387b83cd&swapType=1',
  priceThreshold: 1.4,
  checkInterval: 60000 // Check every minute
};