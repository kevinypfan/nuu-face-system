import axios from './axiosInstance'

export const createPerson = (fullname, identification) => {
  return axios.post(`/persongroups/${process.env.PERSON_GROUP_ID}/persons`, {
  "name": fullname,
  "userData": identification
  })
}

export const addPersonFace = (imgPath, personId) => {
  imgPath.map(path => {
    return Promise((resolve, reject) => {
      return axios.post(`/persongroups/${process.env.PERSON_GROUP_ID}/persons/${personId}/persistedFaces`, {
        "url": process.env.LOCAL_URL + path
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
