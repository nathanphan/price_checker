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

  // Launch Puppeteer with the specified Chrome executable
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to page...');
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 120000 
    });
    
    console.log('Waiting for price element...');
    await page.waitForSelector('div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl', { timeout: 30000 });

    // Ensure the second price element exists and has content
    await page.waitForFunction(
      () => document.querySelectorAll('div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl')[1]?.textContent.trim().length > 0,
      { timeout: 30000 }
    );

    // Extract the second span's text content
    const priceText = await page.$$eval(
      'div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl',
      elements => elements[1]?.textContent?.trim() || '' // Get the second element's text content
    );

    console.log('Extracted price text:', priceText);

    if (!priceText) {
      throw new Error('Price text is empty. Verify the selector or page content.');
    }

    const sanitizedText = priceText.replace(/[^\d.-]+/g, ''); // Remove non-numeric characters
    console.log('Sanitized price text:', sanitizedText);

    const price = extractNumber(sanitizedText);

    console.log(`Price extracted: ${price}`);
    
    return price;
  } catch (error) {
    console.error('Error scraping price:', error);
    throw error;
  } finally {
    await browser.close();
  }
}