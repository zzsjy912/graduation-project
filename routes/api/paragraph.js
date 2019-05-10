const express = require('express');
const router = express.Router();
var request = require('request');

const keys = require('../../config/keys')

const Paragraph = require('../../models/Paragraph');
const ParagraphReply = require('../../models/ParagraphReply');
// const UserActive = require('../../models/UserAcive');

const Module_Active = require('../../modules/Module_Active');

const passport = require('passport')


// $route GET api/movieinfo/test
// @desc  返回json
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "Paragraph works" })
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

    async function getLength() {
        return new Promise((resolve, err) => {
            Paragraph.countDocuments({ id: id, type: 'movie' }).then(data => {
                resolve(data);
            })
        })
    };

    async function parentData() {
        return new Promise((resolve, err) => {
            Paragraph.find({ id: id, type: 'movie' }).sort({ date: -1 }).limit(5).lean()
                .then((paragraph) => {
                    resolve(paragraph)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                })
        }).then(paragraph => {
            return paragraph
        })
    }

    async function getParagraph() {
        var data = await parentData();
        var totalnum = await getLength();
        // await childDate(data);
        res.json({ code: 0, data: data, totalnum})
    }
    getParagraph();
})
// $route GET api/movieinfo/:id
// @desc  返回json
// @access public
router.post('/page', passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.body.movie_id;
    var page = req.body.page -1 ;
    async function parentData() {
        return new Promise((resolve, err) => {
            Paragraph.find({ id: id, type: 'movie'}).sort({ date: -1 }).skip(page*5).limit(5).lean()
                .then((paragraph) => {
                    resolve(paragraph)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                })
        }).then(paragraph => {
            return paragraph
        })
    }

    async function getParagraph() {
        var data = await parentData(data);
        var totalnum = data.length;
        // await childDate(data);
        res.json({ code: 0, data: data, totalnum })
    }
    getParagraph();
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
router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({ msg: "Movieinfo works" })

    async function getLength() {
        return new Promise((resolve, err) => {
            Paragraph.countDocuments().then(data => {
                resolve(data);
            })
        })
    };

    async function addDB(newParagraph) {
        return new Promise((resolve, err) => {
            new Paragraph(newParagraph).save()
                .then(paragraph => {
                    resolve(paragraph);
                })
        }).then(paragraph => {
            res.json({ code: 0, msg: 'success', data: paragraph })
        })
    }

    async function add() {
        var paragraph_id = await getLength()+1;
        const newParagraph = {
            paragraph_id: paragraph_id,
            id: req.body.movie_id,
            type: 'movie',
            user_name: req.body.user_name,
            user_avatar: req.body.user_avatar,
            content: req.body.content,
        };
        await addDB(newParagraph);
        
        // 记录操作
        const newUserActive = {
            user_name: newParagraph.user_name,
            type: 'paragraph',
            type_id: paragraph_id
        };
        Module_Active.save(newUserActive)
        
    }
    add()

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


module.exports = router