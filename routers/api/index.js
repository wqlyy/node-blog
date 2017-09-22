/**
 * Created by Administrator on 2017/9/19.
 */
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Content = require('../../models/Content');

//数据统一返回格式
var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});

// 用户注册
// 注册逻辑：用户名密码不能为空，两次密码一致，用户名是否存在（查询数据库）
router.post('/user/register', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if (username === '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password === '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (password !== repassword) {
        responseData.code = 3;
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经注册,操作数据库
    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            responseData.code = 4;
            responseData.message = '用户名已存在';
            res.json(responseData);
            return;
        }
        //保存用户
        var user = new User({
            username: username,
            password: password
        });
        return user.save()
    }).then(function (newUserInfo) {
        // console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    })
    // console.log(req.body)

});

//用户登录
router.post('/user/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username === '' || password === '') {
        responseData.code = 1;
        responseData.message = '用户或密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中，对应密码用户名是否存在并且一直
    User.findOne({
        username: username,
        password: password
    }).then((userInfo) => {
        if (!userInfo) {//没找到
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        } else {
            responseData.message = '登录成功';
            responseData.userInfo={
                _id:userInfo._id,
                username:username
            };
            req.cookies.set('userInfo',JSON.stringify({
                _id:userInfo._id,
                username:username
            }));
            res.json(responseData);
            return;
        }
    })
});

//退出登录
router.get('/user/logout',(req,res)=>{
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

// 文章所有评论
router.get('/comment',function(req,res){
    var contentid = req.query.contentid || '';
    Content.findOne({
        _id:contentid
    }).then(function(content){
        responseData.message="获取所有评论成功";
        responseData.data = content.comments;
        res.json(responseData)
    });
});

// 评论提交
router.post('/comment/post',function(req,res){
    var contentId = req.body.contentid || '';
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content || '自动评论，内容为空'
    }

    //查询
    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save()
    }).then(function(newContent){
        responseData.message="评论成功";
        responseData.data = newContent;
        res.json(responseData)
    });
});



module.exports = router;