const {assert} = require('chai');
const {jsdom} = require('jsdom');

const {fillForm} = require('./formUtil');
const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`
};


describe('Updating video', () => {
    it('click on a button navigate to edit page', () => {
        // set up
        const newVideo = {
            title: 'My Kool Video',
            videoUrl: generateRandomUrl('mydomain'),
            description: 'Rare Lunar Eclipse'
        };
        // exercise
        browser.url('/videos/create');  // (1)
        fillForm(browser, newVideo.title, newVideo.videoUrl, newVideo.description);             // 2
        
        // redirected to videos/show (3)
        browser.click('#edit-video');
        // redirected to /videos/edit (4)
        // new video title
        const newTitle = 'My Very Kool Video';
        // fill out form/submit
        fillForm(browser, newTitle, browser.getAttribute('#title-input', 'value'), browser.getText('#description-input'));
        // redirected back to /videos/show (5)

        // assert
        assert.include(browser.getText('body'), newTitle);

    });
});