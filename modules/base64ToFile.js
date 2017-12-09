import fs from 'fs'
import path from 'path'

export const base64ToFile = (data) => {
  return new Promise((resolve, reject) => {
    data = data.replace(/.*:(image)\/(.*);.*,/, '');
    if (RegExp.$1 !== "image") {
      reject('這不是圖片');
    } else {
      var decide = RegExp.$1
      var extension = RegExp.$2;
      var date = Date.now()
      // data = data.replace(/^data:image\/png;base64,/, '');
      fs.writeFile( `./public/person/check/${date}.${extension}`, data, 'base64', (err) => {
        if (err) {
          reject(err)
        } else {
          resolve( `/person/check/${date}.${extension}`)
        }
      });
    }
  })
}
