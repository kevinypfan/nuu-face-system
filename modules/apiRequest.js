import axios from './axiosInstance'

export const createPerson = (fullname, identification) => {
  return axios.post(`/persongroups/${process.env.PERSON_GROUP_ID}/persons`, {
  "name": fullname,
  "userData": identification
  })
}

export const addPersonFace = (imgPath, personId) => {
  return imgPath.map(path => {
    return new Promise((resolve, reject) => {
      return axios.post(`/persongroups/${process.env.PERSON_GROUP_ID}/persons/${personId}/persistedFaces`, {
        "url": `${process.env.LOCAL_URL}${path}`
      }).then(({data}) => {
        resolve({ path, faceId: data.persistedFaceId })
      }).catch(error => {
        reject(error)
      })
    })
  })
}

export const deletePerson = (personId) => {
   return axios.delete(`/persongroups/${process.env.PERSON_GROUP_ID}/persons/${personId}`)
}

export const detectPhoto = (path) => {
  return axios.post('/detect', { url: `${process.env.LOCAL_URL}${path}`})
}


export const identify = (faceId) => {
  return axios.post('/identify', {
    "personGroupId": process.env.PERSON_GROUP_ID,
    "faceIds":[
        faceId
      ],
    "maxNumOfCandidatesReturned":1,
    "confidenceThreshold": 0.6
  })
}


export const groupsTrain = () => {
  return axios.post(`/persongroups/${process.env.PERSON_GROUP_ID}/train`)
}
