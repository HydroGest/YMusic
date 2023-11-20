from flask import Flask,render_template,url_for, request
app = Flask(__name__)

import music

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/searchSong')
def search():
    key=request.args.get('keyword', '')
    return music.search(key)
    
@app.route('/getData')
def getData():
    id=request.args.get('aid', '')
    filehash=request.args.get('filehash','')
    return music.query(id,filehash)
    
@app.route('/tgetData')
def tgetData():
    id=request.args.get('aid', '')
    filehash=request.args.get('filehash','')
    return music.tquery(id,filehash)