const { response, request } = require("express");
const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const jwtSecret = "fhbeebfvci3uoweboo7754ergbeiru3453ggqwyfr34235";

class UserController{
    async listUsers(request, response){
        const users = await User.ListUsers();

        response.json(users);
    }

    async listUserById(request, response){
        const id = request.params.id;

        const user = await User.FindById(id);

        if(user == undefined){
            response.status(404);
            response.json({error: "User not exists"});
        }else{
            response.status(200);
            response.json(user);
        }   
    }

    async create(request, response){
        const {name, email, password, role} = request.body;

        if(!email){
            response.status(403);
            response.json({error: "Email incorrect"});
        }

        if(!password){
            response.status(403);
            response.json({error: "Password incorrect"});
        }

        const userExists = await User.UserAlreadyExists(email);

        if(userExists){
            response.status(406);
            response.json({error: "User Already Exists"});
        }

        await User.createUser(email, name, password, role);

        response.status(200);
        response.send("Registered user");
    }

    async editUser(request, response){
        const {id, name, role, email} = request.body;
        const result = await User.updateUser(id, name, email, role);

        if(result != undefined){
            if(result.status){
                response.status(200);
                response.send("User updated");
            }else{
                response.status(406);
                response.send(result.error);
            }
        }else{
            response.status(406);
            response.send(result.error);
        }
    }

    async deleteUser(request, response){
        const id = request.params.id;
        const result = await User.DeleteUser(id);

        if(result != undefined){
            if(result.status){
                response.status(200);
                response.send("User deleted");
            }else{
                response.status(406);
                response.send(result.error);
            }
        }else{
            response.status(406);
            response.send(result.error);
        }
    }

    async recoverPassword(request, response){
        const email = request.body.email;

        const result = await PasswordToken.create(email);

        if(result.status){
            response.status(200);
            response.send(""+result.token);
        }else{
            response.status(406);
            response.send(result.error);
        }
    }

    async changePassword(request, response){
        const {token, password} = request.body;

        const isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){
            await User.alterPassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            response.status(200);
            response.send("Password updated");
        }else{
            response.status(406);
            response.send("Token is not valid");
        }
    }

    async login (request, response){
        const {email, password} = request.body;

        const user = await User.FindByEmail(email);

        if(user != undefined){
            const result = await bcrypt.compare(password, user.password);

            if(result){
                var token = jwt.sign({ email: user.email, role: user.role, name: user.name }, jwtSecret);

                response.status(200);
                response.json({token: token});
            }else{
                response.status(406);
                response.send("Password incorrect");
            }

            response.json({status: result});
        }else{
            response.json({status: false});
        }
    }
}
module.exports = UserController;