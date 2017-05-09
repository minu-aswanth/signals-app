<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->prepare("DELETE FROM signals WHERE id=".$obj->id );
    $stmt->execute();
	echo $obj->id;
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>