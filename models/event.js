var mongoose = require('mongoose')

var eventSchema = mongoose.Schema({
  id: {
    type: Number,
    index: true
  },
  user: {
    type: String
  },
  uploader: {
		type: String,
	},
  uptime: {
    type: Date,
    default: Date.now
  },
	likes: {
		type: Number,
    default: 0
	},
	dislikes: {
		type: Number,
    default: 0
	},
  title: {
    type: String
  },
	content: {
		type: String
	}
});

var event = module.exports = mongoose.model('event', eventSchema);
