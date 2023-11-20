var PlayListObj = [];
var searchResult = [];
var nowPlaying;
var nowPlayingId;
var getRes,isOK;
var lrc = "";

const audio = new Audio();

function DownloadMP3(filePath) {
    filePath = nowPlaying.play_url;
    fetch(filePath,{
        mode:"no-cors"
    }).then(res => res.blob()).then(blob => {
        const a = document.createElement('a');
        document.body.appendChild(a)
        a.style.display = 'none'
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = nowPlaying.song_name+" - "+nowPlaying.author_name+'.mp3';
        a.click();
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url);
    });
}


function DownloadLRC(){
    const stringData = lrc;
	const blob = new Blob([stringData], {
		type: "text/plain;charset=utf-8"
	})
	const objectURL = URL.createObjectURL(blob)
	const aTag = document.createElement('a')
	aTag.href = objectURL
	aTag.download = nowPlaying.song_name+" - "+nowPlaying.author_name+'.lrc';
	aTag.click()
	URL.revokeObjectURL(objectURL)
}

function initAndPlay() {
    initMusic();
    document.getElementById('playPause').setAttribute('icon', "pause");
    AudioPlay();
}

function playPriv(info=nowPlaying){
    var matchObj,curindex,nextindex;
    for(objID in PlayListObj){
        obj = PlayListObj[objID];
        if(obj.ID==info.album_audio_id){
            matchObj=obj;
            curindex=objID;
            console.log(curindex);
            break;
        }
    }
    nextindex = Number(curindex) -1;
    if(nextindex==-1) nextindex=PlayListObj.length-1;
    console.log(nextindex);
    PlaySong(PlayListObj[nextindex].ID,nextindex);
    return;
}

function playNext(info=nowPlaying){
    var matchObj,curindex,nextindex;
    for(objID in PlayListObj){
        obj = PlayListObj[objID];
        if(obj.ID==info.album_audio_id){
            matchObj=obj;
            curindex=objID;
            console.log(curindex);
            break;
        }
    }
    nextindex = Number(curindex) + 1;
    if(nextindex==PlayListObj.length) nextindex=0;
    console.log(nextindex);
    PlaySong(PlayListObj[nextindex].ID,nextindex);
    return;
}

function AudioPlay(info){
    playPromise = audio.play();
    document.getElementById("playPause").setAttribute("loading",'');
    if (playPromise) {
        //document.getElementById(info.album_audio_id).setAttribute("disabled",'');
        document.getElementById("playPause").removeAttribute("loading",'');
         playPromise.then(() => {
            console.log("playing...");
            setTimeout(() => {
                console.log("done.");
                playNext(info);
            }, audio.duration * 1000); // audio.duration 为音频的时长单位为秒
            console.log(PlayListObj);
            
        }).catch((e) => {
            // 音频加载失败
        });
    }
}

audio.addEventListener('timeupdate', updateProgress); // 监听音频播放时间并更新进度条

function updateProgress() {
    var value = audio.currentTime / audio.duration;
    document.getElementById("progress").value = value * 100;
    document.getElementById("playTime").innerText = transTime(audio.currentTime);
}

function Pause() {
    if (audio.paused) {
        if(nowPlaying==null&&PlayListObj!=null){
            PlaySong(PlayListObj[0].ID,0);
            navigationDrawer.open = true;
        }else{
            AudioPlay(nowPlaying);
        }
        document.getElementById('playPause').setAttribute('icon', "pause");
    } else {
        audio.pause();
        document.getElementById('playPause').setAttribute('icon', "play_arrow");
    }
}

function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}


function initMusic() {
    //audio.src = nowPlaying.play_url;
    audio.load();
    audio.ondurationchange = function () {
        document.title = nowPlaying.song_name + " - YMusic";
        document.getElementById('musicTitle').innerText = nowPlaying.song_name;
        document.getElementById('audioTime').innerText = transTime(audio.duration);
        // 重置进度条
        audio.currentTime = 0;
        updateProgress();
    }
}
initMusic();

function PlaySong(ID,listID){
    document.getElementById("lrclist").innerHTML="";
    var matchObj;
    for(objID in PlayListObj){
        obj = PlayListObj[objID];
        if(obj.ID==ID&&listID==objID){
            matchObj=obj;
            break;
        }
    }
    var fhash = matchObj.SQFileHash;
    console.log(fhash);
    if(matchObj.SQFileHash==""){
        fhash = matchObj.HQFileHash;
        if(matchObj.HQFileHash==""){
            fhash = matchObj.FileHash;
        }
    }
    getMusic(fhash,matchObj.AlbumID,ID);
    //console.log(getRes);
    //nowPlayingId = listID;
}

