const express = require("express");

const jwt = require('jsonwebtoken');
const UserController = require("../controllers/UserController")
const Authorise = require("../authorise")
const hook = (main) => {

    const router = express()

    router.get("/",Authorise,  (req, res) => {
        let {userId} = req.decoded;
        if(userId) {
            res.send(`hi ${userId}`)
        }else {
            res.send(`
        <form action="/login/try" method="POST">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">submit</button>
        </form>
        `)
        }
    })
    router.post("/", (req, res) => {
        res.send(req.decoded)
    })

    router.post("/check",Authorise,(req, res) => {
        if(req.decoded.userId) res.sendStatus(200);
    })

    // router.get("/logout", (req, res) => {
    //     req.session.destroy(err => {
    //         if(err)  res.sendStatus(500);
    //         else res.sendStatus(200);
    //     });
    // })

    router.post("/try",async (req, res) => {
        try {
            let { username, password } = req.body;
            if(username === undefined || password === undefined) return res.sendStatus(400);
            username = username.trim();
            password = password.trim();
            if (username.length < 1 || password.length < 1) return res.send({ error: 1 });

            let status = await UserController.authenticate(username, password);
            console.log(username, password, status);
            if (status !== false)
            {
                let token = jwt.sign({userId: status.userId},
                    process.env.SECRET,
                    { expiresIn: '24h' }
                  );
              
                  res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                  });
            }
            else
                res.send({ error: 1 })
        }

        catch (err) {
            console.log(err)
            res.sendStatus(500);
        }


    })
  
    router.post("/register",async (req, res) => {
        try {
            let { username, password } = req.body;
            if(username === undefined || password === undefined) return res.sendStatus(400);
            username = username.trim();
            password = password.trim();
            if (username.length < 1 || password.length < 1) return res.send({ error: 1 });

            let status = await UserController.tryRegister(username, password);
            console.log(username, password, status);
            if ("error" in status)
            {
                return res.send({ error: status.error })
            }
            else {
                
                let token = jwt.sign({userId: status.userId},
                    process.env.SECRET,
                    { expiresIn: '24h' }
                  );

                  res.json({
                    success: true,
                    message: 'registration successful!',
                    token: token
                  });
            }
        }

        catch (err) {
            console.log(err)
            res.sendStatus(500);
        }


    })
    return router;
}
module.exports = { root: "/login", hook, isProtected: false };