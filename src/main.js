window.addEventListener('load',function(){

  var watchlist, id, ratings;
  var x2js = new X2JS();

  var choose = function() {
    var i = Math.floor(Math.random()*watchlist.length-1);
    results.innerHTML += '<li><a href="' + watchlist[i].link + '">' + watchlist[i].title + '</a> since ' +  moment(watchlist[i].pubDate).fromNow() + '</li>';
    console.log(watchlist[i].link.substring(watchlist[i].link.indexOf('/tt')+1,watchlist[i].link.length-1));
  }

  var search = function(userID,callback) {
    var watchlistAddress = 'src/watchlist.php';
    //var ratingsAddress = 'https://www.imdb.com/list/export?list_id=ratings&author_id=' + userID;

    var reqWL = new XMLHttpRequest();
    reqWL.addEventListener('load', function(){
      watchlist = x2js.xml_str2json(this.responseText).rss.channel.item;
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

    if (userID !== id) {
      req.open('POST',watchlistAddress);
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.send('userID='+userID);

      // reqRL.open('GET',ratingsAddress);
      // reqRL.send();

      id = userID;
    };
  }

  document.getElementById('submit').addEventListener('click',function(){
    var results = document.getElementById('results');
    if (results.innerHTML.length === 0) {
      results.classList.add('load');

      search(document.getElementById('username').value,function(){
        results.classList.remove('load');
        choose();
      });

    } else {
      choose();
    }
  });
});