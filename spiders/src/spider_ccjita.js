const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const async = require('async');

charset(superagent);


export default class {
    constructor(options) {
        const defaultOpts = {
            page: 1,
            limit: 5
        };
        let opts = defaultOpts;
        if (options) {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    opts[key] = options[key];
                }
            }
        }
        this.page = opts.page;
        this.limit = opts.limit;
    }

    init() {
        console.log('Spidercc.js')
    }

    async fetchSearchResult(queryString) {
        const detailPageUrls = await this._fetchDetailLinks(queryString);
        return new Promise((resolve, reject) => {
            async.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            });
        })
    }

    async _fetchDetailLinks(queryString) {
        queryString = queryString.replace(/'|"/ig, "");
        queryString = escape(queryString);
        let urls = [];
        let result = [];
        for (let i = 1; i <= this.page; i++) {
            const url = `http://so.ccguitar.cn/tosearch.aspx?searchtype=1&ls=n545c48d898&shows=0&pu_type=0&currentPage=${i}&searchname=${queryString}`;
            urls.push(url)
        }
        return new Promise((resolve,reject)=>{
            async.mapLimit(urls, this.limit, (url, cb) => {
                this._analyseSearchLinks(url, cb)
            }, (err, data) => {
                if(err){
                    reject(err)
                }else{
                    data.forEach(urls=>{
                        result = result.concat(urls)
                    });
                    resolve(result)
                }
            });
        })
    }

    async _analyseSearchLinks(url,cb) {
        let result = [];
        const res = await superagent
            .get(url)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio.load(html);
        const total = $("#xspace-itemreply").find(".list_searh").length;
        if (!total) {
            typeof cb === 'function' && cb(null)
        } else {
            $(".list_searh .pu_title .search_url a").each((index,el)=>{
                const href = $(el).attr('href');
                result.push(href)
            });
            typeof cb === 'function' && cb(null, result)
        }
    }

    async _fetchDetail(url, cb) {
        const res = await superagent
            .get(url)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio.load(html);
        const title = $('#navigation p').html();
        const song_name = await this._analyseTitle(title);
        typeof cb === 'function' && cb(null, song_name);
        return;
        let song_poster;
        let author_name;
        try {
            const songInfo = await this._getSongInfo(song_name);
            song_poster = songInfo.song_poster;
            author_name = songInfo.author_name;
            console.log(author_name, 1111111)
        } catch (err) {
            cb(null);
            return;
        }
        const query = song_name;
        const imgs = Array.prototype.slice.call($('#article_contents img'));
        const chord_images = imgs.map((el) => {
            return $(el).attr('src');
        });
        const view_count = 0;
        const collect_count = 0;
        const search_count = 0;
        const data = {
            song_name,
            author_name,
            song_poster,
            chord_images,
            query,
            view_count,
            collect_count,
            search_count
        };
        typeof cb === 'function' && cb(null, data);
        console.log(`$$结束抓取${url}$$`);
    }

    _analyseTitle(title) {
        const regExp = [
            /\《([\S]+)\》/,
            />>[\u4e00-\u9fa5]+/
        ];
        let match = title.match(regExp[0]);
        if (match) {
            return match[1] || ''
        } else {
            match = title.match(regExp[1]);
            return match && match[0] || ''
        }
    }

}
