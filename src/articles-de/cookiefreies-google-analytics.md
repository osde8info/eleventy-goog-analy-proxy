---
title: "Cookiefreies Google Analytics"
permalink: /de/articles/cookiefreies-google-analytics/index.html
date: 2019-11-14T16:30:00-00:00
dateModified: 2019-11-14T16:30:00-00:00
tags: ["code", "marketing"]
excerpt: "Datenschutzorientiertes, cookiefreies Tracking mit Google Analytics durch die Nutzung des Measurement Protocols."

language: de
translation_en: /en/articles/cookie-free-google-analytics/
translation_de: /de/articles/cookiefreies-google-analytics/

seoindex: true
seotitle: "Cookiefreies Google Analytics"
seodescription: "Datenschutzorientiertes, cookiefreies Tracking mit Google Analytics durch die Nutzung des Measurement Protocols."
---

Seit Start der DSGVO bin ich auf der Suche nach einer cookiefreien Google Analytics-Alternative. Mich interessiert, welche Seiten meines Blogs aufgerufen werden, woher die Besucher stammen und seit dem Relaunch meines Blogs auch, welche Sprache sie sprechen. Außerdem möchte ich die Daten in aggregierter Form betrachten können, beispielsweise als einfaches Dashboard. Und da mein Blog nur mein Privatvergnügen ist, habe ich keine Lust, jeden Monat Unmengen an Geld für die Analysedaten zu bezahlen. All das ist mit Google Analytics einfach umsetzbar – wäre da nicht die DSGVO.

## Das Problem

Möchte ich Google Analytics datenschutzkonform einsetzen, benötige ich die Zustimmung der Besucher. Also klatsche ich einem neuen Nutzer direkt ein Banner vor die Nase, "Zustimmen" oder "Ablehnen" als Möglichkeiten. Nur um anschließend seine Daten an Google zu geben und ihn verfolgbar auf zahlreichen Webseiten zu machen.

Weiterer Nachteil: Immer mehr Menschen sind mit Erweiterungen wie Ghostery unterwegs, die Google Analytics direkt beim Seitenaufruf wegblocken. Spätestens mit der Weiterentwicklung der Browser (wie der Intelligent Tracking Prevention in WebKit) werden die Daten immer weniger zuverlässig.

Alternativen zu Google Analytics gibt's einige: Direkte GA-Konkurrenten wie <a href="https://simpleanalytics.com/" target="_blank">Simple Analytics</a>, Plugins wie <a href="https://de.wordpress.org/plugins/statify/" target="_blank">Statify</a> oder Umstieg auf Server-Log-Analysetools, z.B. mit <a href="https://www.netlify.com/products/analytics/" target="_blank">Netlify Analytics</a>. Die meisten von denen kosten allerdings und beschränken mich auf die mit dem entsprechenden Tool gesammelten Daten. Ich bin großer Fan des Google Data Studios, damit ich gleichzeitig auch Daten der Search Console und von anderen Quellen auswerten kann.

Sogar Experimente mit Firestore habe ich hinter mir. Mit eigenem Trackingpixel habe ich dort die Nutzerdaten hinterlegt – allerdings muss ich dann ALLES selber bauen. Vom einfachen Bot-Filter, über die Einsortierung der Quellen in Channels bis zur Schnittstelle mit dem Data Studio.

Ich will also Google Analytics – nur ohne Cookies und DSGVO-konform.

## Die Lösung: Cookiefreies Google Analytics

Mit dem Standard-Trackingcode von Google ist kein cookiefreies Tracking möglich. Automatisch setzt das Skript mehrere Cookies für Nutzer-ID, Timestamp oder Absprungtracking.

Also nutze ich die zweite Variante, um Daten zu Google Analytics zu importieren: Das Measurement Protocol. Dahinter versteckt sich nichts anderes als eine Schnittstelle zur Übermittlung von Rohdaten als HTTP-Request. Wer mit dem Measurement Protocol spielen möchte, der kann sich mit dem <a href="https://ga-dev-tools.appspot.com/hit-builder/" target="_blank">Hit Builder</a> austoben.

