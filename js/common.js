// 配置项
// 题目数量
var count = 5

// 随机获得json文件标记
var flag=0

// 临时标记答题全对后中奖与否
// 使用0,1两个随机整数来代替
var win

//临时存储json id，尽量不出现重复题目
var Eset = new Set()

// allData 所有题目数据  number 题目序号
var allData,number=1

// open 判断是否选择答案，否则禁止点击下一题
// datas 全局存储某一个题目所有信息
// record 已选择答案后禁止在选择另一个答案
// score 全局存储当前得分
// isPC 判断是否为PC设备，是的话就不加载flexible.js了
var open,datas,record=true,score=0,isPC=true

// 获取所有json题目信息
$.getJSON('utils/que.json', function (data) {allData = data})

// 随机获取一个编号
function randomNumber(lower,upper){
    var temp = Math.floor(Math.random()*(upper-lower+1))+lower;
    if(Eset.has(temp)){
        temp = randomNumber(lower,upper)
    }else{
        Eset.add(temp)
    }
    return temp
}

// 随机获取某一道题目所有信息
function randomJson(result){
    flag=randomNumber(1,result.length);
    return result[flag-1];
}

// 阻止获取input框焦点时发生的跳转，不加该方法每当获取input框焦点时它将会自动跳转至第一页
function stopKeyborad(obj)
{
    obj.attr('readonly', 'readonly');
    setTimeout(function() {
        obj.removeAttr('readonly');
    }, 200);
}
// 动态生成每一道题目并进行显示
function getData(obj,i) {
    datas = randomJson(allData)
    $(obj).html("<div class=\"ani zoomInLeft animated\" swiper-animate-effect=\"zoomInLeft\" swiper-animate-duration=\"0.5s\" swiper-animate-delay=\"0.2s\" style='visibility: visible;animation-duration:0.5s;-webkit-animation-duration:0.5s;animation-delay:0.2s;-webkit-animation-delay:0.2s'><div class=\"bg_img\"><img src=\"img/bg_03.png\" /></div><div class=\"abs three_1\">" + i + " / " + count + "</div>\n" +
        "      <div class=\"abs three_2\">\n" +
        "        <div class=\"three_2_1\">" + i + "、" + (datas.title) + "</div>\n" +
        "        <div class=\"three_2_2\" data-ans=\"A\">A." + datas.a1 + "<span class=\"answerright\"><img></span></div>\n" +
        "        <div class=\"three_2_2\" data-ans=\"B\">B." + datas.a2 + "<span class=\"answerright\"><img></span></div>\n" +
        "        <div class=\"three_2_2\" data-ans=\"C\">C." + datas.a3 + "<span class=\"answerright\"><img></span></div>\n" +
        "        <div class=\"three_2_2\" data-ans=\"D\">D." + datas.a4 + "<span class=\"answerright\"><img></span></div>\n" +
        "        </div>\n"+"</div>"+
        "        <div class=\"fix btn_02 ani flash animated\" swiper-animate-effect=\"flash\" swiper-animate-duration=\"0.8s\" swiper-animate-delay=\"1s\" style='visibility: visible;animation-duration:0.8s;-webkit-animation-duration:.8s;animation-delay:1s;-webkit-animation-delay:1s'><img src=\"img/btn_031.png\" /></div>")
}

var swiper = new Swiper('.swiper-container', {
    observer:true,
    observeParents:true,
    preventClicks : false,
    preventClicksPropagation: false,
    loop: false,
    a11y:false,
    mode: 'horizontal',
    on:{
        init: function(){
            swiperAnimateCache(this); //隐藏动画元素
            swiperAnimate(this); //初始化完成开始动画
        },
        slideChangeTransitionEnd: function(){
            swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
        }
    }
});

