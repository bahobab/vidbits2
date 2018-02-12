const {jsdom} = require('jsdom');
const Video = require('../models/video');

const parseTextFromHTML = (htmlAsString, selector) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);
    if (selectedElement !== null) {
        return selectedElement.textContent;
    } else {
        throw new Error(`No element with ${selector} found in HTML string`);
    }
};

const parseHTML = (htmlAsString, selector) => {
    return jsdom(htmlAsString).querySelector(selector)
}

const findHTMLSelector = (htmlAsString, selector) => {
    const selectedElement = jsdom(htmlAsString).querySelector(selector);
    if (selectedElement !== null) {
        return true;
    } else {
        throw new Error(`No selector ${selector} found in HTML string`);
    }
};

const buildVideoObject = (options = {}) => {
    const title = options.title || 'My Kool Video';
    const videoUrl = options.videoUrl || 'https://youtu.be/oLEjOcMYWCY';
    const description = options.description || 'Rare Lunar Eclipse';
    return {title, videoUrl, description};
}

const seedVideoToDatabase = async (options = {}) => {
    const video = await Video.create(buildVideoObject(options));
    return video;
}


module.exports = {
    parseTextFromHTML,
    parseHTML,
    findHTMLSelector,
    buildVideoObject,
    seedVideoToDatabase
};