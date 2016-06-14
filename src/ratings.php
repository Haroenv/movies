<?php
echo file_get_contents('http://www.imdb.com/list/export?list_id=ratings&author_id=' . $_POST['userID']);
 ?>
