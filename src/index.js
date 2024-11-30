import { scrapePrice } from './price-scraper.js';
import { TelegramNotifier } from './telegram-bot.js';
import { config } from './config.js';
import { setup } from './setup.js';
import { formatPrice } from './utils.js';

async function initializeBot() {
  try {
    await setup();
    console.log('Puppeteer setup completed');
    
    const telegram = new TelegramNotifier();
    
    async function checkPrice() {
      try {
        const price = await scrapePrice(config.thenaUrl);
        console.log(`Current price: ${formatPrice(price)}`);

        if (price < config.priceThreshold) {
          await telegram.sendAlert(formatPrice(price));
        }
      } catch (error) {
        console.error('Error in price check:', error);
      }
    }

    // Initial check
    await checkPrice();

    // Schedule regular checks
    setInterval(checkPrice, config.checkInterval);
    console.log(`Price monitor started! Checking every ${config.checkInterval / 1000} seconds`);
  } catch (error) {
    console.error('Failed to initialize bot:', error);
    process.exit(1);
  }
}

initializeBot();