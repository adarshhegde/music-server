const users = [
    {
        userId: "adarsh@123",
        username: "adarsh",
        password: "adarsh",
    },
    {
        userId: "ambik@123",
        username: "ambika",
        password: "ambika",
    }
];

const User = require("../models/user.model")
const sha1 = require("sha1");
global.User = User;
const LibraryController = require("./LibraryController")
const UserController = {

    authenticate: async (username, password) => {

        try {
            const user = await User.find({ username: username, password: sha1(password) })
            if (user.length !== 0)
            {
                user[0].auth_time = Date.now();
                user[0].save();
                return { userId: user[0].userId, username: user[0].username };
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    },

    tryRegister: async (username, password) => {
        try {
            const user = await User.find({ username: username})
            if (user.length !== 0)
            {
                return {error:"Username already exists!"};
            }
            else
             {
                let temp = new User({

                    userId: sha1(Math.random()).slice(0,10),
                    username,
                    password:sha1(password),
                    auth_time: Date.now(),
                    register_time: Date.now()

                });

                let test = await temp.save();
                console.log(test);

                await LibraryController.addLibrary(test.userId, []);
                return { userId: test.userId, username: test.username };
             }
        }
        catch (err) {
            console.log(err);
            return { error:"Server error." };
        }
    }



};



module.exports = { ...UserController };