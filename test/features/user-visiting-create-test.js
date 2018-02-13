const {assert} = require('chai');
const {jsdom} = require('jsdom');
// const request = require('supertest');
// const app = require('../../app');

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
            browser.setValue('#title-input', newVideo.title);
            browser.setValue('#url-input', newVideo.videoUrl);
            browser.setValue('#description-input', newVideo.description);
            browser.click('#submit-video');
            // browser.url('/');
            // assert
            assert.include(browser.getText('body'), newVideo.title);
            assert.include(browser.getText('body'), newVideo.description);
        });
    });

    // describe('Video title is missing', () => {
    //     it('will not be saved', () => {
    //         // set up
    //         const newVideo = {
    //             title: 'My Kool Video',
    //             description: 'Rare Lunar Eclipse'
    //         };
    //         // exercise
    //         browser.url('/videos/create');
    //         browser.setValue('#title-input', '');
    //         browser.click('#submit-video');
    //         // assert
    //         assert.equal(browser.getText('body')), '');
    //     });
    // });
});