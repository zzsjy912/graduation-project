const express = require('express');
const router = express.Router();

const Notice = require('../../models/Notice');
const ArticleReply = require('../../models/ArticleReply');
// const UserActive = require('../../models/UserAcive');

const Module_Active = require('../../modules/Module_Active');

const passport = require('passport')


router.get('/test', (req, res) => {
    res.json('sucess')
})

router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({ msg: "Movieinfo works" })

    async function getLength() {
        return new Promise((resolve, err) => {
            Notice.countDocuments({}).then(data => {
                resolve(data);
            })
        })
    };

    async function addDB(newNotice) {
        return new Promise((resolve, err) => {
            new Notice(newNotice).save()
                .then(Notice => {
                    resolve(Notice);
                })
        }).then(Notice => {
            res.json({ code: 0, msg: 'success', data: Notice })
        })
    }

    async function add() {
        var id = await getLength() + 1;
        const newNotice = {
            id,
            user_name: req.user.name,
            content: req.body.content
        };
        await addDB(newNotice);

    }
    add()

})

router.post('/list', passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({ msg: "Movieinfo works" })
    async function getDate() {
        return new Promise((resolve, err) => {
            Notice.find({}).sort({ date: -1 }).lean()
                .then(Notice => {
                    resolve(Notice);
                })
        }).then(data => {
            res.json({ code: 0, msg: 'success', data })
        })
    }
    getDate()
})
router.post('/new', passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({ msg: "Movieinfo works" })
    async function getDate() {
        return new Promise((resolve, err) => {
            Notice.find({}).sort({ date: -1 }).limit(1).lean()
                .then(Notice => {
                    resolve(Notice[0]);
                })
        }).then(data => {
            res.json({ code: 0, msg: 'success', data })
        })
    }


    getDate()

})
module.exports = router