const router = require('express').Router();

var Video = require('../models/video');
const app = require('../app');

router.post('/videos', async (req, res) => {
    const {title, description} = req.body;
    const video = await Video.create({title, description});
    res.status(201).send(video);
});

module.exports = router;