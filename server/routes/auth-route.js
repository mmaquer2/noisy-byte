const router = require("express").Router();
const {login, validatePassword, registerNewUser, logout } = require("../api/auth.api");

router.post('/register', validatePassword, registerNewUser);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;