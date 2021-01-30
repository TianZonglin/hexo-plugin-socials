# hexo-plugin-socials

[![GitHub license](https://img.shields.io/github/license/mythsman/hexo-douban.svg)](https://github.com/mythsman/hexo-douban/blob/master/LICENSE)

基于xpath解析页面源代码来构建新页面，构建页面不是最终目的，最终目的是在博客首页/特定页嵌入你想展示的不同平台的最新动态！（只需配置相关ID即可）


# 知乎更新了网站加载方式，原有XPATH解析已失效！

# 此插件已失效！2020.12


任务列表：

- 豆瓣动态：详见插件[hexo-douban-list](https://github.com/TianZonglin/hexo-douban-list)；
- 知乎动态：包括问题点赞/已完成、文章点赞/未完成、回答问题/未完成、个人动态/未完成；
- Github动态：Issue列表/未完成、Star项目/未完成（已有插件？）；
- QQ空间动态：空间说说列表/未完成；
- 哔哩哔哩动态：动态、视频、文章页/未完成（已有插件？）；


主要特性：

- [原项目](https://github.com/mythsman/hexo-douban)固有特性；
- 支持移动适配；
- 暂时只支持知乎问题点赞（还有回答、文章、动态）；
- 样式inline化，允许直接嵌入同源其他页面；
  ``` html
  <div id="sscontent"></div>
  <script>$('#sscontent').load('./socials/index.html .hexo-socials-item:nth-child(1)');</script>
  ```

**注意：本插件构建的页面完全不保证兼容IE等上古浏览器，推广使用现代浏览器，人人有责。**

 
## 第一步：安装

``` bash
$ npm install --save hexo-plugin-socials
```

## 第二步：配置

将下面的配置写入站点的配置文件 `_config.yml` 里(不是主题的配置文件).

``` yaml
socials:
  user: tian-zong-lin-82
  builtin: true
  movie:
    title: '知乎动态'
    quote: <p>在构建时拉取各社交网站动态（完善中）。 <a target="_blank" href="https://github.com/TianZonglin/hexo-socials-list">// 本页使用 hexo-socials-list 插件构建</a></p>
    valine_id: WbLE88qfAcz4h
    valine_key: ycqjmtEfU
  timeout: 100000
```

**注意：以上内容中务必确定 USER ID 的正确性！**

- **user**: 你的知乎ID，打开知乎个人主页，URL为"https://www.zhihu.com/people/xxxxx" ，其中的"xxxxx"就是你的个人ID了。
- **builtin**: 是否将生成页面的功能嵌入`hexo s`和`hexo g`中，默认嵌入（TRUE）即npm安装后无需任何操作按原命令部署博客即可生效。
- **title**: 该页面的标题。
- **quote**: 写在页面开头的一段话,支持html语法。
- **timeout**: 爬取数据的超时时间，默认是 10000ms ,如果在使用时发现报了超时的错(ETIMEOUT)可以把这个数据设置的大一点。

对于 `valine_id` 和 `valine_key`，主要针对的是**Volantis**主题（以及其他默认渲染评论区域的主题），如果您在测试时页面没有评论区域，则可以忽略这两项，如果出现以下显示则需要填写此两项。（这两项是什么？请移步[Valine官方介绍](https://valine.js.org/quickstart.html#%E8%8E%B7%E5%8F%96APP-ID-%E5%92%8C-APP-Key)）

![](https://cdn.jsdelivr.net/gh/TianZonglin/tuchuang/img/20200922010453.png)


## 使用

完成配置文件的配置，正常部署流程即可。

## 升级

使用 `npm install hexo-plugin-socials --update --save` 直接更新。

## 测试

执行 `hexo clean && hexo generate && hexo server`，之后访问 `localhost:4000/socials` 即可访问生成的动态页面。

## 异常

如果构建页面为空或404，且日志输出为 `INFO  0 items have been loaded in xx ms`，这时怀疑您的IP由于多次请求知乎的页面而被知乎封禁了，一般第二天会解禁，使用代理或更改IP即可解决。
 
