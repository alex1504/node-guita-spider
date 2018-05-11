const {Spider_jitashe} = require('../../spiders/dist/main');
const router = require('koa-router')();

router.prefix('/guita_jts');

router.get('/list/new', async (ctx, next) => {
    let {page, limit} = ctx.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const spider_jitashe = new Spider_jitashe({
        page: page || 1,
        limit: limit || 5
    });
    const result = await spider_jitashe.fetchNewList();
    ctx.body = result;
});

router.get('/list/hot', async (ctx, next) => {
    let {page, limit} = ctx.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const spider_jitashe = new Spider_jitashe({
        page: page || 1,
        limit: limit || 5
    });
    const result = await spider_jitashe.fetchHotList();
    ctx.body = result;
});

module.exports = router
