const jwt = require('jsonwebtoken')

let Authorise = (req, res, next) => {

    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== "undefined") {
        const token = bearerHeader.split(" ")[1]
        if (token) {
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.sendStatus(403);
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else
            return res.sendStatus(403);
    } else {
        return res.sendStatus(403);
    }
};

module.exports = Authorise;