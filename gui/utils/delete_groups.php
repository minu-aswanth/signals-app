<?php
include('dblinker.php');
try{
	$conn = dblink();	
	$ids=explode(",",$_POST["x"]);
	foreach(explode(",",$_POST["x"]) as $signal){
		$stmt1 = $conn->prepare("UPDATE signals SET grouped = 0 WHERE id = :signal");
		$stmt1->bindParam(':signal', $signal);
		$stmt1->execute();
	}
	$stmt2 = $conn->prepare("DELETE FROM signalgroups WHERE signals='".$_POST["x"]."'" );
    $stmt2->execute();
	
	echo 'success';
	
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>