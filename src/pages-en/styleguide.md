--- 
layout: layouts/page.njk

title: Styleguide
permalink: /en/styleguide/index.html

language: en
translation_en: /en/styleguide/
translation_de: 

seoindex: false
seotitle: "Who is Dennis Hagemeier?"
seodescription: "The days of blind actionism in marketing are over. Time for data-based, automated marketing."

eleventyExcludeFromCollections: true
--- 

## Colors

<style>
.colorblock {
    display: inline-block;
    width: 2rem;
    height: 1rem;
    border: 1px solid var(--lum-0);
}
</style>

<table>
    <tr>
        <th>Name</th>
        <th>Color</th>
    </tr>
    <tr>
        <td>Yellow</td>
        <td><div class="colorblock" style="background: var(--yellow)"></div></td>
    </tr>
    <tr>
        <td>Orange</td>
        <td><div class="colorblock" style="background: var(--orange)"></div></td>
    </tr>
    <tr>
        <td>Shades</td>
        <td>
            <div class="colorblock" style="background: var(--lum-0)"></div>
            <div class="colorblock" style="background: var(--lum-10)"></div>
            <div class="colorblock" style="background: var(--lum-20)"></div>
            <div class="colorblock" style="background: var(--lum-30)"></div>
            <div class="colorblock" style="background: var(--lum-40)"></div>
            <div class="colorblock" style="background: var(--lum-50)"></div>
            <div class="colorblock" style="background: var(--lum-60)"></div>
            <div class="colorblock" style="background: var(--lum-70)"></div>
            <div class="colorblock" style="background: var(--lum-80)"></div>
            <div class="colorblock" style="background: var(--lum-90)"></div>
            <div class="colorblock" style="background: var(--lum-100)"></div>
        </td>
    </tr>
</table>

## Fonts
<span style="font-family: 'Playfair Display', serif; font-weight: 400">Playfair Display 400</span>
<span style="font-family: 'Playfair Display', serif; font-weight: 700">Playfair Display 700</span>
<span style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';">System Sans-Serif</span>

## Elements

### Headings

# h1 heading
## h2 heading
### h3 heading
#### h4 heading
##### h5 heading

### Paragraph
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.

Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.

### Text elements
{% link "https://www.google.de", "This is a link", true %}
_Italic_
__Bold__
**_Bold Italic_**
~~Strikethrough~~

### Lists
1. First ordered list item
2. Another item
3. Another item

- First unordered list item
- Another item
- Another item

### Quotes
> Simple Quote

> This is a
> pretty long
> blockquote.

### Images
{% image "/assets/media/generate-social-media-preview-images/twitter-big-preview", "This is an image" %}

