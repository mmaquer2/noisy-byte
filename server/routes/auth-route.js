const router = require("express").Router();
const {login, validatePassword, register, logout } = require("../api/auth.api");

//router.post('/register', validatePassword, registerNewUser);

// for testing only
router.post('/register', register); 
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;