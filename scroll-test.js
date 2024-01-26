const playwright = require('playwright-core');
(async() => {
    const browser = await playwright.chromium.launch({
        channel: 'msedge',
        headless: false,
        ignoreDefaultArgs: ['--hide-scrollbars']
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    let actionIdx = 1;
    page.on('domcontentloaded', async(p) => {
        const screenshotAction = `screenshotAction_${actionIdx}`;
        await p.exposeFunction(screenshotAction, async() => {
            await p.screenshot({ path: `scroll-bug-screenshot.png`, fullPage: true });
        });
        await p.evaluate(`(() => {
            const screenshotButton = document.querySelector('#screenshot');
            screenshotButton.addEventListener('click', async()=> {
                await window.${screenshotAction}();
            });
        })()`);
        actionIdx++;
    });
})();
