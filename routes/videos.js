const router = require('express').Router();

const app = require('../app');

router.post('/videos', (req, res) => {
    res.status(201).send();
});

module.exports = router;