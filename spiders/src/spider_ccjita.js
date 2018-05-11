const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const async = require('async');

charset(superagent);


export default class {
    constructor(options) {
        const defaultOpts = {
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
        this.page = opts.page;
        this.limit = opts.limit;
        this.timeout = opts.timeout;
    }

    init() {
        console.log('Spidercc.js')
    }

    async fetchSearchResult(queryString) {
        const detailPageUrls = await this._fetchDetailLinks(queryString);
        console.log(detailPageUrls)
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
     * 获取列表url的所有详情页数据
     * @param url
     * @param page
     * @returns {Promise<void>}
     * @private
     */
    async fetchList() {
        const url = 'http://www.ccguitar.cn/pu_list.htm';
        const detailPageUrls = await this._analyseList(url, this.page);
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
        let detailPageUrl;
        for (let i = 1; i <= page; i++) {
            detailPageUrl = url.replace('.htm', '') + '_0_0_0_0_0_' + i + '.htm';
            const res = await
                superagent
                    .get(url)
                    .charset('gbk');
            const html = res.text;
            const $ = cheerio.load(html);
            $('.imagewall_container.zh_oh .pu_tr .puname a').each((index, el) => {
                let href = $(el).attr('href');
                href = `http://www.ccguitar.cn${href}`;
                result.push(href);
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
        queryString = queryString.replace(/'|"/ig, "");
        queryString = escape(queryString);
        let urls = [];
        let result = [];
        for (let i = 1; i <= this.page; i++) {
            const url = `http://so.ccguitar.cn/tosearch.aspx?searchtype=1&ls=n545c48d898&shows=0&pu_type=0&currentPage=${i}&searchname=${queryString}`;
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
            .timeout(this.timeout)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio.load(html);
        const total = $("#xspace-itemreply").find(".list_searh").length;
        if (!total) {
            typeof cb === 'function' && cb(null, result)
        } else {
            $(".list_searh .pu_title .search_url a").each((index, el) => {
                const href = $(el).attr('href');
                result.push(href)
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
                .timeout(this.timeout)
                .charset('gbk');
        } catch (err) {
            console.log(err);
            typeof cb === 'function' && cb(null);
            return;
        }
        const html = res.text;
        const $ = cheerio.load(html);
        const title = $('#navigation p').text();
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
        const query = song_name;
        const $imgs = $(".swiper-container .swiper-slide img");
        const len = $imgs.length;
        let chord_images = [];
        $(".swiper-container .swiper-slide img").each((index, img) => {
            if (index != 0 || index != len) {
                chord_images.push('http://www.ccguitar.cn' + $(img).attr('src'));
            }
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
            author_name: title.split('>>')[2] || '',
            song_name: title.split('>>')[3] || ''
        }
    }

    async _getSongInfo(name) {
        return await superagent
            .post('http://music.163.com/api/search/pc')
            .timeout(this.timeout)
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
            }).catch(err => {
                console.log(err);
            });
    }

}
