// Require request and cheerio to make scrapes
var request = require("axios");
var cheerio = require("cheerio");

var scrape = function (cb) {
    // First, grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function (response) {

        // Then, load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Save an empty articles array
        var articles = [];

        // Now, grab every h2 within an article tag, and do the following:
        $(".css-8atqhb").each(function (i, element) {

            // Add the text and href of every link, and save them as properties of the result object
            result.heading = $(this)
                .children(".css-qwxefa")
                .text()
                .trim();
            result.summary = $(this)
                .children(".css-1pfq5u")
                .text()
                .trim();

            if (heading && summary) {
                var headingNeat = heading.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var summaryNeat = heading.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    headline: headingNeat,
                    summary: summaryNeat
                };
                articles.push(dataToAdd);
            };
        });
        cb(articles);
    });
}

module.exports = scrape;