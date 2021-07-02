const knex = require("../database/connection");
const bcrypt = require('bcrypt');

class User{

    async createUser(email, password, name, role){
        try{
            //Password hash with bcrypt
            var passwordHash = await bcrypt.hash(password, 10);

            const user = await knex.insert({name, email, password: passwordHash, role}).table("users");

            return user;
        }catch(error){
            console.log(error);
        }
        
    }

    async UserAlreadyExists(email){
        try{
            const userAlreadyExists = await knex.select("*").from("users").where({email: email});

            if(UserAlreadyExists.length > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            console.log(error);
            return false;
        }   
        
    }
}

module.exports= User;