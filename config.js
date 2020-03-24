
let temp = {

    PORT: 4829,
    SECRET: "secret!?",
    routes_dir: "/routes",
    SESS_NAME:"s1",
    SESS_SECRET:"shh!secret",
    SESS_LIFETIME: 1000 * 60 * 60 * 2
}

module.exports = {
    load: () => {
        for (let i in temp) {
            process.env[i] = temp[i]
        }
    }
}