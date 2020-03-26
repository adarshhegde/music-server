const express = require("express");

const LibraryController = require("../controllers/LibraryController")
const youtubedl = require('youtube-dl')
const Authorise = require("../authorise")

let cache = {};

const hook = (main) => {

    const router = express()

    router.post("/:id", async (req, res) => {
        const source_id = req.params.id;
        const url = 'http://www.youtube.com/watch?v=' + source_id
        const { userId, track_id, playlist } = req.body;
        let diff = -1;
        if (cache.hasOwnProperty(source_id)) {
            let date1 = new Date(cache[source_id].t);
            let date2 = new Date();
            diff = Math.abs(date1 - date2) / 36e5;
        }
        if (!cache.hasOwnProperty(source_id) && (diff == -1 || diff >= 1)) {
            youtubedl.getInfo(url, [], function (err, info) {
                if (err) throw err
                res.send(info.formats[0].url, null, 1);
                cache[source_id] = { t: Date.now(), url: info.formats[0].url };
                console.log(playlist);
                if (playlist !== "newlyreleased")
                    LibraryController.incrementPlays(userId, track_id);
                else
                    LibraryController.addTrackToLibrary(userId, {
                        name: req.body.track.name,
                        author: req.body.track.author,
                        image: req.body.track.image,
                        source: req.body.track.source,
                        track_id: req.body.track.track_id,
                        plays: 1,
                    });
            });
        } else {
            console.log("serving " + source_id + " from cache." +" " + diff + " hours has passed");
            res.send(cache[source_id].url);

            if (playlist !== "newlyreleased")
                LibraryController.incrementPlays(userId, track_id);
            else
                LibraryController.addTrackToLibrary(userId, {
                    name: req.body.track.name,
                    author: req.body.track.author,
                    image: req.body.track.image,
                    source: req.body.track.source,
                    track_id: req.body.track.track_id,
                    plays: 1,
                });
        }

    })

    router.get("/info/:id", async (req, res) => {
        const url = 'http://www.youtube.com/watch?v=' + req.params.id


        youtubedl.getInfo(url, [], function (err, info) {
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