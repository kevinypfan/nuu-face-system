var xargon = {
  "imgPath": [
    '/person/K123456666/20171207_071750_48d68a4c9b.jpg',
    '/person/K123456666/20171207_071807_f1e69f78dc.jpg',
    '/person/K123456666/20171207_071824_d23f464607.jpg'
  ],
  "identification": "K123456666",
  "lastname": "Xargon",
  "firstname": "chang",
  "phone": "0912456789",
  "gender": "male",
  "birthday": "19941211",
  "password": "123456",
  "email": "asdasdasdasd@ytad.asd",
  'company': 'status',
  'address': 'status',
  'type': 'status'
}

var mate = {
  "imgPath": [
    '/person/K123456123/20171207_071909_b3f06463cc.JPG',
    '/person/K123456123/20171207_071925_1f9de5fccd.JPG',
    '/person/K123456123/20171207_071941_afde7e288b.JPG'
  ],
  "identification": "K123456123",
  "lastname": "213",
  "firstname": "asd",
  "phone": "0912456789",
  "gender": "male",
  "birthday": "19941211",
  "password": "123456",
  "email": "kkkk@ytad.asd",
  'company': 'status',
  'address': 'status',
  'type': 'status'
}

var me = {
  "imgPath": [
    '/person/K123456rgr6/20171207_072053_4387fcef65.jpg',
    '/person/K123456rgr6/20171207_072117_7f012123d7.jpg',
    '/person/K123456rgr6/20171207_072133_ea848eb18d.jpg'
  ],
  "identification": "K123456rgr6",
  "lastname": "Kevin",
  "firstname": "Fan",
  "phone": "0912456789",
  "gender": "male",
  "birthday": "19941211",
  "password": "123456",
  "email": "jghjhgjKKKK@werwe.asd",
  'company': 'status',
  'address': 'status',
  'type': 'status'
}



function testPost(payload) {
  return axios.post('/upload', payload).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

testPost(me).then(res => {
  return testPost(mate)
}).then(res => {
  return testPost(xargon)
}).then(res => {
  console.log(res);
})

console.log(moment().valueOf())
