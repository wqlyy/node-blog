/**
 * 应用入口文件
 * @type {*}
 */

const express = require('express');//加载express模块
const swig = require('swig');//加载模板处理模块
const admin = require('./routers/admin');//后台管理路由
const api = require('./routers/api');//API接口
const web = require('./routers/web');//前台路由


const app = express();//创建app应用
//配置应用模板，定义当前应用使用的模板引擎
app.engine('html',swig.renderFile)//参数1：模板引擎的名称同时也是模板文件的后缀，参数2：用于解析处理模板内容的方法
//设置模板文件存放的目录，第一个参数必须是views,第二个参数是存放目录
app.set('views','./views');
//注册模板引擎，第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine','html');
//缓存机制--开发过程取消模板缓存--后期换成ejs
swig.setDefaults({cache:false})
//静态文件托管
app.use('/public',express.static(__dirname+'/public'));


app.use('/admin',admin);
app.use('/api',api);
app.use('/',web);

const server = app.listen(8080,()=>{
    console.log('The service runs and listens on port http://localhost:'+server.address().port)
});