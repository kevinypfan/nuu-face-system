import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

var CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  principal: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  {
      usePushEach: true
  }
});


CompanySchema.methods.generateAuthToken = function () {
  var company = this;
  var token = jwt.sign({_id: company._id.toHexString()}, process.env.JWT_SECRET).toString();
  company.tokens.push({token});
  return company.save().then(() => {
    return token
  })
}

CompanySchema.statics.findByCredentials = function (id, password) {
  var Company = this;

  return Company.findOne({id}).then((company) => {
    if (!company) {
      return Promise.reject("沒有這個會員");
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, company.password).then((res) => {
         if (res) {
           resolve(company);
         } else {
           reject("此密碼錯誤");
         }
       })
    })
  })
}

CompanySchema.statics.findByToken = function (token) {
  var Company = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return Promise.reject();
  }
  return Company.findOne({
    _id: decoded._id,
    'tokens.token': token
  })
}

CompanySchema.methods.toJson = function () {
  var company = this;
  var companyObject = company.toObject();
  return _.pick(companyObject, ['_id', 'email', 'name', 'id', 'principal', 'address', 'phone'])
}

CompanySchema.methods.removeToken = function (token) {
  var company = this;

  return company.update({
    $pull: {
      tokens: {token}
    }
  })
}

CompanySchema.pre('save', function (next) {
  var company = this;
  if (company.isModified('password')){
    bcrypt.hash(company.password, 10).then(hash => {
      company.password = hash;
      next();
    })
  } else {
    next();
  }
})


export const Company = mongoose.model('Company', CompanySchema);
