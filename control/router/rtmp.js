const express = require('express');
const rtmpController = require('./../controller/rtmp');

const router = express.Router();



router.post('/publish', rtmpController.publish);
router.post('/publishdone', rtmpController.publishdone);
router.post('/update', rtmpController.update);
router.post('/play', rtmpController.play);

module.exports = router;