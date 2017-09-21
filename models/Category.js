/**
 * Created by Administrator on 2017/9/21.
 */
const mongoose = require('mongoose');
const categoriesSchema = require('../schemas/categories');

//分类模型类
module.exports = mongoose.model('Category',categoriesSchema);