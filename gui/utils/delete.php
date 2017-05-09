<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->prepare("DELETE FROM signals WHERE id=".$obj->id );
    $stmt->execute();
	
	$stmt = $conn->query("SELECT * FROM signalgroups");
	while($data = $stmt->fetch(PDO::FETCH_ASSOC)){
		foreach(explode(",", $data['signals']) as $signal){
			if($signal == $obj->id){
				$stmt2 = $conn->prepare("DELETE FROM signalgroups WHERE id=".$data['id'] );
				$stmt2->execute();
			}
		}
	}
	
	echo $obj->id;
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>