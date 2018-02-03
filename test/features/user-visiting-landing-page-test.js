const {assert} = require('chai');

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
            browser.click('a[href="/videos/create"]');
            assert.include(browser.getText('body'), 'Save a video');
        });
    });

    describe('if existing videos', () => {
        it('display the videos', () => {
            // set up
            const video = {
                title: 'My Kool Video',
                description: 'Rare Lunar Eclipse'
            }
            // exercise
            browser.url('/videos/create');
            browser.setValue("#title-input", video.title);
            browser.setValue('#description-input', video.description);
            browser.click('#submit-video');
            browser.url('/');
            // assert
            assert.include(browser.getText('#videos-container'), video.title)
        });
    });
}); 