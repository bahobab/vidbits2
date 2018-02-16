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
        browser.url('/videos/create');
        fillForm(browser, newVideo.title, newVideo.videoUrl, newVideo.description);             // 2
        browser.click('#edit-video');
        const newTitle = 'My Very Kool Video';
        fillForm(browser, newTitle, browser.getAttribute('#url-input', 'value'), browser.getText('#description-input'));
        // assert
        assert.include(browser.getText('#video-title'), newTitle);
    });

    it('updating video does not create another video', async () => {
        // set up
        const newVideo = {
            title: 'My Kool Video',
            videoUrl: generateRandomUrl('mydomain'),
            description: 'Rare Lunar Eclipse'
        };
        // exercise
        browser.url('/videos/create');  // (1)
        fillForm(browser, newVideo.title, newVideo.videoUrl, newVideo.description);             // 2
        browser.click('#edit-video');
        const newTitle = 'My Very Kool Video';
        fillForm(browser, newTitle, browser.getAttribute('#url-input', 'value'), browser.getText('#description-input'));
        // assert
        assert.notInclude(browser.getText('#video-title'), newVideo.title);
    });
});