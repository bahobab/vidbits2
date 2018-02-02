const {assert} = require('chai');
// const request = require('')

describe('User Visit Landing page', () => {

    describe('first time visit', () => {
        it('shows empty page', async () => {
            // set up exercise
            browser.url('');
            // assert
            assert.equal(browser.getText('#videos-container'), '');
        });
    });
}); 