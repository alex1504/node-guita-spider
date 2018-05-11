const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    ctx.body = {
        "17吉他": [
            {
                name: "列表获取",
                url: "localhost:3000/guita_17/list?page=1&limit=5"
            },
            {
                name: "top100",
                url: "localhost:3000/guita_17/list/top100"
            },
        ],
        "虫虫吉他": [
            {
                name: "列表获取",
                url: "localhost:3000/guita_cc/list?page=1&limit=5"
            },
            {
                name: "搜索",
                url: "localhost:3000/guita_cc/search?q=周杰伦"
            }]
    }
});

module.exports = router
