const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    ctx.body = {
        code: 200,
        msg: '欢迎来到曲谱世界',
        docs: 'http://localhost:4000'

    }
});

module.exports = router
