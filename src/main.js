window.addEventListener('load',function(){
  var watchlist, ratings, lookedUp = false,chosen = [];
  var x2js = new X2JS();

  if (localStorage['id']) {
    document.getElementById('username').value = localStorage['id'];
  }

  var card = function(info,moment,src) {
    var movie = document.createElement('div');
    var card = document.createElement('div');

    var front = document.createElement('div');
    var img = document.createElement('img');

    var back = document.createElement('div');
    var title = document.createElement('h2');
    var plot = document.createElement('p');
    var rating = document.createElement('p');
    var runtime = document.createElement('p');

    var controls = document.createElement('div');
    var link = document.createElement('a');
    var since = document.createElement('span');

    movie.classList.add('movie');
    img.classList.add('img');
    title.classList.add('title');
    plot.classList.add('plot');
    front.classList.add('front');
    back.classList.add('back');
    link.classList.add('link');
    card.classList.add('card');
    controls.classList.add('controls');

    img.src = src;
    title.innerHTML = info.Title;
    plot.innerHTML = info.Plot;
    since.innerHTML = moment;
    rating.innerHTML = info.imdbRating;
    runtime.innerHTML = info.Runtime;
    link.innerHTML = 'imdb';
    link.href = 'http://www.imdb.com/title/' + info.imdbID;

    front.appendChild(img);
    back.appendChild(title);
    back.appendChild(plot);
    back.appendChild(runtime);
    back.appendChild(rating);
    card.appendChild(front);
    card.appendChild(back);
    controls.appendChild(link);
    controls.appendChild(since);
    movie.appendChild(card);
    movie.appendChild(controls);

    movie.addEventListener('click',function(){
      movie.querySelector('.card').classList.toggle('flipped');
    });

    var movies = document.querySelector('.movies');
    movies.insertBefore(movie,movies.firstChild);
  }

  var choose = function() {
    var i = Math.floor(Math.random()*watchlist.length);
    if (watchlist.length === chosen.length) {
      notice('you have no movies on your watchlist left.');
      return;
    } else {
      while (chosen.indexOf(i) > - 1 ) {
        i = Math.floor(Math.random()*watchlist.length);
      }
      chosen.push(i);
    }

    var imdb = watchlist[i].link.substring(watchlist[i].link.indexOf('/tt')+1,watchlist[i].link.length-1)
    var omdb = 'https://www.omdbapi.com/?i='+imdb+'&plot=short&r=json';

    var req = new XMLHttpRequest();
    req.addEventListener('load',function(){
      var response = JSON.parse(this.responseText);

      var image = new XMLHttpRequest();
      image.addEventListener('load',function(){
        card(response,moment(watchlist[i].pubDate).fromNow(),this.responseText);
      });
      if (response.Poster === 'N/A') {
        card(response,moment(watchlist[i].pubDate).fromNow(),'src/404.svg');
      } else {
        image.open('POST','src/poster.php');
        image.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        image.send('url='+response.Poster);
      }

    });
    req.open('GET',omdb);
    req.send();
  }

  var search = function(userID,callback) {
    var watchlistAddress = 'src/watchlist.php';
    //var ratingsAddress = 'https://www.imdb.com/list/export?list_id=ratings&author_id=' + userID;

    var reqWL = new XMLHttpRequest();
    reqWL.addEventListener('load', function(){
      if (this.responseText.length > 0) {
        watchlist = x2js.xml_str2json(this.responseText).rss.channel.item;
      } else {
        notice('This user doesn\'t exist or doesn\'t have a public watchlist.');
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
    var loader = document.querySelector('.loader');
    if (!lookedUp || document.getElementById('username').value !== localStorage['id']) {
      loader.classList.add('load');
      localStorage['id'] = document.getElementById('username').value;

      search(document.getElementById('username').value,function(){
        loader.classList.remove('load');
        choose();
        lookedUp = true;
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

