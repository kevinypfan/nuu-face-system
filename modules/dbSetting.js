import { Record } from '../models/record'


  export const populate = (record) => {
    return Record.findOne({_id: record._id})
      .populate({
        path: 'staff',
        select: ['email','fullname','phone','identification', 'birthday','imagePath','company','address', 'type']
      })
  }
