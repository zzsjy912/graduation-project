var express = require('express');
var router = express.Router();
var formidable = require('formidable');  //上传图片处理的插件
var fs = require("fs");  //文件模块
var context = require('../public/javascripts/context'); //环境的一些配置

//wangeditor上传图片的地址
router.post("/wangeditor/upload",function(req,res,next){
    var form = new formidable.IncomingForm();
    //设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
    form.uploadDir = "./public/images/wang";
    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function(err, fields, files) {
            var oldpath = files.myFileName.path; //myFileName就是我们刚在前台模板里面配置的后台接受的名称；
            var extname = files.myFileName.name; //因为formidable这个时候存在我们刚路径上的，只是一个path，还没有具体的扩展名，如：2.png这样的
            //新的路径由组成：原父路径 + 拓展名
            var newpath = "./public/images/wang/" + extname;
            //改名
            fs.rename(oldpath, newpath, function(err) { //把之前存的图片换成真的图片的完整路径
                if(err) {
                    res.send({errno:1,data:[]});
                };
                var mypath = newpath.replace("./public","http://" + context.ip +":3000"); //context.ip是我自己设置的后台的ip名，根据环境，可以是localhost,也可以是电脑ip
                res.send({errno:0,data:[mypath]}) //返回图片路径，让前端展示
            });
    });
})



module.exports = router;   //暴露接口