module.exports = {
    mongoURI: "mongodb://47.94.194.153:27017",
    secretOrkey: "secret",
    doubanOptions: {
        movieUrl: 'https://api.douban.com/v2/movie/subject/',
        searchUrl: 'https://movie.douban.com/j/subject_suggest',
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
            'Access-Control-Allow-Credentials': true
        }

    }
}