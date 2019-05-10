// login & register
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs')
// const gravatar = require('gravatar')

const fs = require('fs')
const multer = require('multer');
const avatarUpload = multer({ dest: 'public/tem_avatar/' });

const keys = require('../../config/keys')

const jwt = require('jsonwebtoken');
const passport = require('passport')

router.post(
    '/addavatar',
    avatarUpload.single('avatar'),
    (req, res) => {
        console.log(req.file);
        fs.rename(req.file.path, 'public/avatar/' + req.file.originalname, function (err) {
            if (err) {
                throw err
            }
            console.log("上传成功");

        })

        var url = 'http://47.94.194.153:5000/avatar/' + req.file.originalname
        res.json({ code: 0, data: { url: url } })

    }
);

// $route GET api/users/test
// @desc  返回json
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "login works" })
})

// $route POST api/users/register
// @desc  返回json
// @access public
router.post('/register', (req, res) => {
    console.log(req.body);

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ email: '邮箱已被注册' })
            } else {
                // var avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: req.body.avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
})

// $route POST api/users/login
// @desc  返回token jwt passport
// @access public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: '用户不存在' })
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //   res.json({mgs:'success'})
                        const rule = {
                            id: user.id,
                            name: user.name,
                            identity: user.identity
                        }
                        const data = {
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                            data: user.data,
                            identity: user.identity,
                            isban:user.isban
                        }
                        jwt.sign(rule, keys.secretOrkey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token,
                                data
                            })
                        })
                    } else {
                        return res.status(400).json({ msg: '密码错误' })
                    }

                })
        })
})

// $route GET api/users/current
// @desc  返回 current user
// @access private
router.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity,
    });
})

router.post('/changePassWord', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const newPassWord = req.body.newPassWord;
    //查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ msg: '用户不存在' })
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {

                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(newPassWord, salt, (err, hash) => {
                                if (err) {
                                    throw err
                                }
                                User.findOneAndUpdate({ email }, { $set: { password:hash} }, { new: true })
                                    .then(profiles => res.json({code:0,msg:'修改成功'}))
                            });
                        });
                        
                    } else {
                        return res.status(400).json({ msg: '密码错误' })
                    }

                })
        })
})

router.get('/info', passport.authenticate("jwt", { session: false }), (req, res) => {
    var name = req.query.name;
    User.findOne({ name }).lean()
        .then( userInfo => {
            let data = {
                name: userInfo.name,
                email:userInfo.email,
                avatar:userInfo.avatar
            }
            res.json({ code: 0, data: userInfo||[]});
        } )
})

router.post('/list', passport.authenticate("jwt", { session: false }), (req, res) => {
    // var name = req.query.name;
    var identity = req.user.identity;
    if (identity == 0) {
        res.json({ code: 11, msg: '访问不允许'});
    }
    User.find({}).lean()
        .then(userInfo => {
            res.json({ code: 0, data: userInfo });
        })
})

router.post('/ban', passport.authenticate("jwt", { session: false }), (req, res) => {
    var nameBan = req.body.name;
    var current = req.body.current==0?1:0;

    var identity = req.user.identity;
    if (identity == 0) {
        res.json({ code: 11, msg: '访问不允许' });
    }
    User.findOneAndUpdate({ name: nameBan }, { $set: { isban: current } }).then(user => res.json({ code: 0, msg: 'ok' }))
})

module.exports = router