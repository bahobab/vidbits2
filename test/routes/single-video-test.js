const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {
    connectDatabaseAndDropData,
    disconnectDatabase
} = require('../database-utilities');
const {
    parseTextFromHTML,
    findHTMLSelector,
    buildVideoObject,
    seedVideoToDatabase
} = require('../test-utils');

describe('Server path: /videos/:videoid', () =>{

    beforeEach(connectDatabaseAndDropData);
    afterEach(disconnectDatabase);

    describe('visiting a page /videos/videoid', () => {
        it('will render the video with videoid', async () => {
            // set up
            const video = await seedVideoToDatabase();
            // exercise
            const response = await request(app)
                                    .get(`/videos/:${video._id}`);
            // assert
            assert.include(parseTextFromHTML(response.text, '#video-title'), video.title);
        } );
    });
});