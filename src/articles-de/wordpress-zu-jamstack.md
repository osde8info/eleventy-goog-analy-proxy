---
title: "Von WordPress zum JAMStack"
permalink: /de/articles/wordpress-zu-jamstack/index.html
date: 2019-08-20T17:30:00-00:00
tags: ["code"]
excerpt: "Weg von WordPress, hin zum JAMStack mit Eleventy und Netlify. Mehrsprachigkeit dazu, ein Domainumzug... alles neu macht der August."

language: de
translation_en: /en/articles/wordpress-to-jamstack/
translation_de: /de/articles/wordpress-zu-jamstack/

seoindex: true
seotitle: "Von WordPress zum JAMStack"
seodescription: "Weg von WordPress, hin zum JAMStack mit Eleventy und Netlify. Mehrsprachigkeit dazu, ein Domainumzug... alles neu macht der August."
---
## Intro

Ein neues Design, neue Technik, schnellere Ladeperformance – die neue Variante meiner privaten Website ist endlich live :tada:

Ein guter Anlass um zu zeigen, was sich unter der Haube getan hat und was ich künftig mit dieser Seite vorhabe. Oder um dir Anregungen für deinen eigenen Blog zu geben.

## Mehrsprachigkeit & Domainumzug

Die erste Neuerung: Statt wie bisher über d-hagemeier.de ist mein Blog nun über d-hagemeier.com erreichbar. Der Hauptgrund für diesen Schritt ist die zukünftige Zweisprachigkeit aller Inhalte. Jeder Artikel wird zukünftig auf Deutsch und Englisch erscheinen (wie ich das technisch erreicht habe, erscheint bald in einem eigenen Artikel).

Gleichzeitig waren die Inhalte alt. Von 2016. Ein Archiv meiner auf anderen Webseiten veröffentlichten Artikel. Was fehlte, war die Disziplin, mehr Artikel zu schreiben.

Marketing, Webentwicklung und Design werden den Schwerpunkt legen, als persönliches Ziel habe ich mir mindestens einen Artikel pro Monat gesetzt. Und vielleicht gesellt sich auch der ein oder andere Artikel dazu, der über diese Themen hinausgeht – wer weiß? :wink:

## It's a match: Eleventy & Netlify

Technisch besteht die größte Neuerung im Wechsel zu <a href="https://www.11ty.io/" rel="noopener">Eleventy</a> und <a href="https://www.netlify.com/" rel="noopener">Netlify</a>. Jahrelang habe ich alle beruflichen und privaten Projekte auf WordPress aufgebaut, für mich die erste Wahl als CMS. Gerade mit Veröffentlichung von Version 5.0 erschien mir WordPress allerdings aufgebläht; es war Zeit für etwas Neues.

### JAMStack

Von JAMStack (**J**avaScript, **A**PIs und **M**arkup) hatte ich zwar gehört, der Einstieg gestaltete sich zuerst jedoch schwierig. Hinter der Grundidee verbirgt sich ein neuer Ansatz für performante, einfach zu verwaltende Websites. Statt wie bei WordPress auf PHP und Datenbanken zu setzen, werden mithilfe des JAMStacks HTML-Dateien generiert, welche sich "ohne Server" ausliefern lassen.

Klingt statisch? Ist es – abgesehen vom Namen der Generatoren (Static Site Generators, oder kurz SSG) – definitiv nicht. Denn die verwandeln ganz dynamisch unterschiedlichen Inhalt in HTML-Dateien. Damit die Programmierung so flexibel wie möglich ist, setzen SSGs vor allem auf Templatesprachen, wie Liquid oder Nunjucks. Variablen, Filter oder Schleifen werden im Build-Prozess aufgelöst und umgewandelt.

Bedarf es noch mehr Dynamik, lassen sich andere Aufgaben per JavaScript und der Anbindung von APIs lösen. Damit ist es möglich, selbst komplexe Bestellvorgänge wie die eines Onlineshops zu lösen, ohne auf serverbasierte Programmiersprachen zu setzen.

### Eleventy

Alles tolle Theorien, dennoch gestaltete sich der Einstieg für mich schwer. Ich war PHP gewohnt, wurde mit der vorgegebenen Struktur der SSG-Platzhirsche wie <a href="https://jekyllrb.com/" rel="noopener">Jekyll</a> nicht warm.

Das änderte sich, als ich <a href="https://twitter.com/zachleat" rel="noopener">Zach Leathermans</a> Eleventy entdeckte. Basierend auf NodeJS, maximale Freiheit bei der Gestaltung der Struktur, nahezu jede nur denkbare Templatesprache, eine ausführliche Dokumentation mit zahlreichen Tutorials und Starterprojekten... besser hätte der Einstieg nicht sein können.

Wie funktioniert Eleventy konkret bei meiner Website?

Alle meine Artikel werden als Markdown-Dateien verfasst. Zusatzinformationen wie Titel, Veröffentlichungsdatum oder SEO-Angaben landen im Kopf des Artikels. Vereinfacht schaut ein Artikel damit so aus:

```markdown
---
title: "5 Tipps, die du in Las Vegas für dein Business lernen kannst"
permalink: /de/articles/5-vegas-tipps/index.html
date: 2016-02-15T14:14:00-05:00
---
## 1. Weiterdenken als die Konkurrenz

Ein Delfinbecken in der Wüste? (...)
```

