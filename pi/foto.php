<?php
exec("rm /var/www/html/foto.jpg");
exec("fswebcam -r 1280x960 /var/www/html/foto.jpg");
exec("fswebcam -r 1280x960 /var/www/html/foto.jpg");

// open the file in a binary mode
$name = '/var/www/html/foto.jpg';
$fp = fopen($name, 'rb');

// send the right headers
header("Content-Type: image/jpg");
header("Content-Length: " . filesize($name));

// dump the picture and stop the script
fpassthru($fp);