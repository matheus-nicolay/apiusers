const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");


const homeController = new HomeController();
const userController = new UserController();

router.get('/', homeController.handle);
router.post('/user', userController.create);

module.exports = router;