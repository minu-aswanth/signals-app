<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->query("SELECT * FROM signalgroups");
	while($data = $stmt->fetch(PDO::FETCH_ASSOC)){
		foreach(explode(",", $data['signals']) as $signal){
			if($signal == $obj->id){
				$stmt2 = $conn->prepare("DELETE FROM signalgroups WHERE id=".$data['id'] );
				$stmt2->execute();
				
			}
		}
		
	}
	

	//while($t = mysql_fetch_array($results))
	
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>