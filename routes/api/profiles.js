const express = require('express');
const router = express.Router();
const keys = require('../../config/keys')

const Profiles = require('../../models/Profiles');

const passport = require('passport')
// const bcrypt = require('bcrypt')
// const gravatar = require('gravatar')

// const jwt = require('jsonwebtoken');

// const passport = require('passport')

// $route GET api/profiles/test
// @desc  返回json
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "Profiles works" })
})


// $route GET api/profiles/
// @desc  返回json
// @access public
router.get('/', passport.authenticate("jwt", { session: false }), (req, res) => {
    Profiles.find()
        .then((profiles) => {
            if (!profiles) {
                return res.status(404).json({ msg: '无内容' })
            } else {
                return res.json(profiles)
            }
        })
        .then(err => res.json(err))
})

// $route GET api/profiles/add
// @desc  返回json
// @access public
router.get('/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    Profiles.findOne({ _id: req.params.id })
        .then((profiles) => {
            if (!profiles) {
                return res.status(404).json({ msg: '无内容' })
            } else {
                return res.json(profiles)
            }
        })
        .catch(err => res.status(404).json(err))
})
// $route POST api/profiles/add
// @desc  返回json
// @access public
router.post('/add', (req, res) => {
    // res.json({ msg: "Profiles works" })
    const newProfiles = {
        type: req.body.type,
        descibe: req.body.descibe,
        income: req.body.income,
        expend: req.body.expend,
        cash: req.body.cash,
        remark: req.body.remark,
    };
    new Profiles(newProfiles).save()
        .then(profiles => res.json({ msg: 'success' }))
})

// $route POST api/profiles/edit
// @desc  返回json
// @access public
router.post('/edit/:id', passport.authenticate("jwt", { session: false }), (req, res) => {

    const newProfiles = {
        type: req.body.type,
        descibe: req.body.descibe,
        income: req.body.income,
        expend: req.body.expend,
        cash: req.body.cash,
        remark: req.body.remark,
    };
    Profiles.findOneAndUpdate({ _id: req.params.id },{$set:newProfiles},{new: true})
    .then(profiles => res.json(profiles))

})

// $route POST api/profiles/delete
// @desc  返回json
// @access public
router.post('/delete/:id', passport.authenticate("jwt", { session: false }), (req, res) => {

    Profiles.findByIdAndRemove({ _id: req.params.id })
    .then(profiles =>{
         profiles.save().then(profiles => res.json(profiles))
    })
    .catch(err => res.status(404).json('删除失败！'))
})
module.exports = router