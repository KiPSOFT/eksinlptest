const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        let sayfalar;

        async function sayfaSayilari() {
            const navigationPromise = page.waitForNavigation();
            await page.goto('https://eksisozluk.com/mutluluk--40751', {waitUntil: 'networkidle0'});
            await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.4.1.min.js'});
            await page.setViewport({ width: 1280, height: 721 })
            await navigationPromise;
            await page.waitFor(5000);
            sayfalar = await page.evaluate(() => {
                let data = [];
                $($('.pager')[0]).find('select > option').each((ind, itm) => { 
                    data.push($(itm).val());
                });
                return data;
            });
        }
        
        async function sayfaCek(sayfaNo) {
            console.log(`${sayfaNo} numaralı sayfa çekiliyor...`);
            const navigationPromise = page.waitForNavigation();
            await page.goto('https://eksisozluk.com/mutluluk--40751?p=' + sayfaNo, {waitUntil: 'networkidle0'});
            await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.4.1.min.js'});
            await page.setViewport({ width: 1280, height: 721 })
            await navigationPromise;
            await page.waitFor(5000);
            let entryler = [];
            let donus = await page.evaluate(() => {
                try {
                    let data = [];
                    const $ = window.$;
                    $('#entry-item-list > li').each((ind, item) => { 
                        data.push($(item).find('.content').text().trim()); 
                    });
                    return data;
                } catch (err) {
                    return err.toString();
                }
            });
            entryler = entryler.concat(donus);
            return entryler;
        }
        let tumEntry = [];
        await sayfaSayilari();
        if (sayfalar.length > 1) {
            let args = process.argv.slice(2);
            let sayfaNo = args[0] || 1;
            while (sayfaNo <= sayfalar.length) {
                tumEntry = await sayfaCek(sayfaNo);
                let donus = [];
                for (let e of tumEntry) {
                    donus.push({
                        intent: 'güzel',
                        language: 'tr',
                        utterance: e
                    });
                }
                fs.appendFileSync('güzel.json', JSON.stringify(donus));
                sayfaNo++;
            }
        }
        await browser.close();
    } catch (err) {
        console.log(err);
    }
})();