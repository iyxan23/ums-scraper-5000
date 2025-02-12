## UMS Scraper 5000

What's this? A firefox extension that scrapes UMS (Muhammadiyyah University of
Surakarta) materials from https://ums.ac.id/mata-kuliah/{...} because why not.

I had originally planned to use `curl`, but it seemed like the site itself is
protected behind cloudflare; which is really difficult to get around with. So
I decided to build an entire firefox extension that only needs me to press a
few buttons to scrape sites, store them, and export them in JSON.

The material codes are stored in `background.js` in an array, which is
currently populated with FASILKOM material codes. You can change this to
whatever material codes you need, as long as `https://ums.ac.id/mata-kuliah/${code}`
resolves to a valid site.
