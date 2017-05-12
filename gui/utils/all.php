<?php
include('dblinker.php');
try{
	$conn = dblink();
	$stmt = $conn->query("SELECT * FROM signals");
	echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>