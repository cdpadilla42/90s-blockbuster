const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: { type: String, required: true },
  director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: { type: Schema.Types.ObjectId, ref: 'Genre' }
});

// Virtual for Movie's URL
MovieSchema.virtual('url').get(() => '/catalog/movie/' + this._id);

// Export model
module.exports = mongoose.model('Movie', MovieSchema);
