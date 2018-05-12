import Spider_17 from './spider_17jita';
import Spider_cc from './spider_ccjita';
import Spider_jitashe from './spider_jitashe';
import Spider_proxy from './spider_proxy';

export default async function () {
    const res = await new Spider_proxy({
        page: 5,
        type: 1
    }).fetchServers();
    console.log(res)
}
