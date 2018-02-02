const {assert} = require('chai');
// const request = require('supertest');
// const app = require('../../app');

describe('POST', () => {

    describe('fill out submit a form', async () => {
        it('return user to landing page and show created video', () => {
            // set up
            const newVideo = {
                title: 'My Kool Video',
                description: 'Rare Lunar Eclipse'
            }
            // exercise
            browser.url('/videos/create');
            browser.setValue('#title-input', newVideo.title);
            browser.setValue('#description-input', newVideo.description);
            browser.click('#submit-video');
            browser.url('/');
            // assert
            assert.include(browser.getText('body'), newVideo.title);
            assert.include(browser.getText('body'), newVideo.description);
        });
    });
});