Die Lösung des cookiefreien Google Analytics-Skripts besteht also in einem POST-Request, in welchem ich einen Grundschatz an Nutzerdaten verpacke und diesen an das Measurement Protocol weitergebe. Ich habe mich für diese Daten entschieden:

1. User-ID (Voraussetzung von Google für einen gültigen POST-Request)
2. Useragent (Zur Filterung von Bot-Traffic)
3. Seitentitel
4. URL
5. Referrer
6. Eingestellte Sprache

Damit werden nur die für mich wirklich notwendigen Daten für eine vernünftige Analyse übertragen. Diese Weise des Trackings hat aber auch einige Nachteile:

**Das Tracking beschränkt sich auf Pageviews**

Um den kompletten Browse-Verlauf eines Nutzers zu speichern, müsste ich einem Nutzer mehrere Pageviews zuordnen. Klappt auch mit dem Measurement Protocol – ich müsste allerdings eine User-ID als Cookie oder im LocalStorage ablegen, um die Variable über mehrere Seitenaufrufe hinweg kostant zu halten. Das widerspricht aber meinem Grundgedanken, komplett auf Cookies (und auch auf den LocalStorage) zu verzichten.

Stattdessen generiert jeder Pageview eine neue User-ID und startet quasi bei jedem Seitenwechsel eine neue Session. Das bedeutet: Kein Seitenfluss, keine Anzahl an Nutzern (die wird zwar dargestellt, ist aber gleich den Pageviews), keine Einstiege oder Absprünge. Jeder Pageview ist ein neuer Einstieg und jeder Seitenwechsel bedeutet einen Absprung.

**Keine Zielgruppenanalyse**

Ich übertrage nur ein grundliegendes Gerüst an Informationen. Da ich Google nicht genug Informationen gebe, um mehrere Pageviews miteinander zu verketten und damit auch kein seitenübergreifendes Tracking möglich ist, stehen mir auch keine Informationen zur Zielgruppe zur Verfügung. Bedeutet: Keine demografischen Daten, kein Standort, keine Interessen und keine Netzwerkinfos.

Allerdings übertrage ich die verwendete Browsersprache und durch den Useragent sind auch Daten zur Gerätekategorie und zum Browser vorhanden.

**Der Referrer wird nur für den ersten Hit korrekt übertragen**

Da jeder Pageview eine neue Session bedeutet, wird nur für den ersten Hit eines Nutzers der Referrer korrekt gesetzt. Für alle weiteren Aufrufe ist die Website selbst der Referrer, damit wird für jeden weiteren Pageview die Quelle als "direct" gesetzt.

Ein Beispie: Findet ein Nutzer meinen Blog über Google und schaut sich die drei Seiten "Articles", "Home" und "About" an, wären die Quellen:

- Articles: google/organic
- Home: direct
- About: direct

**Ausführlicheres Tracking ist nur sehr umständlich möglich**

Zwar lassen sich auch Ereignisse über das Measurement Protocol übermitteln, die Option wäre aber sehr umständlich. Wer auf ausführliches Tracking angewiesen ist, der ist bei dieser Lösung falsch und sollte eher den Google Tag Manager mit individualisierten Triggern und Events nutzen.

## Client-Side-Skript

Würde ich die Daten direkt per POST-Request an Google schicken, würde Google eine Vielzahl an Informationen über den Body des Requests erhalten. Außerdem würden viele Datenschutz-Browser-Erweiterung diesen Request blocken.

Deshalb teile ich den POST-Request und nutze ein Client-Side- und ein Server-Side-Skript (zweiteres als Proxy-Skript).

### Verwendete Variablen

Zuerst befülle ich meine Client-Side-Datei mit den Variablen, welche ich später per POST-Request übertragen möchte:

**User-ID**

Google nutzt für die User-ID (später `cid`) einen <a href="https://wikipedia.org/wiki/Universally_Unique_Identifier" target="_blank">Universally Unique Identifier</a>. Der lässt sich mit folgender Funktion generieren und als Konstante abspeichern:

```javascript
function uuidv4() { return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, *c* => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); }
const uuid = uuidv4();
```

**Useragent**

```javascript
const useragent = navigator.userAgent;
```
**Seitentitel**

```javascript
const title = document.title;
```
**URL**

