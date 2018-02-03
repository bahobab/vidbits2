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
});