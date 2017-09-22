/**
 * Created by Administrator on 2017/9/19.
 */
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Category = require('../../models/Category');
const Content =  require('../../models/Content');

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
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
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
    var id = req.query.id || "";
    Category.findById(id).then(function(category){
       if(category){
           res.render('admin/category_edit',{
               userInfo:req.userInfo,
               category:category
           })
       }else{
           res.render('admin/error',{
               userInfo:req.userInfo,
               message:"分类信息不存在！！！"
           });
           return Promise.reject();
       }
    })
});
//修改分类编辑保存
router.post('/category/edit',function(req,res){
    var id = req.query.id || "";//get提交过来的
    var name = req.body.name || "";//post提交过来的
    Category.findById(id).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"分类信息不存在！！！"
            });
            return Promise.reject();
        }else{
            //如果用户没有修改
            if(name===category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:"修改成功！！！",
                    url:"/admin/category"
                });
                return Promise.reject();
            }else{
                //修改的名称是否已经存在，
                return Category.findOne({
                    id:{$ne:id},
                    name:name
                });
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"已经存在相同名称的分类"
            });
            return Promise.reject();
        }else{
            return Category.update({
                _id:id
            },{
                name:name
            })
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"修改成功！！！",
            url:"/admin/category"
        });
    })
});

//删除分类
router.get('/category/delete',function (req,res) {
    var id = req.query.id || '';
    Category.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"删除成功",
            url:'/admin/category'
        })
    })
});

//内容管理
router.get('/content',function(req,res){
    var page = Number(req.query.page || 1);//当前页
    var limit = 10;//每页显示条数
    var pages = 0;//总页数
    Content.count().then(function(count){
        pages = Math.ceil(count/limit);
        //todo:此处和url显示值不符
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        var skip = (page-1)*limit;//忽略多少条
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
            // console.log(contents);
            res.render('admin/content_index',{
                userInfo:req.userInfo,//当前管理员的信息
                contents:contents,
                page:page,
                count:count,
                limit:limit,
                pages:pages
            })
        });
    })
});
//内容添加
router.get('/content/add',function(req,res){
    Category.find().then(function (categories) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })
    })
});
router.post('/content/add',function(req,res){
    if(req.body.category === '' || req.body.title === ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"内容分类或者内容标题不能为空！！！"
        });
        return;
    }
    //保存数据到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).save().then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"内容保存成功！！！",
            url:'/admin/content'
        });
        return;
    })
});
//内容编辑
router.get('/content/edit',function(req,res){
    var id = req.query.id || "";
    var categories = [];
    Category.find().then(function(rs){
        categories =rs;
        return Content.findById(id).populate('category');
    }).then(function(content){
        if(content){
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                content:content,
                categories:categories
            })
        }else{
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"内容信息不存在！！！"
            });
            return Promise.reject();
        }
    })
});
router.post('/content/edit',function (req,res) {
    var id = req.query.id || "";//get提交过来的
    if(req.body.category === '' || req.body.name === ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"内容分类或者内容标题不能为空！！！"
        });
        return;
    }
   Content.update({
       _id:id
   },{
       category:req.body.category,
       title:req.body.title,
       description:req.body.description,
       content:req.body.content
   }).then(function(){
       res.render('admin/success',{
           userInfo:req.userInfo,
           message:"内容保存成功！！！",
           url:'/admin/content'
       });
       return;
   })
});

//内容分类
router.get('/content/delete',function (req,res) {
    var id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"删除成功",
            url:'/admin/content'
        })
    })
});


module.exports = router;