<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	$id_list = implode(',',$obj->id);
	$signal_names = implode(',',$obj->signalNames);
	
	$stmt = $conn->prepare("INSERT INTO signalgroups (name,signals,signalnames) VALUES (:name, :signals, :signalnames)");
    $stmt->bindParam(':name', $obj->name);
    $stmt->bindParam(':signals', $id_list);
	$stmt->bindParam(':signalnames', $signal_names);
    $stmt->execute();
	
	echo "success";
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>