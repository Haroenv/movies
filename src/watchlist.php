<?php
echo file_get_contents('http://rss.imdb.com/user/' . $_POST['userID'] . '/watchlist');
 ?>