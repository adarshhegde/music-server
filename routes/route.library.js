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

            const library = await LibraryController.getLibrary(userId);

            if(library === false) 
            {
                res.sendStatus(400);
            } else {
                res.send(library.frequentlyplayed);
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
                req.session.destroy();
                res.sendStatus(403);
            } else {
                res.send(library.mytracks);
            }
        } catch (err) {
            res.sendStatus(500);
        }
    })
    return router;
}
module.exports = { root: "/library", hook };