/**
 * 轮播插件
 * Created by haoran.shu on 2015/12/20.
 */
(function($, f){
    // 声明对象
    var CSlider = function () {
        // 声明全局对象
        var _ = this;
        var t; // 保存定时任务对象
        var i = 0; // 保存初始页数,默认第一页,序号从0开始
        var $dot; // 分页小圆点
        var isStop = false; // 标识是否在跳转到指定页面时停止了自动轮播
        // 保存配置参数
        _.o = {
            autoplay : false, // 是否自动轮播
            delay : 3000, // 幻灯片的播放延迟时间
            speed : 500, // 动画速度
            pause : true // 鼠标悬浮暂停自动轮播
        };

        /* 初始化方法 */
        _.init = function (div, o) {
            // 保存配置参数
            _.o = $.extend(_.o, o);
            // 保存轮播div
            _.div = div;
            _.ul = div.find(">ul"); // 获取轮播的ul
            /*
             声明数组保存滑动区域的最大宽高
             默认为div标签的宽高,如果div没有宽高则为0
             | 运算符：如果相同返回自身，如果不同返回0
             如： 1100 | 0000 返回1100
             */
            _.max = [div.outerWidth() | 0, div.outerHeight() | 0];
            // 遍历每一个li标签
            _.li = _.ul.find(">li").each(function(){
                var me = $(this),
                    width = me.outerWidth(),
                    height = me.outerHeight();
                // 重新赋值宽高，让容器div的宽高随内容变化
                if(width > _.max[0]){
                    _.max[0] = width;
                }
                if(height > _.max[1]){
                    _.max[1] = height;
                }
            });
            var len = _.li.length; // 获取li标签的数量
            // 设置容器div的宽高,宽为最大的宽度,高默认为第一个li标签的高度
            _.div.css({width: _.max[0], height: _.li.first().outerHeight()});
            // 设置ul标签的宽度
            _.ul.css({left: 0, width: (100 * len) + "%"});
            // 设置li标签的宽度, 由于li的百分比宽度是相对于ul来说的,所以每一个的宽度就是100/li.length
            _.li.css({width: (100 / len) + "%"});

            /* 如果配置了自动轮播,则定时轮播 */
            if(_.o.autoplay == true){
                play(); // 开启自动轮播
                if(_.o.pause == true){ // 鼠标悬浮停止自动轮播
                    /* 如果配置了鼠标悬浮停止轮播,则在鼠标悬浮时停止,鼠标离开后开启 */
                    _.div.on("mouseover mouseout", function (e) {
                        // 判断事件类型
                        if(e.type === "mouseover"){ // 鼠标悬浮
                            stop(); // 停止自动轮播
                        }else if(e.type === "mouseout"){ // 开启自动轮播
                            play(); // 开启自动轮播
                        }
                    });
                }
            }

            // 小圆点的点击事件
            var dots = _.div.find("ol.has-dot");
            if(dots){
                var dotLength = dots.children().length; // 获取dot节点的数目,必须和分页数目相同
                if(dotLength == _.li.length){
                    $dot = dots.find(">li");
                    $dot.click(function () {
                        to($(this).index());
                    });
                }
            }
            return _;
        };

        /* 开启自动轮播 */
        function play() {
            t = setInterval(function () {
                to(i + 1); // 跳转到第一页
            }, _.o.delay | 0)
        }

        /* 停止自动轮播 */
        function stop() {
            t = clearInterval(t); // 清楚自动轮播定时任务
        }

        /* 跳转到指定页 */
        function to(index) {
            if(_.t){ // 如果设置了自动轮播定时任务
                stop(); // 停止自动轮播
                isStop = true; // 标识停止了自动轮播
            }
            // 判断是否超出范围
            if(index > _.li.length - 1){ // 超出范围
                index = 0; // 从0开始
            }
            var target = _.li.eq(index); // 获取有效的跳转到的li
            var obj = {height : target.outerHeight()}; // div,ul的高度随li高度变化而变化
            // 判断ul是否有正在执行滑动的队列
            if(!_.ul.queue("fx").length){ // 没有正在执行滑动的队列,则执行滑动动画
                _.div.animate(obj, _.o.speed, "swing"); // 更改div高度动画
                // ul left动画,高度动画
                _.ul.animate($.extend({left: "-" + index + "00%"}, obj), _.o.speed, "swing");
                // 更新分页圆点,siblings()寻找同级元素
                $dot.eq(index).addClass("active").siblings().removeClass("active");
                i = index;
            }
            // 跳转完毕后,如果之前停止了自动轮播,则开启自动轮播
            if(isStop){
                play(); // 开启自动轮播
            }
        }
    };

    $.fn.cslider = function(o){
        // 创建轮播对象
        var cslider = new CSlider();
        cslider.init($(this), o); // 轮播初始化
    };
})(jQuery, false);
