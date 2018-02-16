
const fillForm = (browser, title, url, description) => {
        console.log('$%$%$%$%', title, url, description)
        browser.setValue("#title-input", title);
        browser.setValue('#description-input', description);
        browser.setValue('#url-input', url);
        browser.click('#submit-video');
};

module.exports = {fillForm};