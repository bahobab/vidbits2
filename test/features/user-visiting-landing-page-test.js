const {assert} = require('chai');
// const request = require('')

describe('User Visit Landing page', () => {

    describe('first time visit', () => {
        it('shows empty page', () => {
            // set up exercise
            browser.url('');
            // assert
            assert.equal(browser.getText('#videos-container'), '');
        });

        it('can navigate to create page', () => {
            // set up
            browser.url('');
            browser.click('a[href="/videos/create.html"]');
            assert.include(browser.getText('body'), 'Save a video');
        });
    });
}); 