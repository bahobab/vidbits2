const {request} = require('chai');

const {fillForm} = require('./formUtil');
const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`
};

describe('user deleting a video', () => {
    it('removes video from the list', () => {
        // set up
        const videoToDelete = {
            title: 'My Great Video',
            videoUrl: generateRandomUrl('mydomain')
        };
        const {title, url, description} = videoToDelete;
        browser.url('/video/create');
        fillForm(browser, {title, url, description});
        // exercise
        browser.url('/videos/show');
        browser.click('#delete');
        // assert
        assert.notInclude(browser.getText('body'), title);

    });
});