// 第一页 - 进入活动按钮 事件处理
function btnOfSlide1(obj){
    // 移除上一页激活属性
    $(obj).parent().removeClass('swiper-slide-active')
    //移除上一页动画效果
    $(obj).removeClass('time ani zoomIn animated')
    $(obj).removeAttr('swiper-animate-effect swiper-animate-duration swiper-animate-delay swiper-animate-style-cache')
    $(obj).removeAttr('style')
    $(obj).prev().removeClass('time ani zoomInLeft animated')
    $(obj).prev().removeAttr('swiper-animate-effect swiper-animate-duration swiper-animate-delay swiper-animate-style-cache')
    $(obj).prev().removeAttr('style')

    // 添加下一页动画效果
    $(obj).parent().next().children().siblings().eq(0).addClass('ani zoomInLeft animated')
    $(obj).parent().next().children().siblings().eq(0).attr({"swiper-animate-effect":"zoomInLeft","swiper-animate-duration":"0.5s","swiper-animate-delay":"0.3s"})
    $(obj).parent().next().children().siblings().eq(0).css({"visibility": "visible","animation-duration":"0.5s","-webkit-animation-duration":"0.5s","animation-delay":"0.3s","-webkit-animation-delay":"0.3s"})
    $(obj).parent().next().children().siblings().eq(1).addClass('ani time flash animated')
    $(obj).parent().next().children().siblings().eq(1).attr({"swiper-animate-effect":"flash","swiper-animate-duration":"2s","swiper-animate-delay":"1s"})
    $(obj).parent().next().children().siblings().eq(1).css({"visibility": "visible","animation-duration":"2s","-webkit-animation-duration":"2s","animation-delay":"1s","-webkit-animation-delay":"1s"})

    // 激活下一页
    $(obj).parent().next().addClass('swiper-slide-active')

    // 为下下页添加下一页标记并移除本页的标记
    $(obj).parent().next().removeClass('swiper-slide-next')
    $(obj).parent().next().next().addClass('swiper-slide-next')
}

// 第二页 - 开始答题按钮 事件处理
function btnOfSlide2(obj){
    // 清除本页动画，因为第三个动态生成，为防止消耗资源，将此页动画去掉
    $(obj).removeClass('time ani flash animated')
    $(obj).removeAttr('swiper-animate-effect swiper-animate-duration swiper-animate-delay swiper-animate-style-cache')
    $(obj).removeAttr('style')
    $(obj).prev().removeClass('time ani zoomInLeft animated')
    $(obj).prev().removeAttr('swiper-animate-effect swiper-animate-duration swiper-animate-delay swiper-animate-style-cache')
    $(obj).prev().removeAttr('style')
    // 移除上一页激活属性
    $(obj).parent().removeClass('swiper-slide-active')
    // 激活下一页
    $(obj).parent().next().addClass('swiper-slide-active')
    // 为下下页添加下一页标记并移除本页的标记
    $(obj).parent().next().removeClass('swiper-slide-next')
    $(obj).parent().next().next().addClass('swiper-slide-next')

    open = false;
    getData('.three',number)
}

// 点击下一题按钮事件处理
function btnOfSlide3(obj){
    if(!open){
        alert('请您先答题')
        return false;
    }

    if(number >= count){
        if(score >= count){
            $(obj).parent().siblings().filter('div.correct').children().siblings().eq(5).addClass('ani time flash animated')
            $(obj).parent().siblings().filter('div.correct').children().siblings().eq(5).attr({"swiper-animate-effect":"flash","swiper-animate-duration":"2s","swiper-animate-delay":"1s"})
            $(obj).parent().siblings().filter('div.correct').children().siblings().eq(5).css({"visibility": "visible","animation-duration":"2s","-webkit-animation-duration":"2s","animation-delay":"1s","-webkit-animation-delay":"1s"})
            $(obj).parent().removeClass('swiper-slide-active')
            $(obj).parent().siblings().filter('div.correct').addClass('swiper-slide-active')
            $(obj).parent().next().removeClass('swiper-slide-next')
            $(obj).parent().siblings().filter('div.correct').next().addClass('swiper-slide-next')
        }else{
            $(obj).parent().removeClass('swiper-slide-active')
            $(obj).parent().siblings().filter('div.ans_err').addClass('swiper-slide-active')
            $(obj).parent().next().removeClass('swiper-slide-next')
            $(obj).parent().siblings().filter('div.ans_err').next().addClass('swiper-slide-next')
        }
        open=false
        record = true
        $('.three').empty()
        Eset.clear()
        score = 0
        number = 1
    }else{
        number += 1
        $('.three').empty()
        getData('.three',number)
        open=false
        record = true
    }
}

