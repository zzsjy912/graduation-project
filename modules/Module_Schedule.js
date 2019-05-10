const schedule = require('node-schedule');
const Movieinfo = require('../models/Movieinfo');
const Article = require('../models/Article');
const InTheaters = require('../models/InTheaters');

var request = require('request');


const Module_Schedule = {
    name: 'Module_Schedule',
    Rating: function () {
        async function getitem() {
            return new Promise((reslove, err) => {
                Movieinfo.find({}).lean().then(items => {
                    reslove(items);
                })
            })
        }

        async function getRatingItems(ele) {
            return new Promise((reslove, err) => {
                Article.find({ movie_id: ele.id }).lean().then(items => {
                    var rating = 0;
                    var result = {
                        rating:0,
                        rating_count:0,
                    };
                    if (items.length == 0) {
                        reslove(result)
                    }
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        rating += item.rating;
                    }
                    
                    result.rating = (rating / items.length).toFixed(1) || 0;
                    result.rating_count = items.length;
                    reslove(result);
                })
            })
        }

        async function setRating(id, rating, rating_count) {
            return new Promise((reslove, err) => {
                Movieinfo.findOneAndUpdate({ id }, { $set: { rating: { user: '1', average: String(rating) }, rating_count: rating_count } }, { new: true })
                    .then(movie => console.log('ok'))
            })
        }

        async function getDate() {
            var items = await getitem();
            for (let i = 0; i < items.length; i++) {
                const ele = items[i];
                var result = await getRatingItems(ele);
                if (result.rating_count != 0) {
                    await setRating(ele.id, result.rating, result.rating_count);
                }
                
            }
        }

        getDate()
    },
    Theaters: function () {
        async function getNew() {
            var options = {
                url: keys.doubanOptions.theatersUrl,
                headers: {
                    'Content-Type': 'text/html,application/xhtml+xml,application/xml,charset=utf-8',
                }
            }
            request(options, (err, res1, body) => {
                var info = JSON.parse(body);
                var newList = new InTheaters({
                    subjects: info.subjects
                })
                newList.save()
                    .then(newList => console.log(newList))
            })
        }
        getNew()
    },
    runRating: function () {
        var rule = new schedule.RecurrenceRule();
        rule.minute = [5,10,15,20,25,30,35,40,45,50,55,60];
        const runRatingCronstyle = () => {
            //第5分钟定时执行一次:
            schedule.scheduleJob(rule, () => {
                console.log('runRatingCronstyle:' + new Date());
                this.Rating()
            });
        }
        runRatingCronstyle();
    },
    runTheaters: function () {
        var rule = new schedule.RecurrenceRule();
        rule.hour = 9;
        const runTheatersCronstyle = () => {
            //每分钟的第30秒定时执行一次:
            schedule.scheduleJob(rule, () => {
                console.log('runTheatersCronstyle:' + new Date());
                this.Rating()
            });
        }
        runTheatersCronstyle();
    }
}


module.exports = Module_Schedule;