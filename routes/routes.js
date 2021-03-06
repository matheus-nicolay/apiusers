const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
const adminAuth = require("../middlewares/AdminAuth");


const homeController = new HomeController();
const userController = new UserController();

router.get('/', homeController.handle);
router.post('/user', userController.create);
router.get('/users', adminAuth, userController.listUsers);
router.get('/user/:id', userController.listUserById);
router.put('/user', adminAuth,userController.editUser);
router.delete('/user/:id', adminAuth,userController.deleteUser);
router.post('/recoverpassword', userController.recoverPassword);
router.post('/changepassword', userController.changePassword);
router.post('/login', userController.login);

module.exports = router;