const {generateRandomErrors, generateRandomTraffic} = require('../api/random.api');
const router = require("express").Router();

router.get("/errors", generateRandomErrors);
router.get("/traffic", generateRandomTraffic);

module.exports = router;