// Require scrape from scripts
var scrape = require("../scripts/scrape");

// Require headlines and notes controllers
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function (router) {

    // This route renders the homepage
    router.get("/", function (req, res) {
        res.render("home");
    });
    //This route renders the saved handlebars page
    router.get("/saved", function (req, res) {
        res.render("saved");
    });

    // This route renders the fetched data
    router.get("/api/fetch", function (req, res) {
        headlinesController.fetch(function (err, docs) {
            if (!docs || console.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });

    // This route renders the headlines
    router.get("/api/headlines", function (req, res) {

        // Take in user's request
        var query = {};

        // User specified saved article/ parameter
        if (req.query.saved) {
            query = req.query;
        }

        // Respond with user's request
        headlinesController.get(query, function (data) {
            res.json(data);
        });
    });

    // This route deletes headlines
    router.delete("/api/headlines/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function (err, data) {
            res.json(data);
        });
    });

    // This route updates headlines if needed
    router.patch("/api/headlines", function (req, res) {

        headlinesController.update(req.body, function (data) {
            res.json(data);
        });
    });

    // This route renders notes 
    router.get("/api/notes/:headline_id?", function (req, res) {
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }

        // pass in param and respond with data
        notesController.get(query, function (err, data) {
            res.json(data);
        });
    });
    // This route deletes notes
    router.delete("/api/notes/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function (err, data) {
            res.json(data);
        });
    });

    // This route posts new notes to articles
    router.post("/api/notes", function (req, res) {
        notesController.save(req.body, function (data) {
            res.json(data);
        });
    });

}