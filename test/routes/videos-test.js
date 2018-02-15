const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');
const {
    connectDatabaseAndDropData,
    disconnectDatabase
} = require('../database-utilities');

const {
    parseTextFromHTML,
    parseHTML,
    findHTMLSelector,
    buildVideoObject
} = require('../test-utils');

const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`
};

describe('SERVER: VISIT LANDING PAGE', () => {

    beforeEach(connectDatabaseAndDropData);
    afterEach(disconnectDatabase);

    it('display existing videos', async () => {
        // set up
        const newVideo = await Video.create({
            title: 'My Kool Video',
            videoUrl: generateRandomUrl('mydomain'),
            description: 'Rare Lunar Eclipse'
        });
        // exercise
        response = await request(app).get('/');
        // assert
        assert.include(parseTextFromHTML(response.text, '#videos-container'), newVideo.title);
        assert.equal(parseHTML(response.text, 'iframe').src, newVideo.videoUrl);
    });

    describe('Post video with empty title', () => {
        it('will not save video', async () => {
            // set up
            const newVideo = {
                title: '',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);

            const videos = await Video.find({});
            // assert
            assert.equal(videos.length, 0);
        });

        it('will return 400 status code', async () => {
            // set up
            const newVideo = {
                title: '',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            // assert
            assert.equal(response.status, 400);
        });

        it('will render create new video form', async () => {
            // set up
            const newVideo = {
                title: '',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            // assert
            assert.equal(findHTMLSelector(response.text, '#title-input'), true);
        });

        it('will render a validation error message', async () => {
            // set up
            const newVideo = {
                title: '',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            // assert
            assert.include(parseTextFromHTML(response.text, '#title-validation-error'), 'Title is required');
        });

        it('will preserve the description field value', async () => {
            // set up
            const newVideo = {
                title: '',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // const createdVideo = await Video.create(buildVideoObject());
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            // assert
            assert.equal(parseTextFromHTML(response.text, '#description-input'), newVideo.description);
        });

        it('will preserve the video url field', async () => {
            // set up
            const newVideo = {
                title: '',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            // assert
            assert.equal(parseHTML(response.text, '#url-input').value, newVideo.videoUrl);
        });
    });

    describe('POST /videos/:id/update', () => {
        it('update video record', async () => {
            // set up
            const newTitle = {title: 'My Very Very Kool Video'};
            // exercise
            const oldVideo = await Video.create({
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            });

            const response = await request(app)
                                    .post(`/videos/${oldVideo.id}/updates`)
                                    .type('form')
                                    .send(newTitle)
            // assert
            // console.log('>>> ', response.text);
            assert.strictEqual(response.status, 302);
            assert.equal(response.header['location'], `/videos/${oldVideo.id}`);
        });

        // it('does not save invalid record', async () => {
        //     // set up
        //     const newTitle = {title: ''};
        //     // exercise
        //     const oldVideo = await Video.create({
        //         title: 'My Kool Video',
        //         videoUrl: generateRandomUrl('mydomain'),
        //         description: 'Rare Lunar Eclipse'
        //     });
        //     const response = await request(app)
        //                             .post(`/videos/${oldVideo.id}/updates`)
        //                             .type('form')
        //                             .send(newTitle);
        //     // assert
        //     // assert.equal(response.status, 302);
        //     assert.include(response.location, '/vidos/show');
        // });
    });

    

    // describe('POST /videos with empty url', () => {
    //     it('shows a url validation error', async () => {
    //         // set up
    //         const newVideo = {
    //             title: 'My Kool video',
    //             videoUrl: '',
    //             description: 'Rare Lunar Eclipse'
    //         };
    //         // exercise
    //         const response = await request(app)
    //                                 .post('/videos')
    //                                 .type('form')
    //                                 .send(newVideo);
            
    //         // assert
    //         assert.include(parseTextFromHTML(response.text, '#url-validation-error'), 'Video url is required');
    //     });
    // });

    describe('GET /videos/:videoid', () => {
        it('navigate to video with videoid', async () => {
            // set up
            const video = await Video.create({
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            });
            
            // exercise
            const visitedVideo = await Video.findOne();
            const response = await request(app)
                            .get(`/videos/${visitedVideo.id}`);
            // assert
            const repText = response.text

            assert.include(repText, visitedVideo.title);
            assert.include(parseHTML(repText, 'iframe').src, visitedVideo.videoUrl);
        });
    });

    describe('GET /vidoes/:videoid/edit', () => {
        it('populate a form with valuess of existing video', async () => {
            // set up
            const video = await Video.create({
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            });
            // exercise
            const videoToUpdate = await Video.findOne();
            const videoid = videoToUpdate.id;
            const response = await request(app)
                                    .get(`/videos/${videoid}/edit`);
            
            // assert
            const resp = response.text;
            assert.include(parseHTML(resp, '#title-input').value, videoToUpdate.title);
            assert.include(parseHTML(resp, '#url-input').value, videoToUpdate.videoUrl);
            assert.include(parseTextFromHTML(resp, '#description-input'), videoToUpdate.description);
        });
    });
});