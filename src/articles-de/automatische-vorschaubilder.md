---
title: "Social Media-Vorschaubilder automatisch generieren"
permalink: /de/articles/social-media-vorschaubilder-generieren/index.html
date: 2019-12-19T14:14:00-05:00
dateModified: 2019-12-19T14:14:00-05:00
tags: ["code"]
excerpt: "Link-Vorschaubilder für Twitter, Facebook oder WhatsApp automatisch mit NodeJS und Netlify generieren."

language: de
translation_en: /en/articles/generate-social-media-preview-images/
translation_de: /de/articles/social-media-vorschaubilder-generieren/

seoindex: true
seotitle: "Social Media-Vorschaubilder automatisch generieren"
seodescription: "Link-Vorschaubilder für Twitter, Facebook oder WhatsApp automatisch mit NodeJS und Netlify generieren."
---
## Warum Social Media-Vorschaubilder?

Du hast einen großartigen Blogeintrag geschrieben. Du teilst ihn auf Twitter, WhatsApp oder Facebook. Und du möchtest, dass dein Publikum den Blogeintrag bemerkt und klickt.

Entscheidend dafür ist die Darstellung. Als erstes fällt nicht dein wohlformulierter Tweet ins Auge, sondern das Vorschaubild.

Ohne Optimierung sieht ein Tweet aus wie bei diesem Beispiel von Gatsby:

{% image "/assets/media/generate-social-media-preview-images/twitter-small-preview", "Kleines Twitter-Vorschaubild" %}

Mit passendem Vorschaubild ist der Tweet deutlich präsenter:

{% image "/assets/media/generate-social-media-preview-images/twitter-big-preview", "Großes Twitter-Vorschaubild" %}

Ein normaler Mensch würde jetzt Photoshop öffnen, sich eine Template-Datei erstellen und das Bild für den Beitrag abspeichern. Wäre aber…. langweilig. Also nutze ich NodeJS, {% link "https://www.netlify.com/", "Netlify", true %} und automatisiere das Ganze :D

> Ich nutze für dieses Beispiel den SSG {% link "https://www.11ty.dev/", "11ty", true %}, die Funktionsweise ist aber nicht auf ein CMS begrenzt. Du kannst beispielsweise auch mit WordPress eine Template-Datei generieren und weiterverarbeiten.

## Vorbereitungen

### HTML-Template generieren

Mein erster Ansatz für die Erstellung der Vorschaubilder war die Generierung von SVGs. Ein Grunddesign in SVG, Variablen wie Titel oder URL dynamisch tauschen, in ein PNG oder JPG konvertieren und – Pustekuchen. Denn SVGs {% link "https://wiki.selfhtml.org/wiki/SVG/Tutorials/mehrzeiliger_Text", "scheitern bei mehrzeiligem Text", true %}. Spätestens bei längeren Überschriften wird das zu einem echten Problem.

Stattdessen bildet ein HTML-Template die Basis. Wie bereits erwähnt nutze ich 11ty, dazu kombiniere ich Nunjucks als Template-Sprache. Mit Hilfe einer Pagination generiere ich dann für jede reguläre HTML-Seite ein zusätzliches Vorschaubild-HTML.

> Ich habe mich für die Maße 1200x628 Pixel entschieden. Damit passt das Vorschaubild hinterher perfekt für Facebook, Twitter und WhatsApp. Erstellst du Vorschaubilder für andere Plattformen, findest du die aktuellen Maße z.B. bei {% link "https://sproutsocial.com/insights/social-media-image-sizes-guide/", "Sprout Social", true %}.

{% raw %}
```html
---
pagination:
  data: collections.all
  size: 1
  alias: preview
permalink: "/assets/preview-images/{{ preview.data.title | pslug }}-{{ preview.data.language | url }}-preview.html"
eleventyExcludeFromCollections: true
---
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="robots" content="noindex, nofollow" />
    <style><!-- CSS --></style>
</head>

<body>

  <div class="preview">
  	<svg xmlns="http://www.w3.org/2000/svg" width="80" height="91" viewBox="0 0 441 500" class="logo"><path d="M386.9 311.7c7.7-44 27-82.8 54-113.8C425.2 66 337.2 0 177.2 0H0v500h177.2c80.7 0 145.3-23.2 193.7-69.7 6.9-6.7 13.4-13.7 19.3-21-7.6-30.8-9.2-64-3.3-97.6zm-103.5 53c-27.8 29.3-66.1 43.9-114.9 43.9h-55.8V91.7h55.1c49.7 0 88.4 13.7 116 41C311.3 160 325 197.5 325 245.1c0 50.5-13.9 90.3-41.6 119.6z"></path></svg>
  	<h1>{{ preview.data.title }}</h1>
  	<h2>www.d-hagemeier.com</h2>
  </div>

</body>

</html>
```
{% endraw %}

