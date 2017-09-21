/**
 * Created by Administrator on 2017/9/19.
 */
const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    // console.log(req.userInfo);
    res.render('web/index',{userInfo:req.userInfo});
});

module.exports = router;