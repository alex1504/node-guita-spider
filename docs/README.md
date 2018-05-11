# Node-guita-spider
---------------------------------------

这里是未想好的描述

## 17吉他网
---------------------------------------
### 吉他谱列表页数据

- **必选参数 :** 无
- **可选参数 :** `page`: 抓取页数 `limit`: 并发线程数
-**接口地址 :** `/guita/list`
- **调用例子 :** [http://localhost:3000/guita/list](http://localhost:3000/guita/list)
- **返回数据格式 :**

```javascript
[
    {
        "song_name": "纸短情长",
        "author_name": "花粥",
        "song_poster": "http://p1.music.126.net/PXE9MfYCgnjHz1vkrpUywQ==/109951163290871736.jpg",
        "chord_images": [
            "http://data.17jita.com/attachment/portal/201805/05/131355zh5cb2sgsg2xof8o.png",
            "http://data.17jita.com/attachment/portal/201805/05/131356il4hryh33p34xpk9.png",
            "http://data.17jita.com/attachment/portal/201805/05/131358u2s24fyoip21z12o.png"
        ],
        "query": "纸短情长",
        "view_count": 0,
        "collect_count": 0,
        "search_count": 0
    }
]
```

### top100列表页数据

- **必选参数 :** 无
- **可选参数 :** `page`: 抓取页数 `limit`: 并发线程数
- **接口地址 :** `/guita/list/top100`
- **调用例子 :** [http://localhost:3000/guita/list/top100](http://localhost:3000/guita/list/top100)

**返回数据格式 :**
```javascript
[
    {
        "song_name": "纸短情长",
        "author_name": "花粥",
        "song_poster": "http://p1.music.126.net/PXE9MfYCgnjHz1vkrpUywQ==/109951163290871736.jpg",
        "chord_images": [
            "http://data.17jita.com/attachment/portal/201805/05/131355zh5cb2sgsg2xof8o.png",
            "http://data.17jita.com/attachment/portal/201805/05/131356il4hryh33p34xpk9.png",
            "http://data.17jita.com/attachment/portal/201805/05/131358u2s24fyoip21z12o.png"
        ],
        "query": "纸短情长",
        "view_count": 0,
        "collect_count": 0,
        "search_count": 0
    }
]
```

## 虫虫吉他网
---------------------------------------

### 搜索

- **必选参数 :** 无
- **可选参数 :** `q`: 查询字符串 `page`: 抓取页数 `limit`: 并发线程数
- **接口地址 :** `/guita/search`
- **调用例子 :** [http://localhost:3000/guita/search?q=纸短情长](http://localhost:3000/guita/search?q=纸短情长)

**返回数据格式 :**
```javascript
[
    {
        "song_name": "纸短情长 烟把儿乐队原版\n                ",
        "author_name": " 烟把儿乐队\n",
        "song_poster": "http://p1.music.126.net/tbZaE-DjL_BkemynFlL1cQ==/109951163052534918.jpg",
        "chord_images": [
            "http://www.ccguitar.cn/pu/2018/4/16/213259_41950/1.gif",
            "http://www.ccguitar.cn/pu/2018/4/16/213259_41950/2.gif",
            "http://www.ccguitar.cn/pu/2018/4/16/213259_41950/3.gif"
        ],
        "query": "纸短情长 烟把儿乐队原版\n                ",
        "view_count": 0,
        "collect_count": 0,
        "search_count": 0
    }
]
```
