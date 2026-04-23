const page = await browser.getPage("main");
await page.goto("https://example.com");
console.log("Title:", await page.title());
console.log("URL:", page.url());

// Take a screenshot
await page.screenshot({ path: "/tmp/screenshot.png" });
console.log("Screenshot saved to /tmp/screenshot.png");
