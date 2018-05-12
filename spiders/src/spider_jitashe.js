import userAgent from "./userAgent";
import Spider_proxy from "./spider_proxy";

const superagent = require('superagent');
const superagentProxy = require('superagent-proxy');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const async = require('async');
const proxyServers = new Spider_proxy().getServers();

superagentProxy(superagent);
charset(superagent);

export default class {
    constructor(options) {
        const defaultOpts = {
            start: 1,
            page: 1,
            limit: 5,
            timeout: 4000
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

    init() {
        console.log('Spidercc.js')
    }

    async fetchSearchResult(queryString) {
        const detailPageUrls = await this._fetchDetailLinks(queryString);
        return new Promise((resolve, reject) => {
            async.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                if (url) {
                    console.log(`**开始抓取${url}**`);
                    this._fetchDetail(url, cb);
                }
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
     * 获取最新列表url的所有详情页数据
     * @param url
     * @param page
     * @returns {Promise<void>}
     * @private
     */
    async fetchNewList() {
        const url = 'http://www.jitashe.org/guide/newtab';
        const detailPageUrls = await this._analyseList(url, this.page);
        return new Promise((resolve, reject) => {
            async.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    data = data.filter(song => {
                        return !!song
                    });
                    resolve(data)
                }
            });
        })
    }

    /**
     * 获取热门url的所有详情页数据
     * @param url
     * @param page
     * @returns {Promise<void>}
     * @private
     */
    async fetchHotList() {
        const url = 'http://www.jitashe.org/guide/hottab';
        const detailPageUrls = await this._analyseList(url, this.page);
        // return;
        return new Promise((resolve, reject) => {
            async.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    data = data.filter(song => {
                        return !!song
                    });
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
            listpageUrl = `${url}/${i}/`;
            const res = await
                superagent
                    .get(listpageUrl)
                    .set({'User-Agent': userAgent.getRandom()});
            const html = res.text;
            const $ = cheerio.load(html);
            $('.tab-list .tab-item').each((index, el) => {
                const type = $(el).find(".taglist .tabtype").text().trim();
                if (type === '图片谱') {
                    let href = $(el).find(".text .title").attr('href');
                    href = `http://www.jitashe.org${href}`;
                    result.push(href);
                }
            });
        }
        return result;
    }

    /**
     * 根据查询字符串获取搜索详情页的链接
     * @param queryString
     * @returns {Promise<any>}
     * @private
     */
    async _fetchDetailLinks(queryString) {
        queryString = encodeURIComponent(queryString)
        let urls = [];
        let result = [];
        for (let i = this.start; i < this.start + this.page; i++) {
            const url = `http://www.jitashe.org/search/tab/${queryString}/${i}/`;
            urls.push(url)
        }
        return new Promise((resolve, reject) => {
            async.mapLimit(urls, this.limit, (url, cb) => {
                this._analyseSearchLinks(url, cb)
            }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    data.forEach(urls => {
                        result = result.concat(urls)
                    });
                    resolve(result)
                }
            });
        })
    }

    /**
     * 分析出搜索链接
     * @param url
     * @param cb
     * @returns {Promise<void>}
     * @private
     */
    async _analyseSearchLinks(url, cb) {
        let result = [];
        const res = await superagent
            .get(url)
            .set({'User-Agent': userAgent.getRandom()})
            .timeout(this.timeout)
        const html = res.text;
        const $ = cheerio.load(html);
        const total = $(".tab-list").find(".tab-item").length;
        if (!total) {
            typeof cb === 'function' && cb(null, result)
        } else {
            $('.tab-list .tab-item').each((index, el) => {
                const type = $(el).find(".taglist .tabtype").text().trim();
                if (type === '图片谱') {
                    let href = $(el).find(".text .title").attr('href');
                    href = `http://www.jitashe.org${href}`;
                    result.push(href);
                }
            });
            typeof cb === 'function' && cb(null, result)
        }
    }

    /**
     * 获取吉他谱详情
     * @param url
     * @param cb
     * @returns {Promise<void>}
     * @private
     */
    async _fetchDetail(url, cb) {
        let res;
        try {
            res = await superagent
                .get(url)
                .set({'User-Agent': userAgent.getRandom()})
                .timeout(this.timeout)
        } catch (err) {
            console.log(err);
            typeof cb === 'function' && cb(null);
            return;
        }
        const html = res.text;
        const $ = cheerio.load(html);
        const title = $('#pt .z').text();
        const {song_name, author_name} = this._analyseTitle(title);
        /*typeof cb === 'function' && cb(null, song_name);
        return;*/
        let song_poster;
        try {
            const songInfo = await this._getSongInfo(song_name);
            song_poster = songInfo.song_poster;
        } catch (err) {
            typeof cb === 'function' && cb(null);
            return;
        }
        const query = song_name.replace(/\([\s\S]*\)?/, '');
        const $imgs = $("#postlist .imgtab a img");
        let chord_images = [];
        $imgs.each((index, img) => {
            chord_images.push($(img).attr('src'));
        });
        const view_count = [parseInt(Math.random() * 100)].toString();
        const collect_count = "0";
        const search_count = [parseInt(Math.random() * 100)].toString();
        const data = {
            song_name,
            author_name,
            song_poster,
            query,
            view_count,
            collect_count,
            search_count,
            chord_images: JSON.stringify(chord_images)
        };
        typeof cb === 'function' && cb(null, data);
        console.log(`**结束抓取${url}**`);
    }

    /**
     * 分析吉他谱标题
     * @param title
     * @returns {{author_name: *|string|string, song_name: *|string|string}}
     * @private
     */
    _analyseTitle(title) {
        return {
            author_name: title.split('›')[2] && title.split('›')[2].replace(/\s/g, '') || '',
            song_name: title.split('›')[3] && title.split('›')[3].replace(/\s/g, '') || ''
        }
    }

    async _getSongInfo(name) {
        const proxyServer = proxyServers[Math.floor(proxyServers.length * Math.random())];
        return await superagent
            .post('http://music.163.com/api/search/pc')
            // .proxy(proxyServer)
            .set({'User-Agent': userAgent.getRandom()})
            .timeout(this.timeout)
            .type('form')
            .send({s: name, type: 1}).then(res => {
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
            }).catch(err => {
                console.log(err);
                return {song_poster: '', author_name: ''}
            });
    }

}
