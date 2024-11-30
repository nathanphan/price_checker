import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function setup() { // Added export keyword
  console.log('Setting up Chrome...');
  try {
    // Install Chrome using npm
    execSync('npx @puppeteer/browsers install chrome@121.0.6167.85', {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
    
    console.log('Chrome installation completed successfully');
  } catch (error) {
    console.error('Failed to setup Chrome:', error);
    process.exit(1);
  }
}