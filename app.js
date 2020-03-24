require("./config.js").load();
const fs = require("fs")
const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const chalk = require("chalk")
const cors = require("cors")
const session = require("express-session")
console.clear()
const jwt = require('jsonwebtoken')
const Authorise = require("./authorise")
const app = express();

var whitelist = ['http://localhost:3000', 'http://localhost:4829']
var corsOptions = {
  origin: function (origin, callback) {

      callback(null, true)

  },credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.get("/", (req, res) => {
    res.send("hii")
})
app.get("/host", (req, res) => {
    res.send(req.headers.host)
})



fs.readdir(path.join(__dirname, process.env.routes_dir || "routes"), async function (err, routers) {
    if (err) throw Error(err.message);
    for (let r in routers) {

        let route = await require(path.join(__dirname, process.env.routes_dir || "routes", routers[r]))
        const { root, hook, isProtected = true } = route;

        app.use(...[root, (isProtected === false ? (req, res, next) => next() : Authorise), hook({ hi: "hi" })]);
        console.log("Attached route " + chalk.yellow("%s") + (isProtected === false ? chalk.red(" [no-auth]") : chalk.green(" [auth]")), root);

    }


    app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.port}`));

})
