<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	$id_list = implode(',',$obj->id);
	
	$stmt = $conn->prepare("INSERT INTO signalgroups (name,signals) VALUES (:name, :signals)");
    $stmt->bindParam(':name', $obj->name);
    $stmt->bindParam(':signals', $id_list);
    $stmt->execute();
	
	echo "success";
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>