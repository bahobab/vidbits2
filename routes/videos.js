const router = require('express').Router();

var Video = require('../models/video');
const app = require('../app');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/videos', async (req, res) => {
    const {title, description} = req.body;
    const video = await Video.create({title, description});
    res.status(201).render('videos/show', {video});
});

module.exports = router;