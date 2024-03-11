const express = require('express');
const clientController = require('./../controller/client');

const router = express.Router();


router.get('/player', clientController.player);

module.exports = router;