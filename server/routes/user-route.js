const router = require("express").Router();
const { getAllUsers, createRandomUser } = require("../api/user.api");

router.get("/get-all", getAllUsers);
router.get("/random", createRandomUser);

module.exports = router;