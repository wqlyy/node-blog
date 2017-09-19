/**
 * Created by Administrator on 2017/9/19.
 */
const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    res.send('web')
});

module.exports = router;