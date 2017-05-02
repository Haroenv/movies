function choose({ watchlist, chosen }) {
  let i = Math.floor(Math.random() * watchlist.length);
  if (watchlist.length === chosen.length) {
    notice('you have no movies on your watchlist left.');
    return;
  } else {
    while (chosen.includes(i)) {
      i = Math.floor(Math.random() * watchlist.length);
    }
    chosen.push(i);
  }

  const imdb = watchlist[i].link.split('/')[4]; //the id is the fourth part.
  const omdb = `https://www.omdbapi.com/?i=${imdb}&plot=short&r=json`;

  fetch(`https://www.omdbapi.com/?i=${imdb}&plot=short&r=json`)
    .then(res => res.json())
    .then(res => {
      if (res.Poster === 'N/A') {
        card({
          info: res,
          moment: moment(watchlist[i].pubDate).fromNow(),
          src: 'src/404.svg',
        });
      } else {
        fetch(`src/poster.php?url=${res.Poster}`)
          .then(res => res.text())
          .then(image => {
            card({
              info: res,
              moment: moment(watchlist[i].pubDate).fromNow(),
              src: image,
            });
          });
      }
    });
}

function search(userID, callback) {
  const watchlistAddress = 'src/watchlist.php';
  //var ratingsAddress = 'https://www.imdb.com/list/export?list_id=ratings&author_id=' + userID;
  const x2js = new X2JS();

  const reqWL = new XMLHttpRequest();
  reqWL.addEventListener('load', function() {
    if (this.responseText.length > 0) {
      try {
        const watchlist = x2js.xml_str2json(this.responseText).rss.channel.item;
        localStorage['watchlist'] = JSON.stringify(watchlist);
        if (typeof callback === 'function') {
          callback(watchlist);
        }
      } catch (e) {
        console.warn(e);
        notice('An error occured fetching the data from IMDb.');
      }
    } else {
      notice("This user doesn't exist or doesn't have a public watchlist.");
    }
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

  reqWL.open('POST', watchlistAddress);
  reqWL.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  reqWL.send(`userID=${userID}`);

  // reqRL.open('GET',ratingsAddress);
  // reqRL.send();
}

function card({ info, moment, src }) {
  const movie = document.createElement('div');
  const card = document.createElement('div');

  const front = document.createElement('div');
  const img = document.createElement('img');

  const back = document.createElement('div');
  const title = document.createElement('h2');
  const plot = document.createElement('p');

  const infos = document.createElement('div');
  const rating = document.createElement('p');
  const runtime = document.createElement('p');

  const controls = document.createElement('div');
  const link = document.createElement('a');
  const since = document.createElement('span');

  movie.classList.add('movie');
  img.classList.add('img');
  title.classList.add('title');
  plot.classList.add('plot');
  front.classList.add('front');
  infos.classList.add('info');
  back.classList.add('back');
  link.classList.add('link');
  card.classList.add('card');
  controls.classList.add('controls');

  img.src = src;
  title.innerText = info.Title;
  plot.innerText = info.Plot;
  since.innerText = moment;
  rating.innerText = info.imdbRating;
  runtime.innerText = info.Runtime;
  link.innerText = 'imdb';
  link.href = `http://www.imdb.com/title/${info.imdbID}`;

  front.appendChild(img);
  back.appendChild(title);
  back.appendChild(plot);
  infos.appendChild(runtime);
  infos.appendChild(rating);

  if (window.location.search.includes('torrent')) {
    const kat = document.createElement('a');
    kat.innerHTML = '⬇️';
    kat.classList.add('down');
    const _title = info.Title.replace(/,|\.|\!|\?|\:|#/g, '');
    kat.href = `http://pirateunblocker.info/search/${encodeURIComponent(`${_title} ${info.Year}`)}/0/99/0`;
    infos.appendChild(kat);
  }

  back.appendChild(infos);
  card.appendChild(front);
  card.appendChild(back);
  controls.appendChild(link);
  controls.appendChild(since);
  movie.appendChild(card);
  movie.appendChild(controls);

  movie.addEventListener('click', () => {
    movie.querySelector('.card').classList.toggle('flipped');
  });

  const movies = document.querySelector('.movies');
  movies.insertBefore(movie, movies.firstChild);
  window.getComputedStyle(movie).opacity;
  movie.classList.add('visible');
}

window.addEventListener('DOMContentLoaded', () => {
  let watchlist;
  let lookedUp = false;
  const chosen = [];

  if (localStorage['watchlist']) {
    watchlist = JSON.parse(localStorage['watchlist']);
  }

  if (localStorage['id']) {
    document.getElementById('username').value = localStorage['id'];
  }

  document.getElementById('search').addEventListener('submit', e => {
    e.preventDefault();
    const loader = document.querySelector('.loader');
    if (
      !lookedUp ||
      document.getElementById('username').value !== localStorage['id']
    ) {
      localStorage['id'] = document.getElementById('username').value;

      if (!localStorage['watchlist']) {
        loader.classList.add('load');
      } else {
        choose({ watchlist, chosen });
        lookedUp = true;
      }
      search(document.getElementById('username').value, watchlist => {
        if (loader.classList.contains('load')) {
          choose({ watchlist, chosen });
          loader.classList.remove('load');
          lookedUp = true;
        }
      });
    } else {
      choose({ watchlist, chosen });
      lookedUp = true;
    }
  });
});

const showButtons = document.querySelectorAll('.controls .show');

showButtons.forEach(button =>
  button.addEventListener('click', () => {
    const movie = this.parentNode.parentNode;
    movie.querySelector('.card').classList.toggle('flipped');
  })
);
