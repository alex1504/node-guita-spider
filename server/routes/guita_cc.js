const {Spider_17, Spider_cc} = require('../../spiders/dist/main');
const router = require('koa-router')();

router.prefix('/guita_cc');

router.get('/list', async (ctx, next) => {
    let {start, page, limit} = ctx.query;
    page = parseInt(page);
    limit = parseInt(limit);
    start = parseInt(start);
    const spider_cc = new Spider_cc({
        start: start || 1,
        page: page || 1,
        limit: limit || 5
    });
    const result = await spider_cc.fetchList();
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
    const page = ctx.query.page || 1;
    const limit = ctx.query.limit || 5;
    const spider_cc = new Spider_cc({
        page,
        limit
    });
    const result = await spider_cc.fetchSearchResult(q);
    return result;
});


module.exports = router
