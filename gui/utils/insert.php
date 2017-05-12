<?php
include('dblinker.php');
try{
	$conn = dblink();
	$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->prepare("INSERT INTO signals (name,lat,lon) 
    VALUES (:name, :lat, :lon)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':lat', $lat);
    $stmt->bindParam(':lon', $lon);

    // insert a row
    $name = $obj->name;
    $lat = $obj->lat;
    $lon = $obj->lon;
    $stmt->execute();
	
	$stmt = $conn->query("SELECT id FROM signals WHERE name='" . $name . "'");
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	echo $result['id'];
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>