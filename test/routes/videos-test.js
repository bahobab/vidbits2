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
                videoUrl: 'https://youtu.be/oLEjOcMYWCY',
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
            // assert.include(parseTextFromHTML(response.text, 'iframe').src, newVideo.videoUrl);
        });
    });
});