const express = require("express");

const LibraryController = require("../controllers/LibraryController")
const youtubedl = require('youtube-dl')

let cache = {};

const hook = (main) => {

    const router = express()

    router.get("/:id", async (req, res) => {
        const url = 'http://www.youtube.com/watch?v=' + req.params.id
        const {userId, track_id} = req.body;
       if(!cache.hasOwnProperty(req.params.id)){
            youtubedl.getInfo(url, [], function(err, info) {
            if (err) throw err
            res.send(info.formats[0].url, null, 1);
            cache[req.params.id] = info.formats[0].url;
            // LibraryController.incrementPlays(userId, track_id);
        });} else {
            console.log("serving " + req.params.id + " from cache.");
            res.send(cache[req.params.id]);
            // LibraryController.incrementPlays(userId, track_id);
        }
          
    })

    router.get("/info/:id", async (req, res) => {
        const url = 'http://www.youtube.com/watch?v=' + req.params.id
    

            youtubedl.getInfo(url, [], function(err, info) {
            if (err) throw err
            res.send({
                thumbnail: info.thumbnail,
                author: info.artist || info.uploader,
                name: info.title
            });
            // LibraryController.incrementPlays(userId, track_id);
        });
          
    })
   

    return router;
}
module.exports = { root: "/yt", hook, isProtected: false };