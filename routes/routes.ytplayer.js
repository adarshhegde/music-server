const express = require("express");

const LibraryController = require("../controllers/LibraryController")
const youtubedl = require('youtube-dl')
const Authorise = require("../authorise")

let cache = {};

const hook = (main) => {

    const router = express()

    router.post("/:id", async (req, res) => {
        const url = 'http://www.youtube.com/watch?v=' + req.params.id
        const {userId, track_id, playlist} = req.body;
       if(!cache.hasOwnProperty(req.params.id)){
            youtubedl.getInfo(url, [], function(err, info) {
            if (err) throw err
            res.send(info.formats[0].url, null, 1);
            // cache[req.params.id] = info.formats[0].url;
            console.log(playlist);
            if(playlist !== "newlyreleased")
                LibraryController.incrementPlays(userId, track_id);
            else 
              LibraryController.addTrackToLibrary(userId,{
                name:req.body.track.name,
                author:req.body.track.author,
                image:req.body.track.image,
                source:req.body.track.source,
                track_id:req.body.track.track_id,
                plays:1,
            });
        });} else {
            console.log("serving " + req.params.id + " from cache.");
            res.send(cache[req.params.id]);
            console.log(playlist);
            if(playlist !== "newlyreleased")
                LibraryController.incrementPlays(userId, track_id);
            else 
              LibraryController.addTrackToLibrary(userId,{
                name:req.track.name,
                author:req.track.author,
                image:req.track.image,
                source:req.track.source,
                track_id:req.track.track_id,
                plays:1,
            });
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