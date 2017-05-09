<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->prepare("DELETE FROM signalgroupss WHERE signals=".$obj->signals );
    $stmt->execute();
	
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>