function getMusic(fileHash,AlbumID,ID){
    isOK=false;
    document.getElementById(ID).setAttribute("loading",'');
    var httpRequest = new XMLHttpRequest();
    var url='/getData?aid='+AlbumID+'&filehash='+fileHash;
    console.log(url);
    httpRequest.open('GET', url , true);
    httpRequest.send();
    var result;
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            isOK=true;
            document.getElementById('loader').style.display = 'none';
            var json = JSON.parse(httpRequest.responseText);
            getRes = json;
            document.getElementById(ID).removeAttribute("loading",'');
            nowPlaying = json;
            //nowPlayingID = ID;
            getLRC();
            Pause();
            audio.src=json.play_url;
            AudioPlay(nowPlaying);
            document.getElementById('playPause').setAttribute('icon', "pause");
        }else{
            document.getElementById(ID).removeAttribute("loading",'');
            document.getElementById('loader').style.display = 'none';
            document.getElementById("snackbar").innerHTML="加载音乐时出错，可能是YMusic服务器被音乐源服务器阻止。"
            document.getElementById("snackbar").open = true;
        }
    };
    
}

function updatePlayList(){
    var PlayList= JSON.stringify(PlayListObj);
    localStorage.setItem("PlayList",PlayList);
}

function RemoveSong(ID,listID){
    for(objID in PlayListObj){
        obj = PlayListObj[objID];
        if(obj.ID==ID&&listID==objID){
            //matchObj=obj;
            if(PlayListObj==null) PlayListObj=[];
            else PlayListObj.splice(objID,1);
            break;
        }
    }
    updatePlayList();
    reflashPlayList();
}

function reflashPlayList(){
    var PlayList = document.getElementById('PlayList');
    PlayList.innerHTML = "";
    if(PlayListObj==null) return;
    PlayListObj.forEach(obj => {
       PlayList.innerHTML += `
            <mdui-list-item id="songItem-${obj.ID}" headline="${obj.SongName.replace(/<[^>]+>/g, "")}" description="${obj.SingerName.replace(/<[^>]+>/g, "")}">
                <mdui-button-icon slot="icon" id="${obj.ID}" onclick="PlaySong(${obj.ID},${PlayListObj.indexOf(obj)})" icon="play_arrow">
                </mdui-button-icon>
                <mdui-button-icon slot="end-icon" onclick="RemoveSong(${obj.ID},${PlayListObj.indexOf(obj)})" icon="remove">
                </mdui-button-icon>
            </mdui-list-item>
       `; 
    });
    if(PlayListObj!=null) document.getElementById('playcnt').innerHTML=PlayListObj.length;
    else document.getElementById('playcnt').innerHTML="0";
}

function addSong(ID){
    for(objID in searchResult){
        obj=searchResult[objID];
        if(obj.ID==ID){
            matchObj=obj;
            if(PlayListObj==null) PlayListObj=[obj];
            else{
                if(PlayListObj.indexOf(obj)==-1) PlayListObj.push(obj);
            }
            break;
        }
    }
    updatePlayList();
    reflashPlayList();
}

window.onload = function(){
    var PlayList = localStorage.getItem("PlayList");
    if(PlayList==null){
        PlayList=="[]";
    }
    PlayListObj=JSON.parse(PlayList);
    reflashPlayList();
}

function search(){
    var songname = document.getElementById('search').value;
    document.getElementById('loader').style.display = 'block';
    var httpRequest = new XMLHttpRequest();
    var url='/searchSong?keyword='+songname;
    console.log(url);
    httpRequest.open('GET', url , true);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            document.getElementById('loader').style.display = 'none';
            var json = JSON.parse(httpRequest.responseText);
            searchResult = json;
            var result = document.getElementById('searchResult');
            result.innerHTML="";
            json.forEach(obj=>{
               result.innerHTML+=`
                    <mdui-list-item id="songItem-${obj.ID}" headline="${obj.SongName.replace(/<[^>]+>/g, "")}" description="${obj.SingerName.replace(/<[^>]+>/g, "")}">
                        <mdui-button-icon slot="end-icon" onclick="addSong('${obj.ID}')" icon="add">
                        </mdui-button-icon>
                    </mdui-list-item>
               `;
            });
        }
    };
}