In welchem Verzeichnis diese Markdown-Dateien liegen, gibt Eleventy nicht vor. Parallel dazu nutze ich Nunjucks zur Erstellung der Templates. Öffnet man zum ersten Mal eine Nunjucks-Datei, wirkt der Code wie HTML. Letztlich ist dahinter auch nichts Magisches – Nunjucks ist lediglich eine Erweiterung für Funktionen und Variablen.

Das Grundlayout für jeden Inhaltstyp ist bei mir sehr simpel gestrickt:
{% raw %}
```html
{% include "components/head.njk" %}

<main id="main" class="site-content">
    {{ layoutContent | safe }}
</main>

{% include "components/footer.njk" %}
```
{% endraw %}

Per `include` lade ich zusätzliche Komponenten, in diesem Fall den `head`- und `footer`-Bereich. Im `head` verbirgt sich nichts anderes, als der `doctype`, Angaben für Meta-Tags oder die Verlinkung des Stylesheets (ähnlich zur `header.php` in WordPress). Das Schöne an Nunjucks: Durch die Verwendung der Variablen aus dem Kopf der Markdown-Datei lässt sich sämtliches, hinterher generiertes HTML dynamisch anpassen. Damit sieht z.B. das `<html>`-Tag wie folgt aus:

{% raw %}
```html
<html
    {% if section %} data-current="{{ section }}"{% endif %}
    {% if language %}
        {% if "en" in language %}lang="en"{% endif %}
        {% if "de" in language %}lang="de"{% endif %}
    {% endif %}
>
```
{% endraw %}

In diesem Artikel wird daraus hinterher nichts anderes als:

```html
<html data-current="article" lang="de">
```

Ich habe übrigens lediglich einen einzigen Artikel aus der alten Version meiner Website übernommen und diesen händisch kopiert. Bestände schon ein größeres Artikel-Archiv in WordPress, hätte ich zum Beispiel den <a href="https://www.npmjs.com/package/wordpress-export-to-markdown" rel="noopener">Wordpress Export to Markdown</a> verwendet, um aus der WP-Export-Datei Markdown-Dateien zu generieren.

Eine weitere Änderung dieser neuen Website-Version: Der gesamte Quellcode liegt öffentlich auf Github. Möchtest du also genauer in die Struktur und den Aufbau gucken, dann schau im <a href="https://github.com/dennishagemeier/d-hagemeier" rel="noopener">Repository</a> vorbei!

### Netlify

Heißt zwar "Serverless", einen Server braucht man trotzdem. Also musste ein Hoster her.

Bisher lag mein privater Blog auf einem Webspace von <a href="https://uberspace.de/" rel="noopener">uberspace</a>. Für eine "klassische" Website hätte ich wohl niemals gewechselt – der Support ist überirdisch, die Performance Spitze und das gesamte Geschäftsmodell basiert auf "Pay what you want".

Doch dann kam <a href="https://www.netlify.com/" rel="noopener">Netlify</a>. Und damit war meine Wahl getroffen.

Wer nach dem "Warum" fragt, der sollte Netlify ausprobieren. Innerhalb von drei Minuten war meine Website online – Netlify benötigt lediglich die Angabe eines Repositories, lädt sich anschließend alle benötigten Pakete herunter, führt den definierten Build-Prozess aus und stellt das Live-Verzeichnis direkt unter einer `.netlify.com`-Subdomain bereit.

Zusätzliche Gimmicks, wie das Optimieren von CSS oder Bilddateien, das Optimieren von URLs oder die Erstellung dynamischer Umleitungen nach Sprache vereinfachen vieles.

Die Seite wird erneut aufgebaut, sobald sich im Github-Verzeichnis etwas ändert. Oder man nutzt Webhooks und stößt den Deploy manuell an (für meine Tweets auf der Startseite zum Beispiel). Einfach eine runde Sache.

## ToDo's

Wie immer steht natürlich noch einiges auf meiner ToDo-Liste.

Aktuell beinhaltet die Website noch keine Kategorieseiten. Dank `tags` in Eleventy sind benutzerdefinierte Archivseiten sehr einfach zu bauen (in meinem Fall sind alle Artikel schon in passende `collections` aufgeteilt).

Außerdem möchte ich unbedingt mit Webmentions experimentieren. Dabei handelt es sich um ein Protokoll aus dem IndieWeb, mit welchem auf standardisiertem Weg Informationen wie Kommentare, Likes oder Reposts übertragen werden können. Dank Tools wie <a href="https://brid.gy/" rel="noopener">Bridgy</a> lassen sich sogar Daten von Twitter oder Instagram importieren.

Mein Plan: <a href="https://mxb.dev/blog/using-webmentions-on-static-sites/" rel="noopener">Max Böcks</a> großartige Anleitung umsetzen und alle Kommentare zu Artikeln wie diesem unterhalb des Artikels einblenden.

Außerdem versuche ich mich an automatisch generierten OG-Images, die SVG-Einbindung ist noch nicht optimal... du merkst, ich habe noch einiges vor :smile:

Gib mir gerne dein Feedback oder schreibe mir, sollten dir Fehler auffallen. Fertig bin ich mit diesem Blog noch lange nicht :stuck_out_tongue: