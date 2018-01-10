import axios from './axiosInstance'

export const createPerson = (fullname, identification) => {
  return new Promise((resolve, reject) => {
    axios.post(`/persongroups/${process.env.PERSON_GROUP_ID}/persons`, {
    "name": fullname,
    "userData": identification
    })
    .then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
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
   return new Promise((resolve, reject) => {
      axios.delete(`/persongroups/${process.env.PERSON_GROUP_ID}/persons/${personId}`)
        .then(result => {
          resolve(result)
        }).catch(err => {
          reject(err)
        })
   })
}

export const detectPhoto = (path) => {
   return new Promise((resolve, reject) => {
     axios.post('/detect', { url: `${process.env.LOCAL_URL}${path}`})
       .then(result => {
         resolve(result)
       }).catch(err => {
         reject(err)
       })
  })
}


export const identify = (faceId) => {
  return new Promise((resolve, reject) => {
    axios.post('/identify', {
      "personGroupId": process.env.PERSON_GROUP_ID,
      "faceIds":[
          faceId
        ],
      "maxNumOfCandidatesReturned":1,
      "confidenceThreshold": 0.6
    })
    .then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
}


export const groupsTrain = () => {
  return new Promise((resolve, reject) => {
    axios.post(`/persongroups/${process.env.PERSON_GROUP_ID}/train`)
    .then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
}

export const trainStatus = () => {
  return new Promise((resolve, reject) => {
    axios.get(`/persongroups/${process.env.PERSON_GROUP_ID}/training`)
    .then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
}

trainStatus().then(result => {
  console.log(result.data);
})
