import './config/config.js'
import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'
import moment from 'moment'
import _ from 'lodash'
import { User } from './models/user'
import { Record } from './models/record'
import bodyParser from 'body-parser'

import { upload, checkUpload } from './modules/multerStorage'
import { createPerson, addPersonFace, deletePerson, detectPhoto, identify, groupsTrain } from './modules/apiRequest'
import { populate } from './modules/dbSetting'

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/upload', (req, res) => {
  const body = _.pick(req.body, ['lastname', 'firstname', 'phone', 'gender', 'identification', 'birthday', 'password', 'email', 'imgPath', 'company', 'address', 'type' ])
  body.fullname = body.firstname + body.lastname
  console.log(body);
    User.findOne({identification: body.identification})
      .then((user) => {
        if (user) {
          return Promise.reject('此身份已註冊')
        }
        return createPerson(body.fullname, body.identification)
      }).then(({data}) => {
        body.personId = data.personId
        return Promise.all(addPersonFace(body.imgPath, body.personId))
      }).then((response) => {
        body.imagePath = response
        let user = new User(body)
        return Promise.all([user.save(), groupsTrain()])
      }).then(([user, {data}]) => {
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
    if (response.data.length == 0) {
      res.send("此相片無法使用")
    } else {
      res.send(imgPath)
    }
  }).catch((error) => {
    res.status(400).send(error)
  })
})

app.post('/identify', upload, (req, res) => {
  var pathRegexp = new RegExp("\/person.*");
  var imgPath = req.file.destination.match(pathRegexp)[0] + '/' + req.file.filename
  detectPhoto(imgPath).then((response) => {
    if (response.data.length == 0) {
      res.send("此相片無法使用")
    } else {
      console.log(response.data[0].faceId);
      return identify(response.data[0].faceId)
    }

  }).then(({data}) => {
    if (data[0].candidates.length == 0) {
      return Promise.reject("找不到這個人")
    }
    return User.findOne({personId: data[0].candidates[0].personId})
  }).then((result) => {
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
