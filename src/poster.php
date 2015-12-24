<?php
$url = isset($_GET['url']) ? $_GET['url'] : 'https://ia.media-imdb.com/images/M/MV5BMTQ0ODc4MDk4Nl5BMl5BanBnXkFtZTcwMTEzNzgzNA@@._V1_SX300.jpg';
echo 'data:img+jpeg;base64,' . base64_encode(file_get_contents($url));
 ?>