import express from 'express'
import _ from 'lodash'
const companyRouter = express.Router();

import { Company } from '../models/company'
import { User } from '../models/user'
import { Record } from '../models/record'

import authenticate from '../middleware/authenticate'


companyRouter.get('/getRecord', authenticate, (req, res) => {
  Record.find({'staff.company': req.company._id}).populate({
    path: 'staff',
    select: ['email','fullname','phone','identification', 'birthday','imagePath','company','address', 'type']
  }).then((record) => {
    res.send(record)
  })
})


companyRouter.post('/signup',(req, res) => {
  var body = _.pick(req.body, ['name', 'id', 'principal', 'password', 'address', 'phone', 'email'])
  var company = new Company(body);
  company.save().then(() => {
    return Promise.all([company.generateAuthToken(), company.toJson()])
  }).then(([token, company]) => {
    console.log(token)
    console.log(company);
    res.header('token', token).send(company);
  }).catch((e) => {
    if (e.code == '11000') {
      res.status(400).send('Email已經使用過了');
    }
    res.status(400).send(e);
  })
});

companyRouter.get('/getOption', (req, res) => {
  Company.find().select('name').then((result) => {
    res.send(result)
  })
})


companyRouter.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['id', 'password']);
  console.log(body)
  Company.findByCredentials(body.id, body.password).then((company) => {
    return Promise.all([company.generateAuthToken(), company.toJson()])
  }).then(([token, company]) => {
    res.header('token', token).send(company);
  }).catch((e) => {
    res.status(403).send(e);
  })
})

companyRouter.get('/check', authenticate, (req, res) => {
  var company = req.company
  var objCompany = company.toJson()
  res.send(objCompany);
})

companyRouter.delete('/logout', authenticate, (req, res) => {
  req.company.removeToken(req.token).then(()=>{
    res.status(200).send('成功登出');
  }).catch(() => {
    res.status(400).send();
  })
})

companyRouter.get('/getSignup', authenticate, (req, res) => {
  User.find({company: req.company._id, comfirm: false}).then(result => {
    res.send(result)
  })
})

companyRouter.put('/success', authenticate, (req, res) => {
  User.findOneAndUpdate({'_id': req.body.id, company: req.company._id, comfirm: false}, { $set: { comfirm: true }})
    .then(result => {
      if (!result) {
        res.status(404).json({
          error: {
            status: '404',
            message: "公司內找不到此用戶或已認證"
          }
        })
      }
      res.json({
          success: {
            status: 200,
            message: "此用戶認證"
          }
        })
    })
})

companyRouter.put('/fail', authenticate, (req, res) => {
  User.findOne({'_id': req.body.id, company: req.company._id, comfirm: false}).then(user => {
    if (!user) {
      res.status(404).send({
        error: {
          status: 404,
          message: '找不到此人或此公司沒有這名員工'
        }
      })
    }
    return user.update({
      $set: {
        company: null
      }
    })
  }).then(result => {
    res.send({
      success: {
        status: 200,
        message: '此員工已從公司刪除'
      }
    })
  })
})


export default companyRouter;
