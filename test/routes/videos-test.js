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
        // await request(app).get('/');
        const response = await request(app)
                                .get('/videos/');
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
            const newVideo = {title: 'My Very Very Kool Video',
                                videoUrl: 'mydomain',
                                description: 'description'
                                };
            // exercise
            const oldVideo = await Video.create({
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            });
            // exercise
            const response = await request(app)
                                    .post(`/videos/${oldVideo.id}/updates`)
                                    .type('form')
                                    .send(newVideo)
            // assert
            assert.strictEqual(response.status, 302);
            assert.equal(response.header['location'], `/videos/${oldVideo.id}`);
        });

        describe('when the record is invalid', () => {

            it('does not save invalid record', async () => {
                // set up
                const newVideo = {title: '',
                                videoUrl: 'mydomain',
                                description: 'description'
                                };
                const oldVideo = await Video.create({
                    title: 'My Kool Video',
                    videoUrl: generateRandomUrl('mydomain'),
                    description: 'Rare Lunar Eclipse'
                });
                // exercise
                const response = await request(app)
                                        .post(`/videos/${oldVideo.id}/updates`)
                                        .type('form')
                                        .send(newVideo);
                // assert
                assert.equal(parseHTML(response.text, '#title-input').value, oldVideo.title);
            });

            it('responds with 400 status code', async () => {
                // set up
                const newVideo = {title: '',
                                videoUrl: 'mydomain',
                                description: 'description'
                                };
                const oldVideo = await Video.create({
                    title: 'My Kool Video',
                    videoUrl: generateRandomUrl('mydomain'),
                    description: 'Rare Lunar Eclipse'
                });
                // exercise                
                const response = await request(app)
                                        .post(`/videos/${oldVideo.id}/updates`)
                                        .type('form')
                                        .send(newVideo);
                // assert
                assert.equal(response.status, 400);
            });
        });
    });

    describe('GET /videos/:videoId', () => {
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
                            .get(`/videos/${video.id}`);
            // assert
            // const repText = response.text
            assert.include(response.text, visitedVideo.title);
            assert.include(parseHTML(response.text, 'iframe').src, visitedVideo.videoUrl);
        });
    });

    describe('GET /vidoes/:videoId/edit', () => {
        it('populate a form with valuess of existing video', async () => {
            // set up
            const video = await Video.create({
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            });
            // exercise
            const videoToUpdate = await Video.findOne();
            const videoId = videoToUpdate.id;
            const response = await request(app)
                                    .get(`/videos/${videoId}/edit`);
            
            // assert
            const resp = response.text;
            assert.include(parseHTML(resp, '#title-input').value, videoToUpdate.title);
            assert.include(parseHTML(resp, '#url-input').value, videoToUpdate.videoUrl);
            assert.include(parseTextFromHTML(resp, '#description-input'), videoToUpdate.description);
        });
    });

    describe('POST /videos/:id/deletions', () => {
        it('removes the video record', async () => {
            // set up
            const video = await Video.create({
                title: 'My Great Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            });
            // exercise
            const response = await request(app)
                                .post(`/videos/${video.id}/deletions`);
                                // .type('form')
                                // .send();
            // assert
            // response.text redirected to '/'
            const videos = await Video.find({});
            assert.equal(videos.length, 0);
            assert.equal(response.status, 302);
            assert.equal(response.header['location'], '/');
        });
    });
});