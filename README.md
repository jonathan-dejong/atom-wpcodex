# atom-wpcodex package

This package adds a shortcut and a right-click option to lookup the selected string in the editor against WordPress documentation. If it finds results it will open it in a new tab in the users default browser.

## How do I use it?

Just install the package. You'll now be able to use the shortcode `ctrl+alt+l` to open documentation for the selected string in your editor. Or you can right-click the string and click `WordPress lookup`.

## How does it work?
The string will be searched on wordpress.org using google and opened in your default browser. Google can sometimes block requests made by applications so if that happens the package will use a fallback solution where it scrapes developer.wordpress.org. It takes a little bit longer but a notice will appear saying `WordPress lookup have to perform fallback lookup` to notify you of this.
