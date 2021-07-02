class HomeController{
    async handle(request, response){
        response.send("APP EXPRESS! - Guia do programador");
    }
}

module.exports = HomeController;