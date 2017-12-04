import axios from 'axios'

export const createPerson = (fullname, identification) => {
  return axios.post(process.env.API_URL + `/persongroups/${process.env.PERSON_GROUP_ID}/persons`, {
  "name": fullname,
  "userData": identification
  }, {
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY
  }}).catch(error => {
    return error
  })
}

export const addPersonFace = (imgPath, personId) => {
  return imgPath.map(path => {
    return axios.post(process.env.API_URL + `/persongroups/${process.env.PERSON_GROUP_ID}/persons/${personId}/persistedFaces`, {
      "url": process.env.LOCAL_URL + path
    }, {headers: {'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY}})
      .then(({data}) => {
        return { path, faceId: data.persistedFaceId }
      }).catch(error => {
        return error
      })
  })
}
