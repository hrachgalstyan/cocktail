const express = require('express');
const router = express.Router();
const cocktailRouter = require('./cocktail');

router.use('/cocktails', cocktailRouter);

module.exports = router;