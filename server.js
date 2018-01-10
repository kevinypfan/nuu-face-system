import './config/config.js'
import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'
import moment from 'moment'
import _ from 'lodash'
import { User } from './models/user'
import { Record } from './models/record'

import companyRouter from './api/company'

import bodyParser from 'body-parser'

import { base64ToFile } from './modules/base64ToFile'
import { upload, checkUpload } from './modules/multerStorage'
import { createPerson, addPersonFace, deletePerson, detectPhoto, identify, groupsTrain, trainStatus } from './modules/apiRequest'
import { populate } from './modules/dbSetting'

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });


app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb'}))

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie, token')
  res.header('Access-Control-Expose-Headers', 'token');
  next();
});

app.use('/company', companyRouter)

app.get('/test', (req, res) => {
  User.find().populate({
    path: 'company',
    select: ['name', 'id', 'principal', 'address', 'phone', 'email']
  }).then(result => {
    res.send(result)
  })
})


app.post('/upload', (req, res) => {
  const body = _.pick(req.body, ['lastname', 'firstname', 'phone', 'gender', 'identification', 'birthday', 'password', 'email', 'imgPath', 'company', 'address', 'type' ])
  body.fullname = body.firstname + body.lastname
  console.log(body);
    User.findOne({identification: body.identification})
      .then((user) => {
        if (user) {
          return Promise.reject('此身份已註冊')
        }
        console.log('1')
        return createPerson(body.fullname, body.identification)
      }).then(({data}) => {
        body.personId = data.personId
        console.log('2')
        return addPersonFace(body.imgPath, body.personId)
      }).then((response) => {
        body.imagePath = response
        let user = new User(body)
        console.log('3')
        return Promise.all([user.save(), groupsTrain()])
      }).then(([user, {data}]) => {
        console.log('4')
        console.log(data);
        res.send(user)
      }).catch((error) => {
        deletePerson(body.personId)
        res.status(400).send(error)
      })
})

app.post('/photoCheck', upload, (req, res) => {
  var pathRegexp = new RegExp("\/person.*");
  var imgPath = req.file.destination.match(pathRegexp)[0] + '/' + req.file.filename
  detectPhoto(imgPath).then((response) => {
    console.log(response.data);
    if (response.data.length == 0) {
      res.status(403).send("此相片無法使用")
    } else {
      console.log(response.data);
      res.send(imgPath)
    }
  }).catch((error) => {
    res.status(400).send(error)
  })
})

app.post('/identify', (req, res) => {
  console.log(req.body.image);
  trainStatus().then(result => {
    console.log(result.data.status);
    if (result.data.status === 'failed') {
      return groupsTrain()
    } else {
      return 'trained'
    }
  }).then((result) => {
    console.log(result);
    return base64ToFile(req.body.image)
  })
  .then((imagePath) => {
    console.log(imagePath);
    return detectPhoto(imagePath)
  }).then((response) => {
    if (response.data.length == 0) {
      res.send("此相片無法使用")
    } else {
      console.log(response.data[0].faceId);
      return identify(response.data[0].faceId)
    }

  }).then(({data}) => {
    console.log(data);
    if (data[0].candidates.length == 0) {
      return Promise.reject("找不到這個人")
    }
    console.log(data[0]);
    return User.findOne({personId: data[0].candidates[0].personId})
  }).then((result) => {
    console.log('here');
    req.body = _.pick(result, ['_id', 'company', 'type', 'fullname'])
    return Record.find({staff: req.body._id}).sort({_id: -1})
  }).then((record) => {
    if (record.length == 0) {
      let record = new Record({
        fullname: req.body.fullname,
        entry: moment().valueOf(),
        staff: req.body._id
      })
      return record.save().then(record => {
        return populate(record)
      })
    } else {
      let { entry, outed } = record[0]
      if (outed) {
        let record = new Record({
          fullname: req.body.fullname,
          entry: moment().valueOf(),
          staff: req.body._id
        })
        return record.save().then(record => {
          return populate(record)
        })
      } else {
        return Record.findOneAndUpdate({_id: record[0]._id}, {$set: {outed: moment().valueOf()}}).then(record => {
          return populate(record)
        })
      }
    }
  }).then((result) => {
    res.send(result)
  }).catch((error) => {
    res.status(400).send(error)
  })
})


app.get('/getRecord', (req, res) => {
  Record.find().populate({
    path: 'staff',
    select: ['email','fullname','phone','identification', 'birthday','imagePath','company','address', 'type']
  }).then((record) => {
    res.send(record)
  })
})

app.listen(process.env.PORT, () => {
  console.log( `[${moment(Date.now()).format("YYYY-MM-DD HH:MM:SS")}]--> start up post ${process.env.PORT}` )
})
