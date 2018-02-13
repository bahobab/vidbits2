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

  it('video title cannot be empty (required)', async () => {
    // set up
    const newVideo = {
      description: 'My kool video'
    }
    const video = await new Video(newVideo);
    // exercise    
    video.validateSync();
    assert(video.errors.title.message, 'Title is required');
  });

  it('Video #url is a string', async () => {
    // set up
    const newVideo = await buildVideoObject({
                              videoUrl: 10
                            });
    // exercise
    const createdVideo = await Video.create(newVideo);
    // assert
    assert.strictEqual(createdVideo.videoUrl, newVideo.videoUrl.toString());
  });
});