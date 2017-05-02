<?php
echo 'data:img+jpeg;base64,' . base64_encode(file_get_contents($_GET['url']));
 ?>
