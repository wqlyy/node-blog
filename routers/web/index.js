/**
 * Created by Administrator on 2017/9/19.
 */
const express = require('express');
const Category = require('../../models/Category');
const Content = require('../../models/Content');

const router = express.Router();
let data;
router.use(function (req, res, next) {
    //处理通用数据
    data = {
        userInfo: req.userInfo,
        categories: []
    };
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
});

//前端首页
router.get('/', (req, res) => {
    data.category = req.query.category || '',
    data.count = 0,
    data.page = Number(req.query.page || 1),//当前页
    data.limit = 10 , //每页显示条数
    data.pages = 0 //总页数

    var where = {};
    if (data.category) {
        where.category = data.category;
    }
    Content.where(where).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于1
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;//忽略多少条
        if (where)
            return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
                addTime: -1
            });
    }).then(function (contents) {
        data.contents = contents;
        // console.log(data);
        res.render('web/index', data);
    })
});

router.get('/view', function (req, res) {
    var contentId = req.query.contentid || "";
    Content.findOne({
        _id: contentId
    }).populate(['category', 'user']).then(function (contents) {
        console.log(contents);
        data.content = contents;
        //todo:阅读量处理逻辑
        contents.views++;
        contents.save();
        res.render('web/view', data);
    })
});

module.exports = router;