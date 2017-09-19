/**
 * Created by Administrator on 2017/9/19.
 */
const mongoose = require('mongoose');
const userSchema = require('../schemas/users');

//用户模型类
module.exports = mongoose.model('User',userSchema);