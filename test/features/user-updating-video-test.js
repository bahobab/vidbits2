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
        console.log('Create Page >>>>> ', browser.getText('body'));
        browser.click('#edit-video');
        // redirected to /videos/edit (4)
        console.log('On Edit Page >>>>> ', browser.getText('body'));
        // new video title
        const newTitle = 'My Very Kool Video';
        // fill out form/submit
        fillForm(browser, newTitle, browser.getAttribute('#url-input', 'value'), browser.getText('#description-input'));
        // redirected back to /videos/show (5)
        console.log('Show Page >>>>> ', browser.getText('body'));

        // assert
        // console.log('>>>>> ', browser.getText);
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
        
        // redirected to videos/show (3)
        browser.click('#edit-video');
        // redirected to /videos/edit (4)
        // new video title
        const newTitle = 'My Very Kool Video';
        // fill out form/submit
        fillForm(browser, newTitle, browser.getAttribute('#url-input', 'value'), browser.getText('#description-input'));
        // redirected back to /videos/show (5)
        // assert
        assert.notInclude(browser.getText('#video-title'), newVideo.title);
    });
});