
# 聚合吉他谱API
---------------------------------------
> - 基于Node+Koa网络爬虫吉他谱接口，集合吉他社、17吉他网、虫虫吉他谱，更多网站等待更新。
> - 本API仅仅只是学习研究使用,请勿将以下接口用来商业推广以及其他获利用途，如有版权问题请告知删除

## 代理服务器
---------------------------------------
获取爬虫IP池，防止IP被禁止访问。下面代理服务器列表抓取自[西刺代理](http://www.xicidaili.com/)，接口每24小时更新一次。

### 代理服务器列表

- **必选参数 :** 无
- **可选参数 :** `page`: 抓取页数
- **接口地址 :** `/proxy/list?page=5`
- **调用例子 :** [http://localhost:3000/proxy/list?page=5](http://localhost:3000/guita_17/list?page=5)
- **返回数据格式 :**

```javascript
[
    "http://183.128.35.255:18118",
    "https://122.72.18.34:80",
    "https://122.72.18.35:80",
    "https://114.215.95.188:3128",
    "http://120.26.110.59:8080",
    "https://1.192.240.242:9797",
    "http://182.90.94.113:53281",
    "https://27.37.47.77:9797"
]
```

## 吉他社
---------------------------------------

### 列表页数据

#### 热门列表
- **必选参数 :** 无
- **可选参数 :** `start`: 起始页 `page`: 抓取页数 `limit`: 并发线程数
- **接口地址 :** `/guita_jts/list/hot`
- **调用例子 :** [http://localhost:3000/guita_jts/list/hot](http://localhost:3000/guita_jts/list/hot)
- **返回数据格式 :**

```javascript
[
    {
        "song_name": "莫文蔚《慢慢喜欢你》原版 酷音小伟吉他教学\n                ",
        "author_name": " 莫文蔚\n",
        "song_poster": "http://p1.music.126.net/XqNiBR_6gPXXq58vW2dD8g==/109951163169448520.jpg",
        "chord_images": [
            "http://www.ccguitar.cn/pu/2018/5/10/224616_41891/1.gif",
            "http://www.ccguitar.cn/pu/2018/5/10/224616_41891/2.gif"
        ],
        "query": "莫文蔚《慢慢喜欢你》原版 酷音小伟吉他教学\n                ",
        "view_count": 0,
        "collect_count": 0,
        "search_count": 0
    }
]
```


#### 最新列表
- **必选参数 :** 无
- **可选参数 :** `start`: 起始页 `page`: 抓取页数 `limit`: 并发线程数
- **接口地址 :** `/guita_jts/list/new`
- **调用例子 :** [http://localhost:3000/guita_jts/list/new](http://localhost:3000/guita_jts/list/new)
- **返回数据格式 :**

```javascript
[
    {
        "song_name": "莫文蔚《慢慢喜欢你》原版 酷音小伟吉他教学\n                ",
        "author_name": " 莫文蔚\n",
        "song_poster": "http://p1.music.126.net/XqNiBR_6gPXXq58vW2dD8g==/109951163169448520.jpg",
        "chord_images": [
            "http://www.ccguitar.cn/pu/2018/5/10/224616_41891/1.gif",
            "http://www.ccguitar.cn/pu/2018/5/10/224616_41891/2.gif"
        ],
        "query": "莫文蔚《慢慢喜欢你》原版 酷音小伟吉他教学\n                ",
        "view_count": 0,
        "collect_count": 0,
        "search_count": 0
    }
]
```


### 搜索

- **必选参数 :** 无
- **可选参数 :** `q`: 查询字符串 `page`: 抓取页数 `limit`: 并发线程数
- **接口地址 :** `/guita_jitashe/search`
- **调用例子 :** [http://localhost:3000/guita_jts/search?q=纸短情长](http://localhost:3000/guita_jts/search?q=纸短情长)

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

## 17吉他网
---------------------------------------
### 吉他谱列表页数据

- **必选参数 :** 无
- **可选参数 :** `start`: 起始页 `page`: 抓取页数 `limit`: 并发线程数
- **接口地址 :** `/guita_17/list`
- **调用例子 :** [http://localhost:3000/guita_17/list](http://localhost:3000/guita_17/list)
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
- **可选参数 :** 无
- **接口地址 :** `/guita_17/list/top100`
- **调用例子 :** [http://localhost:3000/guita_17/list/top100](http://localhost:3000/guita_17/list/top100)

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

### 吉他谱列表页数据

- **必选参数 :** 无
- **可选参数 :** `start`: 起始页 `page`: 抓取页数 `limit`: 并发线程数
-**接口地址 :** `/guita_17/list`
- **调用例子 :** [http://localhost:3000/guita_cc/list](http://localhost:3000/guita_cc/list)
- **返回数据格式 :**

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

### 搜索

- **必选参数 :** 无
- **可选参数 :** `q`: 查询字符串 `page`: 抓取页数 `limit`: 并发线程数
- **接口地址 :** `/guita_cc/search`
- **调用例子 :** [http://localhost:3000/guita_cc/search?q=纸短情长](http://localhost:3000/guita_cc/search?q=纸短情长)

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

