import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { extractNumber } from './utils.js';
import os from 'os';
import { execSync } from 'child_process';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function scrapePrice(url) {
  console.log('Launching Puppeteer with bundled Chrome...');
  
  // Determine platform-specific Chrome path
  const chromePath =
    os.platform() === 'darwin'
      ? join(
          __dirname,
          '..',
          'chrome',
          'mac_arm-121.0.6167.85',
          'chrome-mac-arm64',
          'Google Chrome for Testing.app',
          'Contents',
          'MacOS',
          'Google Chrome for Testing'
        )
      : os.platform() === 'win32'
      ? join(
          __dirname,
          '..',
          '.puppeteer_cache',
          'chrome',
          'chrome.exe'
        )
      : join(
          __dirname,
          '..',
          '.puppeteer_cache',
          'chrome',
          'chrome' // For Linux
        );

  console.log('Resolved Chrome Path:', chromePath);

  // Install Chrome if necessary
  try {
    execSync('npx @puppeteer/browsers install chrome@121.0.6167.85', {
      stdio: 'inherit',
      cwd: join(__dirname, '..'),
      env: {
        ...process.env,
        PUPPETEER_CACHE_DIR: join(__dirname, '..', '.puppeteer_cache')
      }
    });
    console.log('Chrome installation completed successfully');
  } catch (error) {
    console.error('Error installing Chrome:', error);
    throw error;
  }

  console.log('Launching Puppeteer with bundled Chrome...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to page...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Waiting for price element...');
    await page.waitForSelector('div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl', { timeout: 60000 });

    console.log('Extracting price element...');
    const priceElementHtml = await page.$eval(
      'div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl',
      el => el.outerHTML
    );
    console.log('Price element HTML:', priceElementHtml);

    console.log('Extracting price...');
    const priceText = await page.$$eval(
      'div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl',
      elements => elements[1]?.textContent?.trim() || ''
    );

    if (!priceText) {
      throw new Error('Price element not found. Verify the selector or page content.');
    }

    const sanitizedPrice = parseFloat(priceText.replace(/[^\d.-]/g, ''));
    console.log('Sanitized price:', sanitizedPrice);

    return sanitizedPrice;
  } catch (error) {
    console.error('Error during price scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}