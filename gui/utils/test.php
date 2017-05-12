<?php
$array = array(0 => "a", 1 => "b", 2 => "c");
unset($array[1]);
echo implode(',',$array);
//var_dump($array);
?>