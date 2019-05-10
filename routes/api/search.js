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

// $route GET api/movieinfo/:id
// @desc  返回json
// @access public
router.get('/subject_suggest', passport.authenticate("jwt", { session: false }), (req, res) => {
    var q = req.query.q;
    q = encodeURI(q)
    var options = {
        url: keys.doubanOptions.searchUrl +q,
        headers: {
            'Content-Type': 'text/html,application/xhtml+xml,application/xml,charset=utf-8',
        }
    }
    request(options, (err, res1, body) => {
        var info = JSON.parse(body);
         
        if (info){
            res.json({ code: 0, data: info })
        } else {
            return res.json({ code: 11, msg: err })
        }
    })

})




module.exports = router