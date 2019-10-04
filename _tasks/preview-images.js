const puppeteer = require('puppeteer');
const fs = require('fs');
const rawpreviewdata = fs.readFileSync('_site/preview-images.json');
const previewdata = JSON.parse(rawpreviewdata);
const dist = __dirname + "/../_site/assets/preview-images/";

async function getscreen(filename, url) {
  try {
    console.log("Getting " + filename);
    await page.setViewport({ width: 1200, height: 628 });
    await page.goto(url, { waitUntil: 'networkidle2' });
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

  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  
    var i;
    for (i = 0; i < response.length; i++) {
  
      let filename = response[i].filename;
      let localurl = dist + filename;
  
      if (fs.existsSync(localurl + ".png")) {
        console.log("File exists");
      } else {
        await getscreen(filename, "file://" + localurl + ".html");
      }
  
    }
  } catch(err) {
    console.error(err)
  }

  browser.close();
  console.log('Done!');

}

setpuppeteer(previewdata);
