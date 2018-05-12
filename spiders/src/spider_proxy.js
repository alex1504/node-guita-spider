import userAgent from './userAgent';

const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const superagentProxy = require('superagent-proxy');
const cheerio = require('cheerio');

superagentProxy(superagent);

export default class {
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
        this.url = this.type === 1 ? 'http://www.xicidaili.com/nn' : 'http://www.xicidaili.com/nt/'
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
                console.log(err)
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
                console.log(err)
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
            const expire = 86400000; //  一天
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
};