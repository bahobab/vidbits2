const {assert} = require('chai');


const {fillForm} = require('./formUtil');
const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`
};

describe('user deleting a video', () => {
    it('removes video from the list', () => {
        // set up
        const video = {
            title: 'My Great Video',
            videoUrl: generateRandomUrl('mydomain'),
            description: 'This is really great!'
        };
        browser.url('/videos/create');
        fillForm(
            browser,
            video.title,
            video.videoUrl,
            video.description
        );
        // exercise
        // browser.url('/videos/show');
        browser.click('#delete');
        // assert
        assert.notInclude(browser.getText('body'), video.title);

    });
});