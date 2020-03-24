const users = [
    {
        userId: "adarsh@123", 
        username:"adarsh",
        password:"adarsh",
    },
    {
        userId: "ambik@123", 
        username:"ambika",
        password:"ambika",
    }
];

const UserController = {

    authenticate: async (username, password) => {
        
       const user = users.find(user => user.username === username && user.password === password )
       if(user) 
            return {userId: user.userId, username: user.username};
        else 
            return false;
    },



};



module.exports = {...UserController};