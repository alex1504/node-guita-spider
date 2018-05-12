'use strict';

const USER_AGENT = [
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0) ,Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre',
    'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
    'Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
    'Opera/9.25 (Windows NT 5.1; U; en), Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
];

const userAgent = {
    getRandom(){
        return Math.floor(Math.random()*USER_AGENT.length)
    }
};

const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const superagentProxy = require('superagent-proxy');
const cheerio = require('cheerio');

superagentProxy(superagent);

class Spider_proxy {
    /**
     * type: 1 获取高匿代理  2：获取普通代理
     * @param options
     */
    constructor(options) {
        const defaultOpts = {
            page: 5,
            timeout: 4000,
            type: 2
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
        this.timeout = opts.timeout;
        this.url = this.type === 1 ? 'http://www.xicidaili.com/nn' : 'http://www.xicidaili.com/nt/';
    }

    /**
     * 获取西刺代理可用服务器
     * @returns {Promise<Array>}
     */
    async _fetchAllServers() {
        let result = [];
        let url = this.url;
        let res;
        for (let i = 1; i <= this.page; i++) {
            url = `${url}/${i}`;
            try {
                res = await superagent
                    .get(url)
                    .timeout(this.timeout)
                    .set({'User-Agent': userAgent.getRandom()});
            } catch (err) {
                console.log(err);
            }
            const html = res.text;
            const $ = cheerio.load(html);
            $("#ip_list .odd").each((index, el) => {
                const host = $(el).find('td').eq(1).text();
                const port = $(el).find('td').eq(2).text();
                const protocol = $(el).find('td').eq(5).text().toLowerCase();
                result.push(`${protocol}://${host}:${port}`);
            });
        }
        return result;
    }

    /**
     * 通过请求筛选稳定的代理服务器，设置timeout为1秒
     * @returns {Promise<Array>}
     */
    async _fetchAvailableServers() {
        let result = [];
        const servers = await this._fetchAllServers();
        for (let i = 0; i < servers.length; i++) {
            try {
                /*await superagent.post(`http://music.163.com/api/search/pc`)
                    .timeout(1000)
                    .proxy(servers[i])
                    .set({'User-Agent': userAgent.getRandom()})
                    .type('form')
                    .send({s: '周杰伦', type: 1});*/
                result.push(servers[i]);
            } catch (err) {
                console.log(err);
            }
        }
        return result;
    }

    /**
     * 获取可用代理服务器
     * @returns {Promise<*>}
     */
    async fetchServers() {
        let result;
        const now = Date.now();
        const filePath = path.join(__dirname, '../data', 'proxy.json');
        const isExist = fs.existsSync(filePath);
        if (isExist) {
            let data = fs.readFileSync(filePath, {encoding: 'utf8'});
            data = JSON.parse(data);
            const createAt = data.createAt;
            if (now - createAt <= 86400000) {
                return data.result;
            } else {
                result = await this._fetchAvailableServers();
                this.createJsonData(filePath, {
                    result,
                    createAt: now
                });
                return result;
            }
        } else {
            result = await this._fetchAvailableServers();
            this.createJsonData(filePath, {
                result,
                createAt: now
            });
            return result;
        }
    }

    /**
     * 写入JSON数据到本地
     * @param path
     * @param data
     */
    createJsonData(path, data) {
        data = JSON.stringify(data);
        fs.writeFileSync(path, data);
    }

    /**
     * 获取本地代理服务器数据
     */
    async getServers() {
        const filePath = path.join(__dirname, '../data', 'proxy.json');
        let data = fs.readFileSync(filePath, {encoding: 'utf8'});
        data = JSON.parse(data);
        const servers = data.result;
        return servers;
    }
}

const superagent$1 = require('superagent');
const charset = require('superagent-charset');
const cheerio$1 = require('cheerio');
const async = require('async');
const proxyServers = new Spider_proxy().getServers();

charset(superagent$1);

class Spider_17 {
    /**
     * 构造函数
     * @param options:{page：抓取页数, limit：并发数}
     */
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

