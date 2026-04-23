const tabs = await browser.listPages();
console.log("Open tabs:");
console.log(JSON.stringify(tabs, null, 2));

// Get the active page and show current URL
const page = await browser.getPage(tabs[0].id);
console.log("\nCurrent page URL:", page.url());
