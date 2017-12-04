import mongoose from 'mongoose'
import validator from 'validator'
import isEmail from 'validator/lib/isEmail'
import _ from 'lodash'

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value)=>{validator.isEmail(value)},
      message: '{VALUE} 不是合法的信箱'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1
  },
  firstname: {
    type: String,
    required: true,
    minlength: 1
  },
  fullname: {
    type: String,
    required: true,
    minlength: 1
  },
  phone: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: {
    type: String
  },
  identification: {
    type: String
  },
  birthday: {
    type: String
  },
  imagePath: [{
    path: {
      type: String
    },
    faceId: {
      type: String
    }
  }],
  personId: {
    type: String,
    required: true
  }
});

UserSchema.methods.updateImage = function (data) {
  var user = this;
  data.forEach(d => {
    user.imagePath.push(d)
  })
  
  return user.save()
}

export const User = mongoose.model('User', UserSchema);
