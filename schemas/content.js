/**
 * Created by Administrator on 2017/9/22.
 */
//定义内容表结构
const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    // 关联字段
    //内容分类ID
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        // 引用
        ref:"Category"
    },
    //用户ID
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        // 引用
        ref:"User"
    },
    //时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //内容标题
    title:String,
    // 简介
    description:{
        type:String,
        default:''
    },
    //内容
   content:{
        type:String,
       default:''
   }
});