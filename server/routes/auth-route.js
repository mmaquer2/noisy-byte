const router = require("express").Router();
const {login, validatePassword, createUser } = require("../api/auth.api");

router.post('/register', validatePassword, createUser);
router.post('/login', login);

module.exports = router;