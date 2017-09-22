/**
 * Created by Administrator on 2017/9/19.
 */
const express = require('express');
const Category = require('../../models/Category');


const router = express.Router();


router.get('/',(req,res)=>{
    // console.log(req.userInfo);
    Category.find().then(function(categories){
        res.render('web/index',{
            userInfo:req.userInfo,
            categories:categories
        });
    });
});

module.exports = router;