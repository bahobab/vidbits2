const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

const Video = require('../../models/video');

const {
  connectDatabaseAndDropData,
  disconnectDatabase
} = require('../database-utilities');

const {
  buildVideoObject
} = require('../test-utils');

describe('MODEL', () => {

  beforeEach(connectDatabaseAndDropData);
  afterEach(disconnectDatabase);

  it('video title is a string', async () => {
    // set up
    const newVideo = {
      title: 4,
    };
    // exercise
    const createdVideo = await Video.create(newVideo);
    // assert
    assert.strictEqual(createdVideo.title, newVideo.title.toString());
  });

  it('Video #url is a string', async () => {
    // set up
    const newVideo = await buildVideoObject({
                              videoUrl: 10
                            });
    console.log('>>>> ', newVideo);
    // exercise
    const createdVideo = await Video.create(newVideo);
    // assert
    assert.strictEqual(createdVideo.videoUrl, newVideo.videoUrl.toString());
  });
});