const {Spider_17, Spider_cc} = require('../../spiders/dist/main');
const router = require('koa-router')();

router.prefix('/guita_17');

router.get('/list', async (ctx, next) => {
    let {page, limit, start} = ctx.query;
    page = parseInt(page);
    limit = parseInt(limit);
    start = parseInt(start);
    const spider_17 = new Spider_17({
        start: start || 1,
        page: page || 1,
        limit: limit || 5
    });
    const result = await spider_17.fetchList();
    ctx.body = result;
});

router.get('/list/top100', async (ctx, next) => {
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

module.exports = router