// 答对所有题目后点击开始抽奖事件处理
function btnOfSlide4(obj){
    $(obj).removeClass('time ani flash animated')
    $(obj).removeAttr('swiper-animate-effect swiper-animate-duration swiper-animate-delay swiper-animate-style-cache')
    $(obj).removeAttr('style')
    var name = String($('input[name="name"]').val()).trim();
    var phone = String($('input[name="phone"]').val()).trim();
    if(!name || !phone){
        alert('请正确输入信息格式')
        return false
    }
    if(!(/^1(\d){10}$/.test(phone))){
        alert('请输入正确的号码')
        return false
    }
    $('input[name]').val("")
    $('input[phone]').val("")

    // 暂时以静态数据替代后台传送过的卡密数据及答对所有题目后是否获奖
    // $.post('index.php',{"name":name,'phone':phone},function (data,status) {
    //     console.log(data)
    //     console.log(status)
    // })
    win = Math.floor(Math.random() * (1 - 0 + 1) + 0)
    if(win){
        $(obj).parent().removeClass('swiper-slide-active')
        // 添加下一页动画效果
        $(obj).parent().siblings().filter('div.winPrize').children().siblings().eq(0).addClass('ani zoomInLeft animated')
        $(obj).parent().siblings().filter('div.winPrize').children().siblings().eq(0).attr({"swiper-animate-effect":"zoomInLeft","swiper-animate-duration":"0.5s","swiper-animate-delay":"0.3s"})
        $(obj).parent().siblings().filter('div.winPrize').children().siblings().eq(0).css({"visibility": "visible","animation-duration":"0.5s","-webkit-animation-duration":"0.5s","animation-delay":"0.3s","-webkit-animation-delay":"0.3s"})
        $(obj).parent().siblings().filter('div.winPrize').children().siblings().eq(1).addClass('ani time flash animated')
        $(obj).parent().siblings().filter('div.winPrize').children().siblings().eq(1).attr({"swiper-animate-effect":"flash","swiper-animate-duration":"2s","swiper-animate-delay":"1s"})
        $(obj).parent().siblings().filter('div.winPrize').children().siblings().eq(1).css({"visibility": "visible","animation-duration":"2s","-webkit-animation-duration":"2s","animation-delay":"1s","-webkit-animation-delay":"1s"})
        $(obj).parent().siblings().filter('div.winPrize').addClass('swiper-slide-active')
        $(obj).parent().next().removeClass('swiper-slide-next')
        $(obj).parent().siblings().filter('div.winPrize').next().addClass('swiper-slide-active')
    }else{
        $(obj).parent().removeClass('swiper-slide-active')
        $(obj).parent().siblings().filter('div.fail').addClass('swiper-slide-active')
        $(obj).parent().next().removeClass('swiper-slide-next')
        $(obj).parent().siblings().filter('div.fail').next().addClass('swiper-slide-active')
        $(obj).parent().siblings().filter('div.winPrize').removeClass('swiper-slide-active')
    }
}

// 全部答对并中奖后点击 分享答题 按钮事件处理
function btnOfSlide5(obj){
    $(obj).removeClass('ani time flash animated')
    $(obj).removeAttr('swiper-animate-effect swiper-animate-duration swiper-animate-delay swiper-animate-style-cache')
    $(obj).removeAttr('style')
    $(obj).prev().removeClass('ani zoomInLeft animated')
    $(obj).prev().removeAttr('swiper-animate-effect swiper-animate-duration swiper-animate-delay swiper-animate-style-cache')
    $(obj).prev().removeAttr('style')
    $(obj).parent().removeClass('swiper-slide-active')
    $(obj).parent().next().removeClass('swiper-slide-next')
    $(obj).parent().siblings().eq(0).addClass('swiper-slide-active')
    $(obj).parent().siblings().eq(0).children().siblings().eq(0).addClass('ani zoomInLeft animated')
    $(obj).parent().siblings().eq(0).children().siblings().eq(0).attr({"swiper-animate-effect":"zoomInLeft","swiper-animate-duration":"0.5s","swiper-animate-delay":"0.3s"})
    $(obj).parent().siblings().eq(0).children().siblings().eq(0).css({"visibility": "visible","animation-duration":"0.5s","-webkit-animation-duration":"0.5s","animation-delay":"0.3s","-webkit-animation-delay":"0.3s"})
    $(obj).parent().siblings().eq(0).children().siblings().eq(1).addClass('ani zoomIn animated')
    $(obj).parent().siblings().eq(0).children().siblings().eq(1).attr({"swiper-animate-effect":"zoomIn","swiper-animate-duration":"1s","swiper-animate-delay":"1s"})
    $(obj).parent().siblings().eq(0).children().siblings().eq(1).css({"visibility": "visible","animation-duration":"1s","-webkit-animation-duration":"1s","animation-delay":"1s","-webkit-animation-delay":"1s"})
    $(obj).parent().siblings().eq(1).addClass('swiper-slide-next')
}

