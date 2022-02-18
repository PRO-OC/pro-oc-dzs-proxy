var express = require('express');
const puppeteer = require('puppeteer');
var app = express();

async function getVysledekKontroly(kdo, dD, dM, dR, onSuccess) {

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://registr.dzs.cz/dotaz.nsf/');
    await page.waitForSelector('input[type="button"]');
    await page.click('input[type="button"]');
    await page.waitForSelector('input[type="button"]');
    await page.type('input[name=kdo]', kdo);
    await page.type('input[name=dD]', dD);
    await page.type('input[name=dM]', dM);
    await page.type('input[name=dR]', dR);
    await page.click('input[type="button"]');

    await page.waitForSelector('form tr:last-child td:last-child');
    const Vysledek = await page.evaluate(() => {
        const anchor = document.querySelector('form tr:last-child td:last-child');
        return anchor.innerHTML;
    });
    onSuccess(Vysledek);
    await browser.close();
}

app.use(function(req, res, next) {

    console.log(req.method + ': new request');

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'X-Requested-With');

    if (req.method === 'OPTIONS') {
        console.log('OPTIONS: preflight sent');
        res.send();
    } else if (req.method === "GET") {

        if(req.baseUrl + req.path == "/dotaz.nsf") {
            return new Promise(resolve => {

                const kdo = req.query.kdo;
                const dD = req.query.dD;
                const dM = req.query.dM;
                const dR = req.query.dR;

                if(dD > 31 || dD < 1 ||
                    dM > 12 || dM < 1 ||
                    !dR ||
                    !kdo
                    )
                {
                    throw new TypeError("Invalid arguments", kdo, dD, dM, dR);
                }

                getVysledekKontroly(kdo, dD, dM, dR, function(Vysledek) {
                    console.log(Vysledek);
                    resolve(Vysledek);
                });
            }).then(body => {
                console.log('GET: response sent');
                res.send(body);
            }).catch(error => {
                console.error(error);
                console.log('GET: error 400 sent');
                res.statusCode = 400;
                res.send();
            });
        }
    } else {
        console.log(req.method + ': is not GET or OPTION request');
        next();
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
