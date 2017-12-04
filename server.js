import './config/config.js'
import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'
import moment from 'moment'
import _ from 'lodash'
import { User } from './models/user'

import { upload } from './modules/multerStorage'
import { createPerson, addPersonFace } from './modules/apiRequest'

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });


app.use(express.static('public'))

app.get('/setup', (req, res) => {
  const body = _.pick(req.body, ['firstname', 'lastname', 'phone', 'gender', 'identification', 'birthday', 'password'])
})

app.post('/upload', upload, (req, res) => {
  const body = _.pick(req.body, ['lastname', 'firstname', 'phone', 'gender', 'identification', 'birthday', 'password', 'email'])
  body.fullname = body.firstname + body.lastname
  var pathRegexp = new RegExp("\/person.*");
  var imgPath = req.files.map((img) => {
    return img.destination.match(pathRegexp)[0] + '/' + img.filename
  })
  
    createPerson(body.fullname, body.identification)
      .then(({data}) => {
        body.personId = data.personId
        return Promise.all(addPersonFace(imgPath, body.personId))
      }).then((response) => {
        body.imagePath = response
        let user = new User(body)
        return user.save()
      }).then((user) => {
        res.send(user)
      }).catch((error) => {
        res.status(400).send(error)
      })
})

app.listen(process.env.PORT, () => {
  console.log( `[${moment(Date.now()).format("YYYY-MM-DD HH:MM:SS")}]--> start up post ${process.env.PORT}` )
})
