const {Spider_17, Spider_cc} = require('../../spiders/dist/main');
const router = require('koa-router')();

router.prefix('/guita');

router.get('/', async (ctx, next) => {
    let {page, limit} = ctx.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const spider_17 = new Spider_17({
        page: page || 1,
        limit: limit || 5
    });
    const result = await spider_17.fetchList();
    ctx.body = result;
});


router.get('/top100', async (ctx, next) => {
    let {limit} = ctx.query;
    limit = parseInt(limit);
    const spider_17 = new Spider_17({
        limit: limit || 5
    });
    let result;
    try {
        result = await spider_17.fetchTop100List();
    } catch (err) {
        console.log(err);
        ctx.body = [];
    }
    ctx.body = result;
});

router.get('/search', async (ctx, next) => {
    const {q} = ctx.query;
    if (!q) {
        ctx.body = {
            ret: 1,
            msg: '缺少必要参数q'
        };
    } else {
        ctx.body = await next()
    }
}, async (ctx, next) => {
    const {q} = ctx.query;
    const spider_cc = new Spider_cc();
    const result = await spider_cc.fetchSearchResult(q);
    return result;
});


module.exports = router
