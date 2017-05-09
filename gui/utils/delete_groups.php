<?php
include('dblinker.php');
try{
	//$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->prepare("DELETE FROM signalgroups WHERE signals='".$_POST["x"]."'" );
    $stmt->execute();
	
	echo 'success';
	
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>