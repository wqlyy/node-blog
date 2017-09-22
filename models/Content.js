/**
 * Created by Administrator on 2017/9/22.
 */
const mongoose = require('mongoose');
const contentSchema = require('../schemas/content');

//内容模型表
module.exports = mongoose.model('Content',contentSchema)