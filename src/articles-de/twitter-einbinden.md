---
title: "Twitter Timeline in Eleventy einbinden"
permalink: /de/articles/twitter-einbinden/index.html
date: 2019-10-16T16:30:00-00:00
tags: ["code"]
excerpt: "Lerne, wie du eigene Tweets per API abrufen und dynamisch im Static Site Generator Eleventy darstellen kannst."

language: de
translation_en: /en/articles/embed-twitter/
translation_de: /de/articles/twitter-einbinden/

seoindex: true
seotitle: "Twitter Timeline in Eleventy einbinden"
seodescription: "Eigene Tweets per API abrufen und dynamisch im Static Site Generator Eleventy darstellen."
---
Twitter ist für mich eine wundervolle Plattform, um spannende Artikel zu entdecken, mich mit Menschen auszutauschen und Wissen weiterzugeben. Warum also nicht die eigene Website stets mit neuen Tweets auf der Startseite frisch halten?

**Möglichkeit 1:**
Die Twitter-Timeline per Widget einbinden. Nachteile: Wenig Einfluss auf die Darstellung, ein zusätzliches Third-Party-Skript und damit verbunden Geschwindigkeitseinbuße.

**Möglichkeit 2:**
Die Twitter-Timeline per API im Build-Prozess direkt im HTML abspeichern. Und wie das ganz einfach mit dem Static Site Generator Eleventy funktioniert, zeige ich euch in diesem Artikel.

## API Zugangsdaten erstellen

Um auf die Twitter-API zugreifen zu können, benötigst du als erstes deine persönlichen Zugangsdaten. Rufe dazu das <a href="https://developer.twitter.com/en/apps" target="_blank">Twitter-Developer-Portal</a> auf und wähle `Create an app`. Der Großteil der nun dargestellten Felder braucht nicht einmal ausgefüllt werden, weil der Nutzer deiner Website niemals in direkten Kontakt mit der API kommen wird.

In meinem Fall sieht das Ganze so aus:

![Twitter Developer App Überblick](/assets/media/embed-twitter/twitter-developers.jpg)

Nach Klick auf den Tab `Keys and tokens` erhältst du deine API-Zugangsdaten – du brauchst alle vier, also schonmal zwischenspeichern!

![Twitter Developer API Keys](/assets/media/embed-twitter/twitter-developers.jpg)

Ich nutze `dotenv`, damit meine API-Zugangsdaten nicht öffentlich auf Github auftauchen. Meine `.env`-Datei ergänze ich also um vier Einträge:

```
TWITTER_CONSUMER_KEY="DeinAPIkey"
TWITTER_CONSUMER_SECRET="DeinAPIsecretkey"
TWITTER_ACCESS_TOKEN_KEY="DeinAccesstoken"
TWITTER_ACCESS_TOKEN_SECRET="DeinAccesstokensecret"
```

## Datenobjekt in Eleventy anlegen

Externe Daten lassen sich bequem in Eleventy nutzen. Hierzu brauchst du lediglich eine JavaScript-Datei im `_data`-Ordner anlegen, welche die gewünschten Daten per `return` ausgibt (Details dazu findest du in der <a href="https://www.11ty.io/docs/data-js/" target="_blank">Dokumentation</a>). Lege zuerst eine Datei mit dem Namen `tweets.js` im Data-Ordner an.

Installiere dann das Twitter-NodeJS-Package:

```
npm install twitter --save
```

Meine `tweets.js`-Datei beginnt mit den benötigten Bibliotheken:

```javascript
var Twitter = require('twitter');
require('dotenv').config()
```
Als nächstes benötigt das Twitter-NodeJS-Package unsere API-Zugangsdaten:

```javascript
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
```

Nun können wir unterschiedliche Daten aus der API abfragen. Uns interessieren unsere eigenen Tweets, deshalb benötigen wir die Angabe unserer User ID (man kann auch den Accountnamen verwenden, die ID bleibt aber auch bei der Änderung des Namens immer gleich).

