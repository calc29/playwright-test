const playwright = require('playwright-core');
(async() => {
    const browser = await playwright.chromium.launch({
        channel: 'msedge',
        headless: false
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    page.on('domcontentloaded', async(p) => {
        const screenshotAction = 'screenshotAction';
        await p.exposeFunction(screenshotAction, async() => {
            await p.screenshot({ path: `scroll-bug-screenshot.png`, fullPage: true });
        });
        await p.evaluate(`(() => {
            const screenshotButton = document.querySelector('#screenshot');
            screenshotButton.addEventListener('click', async()=> {
                await window.${screenshotAction}();
            });
        })()`);
    });
})();