import axios from 'axios'

export const createPerson = (fullname, identification) => {
  return axios.post(process.env.API_URL + `/persongroups/${process.env.PERSON_GROUP_ID}/persons`, {
  "name": fullname,
  "userData": identification
  }, {
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY
  }})
}

export const addPersonFace = (imgPath, personId) => {
  imgPath.map(path => {
    return Promise((resolve, reject) => {
      return axios.post(process.env.API_URL + `/persongroups/${process.env.PERSON_GROUP_ID}/persons/${personId}/persistedFaces`, {
        "url": process.env.LOCAL_URL + path
      }, {headers: {'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY}})
        .then(({data}) => {
          resolve({ path, faceId: data.persistedFaceId })
        }).catch(error => {
          reject(error)
        })
    })
  })
}
