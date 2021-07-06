const knex = require("../database/connection");
const bcrypt = require('bcrypt');

class User{

    async ListUsers(){
        try{
            const users = await knex.select(["id", "name", "email", "role"]).from("users");
            
            return users;
        }catch(error){
            console.log(error);
        }
    }

    async FindById(id){
        try{
            const user = await knex.select(["id", "name", "email", "role"]).where({id: id}).table("users");
            
            if(user.length > 0){
                return user[0];
                
            }else{
                return undefined;
            }
        }catch(error){
            console.log(error);
            return undefined;
        }
    }

    async FindByEmail(email){
        try{
            const result = await knex.select(["id", "name", "email", "password", "role"]).where({email: email}).table("users");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        }catch(error){
            console.log(error);
            return undefined;
        }
    }

    async createUser(email, name, password, role){
        try{
            const passwordHash = await bcrypt.hash(password, 10);

            await knex.insert({name, email, password: passwordHash, role}).table("users");
        }catch(error){
            console.log(error);
        }
        
    }

    async UserAlreadyExists(email){
        try{
            const userAlreadyExists = await knex.select("*").from("users").where({email: email});

            if(userAlreadyExists.length > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            console.log(error);
            return false;
        }   
        
    }

    async updateUser(id, name, email, role){
            const user = await this.FindById(id);

            if(user != undefined){
                const editUser = {};

                if(email != undefined){
                    if(email != user.email){
                        const result = await this.UserAlreadyExists(email);
                        if(result == false){
                            editUser.email = email;
                        }else{
                            return {status: false, error: "Email already exists"};
                        }
                    }
                }

                if(name != undefined){
                    editUser.name = name;
                }

                if(role != undefined){
                    editUser.role = role;
                }

                try{
                    await knex.update(editUser).where({id: id}).table("users");
                    return {status: true}
                }catch(error){
                    return {status: false, error: error};
                }
                
            }else{
                response.status(403);
                response.json({error: "User not exists"});
            }
    }

    async alterPassword(newPassword, id, token){ 
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await knex.update({used: 1}).where({token: token}).table("passwordtokens");
        
        await knex.update({password: passwordHash}).where({id: id}).table("users");
    }

    async DeleteUser(id){
        const user = await this.FindById(id);

        if(user != undefined){
            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true};
            }catch(error){
                return {status: false, error: error};
            }
        }else{
            response.status(403);
            response.json({error: "User not exists"});
        }

    }
}

module.exports = new User();