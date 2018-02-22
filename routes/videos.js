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

router.get('/videos/:videoId', async (req, res) => {
    let videoId = req.params.videoId;
    const video = await Video.findOne({_id:videoId});
    const {title, id, videoUrl, description} = video; // video is an array!!!
    res.status(200).render('videos/show', {title, id, videoUrl, description}); // needed to destructure {video} won't render
});

router.get('/videos/:videoId/edit', async (req, res) => {
    const video = await Video.findOne({_id: req.params.videoId})
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

router.post('/videos/:videoId/updates', async (req, res) => {
    let video = await Video.findOne({_id: req.params.videoId});
    const {id, title, videoUrl, description} = video;
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

router.post('/videos/:videoId/deletions', async (req, res) => {
    await Video.deleteOne({_id: req.params.videoId});
    res.redirect('/');
});

module.exports = router;