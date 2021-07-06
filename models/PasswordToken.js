const knex = require("../database/connection");
const User = require("./User");
const { v4: uuidv4 } = require('uuid');

class PasswordToken{
    async create(email){
        const user = await User.FindByEmail(email);

        if(user != undefined){
            try{
                const token = uuidv4();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordtokens");

                return {status: true, token: token}
                console.log("ok");
            }catch(error){
                return {status: false, error: error}
            }
        }else{
            return {status: false, error: "Email passed not exists"};
        }
    }

    async validate(token){
        try{
            const result = await knex.select().where({token: token}).table("passwordtokens");

            if(result.length > 0){
                const tk = result[0];

                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }
            }else{
                return {status: false};
            }
        }catch(error){
            console.log(error);
            return {status: false};
        }
        
    }
}

module.exports = new PasswordToken();