import mongoose from 'mongoose'

var RecordSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 1
  },
  entry: {
    type: String
  },
  outed: {
    type: String
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});


export const Record = mongoose.model('Record', RecordSchema);