Außerdem fügen wir hinzu, wieviele Tweets wir abrufen möchten, ich habe mich für die 20 neusten Tweets entschieden.

```javascript
var params = {
  user_id: '550124146',
  count: 20
};
```

Wer möchte, kann hier diverse andere Optionen einfügen, einen kompletten Überblick bietet die <a href="https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline" target="_blank">Dokumentation auf Twitter</a>.

Fehlt nur noch der Abruf der Daten und deren Export:

```javascript
module.exports = async function() {
  return client.get('statuses/user_timeline', params)
    .catch((err) => {
      console.error(err);
    });
}
```

Insgesamt sieht meine `tweets.js` so aus:

```javascript
var Twitter = require('twitter');
require('dotenv').config()

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var params = {user_id: '550124146', count: 20};

module.exports = async function() {
  return client.get('statuses/user_timeline', params)
    .catch((err) => {
      console.error(err);
    });
}
```

## 11ty Filter

Eleventy bietet die Möglichkeit, eigene Filter zu definieren. Zwei grundliegende Filter für die Darstellung von Tweets habe ich aktuell im Einsatz.

### Antworten filtern

Standardmäßig übermittelt die API jeden Tweet der Timeline – also auch die Tweets, die du als Antwort auf andere Tweets gepostet hast. Es gibt zwei Möglichkeiten, die Antworten auszufiltern:

**1. Filter per API-Abfrage**

Du fügst deiner `params`-Variable den Wert `exclude_replies = true` hinzu. Ich habe mich allerdings dagegen entschieden, weil wir damit auf keiner anderen Seite auf die Antworten zugreifen können – sie werden eben nicht abgefragt.

**2. Filter per 11ty-Filter**

Mit einem globalen Filter kannst du dynamisch im Template entscheiden, an welcher Stelle du Antworten inkludieren möchtest und wo nicht. Der Trick: Jede Antwort beginnt mit einem @. Der dazugehörige Filter gehört in deine `.eleventy.js`-Datei:

```javascript
eleventyConfig.addFilter("tweetExcludeAnswers", obj => {
  const result = obj.filter(el => el.text.charAt(0) !== "@");
  return result;
});
```

### URL aus Tweettext filtern

Standardmäßig hängt die API jedem Tweet-Text die Quell-URL vom Tweet an. Jede dieser URLs startet mit dem Short-URL-Dienst von Twitter – und das mache ich mir in diesem Filter zunutze, indem ich jede URL ausfiltere, die mit `https://t.co` startet.

```javascript
eleventyConfig.addFilter("tweetRemoveLink", obj => {
  const result = obj.replace(/https:\/\/t.co\/\S*/gm, "");
  return result;
});
```

### Datum mit Moment.js formatieren

Möchtest du das Datum deiner Tweets darstellen, wirst du nicht um eine Formatierung herumkommen. Die Twitter-API gibt das Datum im Format `Thu Apr 06 15:28:43 +0000 2017` aus.

Zur Formatierung nutze ich <a href="https://momentjs.com/" target="_blank">Moment.js</a>. Moment.js erlaubt es nicht nur, das Format des Datums anzupassen, sondern auch die Lokalisierung zu beeinflussen. Da ich den Filter nicht nur für Tweets, sondern auch für andere Daten nutze, habe ich ihn möglichst flexibel aufgebaut, statt ihn auf das Twitter-Format festzulegen.

```javascript
eleventyConfig.addFilter("date", function(dateObj, fromformat , toformat, language = "en") { 
  return moment(dateObj, fromformat).locale(language).format(toformat);
});
```

Der Filter kann nun wie folgt genutzt werden:

{% raw %}

```
{{ item.created_at | date("ddd MMM D HH:mm:ss ZZ YYYY", "Do MMMM YYYY", language) }}
```

{% endraw %}

## Template vorbereiten

### Anzeige der Tweets

