const express = require('express');
const router = express.Router();

const Article = require('../../models/Article');
const ArticleReply = require('../../models/ArticleReply');
const Paragraph = require('../../models/Paragraph');
const ParagraphReply = require('../../models/ParagraphReply');
const UserActive = require('../../models/UserAcive');
const Movieinfo = require('../../models/Movieinfo');
const Message = require('../../models/Message');


const Module_Active = require('../../modules/Module_Active');

const passport = require('passport')

var formidable = require('formidable');  //上传图片处理的插件
var fs = require("fs");  //文件模块
// var context = require('../../public/javascripts/context'); //环境的一些配置

var typeObj = {
    'paragraph': Paragraph,
    'paragraphReply': ParagraphReply,
    'article': Article,
};

router.get('/test', (req, res) => {
    res.json({ msg: "usersactive works" })
})

router.post('/allLength', passport.authenticate("jwt", { session: false }), (req, res) => {
    var user_name = req.body.user_name;
    var data = {};
    var all = 0;

    async function getNoReadLength() {
        return new Promise((resolve, err) => {
            Message.countDocuments({ reply_name: user_name, is_read: 0 }).then(data => {
                resolve(data);
            })
        })
    };

    async function getLength(typeModel) {
        return new Promise((resolve, err) => {
            typeModel.countDocuments({ user_name }).then(data => {
                resolve(data);
            })
        })
    };

    async function getDate() {
        for (const key in typeObj) {
            var typeModel = typeObj[key];
            var obj = {};
            data[key] = await getLength(typeModel);
            all += data[key];
            // data.push(obj);
        }
        data.all = all;
        data.reply = data.paragraphReply;
        data.message = await getNoReadLength();
        res.json({ code: 0, data })
    }

    getDate();


});

router.post('/all', (req, res) => {
    var user_name = req.body.user_name;

    async function parentData() {
        return new Promise((resolve, err) => {
            UserActive.find({ user_name }).sort({ date: -1 }).limit(15).lean()
                .then((userActive) => {
                    resolve(userActive)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 3 })
                })
        }).then(userActive => {
            return userActive
        })
    }

    async function getChild(parent) {
        var typeModel = typeObj[parent.type];
        var typeName = parent.type + '_id'
        var typeid = parent.type_id;
        var childDate = await getDate(typeModel, typeName, typeid)
        if (parent.type == 'paragraph') {
            if (childDate.type == 'article') {
                // var movieInfo = await getMovieInfo(childDate.movie_id)
                // parent.movie_image = movieInfo.img;
                // parent.movie_title = movieInfo.title;
            }
            if (childDate.type == 'movie') {
                var movieInfo = await getMovieInfo(childDate.id)
                parent.movie_image = movieInfo.img;
                parent.movie_title = movieInfo.title;
            }
        }
        if (parent.type == 'article') {
            childDate.content = ''
            var movieInfo = await getMovieInfo(childDate.movie_id)
            
                parent.movie_image = movieInfo.img;
                parent.movie_title = movieInfo.title;
        }


        parent.childDate = childDate;
    }

    async function getDate(typeModel, typeName, typeid) {
        var typeName = typeName;
        var objFind = {};
        objFind[typeName] = typeid;
        return new Promise((resolve, err) => {
            typeModel.findOne(objFind).lean()
                .then((childDate) => {
                    resolve(childDate)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 2 })
                })
        }).then(childDate => {
            return childDate
        })
    }

    async function getMovieInfo(movie_id) {
        return new Promise((resolve, err) => {
            Movieinfo.findOne({ id: movie_id }).lean()
                .then((MovieInfo) => {
                    var movieInfo = {
                        img: MovieInfo.images.small,
                        title: MovieInfo.title
                    }
                    resolve(movieInfo)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 1 })
                })
        }).then(movieInfo => {
            return movieInfo
        })
    }

    async function getAll() {
        var userActive = {};
        userActive = await parentData()
        for (let i = 0; i < userActive.length; i++) {
            const element = userActive[i];
            await getChild(element);
        }
        res.json({ code: 0, data: userActive })
    }
    getAll()
})

router.post('/article', (req, res) => {
    var user_name = req.body.user_name;

    async function parentData() {
        return new Promise((resolve, err) => {
            Article.find({ user_name }).sort({ date: -1 }).limit(15).lean()
                .then((article) => {
                    resolve(article)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 3 })
                })
        }).then(article => {
            return article
        })
    }

    async function getChild(article) {

        var movieInfo = await getMovieInfo(article.movie_id)
        article.movie_image = movieInfo.img;
        article.movie_title = movieInfo.title;
    }

    async function getMovieInfo(movie_id) {
        return new Promise((resolve, err) => {
            Movieinfo.findOne({ id: movie_id }).lean()
                .then((MovieInfo) => {
                    var movieInfo = {
                        img: MovieInfo.images.small,
                        title: MovieInfo.title
                    }
                    resolve(movieInfo)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 1 })
                })
        }).then(movieInfo => {
            return movieInfo
        })
    }

    async function getAll() {
        var article = []
        article = await parentData()
        for (let i = 0; i < article.length; i++) {
            const element = article[i];
            element.content = ''
            await getChild(element);
        }
        res.json({ code: 0, data: article })
    }
    getAll()
})

router.post('/paragraph', (req, res) => {
    var user_name = req.body.user_name;

    async function parentData() {
        return new Promise((resolve, err) => {
            Paragraph.find({ user_name }).sort({ date: -1 }).limit(15).lean()
                .then((paragraph) => {
                    resolve(paragraph)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 3 })
                })
        }).then(paragraph => {
            return paragraph
        })
    }

    async function getChild(item) {
        if (item.type == 'movie') {
            var movieInfo = await getMovieInfo(item.id)
            item.movie_image = movieInfo.img;
            item.movie_title = movieInfo.title;
        }

    }

    async function getMovieInfo(movie_id) {
        return new Promise((resolve, err) => {
            Movieinfo.findOne({ id: movie_id }).lean()
                .then((MovieInfo) => {
                    var movieInfo = {
                        img: MovieInfo.images.small,
                        title: MovieInfo.title
                    }
                    resolve(movieInfo)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 1 })
                })
        }).then(movieInfo => {
            return movieInfo
        })
    }

    async function getAll() {
        var paragraph = []
        paragraph = await parentData()
        for (let i = 0; i < paragraph.length; i++) {
            const element = paragraph[i];
            await getChild(element)
        }
        res.json({ code: 0, data: paragraph })
    }
    getAll()
})

router.post('/reply', (req, res) => {
    var user_name = req.body.user_name;

    async function articleReply() {
        return new Promise((resolve, err) => {
            ArticleReply.find({ user_name }).sort({ date: -1 }).limit(15).lean()
                .then((articleReply) => {
                    resolve(articleReply)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 3 })
                })
        }).then(articleReply => {
            return articleReply
        })
    }

    async function paragraphReply() {
        return new Promise((resolve, err) => {
            ParagraphReply.find({ user_name }).sort({ date: -1 }).limit(15).lean()
                .then((paragraphReply) => {
                    resolve(paragraphReply)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败', err: 3 })
                })
        }).then(paragraphReply => {
            return paragraphReply
        })
    }

    async function getAll() {
        var articleReplyArr = []
        articleReplyArr = await articleReply()
        var paragraphReplyArr = [];
        paragraphReplyArr = await paragraphReply()
        var data = [];
        data = data.concat(articleReplyArr);
        data = data.concat(paragraphReplyArr);
        res.json({ code: 0, data })
    }
    getAll()
})

module.exports = router