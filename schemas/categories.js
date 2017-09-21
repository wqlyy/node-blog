/**
 * Created by Administrator on 2017/9/21.
 */
//定义表结构
const mongoose = require('mongoose');
//用户表 结构

module.exports = new mongoose.Schema({
    // 分类名称
    name:String
});