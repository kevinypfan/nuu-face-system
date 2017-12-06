var xargon = {
  "imgPath": [
    "/person/K123456666/20171206_4e69891cdd.jpg",
    "/person/K123456666/20171206_521feedd82.jpg",
    "/person/K123456666/20171206_96e04136e3.jpg"
  ],
  "identification": "K123456666",
  "lastname": "Xargon",
  "firstname": "chang",
  "phone": "0912456789",
  "gender": "male",
  "birthday": "19941211",
  "password": "123456",
  "email": "asdasdasdasd@ytad.asd"
}

var mate = {
  "imgPath": [
    "/person/K123456123/20171206_d15903c5d1.JPG",
    "/person/K123456123/20171206_569934e78d.JPG",
    "/person/K123456123/20171206_4bb46cb855.JPG"
  ],
  "identification": "K123456123",
  "lastname": "213",
  "firstname": "asd",
  "phone": "0912456789",
  "gender": "male",
  "birthday": "19941211",
  "password": "123456",
  "email": "kkkk@ytad.asd"
}

var me = {
  "imgPath": [
    "/person/K123456666/20171206_a7c8cf4f94.jpg",
    "/person/K123456666/20171206_1a5db6609f.jpg",
    "/person/K123456666/20171206_bd79fea748.jpg"
  ],
  "identification": "K123456rgr6",
  "lastname": "Kevin",
  "firstname": "Fan",
  "phone": "0912456789",
  "gender": "male",
  "birthday": "19941211",
  "password": "123456",
  "email": "jghjhgjKKKK@werwe.asd"
}

function testPost(payload) {
  axios.post('/upload', payload).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

testPost(me)