Nachdem wir aus der Twitter API ein Datenobjekt in Eleventy geformt haben, lässt sich jeder Wert dynamisch im Template verwenden. Ich nutze dafür Nunjucks.

Zuerst setzen wir den `tweetExcludeAnswers`-Filter.

{% raw %}

```
{% set twitter = tweets | tweetExcludeAnswers %}
```

{% endraw %}

Anschließend können wir per Loop die Daten ausspielen. Zudem begrenze ich in diesem Fall per `.slice(0, 5)` die Anzeige auf die fünf aktuellsten Tweets.

{% raw %}

```
{%- for item in twitter.slice(0, 5) -%}
<!-- Anzeige der Tweets -->
{%- endfor -%}
```

{% endraw %}

### Abfrage nach Tweettyp (Retweet, Zitat, eigener Tweet)

Im Kern ist jeder Tweet zu einer von drei Sorten zuzuordnen: Ein Retweet, ein zitierter Tweet (also ein Retweet mit angefügtem Kommentar) oder ein eigener Tweet. Jedes Tweet-Item besitzt deshalb zwei Attribute, `retweeted` und `is_quote_status`, welches mit `true` oder `false` versehen ist. Sind beide Werte `false`, ist der Tweet ein eigener Tweet.

Mit diesem Wissen können wir die Templates entsprechend aufbauen:

{% raw %}

```html
<!-- Retweets -->
{% if item.retweeted %}{% endif %}
<!-- Zitate -->
{% if item.is_quote_status %}{% endif %}
<!-- Eigene Tweets -->
{% if not item.is_quote_status and not item.retweeted %}{% endif %}
```

{% endraw %}

Meinen vollständigen Code mit allen Anpassungen findest du in meinem Github-Repository:

1. <a href="https://github.com/dennishagemeier/d-hagemeier/blob/master/src/_data/tweets.js" target="_blank">Tweet.js-Datei</a> für die Anlage des Datenobjekts
2. <a href="https://github.com/dennishagemeier/d-hagemeier/blob/master/.eleventy.js" target="_blank">Eleventy.js-Datei</a> mit den benötigten Filtern
3. <a href="https://github.com/dennishagemeier/d-hagemeier/blob/master/src/_includes/components/tweets.njk" target="_blank">Nunjucks-Template</a> zur Darstellung

## Bonus: Automatischer Deploy bei neuem Tweet

Da die Tweets nur im Build-Prozess importiert und in die Homepage-HTML eingebettet werden, muss die Seite bei einem neuen Tweet aktualisiert werden. Wer Netlify zum Hosten nutzt, kann sich mit automatischen Deploys viel Handarbeit sparen.

Der Trick: Webhooks und die Verknüpfung zu IFTTT.

### Build-Hook anlegen

Navigiere zuerst in deinem Netlify-Konto zu `Settings > Build & deploy > Continuous Deployment > Build hooks`. Nach Klick auf "Add build hook" fehlt nur noch der Name (in meinem Fall "New tweet") und die Auswahl des Branch. Anschließend zeigt dir Netlify eine URL im Format `https://api.netlify.com/build_hooks/BUILDID` zur Verfügung – die schonmal zwischenspeichern!

### Rebuild in IFTTT triggern

In <a href="https://ifttt.com/" target="_blank">IFTTT</a> legst du nun ein neues Applet an. Unser Trigger ist der Twitter-Account: Der Task soll immer ausgeführt werden, sobald ein neuer Tweet im eigenen Account erscheint.

Die Aktion ist dann "Make a web request". Trage unter der URL die gerade von Netlify erhaltene Build-Hook-URL ein, "Method" ist "POST" und für "Content Type" nutzen wir "application/x-www-form-urlencoded".

So sieht der fertige Task bei mir aus:

![IFTTT Einstellungen für automatischen Deploy in Netlify](/assets/media/embed-twitter/ifttt-settings.jpg)

Viel Spaß beim Nachbauen!

