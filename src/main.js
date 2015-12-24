window.addEventListener('load',function(){
  var watchlist, ratings;
  var x2js = new X2JS();

  if (localStorage['id']) {
    document.getElementById('username').value = localStorage['id'];
  }

  var card = function(info,since) {
    console.log(info,since);
var movie = document.createElement('div');
var card = document.createElement('div');

var front = document.createElement('div');
var img = document.createElement('img');

var back = document.createElement('div');
var title = document.createElement('h2');
var plot = document.createElement('p');

var controls = document.createElement('div');
var link = document.createElement('a');
var back = document.createElement('button');

document.querySelector('.movies').addChild(movie);

    document.querySelector('.movies').innerHTML +=
'<div class="movie">'
+'<div class="card">'
+'<div class="front"><img src="'+info.Poster+'"/></div>'
+'<div class="back">'
+'<h2>'+info.Title+'</h2>'
+'<p>'+info.Plot+'</p>'
+'</div>'
+'</div>'
+'<div class="controls"><a href="'+info.imdbID+'">imdb</a>'
+'<button class="show">back</button>'
+'</div>'
+'</div>';

document.querySelector('.controls .show').addEventListener('click',function(){
  var movie = this.parentNode.parentNode;
  movie.querySelector('.card').classList.toggle('flipped');
});
  }

  var choose = function() {
    var i = Math.floor(Math.random()*watchlist.length-1);
    var imdb = watchlist[i].link.substring(watchlist[i].link.indexOf('/tt')+1,watchlist[i].link.length-1)
    var omdb = 'https://www.omdbapi.com/?i='+imdb+'&plot=short&r=json';

    var req = new XMLHttpRequest();
    req.addEventListener('load',function(){
      moment(watchlist[i].pubDate).fromNow();
      card(JSON.parse(this.responseText),moment(watchlist[i].pubDate).fromNow());
    });
    req.open('GET',omdb);
    req.send();

    //results.innerHTML += '<li><a href="' + watchlist[i].link + '">' + watchlist[i].title + '</a> since ' +  moment(watchlist[i].pubDate).fromNow() + '</li>';
    //console.log(watchlist[i].link.substring(watchlist[i].link.indexOf('/tt')+1,watchlist[i].link.length-1));
  }

  var search = function(userID,callback) {
    var watchlistAddress = 'src/watchlist.php';
    //var ratingsAddress = 'https://www.imdb.com/list/export?list_id=ratings&author_id=' + userID;

    var reqWL = new XMLHttpRequest();
    reqWL.addEventListener('load', function(){
      if (this.responseText.length > 0) {
        watchlist = x2js.xml_str2json(this.responseText).rss.channel.item;
      } else {
        notice('This user doesn\'t exist');
      }
      if (typeof(callback) === 'function') {
        callback();
      };
    });

    /*
    var reqRL = new XMLHttpRequest();
    reqRL.addEventListener('load', function(){
      ratings = CSVToArray(this.responseText);
      if (typeof(callback) === 'function') {
        console.log(ratings);
      };
    });
    */

    reqWL.open('POST',watchlistAddress);
    reqWL.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    reqWL.send('userID='+userID);

    // reqRL.open('GET',ratingsAddress);
    // reqRL.send();
  }

  document.getElementById('submit').addEventListener('click',function(){
    var results = document.getElementById('results');
    if (results.innerHTML.length === 0 || document.getElementById('username').value !== localStorage['id']) {
      results.innerHTML = '';
      results.classList.add('load');
      localStorage['id'] = document.getElementById('username').value;

      search(document.getElementById('username').value,function(){
        results.classList.remove('load');
        choose();
      });

    } else {
      choose();
    }
  });
});

var showButtons = document.querySelectorAll('.controls .show');

for (var i = 0; i < showButtons.length; i++) {
  (function(button){
    button.addEventListener('click',function(){
      var movie = this.parentNode.parentNode;
      movie.querySelector('.card').classList.toggle('flipped');
    });
  })(showButtons[i]);
}

