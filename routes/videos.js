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
    const {title, description} = video[0]; // video is an array!!!
    // const htmlStr = `<p>${vid.title}</p><p>${vid.description}</p>`
    //res.send(htmlStr); // Because i cannot render the view??
    res.render('videos/show', {title, description}); // needed to destructure {video} won't render
});

router.post('/videos', async (req, res) => {
    let {title, description} = req.body;
    const video = await new Video({title, description});
    if (title) {
        await video.save();
        let {title, description} = video;
        res.status(302).render('videos/show', {title, description});
    } else {
        res.status(400).render('videos/create', {video});
    }
    
});

module.exports = router;