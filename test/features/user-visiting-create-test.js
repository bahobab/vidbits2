const {assert} = require('chai');
const {jsdom} = require('jsdom');
// const request = require('supertest');
// const app = require('../../app');

const {fillForm} = require('./formUtil');

const parseTextFromHTML = (htmlAsString, selector) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);
    if (selectedElement !== null) {
        return selectedElement.textContent;
    } else {
        throw new Error(`No element with ${selector} found in HTML string`);
    }
};

const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`
}

describe('POST', () => {

    describe('fill out submit a form', async () => {
        it('return user to landing page and show created video', () => {
            // set up
            const newVideo = {
                title: 'My Kool Video',
                videoUrl: generateRandomUrl('mydomain'),
                description: 'Rare Lunar Eclipse'
            }
            // exercise
            browser.url('/videos/create');
            fillForm(browser, newVideo.title, newVideo.videoUrl, newVideo.description);
            // assert
            assert.include(browser.getText('body'), newVideo.title);
            assert.include(browser.getText('body'), newVideo.description);
        });
    });
});