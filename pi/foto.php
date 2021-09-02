<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

exec("rm /var/www/html/foto.jpg");
exec("fswebcam -r1280x960 /var/www/html/foto.jpg");
exec("fswebcam -r1280x960 /var/www/html/foto.jpg");

// open the file in a binary mode
$name = '/var/www/html/foto.jpg';
$fp = fopen($name, 'rb');

// send the right headers
header("Content-Type: image/jpg");
header("Content-Length: " . filesize($name));

// dump the picture and stop the script
fpassthru($fp);