{% link "https://www.d-hagemeier.com/assets/preview-images/hi-im-dennis-en-preview.html", "Beispiel für eine generierte Datei", true %}

> Schließe per "nofollow" die Crawler von Google & Co. aus, damit deine HTML-Vorschau-Templates nicht in Suchmaschinen auftauchen.

### JSON mit den erforderlichen Daten generieren

Um die HTML-Templates später an den Bildgenerator weiterzugeben, erstellst du als nächstes eine Liste aller HTML-Templates und derer Pfade. Hier ein Auszug aus {% link "https://www.d-hagemeier.com/preview-images.json", "meiner JSON-Datei" %}:

```json
[
  {
    "filename" : "import-tweets-from-twitter-api-in-11ty-en-preview",
    "path" : "https://www.d-hagemeier.com/assets/preview-images/import-tweets-from-twitter-api-in-11ty-en-preview.html"
  },{
    "filename" : "from-wordpress-to-jamstack-en-preview",
    "path" : "https://www.d-hagemeier.com/assets/preview-images/from-wordpress-to-jamstack-en-preview.html"
  },{
    "filename" : "5-tips-you-can-learn-in-las-vegas-for-your-business-en-preview",
    "path" : "https://www.d-hagemeier.com/assets/preview-images/5-tips-you-can-learn-in-las-vegas-for-your-business-en-preview.html"
  }
]
```

### Google Storage erstellen

Netlify hat einen großen Nachteil: Bei jedem Deploy werden die Altdaten gelöscht. Es gibt zwar Tricks mit undokumentierten Cache-Verzeichnissen, darauf wollte ich mich jedoch nicht verlassen.

Regulär würde Netlify also bei jedem Deploy alle Bilddaten löschen und neu anlegen. Je nachdem, wie viele Blogartikel du schreibst und wie viele Bilder generiert werden, erzeugt das eine Menge an Arbeit.

Stattdessen habe ich mich dazu entschieden, die Vorschaubilder im {% link "https://cloud.google.com/storage/", "Google Storage", true %} abzuspeichern. Google Storage gehört mit zur Google Cloud Platform, bietet die Speicherung von Daten in sogenannten Buckets und ist in den ersten 12 Monaten kostenfrei nutzbar.

Die Erstellung eines passenden Buckets ist nach dem Login einfach, ich habe in Klammern meine persönlichen Einstellungen angehängt:

1. "Bucket erstellen"
2. Einen Namen geben ("previewimages")
3. Speicherort auswählen ("Multi-region", "eu")
4. Speicherklasse auswählen ("Standard")
5. Zugriffssteuerung einrichten ("Detailgenau")
6. Erweiterte Einstellung (Alles auf Standard gelassen)

Sind die Einstellungen erledigt, wartet dein neuer Bucket auf dich und du könntest bereits händisch Dateien hochladen.

Damit unser Skript später Dateien im Bucket ablegen kann, benötigen wir die zugehörigen Google Credentials. Dazu einfach der {% link "https://console.cloud.google.com/apis/credentials/serviceaccountkey", "offiziellen Google-Anleitung folgen", true %} und ein neues Dienstkonto anlegen. Du erhältst anschließend eine JSON-Datei mit deinen Zugriffsschlüsseln. Speichere diese Schlüssel gut, pro Dienstkonto werden die nur einmal generiert!

Damit deine Zugriffsdaten nicht öffentlich erscheinen, speichere anschließend die Werte `CLOUD_PROJECT_ID`, `BUCKET_NAME`, `CLIENT_EMAIL` und `PRIVATE_KEY` als .env-Variablen.

## previewimages.js anlegen

### Packages und Einstellungen

Zeit für unser eigentliches Skript, in meinem Fall habe ich dies previewimages.js genannt. Als erstes fügst du die benötigten NPM-Packages hinzu…

```
yarn add axios puppeteer @google-cloud/storage dotenv
```

…und registrierst diese im Skript:

```javascript
const axios = require('axios');
const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config()
```

Anschließend folgen deine Variablen.

