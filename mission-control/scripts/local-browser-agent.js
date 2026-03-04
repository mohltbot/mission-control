#!/usr/bin/env node
/**
 * Browser Automation Tool - Alternative to Browser Use API
 * Uses Puppeteer with local Chrome installation
 */

const puppeteer = require('puppeteer');

class LocalBrowserAgent {
  constructor(options = {}) {
    this.chromePath = options.chromePath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    this.headless = options.headless !== false;
  }

  async run(task) {
    console.log('🚀 Starting local browser...');
    console.log('Task:', task.substring(0, 100) + '...');
    
    const browser = await puppeteer.launch({
      headless: this.headless ? 'new' : false,
      executablePath: this.chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      
      // Parse task for URL
      const urlMatch = task.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const url = urlMatch[0];
        console.log('📄 Navigating to:', url);
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extract title
        const title = await page.title();
        console.log('📋 Page title:', title);
        
        // Extract main content
        const content = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          const main = document.querySelector('main, article, [role="main"]');
          return {
            title: h1 ? h1.innerText : document.title,
            text: main ? main.innerText.substring(0, 1000) : document.body.innerText.substring(0, 1000)
          };
        });
        
        return {
          success: true,
          url,
          title: content.title,
          output: content.text,
          summary: `Successfully scraped ${url}. Title: "${title}"`
        };
      } else {
        return {
          success: false,
          error: 'No URL found in task. Please include a URL to scrape.'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    } finally {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }

  async extract(url, selector) {
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: this.chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const content = await page.evaluate((sel) => {
        const elements = document.querySelectorAll(sel);
        return Array.from(elements).map(el => el.innerText).join('\n');
      }, selector);
      
      return content;
    } finally {
      await browser.close();
    }
  }
}

// CLI usage
if (require.main === module) {
  const task = process.argv.slice(2).join(' ') || 'Go to https://example.com and extract the title';
  
  const agent = new LocalBrowserAgent();
  agent.run(task).then(result => {
    console.log('\n=== RESULT ===');
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { LocalBrowserAgent };
