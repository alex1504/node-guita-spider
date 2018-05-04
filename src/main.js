import Spider_17 from './spider_17jita';
import Spider_cc from './spider_ccjita';

export default function init(){
    const spider_17 = new Spider_17();
    // const spider_cc = new Spider_cc();
    spider_17.init();
    // spider_cc.init();
}

init();