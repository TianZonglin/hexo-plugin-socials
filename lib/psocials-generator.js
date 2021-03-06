'use strict';

var _ = require('underscore');
var request = require('urllib-sync').request;
var ejs = require('ejs');
var xpath = require('xpath');
var path = require('path');
var Dom = require('xmldom').DOMParser;
var renderStar = require('./util').renderStar;
var i18n = require('./util').i18n;
var offline = false;

var log = require('hexo-log')({
    debug: false,
    silent: false
});
 
module.exports = function (locals) {

    var config = this.config;
    if (!config.socials || !config.socials.zhihu) {//当没有输入movie信息时，不进行数据渲染。
        return;
    }

    var root = config.root;
    if (root.endsWith('/')) {
        root = root.slice(0, root.length - 1);
    }

    var timeout = 100000;
    if (config.socials.timeout) {
        timeout = config.socials.timeout;
    }

    /* get long comments start */ 
    var startTime = new Date().getTime();
    var watchedUrl = 'https://www.zhihu.com/people/'+config.socials.user;
    var response = '';
    try {
        response = request(watchedUrl, {
            timeout: 10000,
            dataType: 'xml'
        });
    } catch (err) {offline = true;}
    var doc = new Dom({
        errorHandler: {
            warning: function (e) {},
            error: function (e) {},
            fatalError: function (e) {}
        }
    }).parseFromString(response.data.toString());
    var items = xpath.select('//div[@class="List ProfileActivities"]/div/div[@class="List-item"]', doc);
 
    var list = [];
    for (var i in items) {
        
        var parser = new Dom().parseFromString(items[i].toString());
        var type = xpath.select1('string(//div[@class="List-itemMeta"]/div/span[@class="ActivityItem-metaTitle"])',parser);
        var postime = xpath.select1('string(//div[@class="List-itemMeta"]/div/span[2])',parser);
        var href = "https://www.zhihu.com/people/"+config.socials.user;
       
        if(type=="赞同了回答"){
            var ztTitle = xpath.select1('string(//div[@class="ContentItem AnswerItem"]/h2/div/a)',parser);
            var zthref = xpath.select1('string(//div[@class="ContentItem AnswerItem"]/h2/div/a/@href)',parser);
            var ztAuthor = xpath.select1('string(//div[@class="AuthorInfo AnswerItem-authorInfo"]/meta/@content)',parser);
            var ztContent = xpath.select1('string(//div[@class="ContentItem AnswerItem"]/div[@class="RichContent is-collapsed"]/div[@class="RichContent-inner"]/span)',parser);
            var imgurl = xpath.select1('string(//div[@class="VagueImage"]/@data-src)',parser);
        
            list.push({
                type:type,
                imgurl:imgurl,
                postime:postime,
                href:href,
                zthref:zthref,
                ztTitle:ztTitle,
                ztAuthor:ztAuthor,
                ztContent:ztContent,
            });
        }else if(type=="发布了想法"){

        }else if(type=="回答了问题"){

        }else if(type=="发表了文章"){
            
        }
    
    }
    /* get long comments end */ 



    
 



    var endTime = new Date().getTime();

    var offlinePrompt = offline ? ", because you are offline or your network is bad" : "";

    log.info( list.length + ' socials items have been loaded in ' + (endTime - startTime) + " ms" + offlinePrompt);

    var __ = i18n.__(config.language);

    var contents = ejs.renderFile(path.join(__dirname, 'templates/movie.ejs'), {
        'limg': config.socials.zhihu.sublenimg * 1,
        'lblank': config.socials.zhihu.sublenblank * 1,
        'title': config.socials.zhihu.title,
        'quote': config.socials.zhihu.quote,
        'vappid': config.socials.zhihu.valine_id,
        'vappkey': config.socials.zhihu.valine_key,
        'watched': list,
        '__': __,
        'root': root
    },
        function (err, result) {
            if (err) console.log(err);
            return result;
        });
 
    return {
        path: 'socials/index.html',
        data: {
            title: config.socials.zhihu.title,
            content: contents,
            slug: 'socials'
        },
        layout: ['page', 'post']
    };
};