> Sollte später in Netlify der Fehler `error:0906D06C:PEM routines:PEM_read_bio:no start line` auftauchen, lag bei mir die Lösung in der Enkodierung von `PRIVATEKEY` zu base64. In der lokalen Entwicklungsumgebung hatte ich keine Schwierigkeiten, es scheint an dem mehrzeiligen Format des Keys zu liegen.

```javascript
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const BUCKET_NAME = process.env.GOOGLE_BUCKET_NAME;
const CLIENTEMAIL = process.env.GOOGLE_CLIENT_EMAIL;

// Falls du deinen Private Key per base64 encodiert hast:
const PRIVATEKEY = Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString();
// Falls nicht:
const PRIVATEKEY = process.env.GOOGLE_PRIVATE_KEY;

const credentials = {
  client_email : CLIENTEMAIL,
  private_key : PRIVATEKEY
}
```

Und zuletzt hinterlegst du die Grundeinstellungen:

```javascript
const settings = {
  source: "https://PFAD-ZU-DEINER-JSON-DATEI.json",
  imgwidth: 1200,
  imgheight: 628
}
```

### Daten per Axios verarbeiten

Zuerst lädst du per Axios deine JSON-Datei und gibst die Daten an deine verarbeitende Funktion weiter.

```javascript
axios.get(settings.source)
  .then((response) => {
    setupGoogleStorage(response.data);
  })
  .catch((err) => {
    console.log('Error Axios: ', err)
  });
```

### Google-Storage-Funktion

Damit bestehende Vorschaubilder nicht neu erstellt werden, prüfst du als erstes, welche Bilder bereits im Bucket abgelegt sind.

Dazu erstellst du eine neue Funktion `setupGoogleStorage` und autorisierst den zugriff auf deinen Bucket. Anschließend loopen wir durch die HTML-Template-Links und prüfen per `file.exists()`, ob das Bild vorhanden ist.

Existiert das Bild, erscheint lediglich eine kurze Nachricht in der Console, muss es noch angefertigt werden, reichst du Pfad, Datei und Dateiname an die `get`-Funktion weiter.

```javascript
async function setupGoogleStorage(response) {

  try {
    const storage = new Storage({
      projectId: GOOGLE_CLOUD_PROJECT_ID,
      credentials: credentials
    });
    const bucket = storage.bucket(BUCKET_NAME);
  
    var i;
    for (i = 0; i < response.length; i++) {

      let filename = response[i].filename;
      let path = response[i].path;
      let file = bucket.file(filename + ".png");
      let exists = await file.exists().then(function(data) { return data[0]; });
      
      if(exists == true) {
        console.log("Image already exists: " + filename + ".png")
      } else {
        await get(path, file, filename)
      }

    }
  } catch (err) {
    console.log("Error setupGoogleStorage: ", err);
  }

}
```

### Screenshots anfertigen

Jetzt folgt das eigentliche Anfertigen der Screenshots. In der `get`-Funktion starten wir eine neue Puppeteer-Seite und fordern per `getscreen`-Funktion den Screenshot an.

```javascript
async function get(path, file, filename) {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  const buffer = await getscreen(path, filename);
  await uploadBuffer(file, buffer, filename)
  console.log("Uploaded: " + filename + ".png")
  await file.makePublic();
  browser.close();
}

async function getscreen(url, filename) {
  try {
    console.log("Getting: " + url);
    await page.setViewport({ width: settings.imgwidth, height: settings.imgheight });
    await page.goto(url, { waitUntil: 'networkidle0' });
    const buffer = await page.screenshot();
    console.log("Got: " + filename + ".png");
    return buffer;
  }
  catch (err) {
    console.log('Error getscreen:', err);
  }
}
```

> Mit `networkidle0` wartet Puppeteer, bis innerhalb von 500ms keinerlei Netzwerkaktivität mehr vorhanden ist. Das verzögert zwar die Erstellung, stellt aber auch sicher, dass alle CSS-Dateien, Schriftarten und Bilder korrekt geladen sind.

Puppeteer erhält in `getscreen` keine Variablen für `pagescreenshot` und speichert damit den Screenshot nur als Buffer. Diesen Buffer gibst du jetzt an den Google Bucket weiter:

```javascript
async function uploadBuffer(file, buffer, filename) {
  return new Promise((resolve) => {
      file.save(buffer, { destination: filename }, () => {
          resolve();
      });
  })
}
```

### Fertige previewimages.js

