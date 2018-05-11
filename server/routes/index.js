const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    ctx.body = {
        api: [
            {
                name: "列表获取",
                url: "localhost:3000/guita/list?page=1&limit=5"
            },
            {
                name: "top100",
                url: "localhost:3000/guita/list/top100"
            },
            {
                name: "搜索",
                url: "localhost:3000/guita/search?q=周杰伦"
            }
        ]
    }
});

module.exports = router
