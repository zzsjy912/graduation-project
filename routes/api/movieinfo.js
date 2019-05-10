const express = require('express');
const router = express.Router();
var request = require('request');

const keys = require('../../config/keys')

const Movieinfo = require('../../models/Movieinfo');

const passport = require('passport')


// $route GET api/movieinfo/test
// @desc  返回json
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "Movieinfo works" })
})


// $route GET api/movieinfo/
// @desc  返回json
// @access public
router.get('/', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ code: 11, msg: '电影ID错误' })
})

// $route GET api/movieinfo/:id
// @desc  返回json
// @access public
router.get('/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;
    if (!id) {
        return res.json({ code: 11, msg: 'id bug' })
    }
    Movieinfo.findOne({ id: req.params.id })
        .then((movieinfo) => {
            if (!movieinfo) {
                // return res.status(404).json({ msg: '无内容' })
                var options = {
                    url: keys.doubanOptions.movieUrl + id,
                    headers: keys.doubanOptions.headers
                }
                // 查询豆瓣api
                request(options, (err, res1, body) => {
                    var info = JSON.parse(body);
                    if (info.code == 112) {
                        res.json({ code: 11, msg: '超出API请求速率' })
                        return
                    }
                    if (info.code != 5000) {
                        const newmovieinfo = new Movieinfo({
                            id: info.id,
                            title: info.title,
                            aka: info.aka,
                            year: info.year,
                            countries: info.countries,
                            original_title: info.original_title,
                            genres: info.genres,
                            directors: info.directors,
                            casts: info.casts,
                            images: info.images,
                            summary: info.summary,
                            reviews_count: 1
                        })
                        // 储存到本地服务器
                        newmovieinfo.save()
                            .then(movieinfo => res.json({code:0,data:movieinfo}))
                            .catch(err => console.log(err))
                    } else {
                        res.json({ code: 11, msg: '不存在此电影' })
                    }

                })

            } else {
                Movieinfo.findOneAndUpdate({ id: id }, { $inc: { reviews_count: 1 } }, { new: true })
                    .then(movieinfo => res.json({ code: 0, data: movieinfo  }))
            }
        })
        .catch(err => {
            res.json({ code: 11, msg: '查询失败' })
        })
})

// $route POST api/movieinfo/update:id
// @desc  返回json 想看，点赞
// @access public

router.post('/update/:id', passport.authenticate("jwt", { session: false }), (req, res) => {

    const newMovieinfo = {
        type: req.body.type,
        descibe: req.body.descibe,
        income: req.body.income,
        expend: req.body.expend,
        cash: req.body.cash,
        remark: req.body.remark,
    };
    Movieinfo.findOneAndUpdate({ _id: req.params.id }, { $set: newMovieinfo }, { new: true })
        .then(movieinfo => res.json(movieinfo))
})

// $route POST api/movieinfo/add
// @desc  返回json
// @access public
router.post('/add', (req, res) => {
    // res.json({ msg: "Movieinfo works" })
    const newMovieinfo = {
        id: req.body.id,
        title: req.body.title,
        aka: req.body.aka,
        year: req.body.year,
        countries: req.body.countries,
        genres: ireq.bodygenres,
        directors: req.body.directors,
        casts: req.body.casts,
        images: req.body.images,
        summary: req.body.summary
    };
    new Movieinfo(newMovieinfo).save()
        .then(movieinfo => res.json({ code: 0,msg: 'success' }))
})

// $route POST api/movieinfo/edit
// @desc  返回json
// @access public
router.post('/edit/:id', passport.authenticate("jwt", { session: false }), (req, res) => {

    const newMovieinfo = {
        type: req.body.type,
        descibe: req.body.descibe,
        income: req.body.income,
        expend: req.body.expend,
        cash: req.body.cash,
        remark: req.body.remark,
    };
    Movieinfo.findOneAndUpdate({ _id: req.params.id }, { $set: newMovieinfo }, { new: true })
        .then(movieinfo => res.json(movieinfo))

})

// $route POST api/movieinfo/delete
// @desc  返回json
// @access public
router.post('/delete/:id', passport.authenticate("jwt", { session: false }), (req, res) => {

    Movieinfo.findByIdAndRemove({ _id: req.params.id })
        .then(movieinfo => {
            movieinfo.save().then(movieinfo => res.json(movieinfo))
        })
        .catch(err => res.status(404).json('删除失败！'))
})

router.post('/list', passport.authenticate("jwt", { session: false }), (req, res) => {

    Movieinfo.find({})
        .then(list => {
            res.json({ code: 0, data: list })
        })
        .catch(err => res.status(404).json('删除失败！'))
})



module.exports = router