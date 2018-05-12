const {Spider_jitashe} = require('../../spiders/dist/main');
const router = require('koa-router')();

router.prefix('/guita_jts');

router.get('/list/new', async (ctx, next) => {
    let {page, limit, start} = ctx.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const spider_jitashe = new Spider_jitashe({
        start: start || 1,
        page: page || 1,
        limit: limit || 5
    });
    const result = await spider_jitashe.fetchNewList();
    ctx.body = result;
});

router.get('/list/hot', async (ctx, next) => {
    let {page, limit, start} = ctx.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const spider_jitashe = new Spider_jitashe({
        start: start || 1,
        page: page || 1,
        limit: limit || 5
    });
    const result = await spider_jitashe.fetchHotList();
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
    const spider_jitashe = new Spider_jitashe({
        page,
        limit
    });
    const result = await spider_jitashe.fetchSearchResult(q);
    return result;
});

module.exports = router;
