const playwright = require('playwright-core');
const urls = [
    {
        url: 'https://en.wikipedia.org/wiki/Rome',
        timeout: 0
    },
];
(async() => {
    const browser = await playwright.chromium.launch({
        channel: 'msedge',
        headless: false
    });
    const promiseList = [];
    const titleList = [];
    const context = await browser.newContext({ viewport: null });
    urls.forEach((data, i) => {
        promiseList.push((async() => {
            const page = await context.newPage();
            await Promise.all([
                page.waitForLoadState(),
                page.goto(data.url)
            ]);
            const title = await page.evaluate(() => {
                return document.title;
            });
            await page.screenshot({path: `screenshot_${i}_${title}.png`, fullPage: true});
            await page.close();
            return title;
        })().catch(e => console.error(e)));
    })
    await Promise.all(promiseList).then(tList => {
        tList.forEach(title => titleList.push(title));
    });
    console.log(titleList);
    await browser.close();
})();
