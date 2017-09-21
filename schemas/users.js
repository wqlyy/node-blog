/**
 * Created by Administrator on 2017/9/19.
 */

//定义表结构
const mongoose = require('mongoose');
//用户表 结构

module.exports = new mongoose.Schema({
    // 用户名
    username:String,
    // 密码
    password:String,
    //是否管理员
    isAdmin:{
        type:Boolean,
        default:false
    }
});

