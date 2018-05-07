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

    /**
     * 获取详情页数据
     * @param url
     * @returns {Promise<{song_name: *, author_name: T.author_name, song_poster: T.song_poster, chord_images: jQuery[], query: *, view_count: number, collect_count: number, search_count: number}>}
     * @private
     */
    async _fetchDetail(url, cb) {
        const res = await superagent
            .get(url)
            .charset('gbk');
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

    /**
     * 调网易API获取歌曲封面、歌手
     * @param name
     * @returns {Promise<T>}
     * @private
     */
    async _getSongInfo(name) {
        return await superagent
            .post('http://music.163.com/api/search/pc')
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
        for (let i = 1; i <= page; i++) {
            url = `${url}?page=${i}`;
            const res = await
                superagent
                    .get(url)
                    .charset('gbk');
            const html = res.text;
            const $ = cheerio.load(html);
            $('.bbs.cl .xs3 a').each((index, el) => {
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

}