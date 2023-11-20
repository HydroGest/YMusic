import requests
import urllib
import json
from urllib import parse

def search(keyword,page=1):
    url = 'https://songsearch.kugou.com/song_search_v2?callback=jQuery11240251602301830425_1548735800928&keyword=%s&page=1&pagesize=100&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_=1548735800930' % urllib.parse.quote(keyword)
    #requestsURL=URL+'&keyword={}&page={}'.format(keyword,page)
    res=requests.get(url).text[41:-2]
    
    result=json.loads(res)["data"]["lists"]
    #print(res)#print(result)
    return result
    #print(result)

def query(id,filehash):
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
        'cookie': 'kg_mid=52ee050d4b6d1ba7acb9a1a05a60c98d; kg_dfid=4FHmC13bOoFu3sMxa31Eh55n; kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e'
    }
    
    url = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=jQuery19103229977125128476_1609770061395&hash=%s&dfid=2SoVLy2WYH7H12v3g50D57Z6&mid=86f5acfdf2ca3dd39396e98ac4074a42&platid=4&album_id=%s&privilege_filter=0&filter=10" % (filehash,id)
    res=requests.get(url).text[41:-2]
    print(res)
    eid=json.loads(res)["data"]["encode_album_audio_id"]
    #print(eid)
    url = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&encode_album_audio_id=%s" % eid
    #print(url)
    res=requests.get(url,headers=headers).text
    #print(res)
    return json.loads(res)["data"]

def tquery(id,filehash):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
        'Cookie': 'kg_mid=6953ffd158418cc729104d3b5eecfbc6; kg_dfid=3x7cXp1qKRSk0dPKSN2tUf9n; kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e; Hm_lvt_aedee6983d4cfc62f509129360d6bb3d=1700400169,1700440012'
    }
    
    url = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&callback=jQuery19103229977125128476_1609770061395&hash=%s&dfid=2SoVLy2WYH7H12v3g50D57Z6&mid=86f5acfdf2ca3dd39396e98ac4074a42&platid=4&album_id=%s&privilege_filter=0&filter=10" % (filehash,id)
    res=requests.get(url).text[41:-2]
    #eid=json.loads(res)["data"]["encode_album_audio_id"]
    #print(eid)
    #url = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&encode_album_audio_id=%s" % eid
    #print(url)
    #res=requests.get(url,headers=headers).text
    #print(res)
    return json.loads(res)

#query("35202001","9D5596F29267159C7A4D7BD235484DD6")