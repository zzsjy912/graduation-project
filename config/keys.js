module.exports = {
    mongoURI:"mongodb://47.94.194.153:27017",
    secretOrkey: "secret",
    doubanOptions: {
        movieUrl: 'https://api.douban.com/v2/movie/subject/',
        theatersUrl:'https://api.douban.com/v2/movie/in_theaters',
        searchUrl: 'https://movie.douban.com/j/subject_suggest?q=',
        cnBoxUrl:'https://api.shenjian.io/?appid=5b06c9b972c9896b070f01cbd12a3fea',
        usBoxUrl:'https://api.douban.com/v2/movie/us_box',
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Transfer-Encoding': 'chunked'
        }
    }
}