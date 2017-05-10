<?php
include('dblinker.php');
try{	
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