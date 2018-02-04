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

router.get('/videos/:videoid', async (req, res) => {
    let videoId = req.params.videoid;
    videoId = videoId.slice(1); // hmmm why it includes the :
    const video = await Video.find({_id:videoId});
    const vid = video[0]; // video is an array!!!
    const htmlStr = `<p>${vid.title}</p><p>${vid.description}</p>`
    //res.send(htmlStr); // Because i cannot render the view??
    res.render('videos/show', {vid});
});

router.post('/videos', async (req, res) => {
    const {title, description} = req.body;
    const video = await new Video({title, description});
    if (title) {
        await video.save();
        res.status(201).render('videos/show', {video});
    } else {
        res.status(400).render('videos/create', {video});
    }
    
});

module.exports = router;