const express = require('express');
const router = express.Router();

const Article = require('../../models/Article');
const ArticleReply = require('../../models/ArticleReply');
// const UserActive = require('../../models/UserAcive');

const Module_Active = require('../../modules/Module_Active');

const passport = require('passport')

var formidable = require('formidable');  //上传图片处理的插件
var fs = require("fs");  //文件模块
// var context = require('../../public/javascripts/context'); //环境的一些配置

// $route GET api/articleinfo/test
// @desc  返回json
// @access public


//wangeditor上传图片的地址
router.post("/upload", function (req, res, next) {
    var form = new formidable.IncomingForm();
    //设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
    form.uploadDir = "'../../public/article/images";
    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function (err, fields, files) {
        var oldpath = files.myFileName.path; //myFileName就是我们刚在前台模板里面配置的后台接受的名称；
        var extname = files.myFileName.name; //因为formidable这个时候存在我们刚路径上的，只是一个path，还没有具体的扩展名，如：2.png这样的
        //新的路径由组成：原父路径 + 拓展名
        var newpath = "public/article/images/" + extname;
        //改名
        fs.rename(oldpath, newpath, function (err) { //把之前存的图片换成真的图片的完整路径
            if (err) {
                res.send({ errno: 1, data: [] });
            };
            var mypath = newpath.replace("public", "http://localhost:5000"); //context.ip是我自己设置的后台的ip名，根据环境，可以是localhost,也可以是电脑ip
            res.send({ errno: 0, data: [mypath] }) //返回图片路径，让前端展示
        });
    });
})

router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({ msg: "Movieinfo works" })

    async function getLength() {
        return new Promise((resolve, err) => {
            Article.countDocuments({}).then(data => {
                resolve(data);
            })
        })
    };

    async function addDB(newArticle) {
        return new Promise((resolve, err) => {
            new Article(newArticle).save()
                .then(article => {
                    resolve(article);
                })
        }).then(article => {
            res.json({ code: 0, msg: 'success', data: article })
        })
    }

    async function add() {
        var article_id = await getLength() + 1;
        const newArticle = {
            article_id: article_id,
            movie_id: req.body.movie_id,
            user_name: req.body.user_name,
            user_avatar: req.body.user_avatar,
            title: req.body.title,
            topic: req.body.topic,
            content: req.body.content,
            rating: req.body.rating
        };
        await addDB(newArticle);

        // 记录操作
        const newUserActive = {
            user_name: newArticle.user_name,
            type: 'article',
            type_id: article_id
        };
        Module_Active.save(newUserActive)
    }
    add()

})

router.post('/details', passport.authenticate("jwt", { session: false }), (req, res) => {
    
    async function getMovieInfo(movie_id) {
        return new Promise((resolve, err) => {
            Movieinfo.findOne({ id: movie_id }).lean()
                .then((MovieInfo) => {
                    var movieInfo = {
                        img: MovieInfo.images.large,
                        title: MovieInfo.title,
                        directors: MovieInfo.directors,
                        genres: MovieInfo.genres,
                        casts: MovieInfo.casts,
                        countries: MovieInfo.countries
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

    async function getArticleInfo(id) {
        return new Promise(resolve => {
            Article.findOne({ article_id: id }).lean()
                .then((articleinfo) => {
                    if (!articleinfo) {
                        res.json({ code: 11, msg: '不存在此文章' })
                    } else {
                        resolve(articleinfo)
                    }
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                })
        })
    }
    
    async function getDate(){
        let id = req.body.id;
        let data = await getArticleInfo(id);
        let movieInfo = await getMovieInfo(data.movie_id);
        data.movieInfo = movieInfo;
        res.json({ code: 0, data})
    }

    getDate();
})

router.get('/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;

    async function getLength() {
        return new Promise((resolve, err) => {
            Article.countDocuments({ movie_id: id }).then(data => {
                resolve(data);
            })
        })
    };

    async function parentData() {
        return new Promise((resolve, err) => {
            Article.find({ movie_id: id }, { content: 0 }).sort({ date: -1 }).limit(5).lean()
                .then((articlelist) => {
                    resolve(articlelist)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                })
        }).then(articlelist => {
            return articlelist
        })
    }

    async function getArticle() {
        var data = await parentData();
        var totalnum = await getLength();
        // await childDate(data);
        res.json({ code: 0, data: data, totalnum })
    }
    getArticle();
})

router.post('/page', passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.body.movie_id;
    var page = req.body.page - 1;
    async function parentData() {
        return new Promise((resolve, err) => {
            Article.find({ movie_id: id }, { content: 0 }).sort({ date: -1 }).skip(page * 5).limit(5).lean()
                .then((articlelist) => {
                    resolve(articlelist)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                })
        }).then(articlelist => {
            return articlelist
        })
    }

    async function getArticle() {
        var data = await parentData(data);
        var totalnum = data.length;
        // await childDate(data);
        res.json({ code: 0, data: data, totalnum })
    }
    getArticle();
})

router.post('/new', passport.authenticate("jwt", { session: false }), (req, res) => {

    async function parentData() {
        return new Promise((resolve, err) => {
            Article.find({}).sort({ date: -1 }).limit(5).lean()
                .then((articlelist) => {
                    resolve(articlelist)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                })
        }).then(articlelist => {
            return articlelist
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
    async function getArticle() {
        var data = await parentData();
        // await childDate(data);
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.content = ''
            await getChild(element);
        }
        res.json({ code: 0, data: data })
    }
    getArticle();
})

router.post('/list', passport.authenticate("jwt", { session: false }), (req, res) => {
    // var name = req.query.name;
    var identity = req.user.identity;
    if (identity == 0) {
        res.json({ code: 11, msg: '访问不允许' });
    }
    Article.find({}).lean()
        .then(Article => {
            Article.forEach(ele => {
                ele.content=''
            });
            res.json({ code: 0, data: Article });
        })
})

router.post('/del', passport.authenticate("jwt", { session: false }), (req, res) => {
    // var name = req.query.name;
    var identity = req.user.identity;
    var article_id = req.body.id;
    if (identity == 0) {
        res.json({ code: 11, msg: '访问不允许' });
    }
    Article.findOneAndRemove({ article_id})
        .then(user => res.json({ code: 0, msg: 'ok' }))
})

module.exports = router