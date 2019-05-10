const express = require('express');
const router = express.Router();
var request = require('request');
const keys = require('../../config/keys')

const BoxOffice = require('../../models/BoxOffice');
const passport = require('passport');

// $route GET api/boxoffice/test
// @desc  返回json
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: "BoxOffice works" })
})

router.get('/cn', passport.authenticate("jwt", { session: false }), (req, res) => {

    async function getBoxDate() {
        //神箭手api
        return new Promise((resolve) => {
            var options = keys.doubanOptions.cnBoxUrl;
            request(options, (err, res1, body) => {
                var info = JSON.parse(body);
                resolve(info.data)

            })
        })

    }

    async function getMovieID(item) {
        var movieName = encodeURI(item.MovieName);
        var options = {
            url: keys.doubanOptions.searchUrl + movieName,
            headers: {
                'Content-Type': 'text/html,application/xhtml+xml,application/xml,charset=utf-8',
            }
        };
        return new Promise((resolve => {
            request(options, (err, res1, body) => {
                var info = JSON.parse(body);
                if (info[0].hasOwnProperty('id')) {
                    item.id = info[0].id;
                    resolve(item)
                }
                
            })
        }))
    }

    async function getDate() {
        var boxDate = await getBoxDate();
        for (let i = 0; i < boxDate.length-1; i++) {
            const ele = boxDate[i];
            await getMovieID(ele)
        }
        boxDate = boxDate.slice(0,-1);
        res.json({ code: 0, data: boxDate })
    }
    getDate()
})

router.get('/us', passport.authenticate("jwt", { session: false }), (req, res) => {

    async function getBoxDate() {
        //豆瓣api
        return new Promise((resolve) => {
            var options = keys.doubanOptions.usBoxUrl;
            request(options, (err, res1, body) => {
                var info = JSON.parse(body);
                resolve(info)

            })
        })

    }

    async function getDate() {
        var boxDate = await getBoxDate();
        for (let i = 0; i < boxDate.subjects.length; i++) {
            const element = boxDate.subjects[i];
            element.box = (element.box/10000).toFixed(2)
        }
        res.json({ code: 0, data: boxDate })
    }
    getDate()
})

module.exports = router