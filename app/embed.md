---
layout: content
partner: fftf
locale: en
script: embed_instructions.js
---
# Embed HelloVote!

You can embed HelloVote on your site using our drop-in widget.
Simply drop the following iframe snippet into your page wherever
you want it to appear:

```
code snippet 1
```

This will look something like:

<div class="iframe-container"><iframe src="/iframe/" allowtransparency="1" frameborder="0" style="width: 100%; height: 400px;"></iframe></div>

Please make sure to give the iframe an appropriate width and height
using CSS. Keep in mind that if the iframe is less than 400 pixels tall,
the, chat bubbles will not appear. This is by design and allows you to
embed a smaller version of the UI (but it's up to you to explain why the
user should enter their phone number :) — here's an example of the
smaller version:

<div class="iframe-container.transparent"><iframe src="/iframe/" allowtransparency="1" frameborder="0" style="width: 100%; height: 110px;"></iframe></div>

## Customizing the HelloVote Widget

By default, the widget will display a transparent background and use the
same colors as this beautiful site. But you can customize this to make it
fit into your design. There are two parameters you can pass into the iframe's
URL:

`disclosureColor=COLOR` — Changes the text color of the privacy disclosure.
This can either be a hexidecimal color code (without the leading hash mark),
or an rgba(x, y, z, a) color.

`hueShift=DEGREES` — (where DEGREES is a number between 0 and 360). This sets
a hue shift for the color of the speech bubbles, buttons, and links, allowing
you to change the primary color of the design.

## Example of Customized Widget

```
code snippet 2
```

This customized code gives you a different color scheme:

<div class="iframe-container"><iframe src="/iframe/?disclosureColor=ff8800&hueShift=120" allowtransparency="1" frameborder="0" style="width: 100%; height: 400px;"></iframe></div>

## Terms of Use

By using the HelloVote iframe widget, you agree to embed the widget in a way that
the privacy disclosure is completely visible and not obscured in any way.
Sites that embed the widget in a way that hides the privacy disclosure will be
blocked (or worse!)
