---
title: "From WordPress to JAMStack"
permalink: /en/articles/wordpress-to-jamstack/index.html
date: 2019-08-20T17:30:00-00:00
dateModified: 2019-08-20T17:30:00-00:00
tags: ["code"]
excerpt: "Away from WordPress, towards JAMStack with Eleventy and Netlify. Multilingualism, a domain move... August makes everything new."

language: en
translation_en: /en/articles/wordpress-to-jamstack/
translation_de: /de/articles/wordpress-zu-jamstack/

seoindex: true
seotitle: "From WordPress to JAMStack"
seodescription: "Away from WordPress, towards JAMStack with Eleventy and Netlify. Multilingualism, a domain move... August makes everything new."
---
## Intro

New design, new technology, faster loading performance – the new version of my private website is finally live :tada:

A good occasion to show what has been going on in the backend, what I intend to do with this site in the future and to give you suggestions for your own blog.

## Multilingualism & domain transfer

The first change: Instead of d-hagemeier.de my blog is now accessible via d-hagemeier.com. The main reason for this step is the future bilingualism of all content. Each article will be published in German and English in the future (how I have achieved this technically, will soon be published in a separate article).

At the same time the content was old. 2016-old. Basically, an archive of my articles published on other websites. What was missing was the discipline to write more articles.

Marketing, web development and design will be the future focus, my personal goal is to write at least one article per month. Maybe, there will be one or two articles beyond these topics – who knows? :wink:

## It's a match: Eleventy & Netlify

Technically, the biggest step is the change to <a href="https://www.11ty.io/" rel="noopener">Eleventy</a> and <a href="https://www.netlify.com/" rel="noopener">Netlify</a>. For years I have built up all my professional and private projects on WordPress, my first choice for a CMS. But with the release of version 5.0, WordPress seemed bloated to me. It was time for something new.

### JAMStack

I had heard about the JAMStack (**J**avaScript, **A**PIs and **M**arkup), but it was quite difficult to get started. The basic idea is a new approach for high-performance, easy-to-manage websites. Instead of using PHP and databases like WordPress, the JAMStack generates HTML files that can be delivered "serverless".

Sounds static? Apart from the name of the generators (Static Site Generators, or SSG for short), it isn't static at all. To make programming as flexible as possible, SSGs rely primarily on template languages such as Liquid or Nunjucks. Variables, filters or loops are resolved and converted during build process.

Other tasks can be solved via JavaScript and the connection of APIs. This makes it possible to solve even complex ordering processes such as those of an online shop without relying on server-based programming languages.

### Eleventy

Great theories, yet the introduction was difficult for me. I was used to PHP, had a hard time fiddling with the given structure of the leading SSGs, like <a href="https://jekyllrb.com/" rel="noopener">Jekyll</a>.

This changed when I discovered <a href="https://twitter.com/zachleat" rel="noopener">Zach Leathermans</a> Eleventy. Based on NodeJS, you get maximum flexibility in the structure, almost every template language imaginable, a detailed documentation with numerous tutorials and starter projects... the start couldn't have been better.

How does Eleventy work with my website?

All my articles are written as Markdown files. Additional information such as title, publication date or SEO information ends up in the header of the article. Simplified, an article looks like this:

```markdown
---
title: "5 Tips You Can Learn in Las Vegas for Your Business"
permalink: /en/articles/5-vegas-tipps/index.html
date: 2016-02-15T14:14:00-05:00
---
## 1. Think further than the competition

A dolphin tank in the desert? (...)
```

Eleventy does not specify in which directory these Markdown files are located. At the same time I use Nunjucks to create the templates. If you open a Nunjucks file for the first time, the code looks like HTML. Finally there is nothing magical about it – Nunjucks is just an extension for functions and variables.

The basic layout for each content type is very simple:
{% raw %}
```html
{% include "components/head.njk" %}

<main id="main" class="site-content">
    {{ layoutContent | safe }}
</main>

{% include "components/footer.njk" %}
```
{% endraw %}

With `include` I load additional components, in this case the `head` and `footer` area. The `head` contains nothing else than the `doctype`, meta tags or the link of the stylesheet (similar to `header.php` in WordPress). The cool thing about Nunjucks: By using variables from the head of the markdown file, all HTML generated afterwards can be adapted dynamically. For example, the `<html>` tag looks like this:

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

For this example, this would result in nothing more than:

```html
<html data-current="article" lang="en">
```

By the way, I took only one article from the old version of my website and copied it manually. If I already had a larger amount of articles in WordPress, I would have used the <a href="https://www.npmjs.com/package/wordpress-export-to-markdown" rel="noopener">Wordpress Export to Markdown</a> to generate markdown files from the WP export file.

Another change of this new website version: All source code is publicly available on Github. So if you want to take a closer look at the structure, feel free to check out the <a href="https://github.com/dennishagemeier/d-hagemeier" rel="noopener">Repository</a>!

### Netlify

Although being called "serverless", you still need a server. So I needed a hoster.

So far, my private blog was accessible on a webspace of <a href="https://uberspace.de/" rel="noopener">uberspace</a>. For a "classic" website, I would probably never have changed - the support is out-of-this-world, the performance better than most supercars and the whole business model is based on "Pay what you want".

But then, along came <a href="https://www.netlify.com/" rel="noopener">Netlify</a>. And so my choice was made.

Anyone who asks "why" should try Netlify. Within three minutes my website was online - Netlify only needs to specify a repository, then downloads all required packages, executes the defined build process and provides the live directory directly under a `.netlify.com` subdomain.

Additional gimmicks simplify a lot, like optimizing CSS or image files, optimizing URLs or creating dynamic redirects by language.

The page will be rebuilt as soon as something changes in the Github directory. Or you can use webhooks and trigger the deploy manually (for my tweets on the home page for example).

## ToDo's

As always, there is still a lot on my ToDo list.

Currently the website does not contain any category pages. Thanks to `tags` in Eleventy, custom archive pages are very easy to build (in my case all articles are already divided into matching `collections`).

I also want to experiment with webmentions. This is a protocol from the IndieWeb, with which information like comments, likes or reposts can be transferred in a standardized way. Thanks to tools like <a href="https://brid.gy/" rel="noopener">Bridgy</a>, you can even import data from Twitter or Instagram.

My plan: Implement <a href="https://mxb.dev/blog/using-webmentions-on-static-sites/" rel="noopener">Max Böcks</a> great instructions and show all comments to articles like this one below the article.

Also, I'm working on automatically generate OG-images, the SVG-integration is not optimal yet... you notice, I still have some things to do :smile:

Please give me your feedback or write a short message, if you should notice any errors. I'm not finished with this blog yet :stuck_out_tongue: