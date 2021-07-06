const jwt = require("jsonwebtoken");
const jwtSecret = "fhbeebfvci3uoweboo7754ergbeiru3453ggqwyfr34235";

module.exports = function(request, response, next){

    const authToken = request.headers['authorization'];

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try{
            var decoded = jwt.verify(token, jwtSecret);
            if(decoded.role == 0){
                next();
            }else{
                response.status(403);
                response.send("User is not admin");
                return;
            }
        }catch(error){
            response.status(403);
            response.send("User is not authenticated");
            return;
        }    
    }else{
        response.status(403);
        response.send("User is not authenticated");
        return;
    }
}