import Spider_17 from './spider_17jita';
import Spider_cc from './spider_ccjita';

async function test(){
    const spider_cc = new Spider_cc({
        page: 2,
        limit: 3
    });
    const data = await spider_cc._fetchDetailLinks('告白气球');
    console.log(data, '---')
}
// test();

module.exports = {
    Spider_17,
    Spider_cc
};
