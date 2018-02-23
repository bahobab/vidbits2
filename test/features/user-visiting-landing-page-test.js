const {assert} = require('chai');

const {fillForm} = require('./formUtil');

const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`
}

describe('User Visit Landing page', () => {

    describe('first time visit', () => {
        it('shows empty page', () => {
            // set up exercise
            browser.url('/');
            // assert
            assert.equal(browser.getText('#videos-container'), '');
        });
    });

    describe('from the landing page', () => {
        it('can navigate to create page', () => {
            // set up
            browser.url('/');
            browser.url('/videos'); // redirect
            browser.click('a[href="/videos/create"]');
            assert.include(browser.getText('body'), 'Save a video');
        });
    });

    describe('if existing videos', () => {
        it('display the videos', () => {
            // set up
            const video = {
                title: 'My Kool Video',
                description: 'Rare Lunar Eclipse',
                videoUrl: generateRandomUrl('mydomain')
            }
            // exercise
            browser.url('/videos/create');
            fillForm(browser, video.title, video.videoUrl, video.description);
            browser.url('/');
            // assert
            assert.include(browser.getText('#videos-container'), video.title);
        });
    });

    describe('with an existing video', () => {
        it('can navigate to a video', () => {
            // set up
            const video = {
                title: 'My Kool Video',
                description: 'Rare Lunar Eclipse',
                videoUrl: generateRandomUrl('mydomain')
            };
            // exercise
            // first, create a video to work with
            browser.url('/videos/create');
            fillForm(browser, video.title, video.videoUrl, video.description);
            // back to landing page
            browser.url('/');
            browser.click('.video-title a');
            // assert
            assert.include(browser.getText('body'), video.title);
            assert.include(browser.getText('body'), video.description);
        });
    });
}); 