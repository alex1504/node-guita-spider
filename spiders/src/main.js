import Spider_17 from './spider_17jita';
import Spider_cc from './spider_ccjita';
import Spider_jitashe from './spider_jitashe';

async function test(){
    const spider_jitashe = new Spider_jitashe({
        page: 2,
        limit: 5
    });
    const data = await spider_jitashe.fetchSearchResult('那些年');
    console.log(data, '---')
}
// test();

module.exports = {
    Spider_17,
    Spider_cc,
    Spider_jitashe
};
