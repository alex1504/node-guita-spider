const {Spider_proxy} = require('../../spiders/dist/main');
const router = require('koa-router')();

router.prefix('/proxy');

router.get('/list', async (ctx, next) => {
    let {page} = ctx.query;
    page = parseInt(page || 10);
    const result = await new Spider_proxy({
        page: 1
    }).fetchServers();
    ctx.body = result;
});


module.exports = router