```javascript
const axios = require('axios');
const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
require('dotenv').config()

const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const BUCKET_NAME = process.env.GOOGLE_BUCKET_NAME;
const CLIENTEMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATEKEY = Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString();
const credentials = {
  client_email : CLIENTEMAIL,
  private_key : PRIVATEKEY
}

const settings = {
  source: "https://PFAD-ZU-DEINER-JSON-DATEI.json",
  imgwidth: 1200,
  imgheight: 628
}

async function setupGoogleStorage(response) {

  try {
    const storage = new Storage({
      projectId: GOOGLE_CLOUD_PROJECT_ID,
      credentials: credentials
    });
    const bucket = storage.bucket(BUCKET_NAME);
  
    var i;
    for (i = 0; i < response.length; i++) {

      let filename = response[i].filename;
      let path = response[i].path;
      let file = bucket.file(filename + ".png");
      let exists = await file.exists().then(function(data) { return data[0]; });
      
      if(exists == true) {
        console.log("Image already exists: " + filename + ".png")
      } else {
        await get(path, file, filename)
      }

    }
  } catch (err) {
    console.log("Error setupGoogleStorage: ", err);
  }

}

async function get(path, file, filename) {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  const buffer = await getscreen(path, filename);
  await uploadBuffer(file, buffer, filename)
  console.log("Uploaded: " + filename + ".png")
  await file.makePublic();
  browser.close();
}

async function getscreen(url, filename) {
  try {
    console.log("Getting: " + url);
    await page.setViewport({ width: settings.imgwidth, height: settings.imgheight });
    await page.goto(url, { waitUntil: 'networkidle0' });
    const buffer = await page.screenshot();
    console.log("Got: " + filename + ".png");
    return buffer;
  }
  catch (err) {
    console.log('Error getscreen:', err);
  }
}

async function uploadBuffer(file, buffer, filename) {
  return new Promise((resolve) => {
      file.save(buffer, { destination: filename }, () => {
          resolve();
      });
  })
}

axios.get(settings.source)
  .then((response) => {
    setupGoogleStorage(response.data);
  })
  .catch((err) => {
    console.log('Error Axios: ', err)
  });
```

## Einbinden als Metatag + Verifizierung bei Twitter

Damit die Social Media-Vorschaubilder auch erscheinen, benötigst du die passenden Metatags. Davon gibt's die allgemeinen Open-Graph-Tags und die Twitter-Tags, beide Sorten gehören in den `<head>` deiner Website:

```html
<meta property="og:image" content="https://URL-ZU-DEINEM-VORSCHAUBILD.png" />
<meta property="og:image:height" content="1200" />
<meta property="og:image:width" content="628" />
<meta property="og:image:alt" content="DER ALT-TEXT ZU DEINEM VORSCHAUBILD" />

<meta name="twitter:image" content="https://URL-ZU-DEINEM-VORSCHAUBILD.png" />
<meta property="twitter:image:alt" content="DER ALT-TEXT ZU DEINEM VORSCHAUBILD" />
```

Die URL zu deinem Vorschaubild ist `https://storage.cloud.google.com/DEIN_BUCKETNAME/BILDNAME.png`.

Damit auf Twitter dein großes Vorschaubild erscheint, musst du außerdem eine zusätzliche Angabe hinzufügen…

```html
<meta name="twitter:card" content="summary_large_image" />
```

…und das Ergebnis im {% link "https://cards-dev.twitter.com/validator", "Validator", true %} testen:

{% image "/assets/media/generate-social-media-preview-images/twitter-validator", "Twitter Card validator" %}

## Deploy bei neuem Artikel

Damit jeder neue Artikel direkt ein Vorschaubild erhält, musst du nun nur noch festlegen, wann der Deploy starten soll. Mein eigener Workflow dafür:

1. Website schickt bei neuem Deploy einen Webhook ("Outgoing webhook" in Netlify, unter "Deploy notifications")
2. "Build hook" der Preview-Seite in Netlify triggert neuen Deploy

Nutzt du nicht Netlify für den Ursprung, kannst du den Webhook auch anders triggern. Wenn du beispielsweise bei jedem neuen Artikel in WordPress einen Deploy anstoßen möchtest, dann hinterlege einen der automatisch generierten RSS-Feeds bei {% link "https://ifttt.com/", "ifttt.com", true %} mit der Aktion "Webhook" und dem Webhook-Ziel deiner Preview-Seite.

Das war's, frohes Vorschauen :D