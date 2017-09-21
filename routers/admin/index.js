/**
 * Created by Administrator on 2017/9/19.
 */
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Category = require('../../models/Category');


router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('对不起，您不是管理员');
        return;
    }
    next();
});
//后台首页
router.get('/',(req,res)=>{
   res.render('admin/index',{userInfo:req.userInfo});
});
// 用户管理
router.get('/user',function(req,res,next){
    // 读取数据库所有该用户数据 limit().限制查询条数
    //skip() 忽略条数
    // console.log(req.query.page);
    var page = Number(req.query.page || 1);//当前页
    var limit = 10;//每页显示条数
    var pages = 0;//总页数
    User.count().then(function(count){
        pages = Math.ceil(count/limit);
        //todo:此处和url显示值不符
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;//忽略多少条
        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,//当前管理员的信息
                users:users,//所有用户信息
                page:page,
                count:count,
                limit:limit,
                pages:pages
            })
        });
    })


});

// 分类首页
router.get('/category',function(req,res){
    // 读取数据库所有该用户数据 limit().限制查询条数
    //skip() 忽略条数
    // console.log(req.query.page);
    var page = Number(req.query.page || 1);//当前页
    var limit = 10;//每页显示条数
    var pages = 0;//总页数
    Category.count().then(function(count){
        pages = Math.ceil(count/limit);
        //todo:此处和url显示值不符
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;//忽略多少条
        Category.find().limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                userInfo:req.userInfo,//当前管理员的信息
                categories:categories,
                page:page,
                count:count,
                limit:limit,
                pages:pages
            })
        });
    })
});
// 添加分类
router.get('/category/add',function(req,res){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
});
router.post('/category/add',function(req,res){
    var name = req.body.name || "";
    if(name === ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空！！！'
        });
        return;
    }
    //数据库是否已经存在同名分类
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在！！！'
            });
            return Promise.reject();
        }else{
            //数据库不存在该分类，保存
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'添加分类成功',
            url:'/admin/category'
        })
    })
});

//修改分类
router.get('/category/edit',function(req,res){
    Category.findById(req.query.id).then(function(category){
        res.render('admin/category_edit',{
            userInfo:req.userInfo,
            category:category
        })
    })
});
//todo:修改分类提交
router.post('/category/edit',function(req,res){
    Category.findById(req.query.id).then(function(category){
        res.render('admin/category_edit',{
            userInfo:req.userInfo,
            category:category
        })
    })
});
module.exports = router;