const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');

charset(superagent);

export default class {
    constructor(options) {
        /**
         * {string}  url   抓取地址 required
         * {string}  mode  抓取模式 'detail': 详情页  'list': 列表页
         * {numbaer} page  抓取页数
         */
        /*const defaultOpts = {
            url: 'https://www.17jita.com/tab/whole_8290.html',
            mode: 'detail',
            page: 1
        };
        let opts = defaultOpts;
        if (options) {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    opts[key] = options[key];
                }
            }
        }
        this.url = opts.url;
        this.mode = opts.mode;
        this.page = opts.page;*/
    }

    init() {
        this._fetchList('https://www.17jita.com/tab/index.php', 2);
    }

    /**
     * 获取详情页数据
     * @param url
     * @returns {Promise<{song_name: *, author_name: T.author_name, song_poster: T.song_poster, chord_images: jQuery[], query: *, view_count: number, collect_count: number, search_count: number}>}
     * @private
     */
    async _fetchDetail(url) {
        const res = await superagent
            .get(url)
            .charset('gbk');
        const html = res.text;
        const $ = cheerio.load(html);
        const title = $('h1.ph').text();
        const song_name = this._analyseTitle(title);
        const {song_poster, author_name} = await this._getSongInfo(song_name);
        const query = song_name;
        const imgs = Array.prototype.slice.call($('#article_contents img'));
        const chord_images = imgs.map((el) => {
            return $(el).attr('src');
        });
        const view_count = 0;
        const collect_count = 0;
        const search_count = 0;
        /*console.log({
            song_name,
            author_name,
            song_poster,
            chord_images,
            query,
            view_count,
            collect_count,
            search_count
        });
        console.log("\n——————————————————")*/
        return {
            song_name,
            author_name,
            song_poster,
            chord_images,
            query,
            view_count,
            collect_count,
            search_count
        }
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
                const songs = res.result.songs;
                if (songs.length) {
                    return {
                        song_poster: songs[0].album.picUrl,
                        author_name: songs[0].artists[0].name
                    }
                } else {
                    return ''
                }
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
            return match[1] || ''
        }
    }

    /**
     * 获取列表url的所有详情页数据
     * @param url
     * @param page
     * @returns {Promise<void>}
     * @private
     */
    async _fetchList(url, page) {
        const result = [];
        const detailPageUrls = await this._analyseList(url, page);
         detailPageUrls.forEach(async url => {
            let data = await this._fetchDetail(url);
            result.push(data)
        });
        console.log(result)
    }

    /**
     * 分析单页列表页获取详情页url
     * @param url
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

}