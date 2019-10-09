// Document ready boiler plate
$(document).ready(function () {

    // article-container is div where content will go
    var articleContainer = $(".article-container");

    // Event listener for dynamically generated "save article" button
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    // Run initPage function
    initPage();

    function initPage() {
        // Empty article container
        articleContainer.empty();

        // Run an AJAX request for any unsaved headlines
        $.get("/api/headlines?saved=true")
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
                "<a class = 'btn btn-danger delete'>",
                "Delete From Saved",
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
                "<h4>There are no saved articles.<h4>",
                "</div>",
                "<div class = 'panel panel-default'>",
                "<div class = 'panel-heading text-center'>",
                "<h3>Would you like to Browse Available Articles?</h3>",
                "</div>",
                "<div class = 'panel-body text-center'>",
                "<h4><a href = '/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));

        // Append this data to the page
        articleContainer.append(emptyAlert);
    }

    // renderNotesList function
    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class = 'list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class = 'list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class = 'btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));

                currentNote.children("button").data("_id", data.notes[i]._id);

                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    // handleArticleDelete function is used when user wants to delete an article. 
    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".panel").data();

        // Update to an existing record, so use PATCH method
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id,
            data: articleToSave
        })
            .then(function (data) {
                // If successful, mongoose will send back an object containing a key of "ok" with the value of 1
                if (data.ok) {
                    initPage();
                }
            });
    }

    // handleArticleNotes function
    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id)
            .then(function (data) {
                var modalText = [
                    "<div class ='container-fluid text-center'>",
                    "<h4>Notes for Article: ",
                    currentArticle._id,
                    "<h4>",
                    "<hr />",
                    "<ul class = 'list-group note-container'>",
                    "</ul>",
                    "<textarea placeholder = 'New Note' rows = '4' cols ='60'></textarea>",
                    "<button class = 'btn btn-success save'>Save Note</button>",
                    "</div>"
                ].join("");
                bootbox.dialog({
                    mesage: modalText,
                    closeButton: true
                });
                var noteData = {
                    _id: currentArticle._id,
                    notes: data || []
                };
                $("btn.save").data("article", noteData);
                renderNotesList(noteData);
            });
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function () {
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function () {
            bootbox.hideAll();
        });
    }
});