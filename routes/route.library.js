const express = require("express");

const LibraryController = require("../controllers/LibraryController")

const hook = (main) => {

    const router = express()

    router.post("/", async (req, res) => {
      
    })
    router.post("/frequentlyplayed", async (req, res) => {
        try {
            const { userId } = req.decoded;
            if (!userId) return res.sendStatus(403);

            const list = await LibraryController.getFrequentlyPlayed(userId);

            if(list === false) 
            {
                res.sendStatus(400);
            } else {
                res.send(list);
            }
        } catch (err) {
            res.sendStatus(500);
        }
    })
    router.post("/mytracks", async (req, res) => {
        try {
            const { userId } = req.decoded;

            if (!userId) return res.sendStatus(403);

            const library = await LibraryController.getLibrary(userId);

            if(library === false) 
            {
                res.sendStatus(403);
            } else {
                res.send(library.mytracks);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    })

    router.get("/playtrack", async (req, res) => {
        let all = await LibraryController.incrementPlays("adarsh","t5");
        res.send(JSON.stringify(all));
    })

    return router;
}
module.exports = { root: "/library", hook };