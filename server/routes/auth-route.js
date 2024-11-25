const router = require("express").Router();
const {login, validatePassword, registerNewUser, logout } = require("../api/auth.api");

//router.post('/register', validatePassword, registerNewUser);

// for testing only
router.post('/register', registerNewUser); 
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;