const puppeteer = require('puppeteer');
const fs = require('fs');
const rawpreviewdata = fs.readFileSync('_site/preview-images.json');
const previewdata = JSON.parse(rawpreviewdata);
const dist = __dirname + "/../_site/assets/preview-images/";

async function getscreen(filename) {
  try {
    console.log("Getting " + filename);
    let localurl = "file://" + dist + filename + ".html";
    await page.setViewport({ width: 1200, height: 628 });
    await page.goto(localurl, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ 
      path: dist + filename + ".png",
      type: 'png'
    });
    console.log("Finished " + dist + filename + ".png");
  }
  catch (err) {
    console.log('err :', err);
  }
}

async function setpuppeteer(response) {  

  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();

  console.log("Launched Puppeteer");

  var i;
  for (i = 0; i < response.length; i++) {
    await getscreen(response[i].filename);
  }
  
  browser.close();
  console.log('Done!');

}

setpuppeteer(previewdata);
