const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');
const {
    connectDatabaseAndDropData,
    disconnectDatabase
} = require('../database-utilities');

const parseTextFromHTML = (htmlAsString, selector) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);
    if (selectedElement !== null) {
        return selectedElement.textContent;
    } else {
        throw new Error(`No element with ${selector} found in HTML string`);
    }
};

const findHTMLSelector = (htmlAsString, selector) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);
    if (selectedElement !== null) {
        return true;
    } else {
        throw new Error(`No selector ${selector} found in HTML string`);
    }
};

describe('SERVER: VISIT LANDING PAGE', () => {

    beforeEach(connectDatabaseAndDropData);
    afterEach(disconnectDatabase);

    it('display existing videos', async () => {
        // set up
        const newVideo = {
            title: 'My Kool Video',
            description: 'Rare Lunar Eclipse'
        }
        // exercise
        let response = await request(app)
                                .post('/videos')
                                .type('form')
                                .send(newVideo);

        response = await request(app).get('/');
        // assert
        assert.include(parseTextFromHTML(response.text, '#videos-container'), newVideo.title)
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


    });
});