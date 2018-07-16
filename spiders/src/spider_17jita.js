import userAgent from "./userAgent";
import Spider_proxy from "./spider_proxy";

const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const async = require('async');

charset(superagent);

export default class {
    /**
     * 构造函数
     * @param options:{page：抓取页数, limit：并发数}
     */
    constructor(options) {
        const defaultOpts = {
            start: 1,
            page: 1,
            limit: 5,
            timeout: 3000
        };
        let opts = defaultOpts;
        if (options) {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    opts[key] = options[key];
                }
            }
        }
        this.start = parseInt(opts.start);
        this.page = parseInt(opts.page);
        this.limit = parseInt(opts.limit);
        this.timeout = parseInt(opts.timeout);
    }

    /**
     * 获取详情页数据
     * @param url
     * @returns {Promise<{song_name: *, author_name: T.author_name, song_poster: T.song_poster, chord_images: jQuery[], query: *, view_count: number, collect_count: number, search_count: number}>}
     * @private
     */
    async _fetchDetail(url, cb) {
        let res;
        try {
            res = await superagent
                .get(url)
                .timeout(2000)
                .set({'User-Agent': userAgent.getRandom()})
                .charset('gbk');
        } catch (err) {
            cb(null);
            return;
        }
        const html = res.text;
        const $ = cheerio.load(html);
        const title = $('h1.ph').text();
        const song_name = this._analyseTitle(title);
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
        console.log('ok')
        const query = song_name;
        const imgs = Array.prototype.slice.call($('#article_contents img'));
        let chord_images = imgs.map((el) => {
            return $(el).attr('src');
        });
        let keyword = [query]
        const view_count = "0";
        const collect_count = "0";
        const search_count = "0";
        const status = "0";
        const data = {
            song_name,
            author_name,
            song_poster,
            query,
            keyword: JSON.stringify(keyword),
            view_count,
            collect_count,
            search_count,
            status,
            chord_images: JSON.stringify(chord_images)
        };
        if (data.song_name) {
            typeof cb === 'function' && cb(null, data);
        }else{
            cb(null)
        }
        console.log(`**结束抓取${url}**`);
    }

    /**
     * 调网易API获取歌曲封面、歌手
     * @param name
     * @returns {Promise<T>}
     * @private
     */
    async _getSongInfo(name) {
        try {
            return await superagent
                .post('http://music.163.com/api/search/pc')
                .timeout(2000)
                .set({'User-Agent': userAgent.getRandom()})
                .type('form')
                .send({
                    s: name,
                    type: '1'
                }).then(res => {
                    res = JSON.parse(res.text);
                    const songs = res.result && res.result.songs;
                    if (songs && songs.length) {
                        return {
                            song_poster: songs[0].album.picUrl,
                            author_name: songs[0].artists[0].name
                        }
                    } else {
                        return {song_poster: '', author_name: ''}
                    }
                })
        } catch (err) {
            console.log(err);
            return {song_poster: '', author_name: ''}
        }

    }

    /**
     * 分析title字段提取歌曲名
     * @param title
     * @returns {*|string}
     * @private
     */
    _analyseTitle(title) {
        const regExp = [
            /\《([\S]+)\》/,
            /([\w\W]+)吉他谱/
        ];
        let match = title.match(regExp[0]);
        if (match) {
            return match[1] || ''
        } else {
            match = title.match(regExp[1]);
            return match && match[1] || ''
        }
    }

    /**
     * 获取列表url的所有详情页数据
     * @param url
     * @param page
     * @returns {Promise<void>}
     * @private
     */
    async fetchList() {
        const url = 'https://www.17jita.com/tab/index.php';
        const detailPageUrls = await this._analyseList(url, this.page);
        console.log(detailPageUrls)
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

    /**
     * 获取top100列表数据
     * @returns {Promise<any>}
     */
    async fetchTop100List() {
        const url = 'https://www.17jita.com/tab/topic/top100.html';
        const detailPageUrls = await this._analyseTop100List(url);
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

    /**
     * 分析单页列表页从而获取详情页urls
     * @param url 列表页url
     * @param page
     * @returns {Promise<Array>}
     * @private
     */
    async _analyseList(url, page) {
        let result = [];
        let listpageUrl;
        for (let i = this.start; i < this.start + page; i++) {
            listpageUrl = `${url}?page=${i}`;
            let res;
            try {
                res = await
                    superagent
                        .get(listpageUrl)
                        .set({'User-Agent': userAgent.getRandom()})
                        .charset('gbk');
            } catch (err) {
                return []
            }

            const html = res.text;
            const $ = cheerio.load(html);
            $('.bbs.cl dt a').each((index, el) => {
                const id = $(el).attr('href').match(/\d+/);
                const href = `https://www.17jita.com/tab/whole_${id}.html`;
                result.push(href)
            });
        }
        return result;
    }

    /**
     * 分析top100列表页从而获取详情页urls
     * @param url top100列表页url
     * @returns {Promise<Array>}
     * @private
     */
    async _analyseTop100List(url) {
        let result = [];
        const res = await
            superagent
                .get(url)
                .set({'User-Agent': userAgent.getRandom()})
                .charset('gbk');
        const html = res.text;
        const $ = cheerio.load(html);
        $('#article_content ul li').each((index, el) => {
            const id = $(el).find('a').eq(1).attr('href').match(/\d+/);
            const href = `https://www.17jita.com/tab/whole_${id}.html`;
            result.push(href)
        });
        return result;
    }

};
