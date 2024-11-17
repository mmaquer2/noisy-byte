const {generateRandomErrors, generateRandomTraffic} = require('../api/random.api');
const router = require("express").Router();


router.get("/errors", generateRandomErrors);
router.get("/traffic", generateRandomTraffic);

router.get("/test", (req, res) => {
    console.log("TEST FROM THE ERRORS ROUTE");
    res.json({ message: "TEST FROM THE ERRORS ROUTE" });
});



module.exports = router;