const router = require('express').Router();

const Video = require('../models/video');
const app = require('../app');

router.get('/', async (req, res) => {
    const videos = await Video.find({})
    res.render('videos/index', {videos});
});

router.get('/videos/create', (req, res) => {
    res.render('videos/create');
});

router.post('/videos', async (req, res) => {
    const {title, description} = req.body;
    if (title) {
        const video = await Video.create({title, description});
        res.status(201).render('videos/show', {video});
    } else {
        res.status(400).render('videos/create');
    }
    
});

module.exports = router;