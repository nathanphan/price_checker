import TelegramBot from 'node-telegram-bot-api';
import { config } from './config.js';

export class TelegramNotifier {
  constructor() {
    this.bot = new TelegramBot(config.telegramToken, { polling: false });
  }

  async sendAlert(price) {
    const message = `🚨 Price Alert! 🚨\n` +
      `Current price: ${price}\n` +
      `Threshold: ${config.priceThreshold}\n` +
      `Time: ${new Date().toISOString()}`;
    
    try {
      await this.bot.sendMessage(config.telegramChannelId, message);
      console.log('Alert sent successfully');
    } catch (error) {
      console.error('Error sending telegram message:', error);
      throw error;
    }
  }
}