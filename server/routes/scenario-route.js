const router = require("express").Router();
const { cpuSpike, memoryLeak } = require('../api/scenario.api');

router.get('/cpuSpike', cpuSpike )
router.get('/memoryLeak', memoryLeak )

module.exports = router;