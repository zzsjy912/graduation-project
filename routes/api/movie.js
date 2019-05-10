const express = require('express');
const router = express.Router();
var request = require('request');
const keys = require('../../config/keys')

const InTheaters = require('../../models/InTheaters');



const passport = require('passport')

var formidable = require('formidable');  //上传图片处理的插件
var fs = require("fs");  //文件模块
// var context = require('../../public/javascripts/context'); //环境的一些配置

router.get('/test', (req, res) => {
    res.json({ msg: "usersactive works" })
})
router.get('/in_theaters', (req, res) => {
    // async function getNew() {
    //     var options = {
    //         url: keys.doubanOptions.theatersUrl,
    //         headers: {
    //             'Content-Type': 'text/html,application/xhtml+xml,application/xml,charset=utf-8',
    //         }
    //     }
    //     request(options, (err, res1, body) => {
    //         var info = JSON.parse(body);
    //         var newList = new InTheaters({
    //             id: 1,
    //             subjects: info.subjects
    //         })
    //         newList.save()
    //             .then(newList => res.json({ code: 0, data: newList }))
    //     })
    // }

    async function getList() {
        return new Promise((resolve, err) => {
            InTheaters.find({}).sort({ date: -1 }).limit(1).lean()
                .then((list) => {
                    res.json({ code: 0, data: list[0] })
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                })
        })
    }
    // getNew()
    getList()
})

module.exports = router