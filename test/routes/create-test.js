const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

describe('POST', () => {

    describe('fill out and submit form', () => {
        it('return 201 status code', async () => {
            // set up
            const newVideo = {
                title: 'My Kool Video',
                description: 'Rare Lunar Eclipse'
            };
            // exercise
            const response = await request(app)
                                    .post('/videos')
                                    .type('form')
                                    .send(newVideo);
            // assert
            assert.equal(response.status, 201);
        });
    });
});