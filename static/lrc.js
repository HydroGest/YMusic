var lrc = "";

function getLRC() {
    lrc = nowPlaying.lyrics;
    var oLRC = {
        ti: "", //歌曲名
        ar: "", //演唱者
        al: "", //专辑名
        by: "", //歌词制作人
        offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
        ms: [] //歌词数组{t:时间,c:歌词}
    };
    
    if (lrc.length === 0) return;
    var lrcs = lrc.split('\n'); //用回车拆分成数组
    for (var i in lrcs) { //遍历歌词数组
        if (lrcs.hasOwnProperty(i)) {
            lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
            var t_lrc = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]")); //取[]间的内容
            var s_text = t_lrc.split(":"); //分离:号前后的文字
            if (isNaN(parseInt(s_text[0]))) { //不是数值，基本上是歌曲名、作者等信息
                for (var j in oLRC) {
                    if (j !== "ms" && j === s_text[0].toLowerCase()) {
                        oLRC[j] = s_text[1];
                    }
                }
            } else { //是数值，基本上就是歌词时间点
                var arr = lrcs[i].match(/\[(\d+:.+?)\]/g); //提取时间字段，可能有多个
                var start = 0;
                for (var lrc_position in arr) {
                    if (arr.hasOwnProperty(lrc_position)) {
                        start += arr[lrc_position].length; //计算歌词位置
                    }
                }
                var content = lrcs[i].substring(start); //获取歌词内容
                for (var k in arr) {
                    if (arr.hasOwnProperty(k)) {
                        var t = arr[k].substring(1, arr[k].length - 1); //取[]间的内容
                        var s = t.split(":"); //分离:前后文字
                        oLRC.ms.push({ //对象{t:时间,c:歌词}加入ms数组
                            t: parseFloat(s[0].substr(0, 2)) * 60 + parseFloat(s[1].substring(0, 6)),
                            //注意转换成number格式
                            // t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                            c: content
                        });
                    }
                }
            }
        }

    }
    oLRC.ms.sort(function(a, b) { //按时间顺序排序
        return a.t - b.t;
    });
    // var lrc_result = "";
    var lrcTime = []; //歌词对应的时间数组
    var ul = document.getElementById("lrclist"); //获取ul
    for (var n in oLRC.ms) { //遍历ms数组，把歌词加入列表
        // lrc_result += '<li>' + oLRC.ms[n].c + '</li>';
        // document.getElementById("lyric").innerHTML = lrc_result;
        ul.innerHTML += "<li><p>" + oLRC.ms[n].c + "</p></li>"; //ul里填充歌词
    }
    // console.log(oLRC.ms[0].t); // 时间00:00.231中的0.231
    // console.log(oLRC.ms.length);
    // for(var result in oLRC){ //查看解析结果
    //     // console.log(result,":",oLRC[result]);
    // }
    for (var x = 0; x < oLRC.ms.length; x++) {
        lrcTime[x] = oLRC.ms[x].t;
    }

    lrcTime[oLRC.ms.length] = lrcTime[oLRC.ms.length - 1] + 3; //如不另加一个结束时间，到最后歌词滚动不到最后一句
    var $li = $("#lrclist>li"); //获取所有li
    var currentLine = 0; //当前播放到哪一句了
    var currentTime; //当前播放的时间
    var ppxx; //保存ul的translateY值
    audio.ontimeupdate = function() { //audio时间改变事件
        currentTime = audio.currentTime;
        for (j = currentLine, len = lrcTime.length; j < len; j++) { // len=50
            if (currentTime < lrcTime[j + 1] && currentTime > lrcTime[j]) {
                currentLine = j;
                // ppxx = 250-(currentLine*32);
                ppxx = -currentLine * 32;
                ul.style.transform = "translateY(" + ppxx + "px)";
                $li.get(currentLine - 1).className = "";
                // console.log("on"+currentLine);
                $li.get(currentLine).className = "on";
                break;
            }
        }
    };
    audio.onseeked = function() { //audio进度更改后事件
        currentTime = audio.currentTime;
        console.log("  off" + currentLine);
        $li.get(currentLine).className = "";
        for (k = 0, len = lrcTime.length; k < len; k++) {
            if (currentTime < lrcTime[k + 1] && currentTime < lrcTime[k]) {
                currentLine = k;
                break;
            }
        }
    };
}