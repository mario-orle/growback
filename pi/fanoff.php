<?php
require_once('vendor/autoload.php');
use PiPHP\GPIO\GPIO;
use PiPHP\GPIO\Pin\PinInterface;

// Create a GPIO object
$gpio = new GPIO();

// Retrieve pin 17 and configure it as an output pin
$pin = $gpio->getOutputPin(17);

// Set the value of the pin low (turn it off)
$pin->setValue(PinInterface::VALUE_LOW);