const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieInstanceSchema = new Schema({
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  status: {
    type: Boolean,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance'
  },
  dueDate: { type: Date, default: Date.now },
  imprint: { type: String }
});

MovieInstanceSchema.virtual('url').get(
  () => 'catalog/movieinstance' + this._id
);

// Export

module.exports = mongoose.model('MovieInstance', MovieInstanceSchema);
