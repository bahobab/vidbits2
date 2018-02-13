const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {
    connectDatabaseAndDropData,
    disconnectDatabase
} = require('../database-utilities');

const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`
};

describe('SERVER: POST', () => {

    beforeEach(connectDatabaseAndDropData);
    afterEach(disconnectDatabase);

    describe('fill out and submit form', () => {
        it('return 302 status code', async () => {
            // set up
            const newVideo = {
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            // assert
            assert.equal(response.status, 302);
        });
    });

    describe('submit a video with title and description', () =>{

        it('title and description match database', async () => {
            // set up
            const newVideo = {
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            const createdVideo = await Video.findOne({});
            // assert
            assert.equal(newVideo.title, createdVideo.title);
            assert.equal(newVideo.description, createdVideo.description);
        });

    });
});