const User = require("../models/User");

class UserController{
    async handle(request, response){}

    async create(request, response){
        const {name, email, password, role} = request.body;
        const user = new User();

        if(!email){
            response.status = 403;
            response.json({error: "Email incorrect"});
        }

        if(!password){
            response.status = 403;
            response.json({error: "Password incorrect"});
        }

        await User.UserAlreadyExists(email);

        const userb = await user.createUser(name, email, password, role);

        response.status = 200;
        return userb;
    }
}
module.exports = UserController;