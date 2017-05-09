<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->prepare("UPDATE signals SET name = :name,lat = :lat,lon = :lon WHERE id = ".$obj->id );
 
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':lat', $lat);
    $stmt->bindParam(':lon', $lon);

    // insert a row
    $name = $obj->name;
    $lat = $obj->lat;
    $lon = $obj->lon;
    $stmt->execute();
	echo $obj->id;
	
	
	// $stmt = $conn->prepare("UPDATE signals SET name = :name,lat = :lat,lon = :lon WHERE id = 1" );
 
    // $stmt->bindParam(':name', $name);
    // $stmt->bindParam(':lat', $lat);
    // $stmt->bindParam(':lon', $lon);

    // // insert a row
    // $name = "Raghuram";
    // $lat = "0.001";
    // $lon = "0.01";
    // $stmt->execute();
	// echo "success";
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>