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
    const video = await Video.find({_id:videoId});
    const {title, id, videoUrl, description} = video[0]; // video is an array!!!
    res.render('videos/show', {title, id, videoUrl, description}); // needed to destructure {video} won't render
});

router.get('/videos/:videoid/edit', async (req, res) => {
    const video = await Video.findOne({_id: req.params.videoid})
    res.render('videos/edit', {video});
});

router.post('/videos', async (req, res) => {
    let {title, videoUrl, description} = req.body;
    const video = await new Video({title, videoUrl, description});
    video.validateSync();
    if (video.errors) {
        res.status(400).render('videos/create', {video});
    } else {
        await video.save();
        let {id, title, videoUrl, description} = video;
        res.status(302).render('videos/show', {id, title, videoUrl, description});
    }
});

router.post('/videos/:videoid/updates', async (req, res) => {
    var video = await Video.findOne({_id: req.params.videoid});
    var {id, title, videoUrl, description} = video;
    video.title = req.body.title;
    video.videoUrl = req.body.videoUrl;
    video.description = req.body.description;
    video.validateSync();
    if (video.errors) {
        video = {id, title, videoUrl, description};
        res.status(400)
        .render('videos/edit', {video});
    } else {
        // save updated video first
        await video.save();
        res.redirect(`/videos/${video.id}`);
    }  
});

router.post('/videos/:videoid/deletions', async (req, res) => {
    await Video.deleteOne({_id: req.params.videoid});
    res.redirect('/');
});

module.exports = router;