    /**
     * 获取详情页数据
     * @param url
     * @returns {Promise<{song_name: *, author_name: T.author_name, song_poster: T.song_poster, chord_images: jQuery[], query: *, view_count: number, collect_count: number, search_count: number}>}
     * @private
     */
    async _fetchDetail(url, cb) {
        const res = await superagent$1
            .get(url)
            .set({'User-Agent': userAgent.getRandom()})
            .charset('gbk');
        const html = res.text;
        const $ = cheerio$1.load(html);
        const title = $('h1.ph').text();
        const song_name = this._analyseTitle(title);
        let song_poster;
        let author_name;
        try {
            const songInfo = await this._getSongInfo(song_name);
            song_poster = songInfo.song_poster;
            author_name = songInfo.author_name;
            console.log(author_name, 1111111);
        } catch (err) {
            cb(null);
            return;
        }
        const query = song_name;
        const imgs = Array.prototype.slice.call($('#article_contents img'));
        let chord_images = imgs.map((el) => {
            return $(el).attr('src');
        });
        const view_count = 0;
        const collect_count = 0;
        const search_count = 0;
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
        console.log(`$$结束抓取${url}$$`);
    }

    /**
     * 调网易API获取歌曲封面、歌手
     * @param name
     * @returns {Promise<T>}
     * @private
     */
    async _getSongInfo(name) {
        const proxyServer = proxyServers[Math.floor(proxyServers.length * Math.random())];
        return await superagent$1
            .post('http://music.163.com/api/search/pc')
            // .proxy(proxyServer)
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
            }).catch(err => {
                console.log(err);
                return {song_poster: '', author_name: ''}
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
                    reject(err);
                } else {
                    resolve(data);
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
                    reject(err);
                } else {
                    resolve(data);
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
        for (let i = 1; i <= page; i++) {
            listpageUrl = `${url}?page=${i}`;
            const res = await
                superagent$1
                    .get(listpageUrl)
                    .set({'User-Agent': userAgent.getRandom()})
                    .charset('gbk');
            const html = res.text;
            const $ = cheerio$1.load(html);
            $('.bbs.cl .xs3 a').each((index, el) => {
                const id = $(el).attr('href').match(/\d+/);
                const href = `https://www.17jita.com/tab/whole_${id}.html`;
                result.push(href);
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
            superagent$1
                .get(url)
                .set({'User-Agent': userAgent.getRandom()})
                .charset('gbk');
        const html = res.text;
        const $ = cheerio$1.load(html);
        $('#article_content ul li').each((index, el) => {
            const id = $(el).find('a').eq(1).attr('href').match(/\d+/);
            const href = `https://www.17jita.com/tab/whole_${id}.html`;
            result.push(href);
        });
        return result;
    }

}

const superagent$2 = require('superagent');
const charset$1 = require('superagent-charset');
const cheerio$2 = require('cheerio');
const async$1 = require('async');
const proxyServers$1 = new Spider_proxy().getServers();

charset$1(superagent$2);


class Spider_cc {
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
        console.log('Spidercc.js');
    }

    async fetchSearchResult(queryString) {
        const detailPageUrls = await this._fetchDetailLinks(queryString);
        console.log(detailPageUrls);
        return new Promise((resolve, reject) => {
            async$1.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                if (url) {
                    console.log(`**开始抓取${url}**`);
                    this._fetchDetail(url, cb);
                }
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
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
            async$1.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
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
        for (let i = 1; i <= page; i++) {
            listpageUrl = url.replace('.htm', '') + '_0_0_0_0_0_' + i + '.htm';
            const res = await
                superagent$2
                    .get(listpageUrl)
                    .set({'User-Agent': userAgent.getRandom()})
                    .charset('gbk');
            const html = res.text;
            const $ = cheerio$2.load(html);
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
            urls.push(url);
        }
        return new Promise((resolve, reject) => {
            async$1.mapLimit(urls, this.limit, (url, cb) => {
                this._analyseSearchLinks(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    data.forEach(urls => {
                        result = result.concat(urls);
                    });
                    resolve(result);
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
        const res = await superagent$2
            .get(url)
            .set({'User-Agent': userAgent.getRandom()})
            .timeout(this.timeout)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio$2.load(html);
        const total = $("#xspace-itemreply").find(".list_searh").length;
        if (!total) {
            typeof cb === 'function' && cb(null, result);
        } else {
            $(".list_searh .pu_title .search_url a").each((index, el) => {
                const href = $(el).attr('href');
                result.push(href);
            });
            typeof cb === 'function' && cb(null, result);
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
            res = await superagent$2
                .get(url)
                .set({'User-Agent': userAgent.getRandom()})
                .timeout(this.timeout)
                .charset('gbk');
        } catch (err) {
            console.log(err);
            typeof cb === 'function' && cb(null);
            return;
        }
        const html = res.text;
        const $ = cheerio$2.load(html);
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
            author_name: title.split('>>')[2] || '',
            song_name: title.split('>>')[3] || ''
        }
    }

    async _getSongInfo(name) {
        const proxyServer = proxyServers$1[Math.floor(proxyServers$1.length * Math.random())];
        return await superagent$2
            .post('http://music.163.com/api/search/pc')
            // .proxy(proxyServer)
            .set({'User-Agent': userAgent.getRandom()})
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
                return {song_poster: '', author_name: ''}
            });
    }

}

const superagent$3 = require('superagent');
const superagentProxy$1 = require('superagent-proxy');
const charset$2 = require('superagent-charset');
const cheerio$3 = require('cheerio');
const async$2 = require('async');
const proxyServers$2 = new Spider_proxy().getServers();

superagentProxy$1(superagent$3);
charset$2(superagent$3);

class Spider_jitashe {
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
        console.log('Spidercc.js');
    }

    async fetchSearchResult(queryString) {
        const detailPageUrls = await this._fetchDetailLinks(queryString);
        return new Promise((resolve, reject) => {
            async$2.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                if (url) {
                    console.log(`**开始抓取${url}**`);
                    this._fetchDetail(url, cb);
                }
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
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
            async$2.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    data = data.filter(song => {
                        return !!song
                    });
                    resolve(data);
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
            async$2.mapLimit(detailPageUrls, this.limit, (url, cb) => {
                console.log(`**开始抓取${url}**`);
                this._fetchDetail(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    data = data.filter(song => {
                        return !!song
                    });
                    resolve(data);
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
                superagent$3
                    .get(listpageUrl)
                    .set({'User-Agent': userAgent.getRandom()});
            const html = res.text;
            const $ = cheerio$3.load(html);
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
        queryString = encodeURIComponent(queryString);
        let urls = [];
        let result = [];
        for (let i = this.start; i < this.start + this.page; i++) {
            const url = `http://www.jitashe.org/search/tab/${queryString}/${i}/`;
            urls.push(url);
        }
        return new Promise((resolve, reject) => {
            async$2.mapLimit(urls, this.limit, (url, cb) => {
                this._analyseSearchLinks(url, cb);
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    data.forEach(urls => {
                        result = result.concat(urls);
                    });
                    resolve(result);
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
        const res = await superagent$3
            .get(url)
            .set({'User-Agent': userAgent.getRandom()})
            .timeout(this.timeout);
        const html = res.text;
        const $ = cheerio$3.load(html);
        const total = $(".tab-list").find(".tab-item").length;
        if (!total) {
            typeof cb === 'function' && cb(null, result);
        } else {
            $('.tab-list .tab-item').each((index, el) => {
                const type = $(el).find(".taglist .tabtype").text().trim();
                if (type === '图片谱') {
                    let href = $(el).find(".text .title").attr('href');
                    href = `http://www.jitashe.org${href}`;
                    result.push(href);
                }
            });
            typeof cb === 'function' && cb(null, result);
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
            res = await superagent$3
                .get(url)
                .set({'User-Agent': userAgent.getRandom()})
                .timeout(this.timeout);
        } catch (err) {
            console.log(err);
            typeof cb === 'function' && cb(null);
            return;
        }
        const html = res.text;
        const $ = cheerio$3.load(html);
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
        const proxyServer = proxyServers$2[Math.floor(proxyServers$2.length * Math.random())];
        return await superagent$3
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

// test();

module.exports = {
    Spider_17,
    Spider_cc,
    Spider_jitashe,
    Spider_proxy
};
