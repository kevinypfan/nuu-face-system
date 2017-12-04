import fs from 'fs'
import multer from 'multer'
import moment from 'moment'
import {randomToken} from './random'


function getFileExtension1(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var id = req.body.identification
    if (!fs.existsSync( `public/person/${id}`)){
      fs.mkdirSync(`public/person/${id}`);
    }
    cb(null,`public/person/${id}`)
  },
  filename: (req, file, cb) => {
    var id = req.body.identification
    var fileName = getFileExtension1(file.originalname);
    var date = Date.now()
    cb(null, `${id}_${moment(date).format("YYYYMMDD")}_${randomToken()}.${fileName}`)
  }
})

export const upload = multer({ storage }).any()
