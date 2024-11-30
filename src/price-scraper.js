import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';
import { execSync } from 'child_process';
import fs from 'fs';

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

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to page...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('Saving page content for debugging...');
    const content = await page.content();
    fs.writeFileSync('page.html', content); // Save page content for inspection
    console.log('Page content saved to page.html');

    console.log('Waiting for price element...');
    await page.waitForFunction(
      () => {
        const elements = document.querySelectorAll('div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl');
        return elements.length > 1 && elements[1]?.textContent?.trim().length > 0;
      },
      { timeout: 60000 } // Wait up to 60 seconds
    );

    console.log('Extracting price element...');
    const priceText = await page.$$eval(
      'div.flex.items-center.gap-2 > span.font-medium.text-neutral-50.text-xl',
      elements => elements[1]?.textContent?.trim() || ''
    );

    if (!priceText) {
      throw new Error('Price element not found. Verify the selector or page content.');
    }

    console.log('Extracted price text:', priceText);
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