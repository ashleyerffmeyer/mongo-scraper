// Document ready boiler plate
$(document).ready(function () {

    // article-container is div where content will go
    var articleContainer = $(".article-container");

    // Event listener for dynamically generated "save article" button
    $(document).on("click", ".btn.save", handleArticleSave);

    // Event listener for "scrape new article" button
    $(document).on("click", ".scrape-new", handleArticleScrape);

    // Run initPage function
    initPage();

    function initPage() {
        // Empty article container
        articleContainer.empty();

        // Run an AJAX request for any unsaved headlines
        $.get("/api/headlines?saved=false")
            .then(function (data) {
                // If there are headlines, render them to the page
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    // Else, render message of "No articles"
                    renderEmpty();
                }
            });
    }

    // renderArticles function to append HTML containing article data to page
    function renderArticles(articles) {
        // Input is array of JSON with all available articles in database
        var articlePanels = [];

        // Pass each article JSON object to createPanel function to return panel with article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }

        // Append articles stored in articlePanels array to articlePanels container
        articleContainer.append(articlePanels);
    }

    // createPanel function takes JSON object for article & headline
    function createPanel(article) {
        var panel =
            $(["<div class = 'panel panel-default'>",
                "<div class = 'panel-heading'>",
                "<h3>",
                article.headline,
                "<a class = 'btn btn-success save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "<div class = 'panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));

        panel.data("_id", article._id);

        return panel;
    }

    // renderEmpty function renders HTML to page explaining there aren't articles to view
    function renderEmpty() {
        var emptyAlert =
            $(["<div class = 'alert alert-warning text-center'>",
                "<h4>There are no new articles.<h4>",
                "</div>",
                "<div class = 'panel panel-default'>",
                "<div class = 'panel-heading text-center'>",
                "<h3>What would you like to do?</h3>",
                "</div>",
                "<div class = 'panel-body text-center'>",
                "<h4><a class = 'scrape-new'>Try Scraping New Articles</a></h4>",
                "<h4><a href = '/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));

        // Append this data to the page
        articleContainer.append(emptyAlert);
    }

    // handleArticleSave function is used when user wants to save an article. 

    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;

        // Update to an existing record, so use PATCH method
        $.ajax({
            method: "PATCH",
            url: "/api/headlines/",
            data: articleToSave
        })
            .then(function (data) {
                // If successful, mongoose will send back an object containing a key of "ok" with the value of 1

                if (data.ok) {
                    initPage();
                }
            });
    }

    // handleArticleScrape function is run when "scrape new article button" is clicked
    function handleArticleScrape() {
        $.get("/api/fetch/")
            .then(function (data) {
                initPage();
                bootbox.alert("<h3 class = 'text-center m-top-80'>" + data.message + "<h3>");
            });
    }

});