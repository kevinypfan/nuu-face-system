// var { Company } = require('../models/company')
import { Company } from '../models/company'
var authenticate = (req, res, next) => {
  var token = req.header('token');
  Company.findByToken(token).then(company => {
    if (!company) {
      return Promise.reject();
    }
      req.company = company;
      req.token = token;
      //console.log(req.company.roleId);
      next();
  }).catch(()=>{
    res.status(401).send('沒有此用戶');
  })
}

export default authenticate