Eine reguläre URL setzt sich aus drei Teilen zusammen: Der Domain ("https://www.d-hagemeier.com"), dem Pfad ("/en/articles/") und den Parametern ("?utm_source=facebook&utm_medium=social"). Ich übermittle diese bewusst getrennt voneinander, um später einzeln darauf zugreifen zu können.

```javascript
// Domain
const origin = window.location.origin;
// Pfad
const pathname = window.location.pathname;
// Parameter
const search = window.location.search;
```
**Referrer**

```javascript
const referrer = document.referrer;
```
**Eingestellte Sprache**

```javascript
const language = navigator.language || navigator.userLanguage;
```

Anschließend summiere ich die Daten der Einfachheit halber in einer Variable:

```javascript
const sitedata = {
  uuid: uuid,
  useragent: useragent,
  title: title,
  origin: origin,
  pathname: pathname,
  search: search,
  referrer: referrer,
  language: language
}
```

### Post Request

Zur Übertragung als POST-Request nutze ich die `fetch-API`. Mein Endpoint dafür ist `/.netlify/functions/send`, weil ich für mein Server-Side-Skript eine AWS-Lambda-Funktion über Netlify nutze. Das ist aber kein Muss; möglich wäre beispielsweise auch ein PHP-Endpoint, der die Daten an das Measurement Protocol weitergibt.

```javascript
function senddata(data) {
  return fetch('/.netlify/functions/send', {
    body: JSON.stringify(data),
    method: 'POST'
  })
}

senddata(sitedata).catch((error) => {
  console.log('Error: ', error)
})
```

## Server-Side-Skript

Wie schon beschrieben nutze ich serverseitig eine Netlify Funktion. 

Ich starte mit der Abfrage, ob sich bei dem Aufruf um einen POST-Request handelt – und verbiete alle anderen Aufrufe.

```javascript
if (event.httpMethod !== "POST") {
  return { statusCode: 405, body: "Method Not Allowed" };
}
```

Als nächstes parse ich die übermittelten Dateien und speichere diese in der Konstante `data`. Dann konstruiere ich meinen Payload und den Endpoint.

```javascript
const url = data.origin + data.pathname + data.search;
const endpoint = "https://www.google-analytics.com/collect";
const payload = encodeURI(`v=1&t=pageview&tid=UA-85526167-1&cid=${data.uuid}&ua=${data.useragent}&aip=1&ds=web&dl=${url}&dt=${data.title}&ul=${data.language}&dr=${data.referrer}`).replace(/\//g, '%2F');
```

Jetzt folgt der eigentliche POST-Request an Google. Den Status gebe ich als `console.log`, bzw. `console.error` aus, beides wird mir im Netlify-Dashboard unter den Funktionen angezeigt.

```javascript
try {
  const response = await fetch(`${endpoint}?${payload}`, {
    method: 'POST',
    cache: 'no-cache'
  })
  if (response.ok) {
    console.log(`Status ${response.status}: ${response.statusText}`)
  }
} catch (err) {
  console.error("Error: " + err)
}
```

**Achtung**: Um die `fetch-API` in NodeJS zu nutzen, benötige ich das entsprechende <a href="https://www.npmjs.com/package/node-fetch" target="_blank">Modul</a>!

Die vollständigen Varianten der <a href="https://github.com/dennishagemeier/d-hagemeier/blob/master/src/assets/js/send.js" target="_blank">Client-Side-</a> und <a href="https://github.com/dennishagemeier/d-hagemeier/blob/master/functions/send/send.js" target="_blank">Server-Side-Skripte</a> findet du in meinem Github-Repository.

## Bonus: Data Studio-Vorlage

Die Daten laufen mit diesen beiden Dateien schon sauber in Google Analytics ein und können dort wie gewohnt gefiltert und ausgewertet werden. Ich bin aber ein Fan vom Google Data Studio, also habe ich mir ein passendes Dashboard mit den übertragenen Daten und den Suchanfragen aus der Search Console gebastelt.

Das Data Studio kannst du dir <a href="https://datastudio.google.com/s/nNr0l5Et0PM" target="_blank">hier</a> anschauen und kopieren. Einfach die Datenquellen tauschen und schon hast du einen guten Startpunkt für dein eigenes Data Studio.