// 未全答对或未中奖点击 再答一次 按钮事件处理
function btnOfSlide6(obj){
    $(obj).parent().removeClass('swiper-slide-active')
    $(obj).parent().next().removeClass('swiper-slide-next')
    $(obj).parent().siblings().eq(2).addClass('swiper-slide-active')
    $(obj).parent().siblings().eq(3).addClass('swiper-slide-next')
    open=false
    getData('.three',number)
}

// 点击题目中的某一选项判断正误事件处理
function btnOfCorrOrErr(obj){
    if(!record){
        alert('请勿重复点击')
        return false;
    }
    record = false
    var user_ans = $(obj).attr('data-ans')
    var cor_ans = datas.ra
    if(user_ans === cor_ans){
        score += 1
        $(obj).children().find('img').attr('src','./img/btn_corr.png')
    }else{
        $(obj).children().find('img').attr('src','./img/btn_error.png')
        if(user_ans < cor_ans){
            if(cor_ans === "A"){
                // 问题一： 此处+1是因为$(obj)的头部还有一个three_2_1(此处我已经用给siblings中加入selector处理掉)
                //实例：$(obj).siblings('.three_2_2').eq(-1).children().find('img').attr('src','./img/btn_corr.png')

                // 问题二： 千万注意，siblings获取eq值时并不包含它本身，相当于是把它本身排除在外的，所以取值时需要-1
                //                位于本身之前不受影响，之后就必须要将他本身排除，即用户选项小于正确选项走1反之2
                $(obj).siblings('.three_2_2').eq(0-1).children().find('img').attr('src','./img/btn_corr.png')
            }else if(cor_ans === "B"){
                $(obj).siblings('.three_2_2').eq(1-1).children().find('img').attr('src','./img/btn_corr.png')
            }else if(cor_ans === "C"){
                $(obj).siblings('.three_2_2').eq(2-1).children().find('img').attr('src','./img/btn_corr.png')
            }else {
                $(obj).siblings('.three_2_2').eq(3-1).children().find('img').attr('src','./img/btn_corr.png')
            }
        }else{
            if(cor_ans === "A"){
                //注意参看注释（与上面等同）
                $(obj).siblings('.three_2_2').eq(0).children().find('img').attr('src','./img/btn_corr.png')
            }else if(cor_ans === "B"){
                $(obj).siblings('.three_2_2').eq(1).children().find('img').attr('src','./img/btn_corr.png')
            }else if(cor_ans === "C"){
                $(obj).siblings('.three_2_2').eq(2).children().find('img').attr('src','./img/btn_corr.png')
            }else {
                $(obj).siblings('.three_2_2').eq(3).children().find('img').attr('src','./img/btn_corr.png')
            }
        }
    }
    datas = ""
    open = true
}

// 是否为移动端设备事件处理
function isPCOrNot() {
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        isPC = false
    } else {
        isPC = true;
    }
}

// 第一页点击事件
// delay表示动画延迟多少s执行
// during表示每一次动画执行时长
$('.btn_00').on('click',function () {
    btnOfSlide1(this)
})

//第二页点击事件
$('.btn_01').on('click',function () {
    btnOfSlide2(this)
})


// 未全答对或未中奖点击 再答一次 按钮
$('.btn_03').on('click',function () {
    btnOfSlide6(this)
})

// 答对所有题目后点击 点击抽奖 按钮
$('.btn_04').on('click',function () {
    btnOfSlide4(this)
})

// 全部答对并中奖后点击 分享答题 按钮
$('.btn_05').on('click',function () {
    btnOfSlide5(this)
})

// 点击下一题
$('.three').on('click','.btn_02',function () {
    btnOfSlide3(this)
})

// 点击题目中的某一选项判断正误
$('.three').on('click','.three_2_2',function () {
    btnOfCorrOrErr(this)
})

// 是否为移动端设备
isPCOrNot()
if(!isPC){
    document.writeln("<script src=\"js/flexible.js\"></script>");
}

