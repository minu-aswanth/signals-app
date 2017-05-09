<?php
include('dblinker.php');
try{
	$stmt = $conn->query("SELECT * FROM signalgroups");
	echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>