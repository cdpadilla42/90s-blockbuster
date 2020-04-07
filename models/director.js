const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for director's full name

DirectorSchema.virtual('name').get(function () {
  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }

  return fullname;
});

// Virtual for director's Lifespan
DirectorSchema.virtual('lifespan').get(function () {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString();
});

// Virtual for Director's URL
DirectorSchema.virtual('url').get(function () {
  return '/catalog/director/' + this._id;
});

DirectorSchema.virtual('dob_formatted').get(function () {
  return moment(this.date_of_birth).format('YYYY-MM-DD');
});
DirectorSchema.virtual('dod_formatted').get(function () {
  return moment(this.date_of_death).format('YYYY-MM-DD');
});

// Export model
module.exports = mongoose.model('Director', DirectorSchema);
