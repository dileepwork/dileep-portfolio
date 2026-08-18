import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testRender() {
  console.log('Launching headless browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
    } else {
      console.log('Browser console:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('Browser runtime crash:', err.message);
  });

  try {
    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });

    console.log('Waiting for loading screen to complete...');
    // The loading screen completes after a timeout in React (around 900ms)
    await page.waitForTimeout(3000);

    // Take a screenshot of the landing page
    const screenshotPath = path.resolve(__dirname, '../artifacts/render_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to:', screenshotPath);

    // Check project elements in DOM
    const projectNexusHeader = await page.locator('h2:has-text("Project Nexus")').count();
    console.log('Found "Project Nexus" section header count:', projectNexusHeader);

    const projectCardsCount = await page.locator('div:has-text("Demo")').count();
    console.log('Found project card elements count (contains "Demo"):', projectCardsCount);

    // Get the HTML content of the projects container
    const htmlContent = await page.locator('body').innerHTML();
    console.log('Body length:', htmlContent.length);

  } catch (error) {
    console.error('Test run failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

testRender();
