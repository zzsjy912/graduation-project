const express = require('express');
const router = express.Router();
var request = require('request');

const keys = require('../../config/keys')

const Paragraph = require('../../models/Paragraph');

const Article = require('../../models/Article');
const ArticleReply = require('../../models/ArticleReply');
// const UserActive = require('../../models/UserAcive');

const Module_Active = require('../../modules/Module_Active');
const Module_Message = require('../../modules/Module_Message');

const passport = require('passport')


router.get('/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;

    async function getLength() {
        return new Promise((resolve, err) => {
            Paragraph.countDocuments({ id: id, type: 'article' }).then(data => {
                resolve(data);
            })
        })
    };

    async function parentData() {
        return new Promise((resolve, err) => {
            Paragraph.find({ id: id, type: 'article' }).sort({ date: -1 }).lean()
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
        res.json({ code: 0, data: data, totalnum })
    }
    getParagraph();
})


router.post('/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({ msg: "Movieinfo works" })

    async function getLength() {
        return new Promise((resolve, err) => {
            Paragraph.countDocuments({}).then(data => {
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

    async function getReplyUser(article_id) {
        return new Promise(resolve => {
            Article.findOne({ article_id}).lean()
                .then(article => {
                    let user ={};
                    user.name = article.user_name;
                    user.avatar = article.user_avatar;
                    resolve(user)
                })
        })
    }

    async function add() {
        var paragraph_id = await getLength() + 1;
        const newParagraph = {
            paragraph_id: paragraph_id,
            type: 'article',
            id: req.body.article_id,
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

        var replyUser = await getReplyUser(newParagraph.id);
        const newMessage = {
            user_name: newParagraph.user_name,
            user_avatar: newParagraph.user_avatar,
            reply_name: replyUser.name,
            reply_avatar: replyUser.avatar,
            type: 'article',
            type_id: paragraph_id,
            content:newParagraph.content,
            
        }
        Module_Active.save(newUserActive);
        Module_Message.save(newMessage);
    }
    add()

})

router.post('/reply/add', passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({ msg: "Movieinfo works" })

    async function getLength() {
        return new Promise((resolve, err) => {
            ParagraphReply.countDocuments({}).then(data => {
                resolve(data);
            })
        })
    };

    async function addDB(newParagraphReply) {
        return new Promise((resolve, err) => {
            new ParagraphReply(newParagraphReply).save()
                .then(paragraph => {
                    resolve(paragraph);
                })
        }).then(paragraph => {
            res.json({ code: 0, msg: 'success', data: paragraph })
        })
    }

    async function add() {
        var paragraphReply_id = await getLength() + 1;
        const newParagraphReply = {
            paragraphReply_id: paragraphReply_id,
            paragraph_id: req.body.paragraph_id,
            user_name: req.body.user_name,
            user_avatar: req.body.user_avatar,
            reply_name: req.body.reply_name,
            reply_avatar: req.body.reply_avatar,
            content: req.body.content,
        };
        await addDB(newParagraphReply);

        // 记录操作
        const newUserActive = {
            user_name: newParagraphReply.user_name,
            type: 'articleReply',
            type_id: paragraphReply_id
        };
        Module_Active.save(newUserActive);

        const newMessage = {
            user_name: newParagraphReply.user_name,
            user_avatar: newParagraphReply.user_avatar,
            reply_name: newParagraphReply.reply_name,
            reply_avatar: newParagraphReply.reply_avatar,
            type: 'paragraphReply',
            type_id: paragraphReply_id,
            content: newParagraphReply.content,
        }
        Module_Message.save(newMessage);
    }
    add()

})

router.get('/reply/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;

    async function getLength() {
        return new Promise((resolve, err) => {
            ParagraphReply.countDocuments({ paragraph_id: id }).then(data => {
                resolve(data);
            })
        })
    };

    async function parentData() {
        return new Promise((resolve, err) => {
            ParagraphReply.find({ paragraph_id: id }).sort({ date: -1 }.lean()
                .then((paragraphreply) => {
                    resolve(paragraphreply)
                })
                .catch(err => {
                    res.json({ code: 11, msg: '查询失败' })
                }))
        }).then(paragraphreply => {
            return paragraphreply
        })
    }

    async function getParagraphReply() {
        var data = await parentData();
        var totalnum = await getLength() + 1;
        // await childDate(data);
        res.json({ code: 0, data: data, totalnum })
    }
    getParagraphReply();
})

module.exports = router