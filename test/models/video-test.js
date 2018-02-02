const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

const Video = require('../../models/video');

async function connectDatabase() {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
}

describe('MODEL', () => {

  beforeEach(connectDatabase);
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
});