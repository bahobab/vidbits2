const {mongoose} = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    videoUrl: {
      type: String,
      required: [true, 'Video url is required']
    },
    description: {
      type: String
    }
  })
);

module.exports = Video;
